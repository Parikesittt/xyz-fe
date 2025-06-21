<template>
  <div>
    <div class="mb-3"><h3>Item Group</h3></div>
    <!-- Search Input and Create Button -->
    <CInputGroup class="mb-3">
      <CFormInput v-model="filterText" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
      <CButton id="button-addon2" type="button" color="primary" @click="changeFilter">
        Search
      </CButton>
    </CInputGroup>

    <!-- Create Button -->
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
      <CButton color="primary" @click="createItem">
        <CIcon icon="cil-plus" class="me-2" />
        Create
      </CButton>

      <CButton color="primary" @click="exportItem">
        <CIcon icon="cil-plus" class="me-2" />
        Export
      </CButton>

      <CButton color="primary" @click="uploadItem">
        <CIcon icon="cil-plus" class="me-2" />
        Upload Item Part
      </CButton>
    </div>

    <DataTable
      :value="itemList"
      :paginator="true"
      :rows="pagination.perPage"
      :totalRecords="pagination.total"
      :loading="loading"
      :lazy="true"
      @page="onPageChange"
      class="p-datatable-striped"
    >
      <Column field="is_posted" header="Status" :sortable="true">
        <template #body="{data}">
          <Tag :value="data.is_posted ? 'Posted' : 'Saved'"
               :severity="data.is_posted ? 'success' : 'info'" />
        </template>
      </Column>
      <Column field="code" header="Item Code" :sortable="true" />
      <Column field="name" header="Name of Material" :sortable="true" />
      <Column field="unit" header="Unit" :sortable="true" />
      <Column field="product_code" header="Product No." :sortable="true" />
      <Column field="item_subcategory_name" header="Category" :sortable="true" />

      <Column field="is_active" header="Active" :sortable="true">
        <template #body="{data}">
          <Tag :value="data.is_active ? 'Active' : 'Inactive'"
               :severity="data.is_active ? 'success' : 'danger'" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{data}">
          <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editItem(data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
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

const itemList = ref([]);
const filterText = ref('');
const loading = ref(false);

const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const router = useRouter();
const authStore = useAuthStore();
const token = localStorage.getItem("token");

const error = ref(null);

const formatDate = (dateString) => {
  const date = new Date(dateString); // Convert the string to a Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Return formatted date
};

const columnDefs = [
  {
    field: 'is_posted',
    headerName: 'Status',
    sortable: true,
    cellRenderer: (params) => {
      // Map integer 1 to "Active" and 0 to "Inactive"
      return params.value === 1 ? 'Posted' : 'Unposted';
    },
    flex:1
  },
  { field: 'code', headerName: 'Item Code', sortable: true, flex: 1 },
  { field: 'name', headerName: 'Name of Material', sortable: true, flex: 2 },
  { field: 'unit', headerName: 'Unit', sortable: true, flex: 2 },
  { field: 'product_code', headerName: 'Product No.', sortable: true, flex: 2 },
  { field: 'item_subcategory_name', headerName: 'Category', sortable: true, flex: 2 },
  {
    field: 'is_active',
    headerName: 'Active',
    sortable: true,
    cellRenderer: (params) => {
      // Map integer 1 to "Active" and 0 to "Inactive"
      return params.value === 1 ? 'Active' : 'Inactive';
    },
    flex:1
  },
  {
    headerName: 'Action',
    cellRenderer: (params) => {
      const editButton = document.createElement('button');
      editButton.innerHTML = 'Edit';
      editButton.classList.add('btn', 'btn-warning');
      editButton.addEventListener('click', () => {
        // Handle the edit action
        editItem(params.data.item_id);
      });
      return editButton;
    },
    flex:1
  },
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
    const response = await axios.get(`/api/master/item?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    itemList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Item List:', itemList.value.created_at); // Log to verify the data
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event) => {
  pagination.currentPage = event.page + 1;
  fetchData(pagination.currentPage, filterText.value);
};

const changeFilter = () => {
  fetchData(1, filterText.value); // Fetch data with filter applied
};

const createItem = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Item' });
};

const uploadItem = () => {
  console.log('Redirecting to upload page');
  router.push({ name: 'Upload Item' });
};

const editItem = (itemId) => {
  console.log('Redirecting to edit item group page with ID:', itemId);
  router.push({ name: 'Edit Item', params: { id: itemId } });
};

const exportItem = async () => {
  try {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Dynamically create the filename with the current date
    const filename = `inventory_${currentDate}.xlsx`;  // Example: inventory_2025-05-04.xlsx

    const response = await axios({
      url: '/api/master/export/master-item',  // API endpoint for export
      method: 'GET',
      responseType: 'blob', // Set the response type as blob for file download
      headers: {
        'Authorization': `Bearer ${token}`, // Authorization header for the API call
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Ensure Excel file type is accepted
      },
    });

    // Create a blob from the response and trigger the download
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename; // Use the dynamically generated filename
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadLink.href);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data. Please try again.');
  }
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
