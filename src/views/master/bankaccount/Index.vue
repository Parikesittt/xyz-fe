<template>
  <div>
    <div class="mb-3"><h3>Bank Account</h3></div>
    <!-- Search Input and Create Button -->
    <CInputGroup class="mb-3">
      <CFormInput v-model="filterText" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
      <CButton id="button-addon2" type="button" color="primary" @click="changeFilter">
        Search
      </CButton>
    </CInputGroup>

    <!-- Create Button -->
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
      <CButton color="primary" @click="createBankAccount">
        <CIcon icon="cil-plus" class="me-2" />
        Create
      </CButton>
    </div>

    <DataTable
      :value="bankAccountList"
      :paginator="true"
      :rows="pagination.perPage"
      :totalRecords="pagination.total"
      :loading="loading"
      :lazy="true"
      @page="onPageChange"
      class="p-datatable-striped"
    >
      <Column field="bank" header="Bank" :sortable="true" />
      <Column field="no_rek" header="Account Number" :sortable="true" />
      <Column field="name" header="Account Name" :sortable="true" />
      <Column field="location_name" header="Location" :sortable="true" />
      <Column field="description" header="Description" :sortable="true" />

      <Column field="is_active" header="Status" :sortable="true">
        <template #body="{data}">
          <Tag :value="data.is_active ? 'Active' : 'Inactive'"
               :severity="data.is_active ? 'success' : 'danger'" />
        </template>
      </Column>

      <Column header="Actions">
        <template #body="{data}">
          <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editBankAccount(data.id)" />
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
import api from '../../../api/api';

const bankAccountList = ref([]); // List of companies fetched from API
// const list = ref([]);
const filterText = ref('');
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const router = useRouter();

const loading = ref(false);
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
  { field: 'bank', headerName: 'Bank', sortable: true, flex: 1.5 },
  { field: 'no_rek', headerName: 'Account Number', sortable: true, flex: 1.5 },
  { field: 'name', headerName: 'Account Name', sortable: true, flex: 2 },
  { field: 'name', headerName: 'Location', sortable: true, flex: 2 },
  { field: 'description', headerName: 'Description', sortable: true, flex: 2 },
  {
    field: 'created_at',
    headerName: 'Date',
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
        editBankAccount(params.data.id);
      });
      const listItem = document.createElement('button');
      listItem.innerHTML = 'List Item';
      listItem.classList.add('btn', 'btn-secondary');
      listItem.addEventListener('click', () => {
        // Handle the edit action
        // editBankAccount(params.data.id);
        console.log('List Item')
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
    const response = await api.get(`/api/master/bankaccount?search=${keywords}&page=${page}`);

    bankAccountList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Bank Account List:', bankAccountList.value.created_at); // Log to verify the data
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

const createBankAccount = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Bank Account' });
};

const editBankAccount = (bankAccountId) => {
  console.log('Redirecting to edit bank account page with ID:', bankAccountId);
  router.push({ name: 'Edit Bank Account', params: { id: bankAccountId } });
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
