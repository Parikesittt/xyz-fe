<template>
  <CTabs :activeItemKey=1>
    <CTabList variant="pills">
      <CTab aria-controls="home-tab-pane" :itemKey="1">Price List</CTab>
      <CTab aria-controls="search-tab-pane" :itemKey="2">Search</CTab>
    </CTabList>
    <CTabContent>
      <CTabPanel class="p-3" aria-labelledby="home-tab-pane" :itemKey="1">
        <div>
          <!-- Search Input and Create Button -->
          <CInputGroup class="mb-3">
            <CFormInput v-model="filterText" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
            <CButton id="button-addon2" type="button" color="primary" @click="changeFilter">
              Search
            </CButton>
          </CInputGroup>

          <!-- Create Button -->
          <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
            <CButton color="primary" @click="createPriceList">
              <CIcon icon="cil-plus" class="me-2" />
              Create
            </CButton>
          </div>

          <DataTable
            :value="priceList"
            :paginator="true"
            :rows="pagination.perPage"
            :totalRecords="pagination.total"
            :loading="loading"
            :lazy="true"
            @page="onPageChange"
            class="p-datatable-striped"
          >
          <Column field="is_submitted" header="Status" :sortable="true">
            <template #body="{data}">
              <Tag :value="data.is_submitted ? 'Posted' : 'Saved'"
                  :severity="data.is_submitted ? 'success' : 'info'" />
            </template>
          </Column>
          <Column field="code" header="Code" :sortable="true" />
          <Column field="unit_item" header="Unit Code" :sortable="true" />
          <Column field="unit_name" header="Unit" :sortable="true" />
          <Column field="warehouse_name" header="Warehouse" :sortable="true" />
          <Column field="description" header="Description" :sortable="true" />
          <Column field="periode_from" header="From" :sortable="true">
            <template #body="{ data }">
              <span>
                {{
                  formatDate(data.periode_from)
                }}
              </span>
            </template>
          </Column>
          <Column field="periode_to" header="To" :sortable="true">
            <template #body="{ data }">
              <span>
                {{
                  formatDate(data.periode_to)
                }}
              </span>
            </template>
          </Column>

          <Column field="is_active" header="Status" :sortable="true">
            <template #body="{data}">
              <Tag :value="data.is_active ? 'Active' : 'Inactive'"
                  :severity="data.is_active ? 'success' : 'danger'" />
            </template>
          </Column>

            <Column field="is_active" header="Status" :sortable="true">
              <template #body="{data}">
                <Tag :value="data.is_active ? 'Active' : 'Inactive'"
                    :severity="data.is_active ? 'success' : 'danger'" />
              </template>
            </Column>

            <Column header="Actions">
              <template #body="{data}">
                <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editPriceList(data.id)" />
              </template>
            </Column>
          </DataTable>
        </div>
      </CTabPanel>
      <CTabPanel class="p-3" aria-labelledby="search-tab-pane" :itemKey="2">
        <div>
          <!-- Search Input and Create Button -->
          <CInputGroup class="mb-3">
            <CFormInput v-model="filterTextSearch" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
            <CButton id="button-addon2" type="button" color="primary" @click="changeFilterSearch">
              Search
            </CButton>
          </CInputGroup>

          <DataTable
            :value="searchPriceList"
            :paginator="true"
            :rows="pagination.perPage"
            :totalRecords="pagination.total"
            :loading="loading"
            :lazy="true"
            @page="onPageChangeSearch"
            class="p-datatable-striped"
          >
            <Column header="Actions">
              <template #body="{data}">
                <Button icon="pi pi-trash" class="p-button-warning mr-2" @click="deletePriceList(data.id)" />
              </template>
            </Column>
            <Column field="code" header="PL Code" :sortable="true" />
            <Column field="periode_from" header="From" :sortable="true">
              <template #body="{ data }">
                <span>
                  {{
                    formatDate(data.periode_from)
                  }}
                </span>
              </template>
            </Column>
            <Column field="periode_to" header="To" :sortable="true">
              <template #body="{ data }">
                <span>
                  {{
                    formatDate(data.periode_to)
                  }}
                </span>
              </template>
            </Column>
            <Column field="is_active" header="Status" :sortable="true">
              <template #body="{data}">
                <Tag :value="data.is_active ? 'Active' : 'Inactive'"
                    :severity="data.is_active ? 'success' : 'danger'" />
              </template>
            </Column>
            <Column field="unit_item" header="Unit Code" :sortable="true" />
            <Column field="unit_name" header="Unit Name" :sortable="true" />
            <Column field="warehouse_name" header="Warehouse" :sortable="true" />
            <Column field="description" header="Description" :sortable="true" />
            <Column field="product_code" header="Product No." :sortable="true" />
            <Column field="item_code" header="Item Code" :sortable="true" />
            <Column field="item_name" header="Item Name" :sortable="true" />
            <Column field="item_unit" header="Item Unit" :sortable="true" />
            <Column field="price_spi" header="Price SPI*" :sortable="true">
              <template #body="{ data }">
                <span>
                  {{
                    formatNumber(data.price_spi)
                  }}
                </span>
              </template>
            </Column>
            <Column field="price" header="Price*" :sortable="true">
              <template #body="{ data }">
                <span>
                  {{
                    formatNumber(data.price)
                  }}
                </span>
              </template>
            </Column>

          </DataTable>
        </div>
      </CTabPanel>
    </CTabContent>
  </CTabs>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { AgGridVue } from  'ag-grid-vue3';
