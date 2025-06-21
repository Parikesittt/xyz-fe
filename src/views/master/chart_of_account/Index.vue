<template>
  <div>
    <div class="mb-3"><h3>Chart Of Account</h3></div>
    <!-- Search Input and Create Button -->
    <CInputGroup class="mb-3">
      <CFormInput v-model="filterText" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
      <CButton id="button-addon2" type="button" color="primary" @click="changeFilter">
        Search
      </CButton>
    </CInputGroup>

    <!-- Create Button -->
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
      <CButton color="primary" @click="createChartAccount">
        <CIcon icon="cil-plus" class="me-2" />
        Create
      </CButton>
    </div>

    <DataTable
      :value="chartAccountList"
      :paginator="true"
      :rows="pagination.perPage"
      :totalRecords="pagination.total"
      :loading="loading"
      :lazy="true"
      @page="onPageChange"
      class="p-datatable-striped"
    >
      <Column field="ledger_account" header="Account" :sortable="true" />
      <Column field="account_name" header="Name" :sortable="true" />
      <Column field="account_type" header="Type" :sortable="true" />

      <Column header="Actions">
        <template #body="{data}">
          <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editChartAccount(data.id)" />
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

const chartAccountList = ref([]); // List of companies fetched from API
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


const fetchData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const response = await axios.get(`/api/master/ledger?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    chartAccountList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Ledger List:', chartAccountList.value.created_at); // Log to verify the data
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

const createChartAccount = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Chart of Account' });
};

const editChartAccount = (chartAccountId) => {
  console.log('Redirecting to edit Chart of Account page with ID:', chartAccountId);
  router.push({ name: 'Edit Chart of Account', params: { id: chartAccountId } });
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
