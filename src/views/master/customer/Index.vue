<template>
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
      <CButton color="primary" @click="createCustomer">
        <CIcon icon="cil-plus" class="me-2" />
        Create
      </CButton>
    </div>

    <DataTable
  :value="customerList"
  :paginator="true"
  :rows="pagination.perPage"
  :totalRecords="pagination.total"
  :loading="loading"
  :lazy="true"
  @page="onPageChange"
  class="p-datatable-striped"
  tableStyle="min-width: 1200px"
>
  <Column field="accountNum" header="Code" style="min-width: 100px" :sortable="true" />
  <Column field="name" header="Name" style="min-width: 200px" :sortable="true">
    <template #body="{ data }">
      <div class="cell-content">
        {{ data.name }}
      </div>
    </template>
  </Column>
  <Column field="contact" header="Contact Person" style="min-width: 150px" :sortable="true">
    <template #body="{ data }">
      <div class="cell-content">
        {{ data.contact }}
      </div>
    </template>
  </Column>
  <Column field="email" header="Email" style="min-width: 200px" :sortable="true">
    <template #body="{ data }">
      <div class="cell-content">
        {{ data.email }}
      </div>
    </template>
  </Column>
  <Column field="phone" header="Mobile" style="min-width: 130px" :sortable="true" />
  <Column field="telefax" header="Phone" style="min-width: 130px" :sortable="true" />
  <Column field="address" header="Address" style="min-width: 250px" :sortable="true">
    <template #body="{ data }">
      <div class="cell-content">
        {{ data.address }}
      </div>
    </template>
  </Column>
  <Column field="is_active" header="Status" style="min-width: 100px" :sortable="true">
    <template #body="{data}">
      <Tag :value="data.is_active ? 'Active' : 'Inactive'"
           :severity="data.is_active ? 'success' : 'danger'" />
    </template>
  </Column>
  <Column header="Actions" style="min-width: 100px">
    <template #body="{data}">
      <Button icon="pi pi-pencil" class="p-button-warning p-button-sm" @click="editCustomer(data.id)" />
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

const customerList = ref([]); // List of companies fetched from API
// const list = ref([]);
const filterText = ref('');
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const router = useRouter();
const authStore = useAuthStore();
const token = localStorage.getItem("token");

const loading = ref(false);
const error = ref(null);

const columnDefs = [
  { field: 'accountNum', headerName: 'Code', sortable: true, flex:1 },
  { field: 'name', headerName: 'Name', sortable: true, flex: 1 },
  { field: 'contact', headerName: 'Contact Person', sortable: true, flex: 1 },
  { field: 'email', headerName: 'Email', sortable: true, flex:1 },
  { field: 'phone', headerName: 'Mobile', sortable: true, flex:1 },
  { field: 'telefax', headerName: 'Phone', sortable: true, flex:1 },
  { field: 'address', headerName: 'Address', sortable: true, flex:2 },
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
        editCustomer(params.data.id);
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
    const response = await axios.get(`/api/master/customer?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    customerList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Customer List:', customerList); // Log to verify the data
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

const createCustomer = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Customer' });
};

const editCustomer = (customerId) => {
  console.log('Redirecting to edit customer page with ID:', customerId);
  router.push({ name: 'Edit Customer', params: { id: customerId } });
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
.text-truncate-cell {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.truncate-cell {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-content {
  padding: 0.5rem;
  word-break: break-word;
  white-space: normal;
  overflow: visible;
}

:deep(.p-datatable) {
  overflow-x: auto;
}

:deep(.p-datatable-wrapper) {
  overflow-x: auto;
}

:deep(.p-datatable-table) {
  width: 100%;
}

:deep(.p-button-sm) {
  padding: 0.4rem;
  font-size: 0.8rem;
  margin: 0.2rem;
}

div {
  overflow-x: auto;
  width: 100%;
}
</style>