import {ClientSideRowModelModule} from 'ag-grid-community';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const priceList = ref([]); // List of companies fetched from API
const searchPriceList = ref([]); // List of companies fetched from API
// const list = ref([]);
const filterText = ref('');
const filterTextSearch = ref('');
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const paginationSearch = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const router = useRouter();
const authStore = useAuthStore();
const token = localStorage.getItem("token");

const loading = ref(false);
const error = ref(null);
const formatDate = (dateString) => {
  const date = new Date(dateString); // Convert the string to a Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`; // Return formatted date
};

const formatNumber = (value) => {
  if (value == null) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const columnDefs = [
  {
    field: 'is_submitted',
    headerName: 'Status',
    sortable: true,
    cellRenderer: (params) => {
      // Map integer 1 to "Active" and 0 to "Inactive"
      return params.value === 4 ? 'Submitted' : 'Saved';
    },
    flex:0.8
  },
  { field: 'code', headerName: 'Code', sortable: true, flex: 1 },
  { field: 'unit_item', headerName: 'Unit Code', sortable: true, flex: 1 },
  { field: 'warehouse_name', headerName: 'Warehouse', sortable: true, flex: 2 },
  { field: 'description', headerName: 'Description', sortable: true, flex: 2 },
  {
    field: 'periode_from',
    headerName: 'From',
    sortable: true,
    cellRenderer: (params) => {
      return formatDate(params.value);;
    },
    flex:1
  },
  {
    field: 'periode_to',
    headerName: 'To',
    sortable: true,
    cellRenderer: (params) => {
      return formatDate(params.value);;
    },
    flex:1
  },
  {
    field: 'is_active',
    headerName: 'Active',
    sortable: true,
    cellRenderer: (params) => {
      // Map integer 1 to "Active" and 0 to "Inactive"
      return params.value === 1 ? 'Active' : 'Inactive';
    },
    flex:0.6
  },
  {
    headerName: 'Action',
    cellRenderer: (params) => {
      const editButton = document.createElement('button');
      editButton.innerHTML = 'Edit';
      editButton.classList.add('btn', 'btn-warning');
      editButton.addEventListener('click', () => {
        // Handle the edit action
        editPriceList(params.data.id);
      });
      return editButton;
    },
    flex:0.6
  },
  // Tambahkan field lain sesuai kebutuhan
];

const columnDefsSearch = [
  {
    headerName: 'Action',
    cellRenderer: (params) => {
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
      deleteButton.addEventListener('click', () => {
        deletePriceList(params.data.id, params.data.pl_id);
      });
      return deleteButton;
    },
    flex:0.6
  },
  { field: 'code', headerName: 'PL Code', sortable: true, flex: 1 },
  {
    field: 'periode_from',
    headerName: 'From',
    sortable: true,
    cellRenderer: (params) => {
      return formatDate(params.value);;
    },
    flex:1
  },
  {
    field: 'periode_to',
    headerName: 'To',
    sortable: true,
    cellRenderer: (params) => {
      return formatDate(params.value);;
    },
    flex:1
  },
  {
    field: 'is_active',
    headerName: 'Active',
    sortable: true,
    cellRenderer: (params) => {
      // Map integer 1 to "Active" and 0 to "Inactive"
      return params.value === 1 ? 'Active' : 'Inactive';
    },
    flex:0.6
  },
  { field: 'unit_item', headerName: 'Unit Code', sortable: true, flex: 1 },
  { field: 'unit_name', headerName: 'Unit Name', sortable: true, flex: 1 },
  { field: 'warehouse_name', headerName: 'Warehouse', sortable: true, flex: 2 },
  { field: 'description', headerName: 'Description', sortable: true, flex: 2 },
  { field: 'product_code', headerName: 'Product No.', sortable: true, flex: 1 },
  { field: 'item_code', headerName: 'Item Code', sortable: true, flex: 1 },
  { field: 'item_name', headerName: 'Item Name', sortable: true, flex: 1 },
  { field: 'item_unit', headerName: 'Item Unit', sortable: true, flex: 1 },
  { field: 'price', headerName: 'Price', sortable: true, flex: 1 },
  { field: 'price', headerName: 'Price PSI', sortable: true, flex: 1 },
  // Tambahkan field lain sesuai kebutuhan
];

const gridOptions = {
  rowModelType: 'clientSide',
  modules: [ClientSideRowModelModule]
};

const fetchData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const response = await axios.get(`/api/master/office_price_list?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    priceList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Price List:', priceList); // Log to verify the data
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};
const fetchDataSearch = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const response = await axios.get(`/api/master/office_price_list/search?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    searchPriceList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Price List:', priceList); // Log to verify the data
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

const deletePriceList = async (id, pl_id) => {
  if (confirm('Apakah Anda yakin ingin menghapus price list ini?')) {
    try {
      const response = await axios.post(`/api/master/office_price_list/deletePriceListItem/${id}/${pl_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Refresh data setelah berhasil menghapus
        fetchData(pagination.currentPage, filterText.value);
        fetchDataSearch(paginationSearch.currentPage, filterTextSearch.value);
        alert('Price list berhasil dihapus');
      } else {
        alert('Gagal menghapus price list: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error deleting price list:', err);
      alert('Terjadi kesalahan saat menghapus price list');
    }
  }
};


const onPageChange = (event) => {
  pagination.currentPage = event.page + 1;
  fetchData(pagination.currentPage, filterText.value);
};

const onPageChangeSearch = (event) => {
  pagination.currentPage = event.page + 1;
  fetchDataSearch(pagination.currentPage, filterText.value);
};


const changeFilter = () => {
  fetchData(1, filterText.value); // Fetch data with filter applied
};

const changePageSearch = (pageNumber) => {
  paginationSearch.currentPage = pageNumber;
  fetchDataSearch(paginationSearch.currentPage, filterTextSearch.value);
};

const changeFilterSearch = () => {
  fetchDataSearch(1, filterTextSearch.value); // Fetch data with filter applied
};

const createPriceList = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Price List' });
};

const editPriceList = (priceListId) => {
  console.log('Redirecting to edit customer page with ID:', priceListId);
  router.push({ name: 'Edit Price List', params: { id: priceListId } });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.ctable-address {
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide any overflowed text */
  text-overflow: ellipsis; /* Add "..." when the text overflows */
  max-width: 200px; /* Set max width for address column */
}

.table-responsive {
  overflow-x: auto; /* Add horizontal scrolling */
}
</style>
