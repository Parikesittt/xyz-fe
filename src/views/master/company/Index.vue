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
      <CButton color="primary" @click="createCompany">
        <CIcon icon="cil-plus" class="me-2" />
        Create
      </CButton>
    </div>

    <!-- Responsive Table -->
    <DataTable
      :value="companyList"
      :paginator="true"
      :rows="pagination.perPage"
      :totalRecords="pagination.total"
      :loading="loading"
      :lazy="true"
      @page="onPageChange"
      class="p-datatable-striped"
    >
      <Column field="code" header="Code" :sortable="true" />
      <Column field="name" header="Name" :sortable="true" />
      <Column field="address" header="Address" :sortable="true" />
      <Column field="phone" header="Phone" :sortable="true" />
      <Column field="email" header="Email" :sortable="true" />

      <Column field="is_active" header="Status" :sortable="true">
        <template #body="{data}">
          <Tag :value="data.is_active ? 'Active' : 'Inactive'"
               :severity="data.is_active ? 'success' : 'danger'" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{data}">
          <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editCompany(data.id)" />
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

const companyList = ref([]); // List of companies fetched from API
// const list = ref([]);
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

const columnDefs = [
  { field: 'code', headerName: 'Code', sortable: true, flex:1 },
  { field: 'name', headerName: 'Name', sortable: true, flex: 1 },
  { field: 'address', headerName: 'Address', sortable: true, flex:2 },
  { field: 'phone', headerName: 'Phone', sortable: true, flex:1 },
  { field: 'email', headerName: 'email', sortable: true, flex:1 },
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
        editCompany(params.data.id);
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

// const fetchData = async (pageNumber = 1, keywords = '') => {
//   const page = pageNumber ? pageNumber : pagination.currentPage;

//   try {
//     const response = await axios.get(`/api/master/company?search=${keywords}&page=${page}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     companyList.value = response.data.data.data; // Set company data
//     pagination.currentPage = response.data.data.current_page;
//     pagination.perPage = response.data.data.per_page;
//     pagination.total = response.data.data.total;

//     console.log('Company List:', companyList); // Log to verify the data
//   } catch (err) {
//     console.error('Error fetching data:', err);
//   }
// };

const fetchData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const response = await axios.get(`/api/master/company`, {
      params: {
        page: page,
        search: keywords,
        per_page: pagination.perPage
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    companyList.value = response.data.data.data;
    pagination.total = response.data.data.total;
    pagination.currentPage = response.data.data.current_page;

  } catch (error) {
    console.error('Error fetching data:', error);
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

const createCompany = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Company' });
};

const editCompany = (companyId) => {
  console.log('Redirecting to edit company page with ID:', companyId);
  router.push({ name: 'Edit Company', params: { id: companyId } });
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
