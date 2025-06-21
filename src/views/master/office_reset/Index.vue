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
            <CButton color="primary" @click="createReset">
              <CIcon icon="cil-plus" class="me-2" />
              Create
            </CButton>
          </div>

          <DataTable
            :value="resetList"
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
              <Tag :value="data.is_submitted ? 'Activated' : 'Saved'"
                  :severity="data.is_submitted ? 'success' : 'info'" />
            </template>
          </Column>
          <Column field="code" header="Code" :sortable="true" />
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

            <Column header="Actions">
              <template #body="{data}">
                <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editReset(data.id)" />
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

const resetList = ref([]); // List of companies fetched from API
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
  return `${day}/${month}/${year}`; // Return formatted date
};

const formatNumber = (value) => {
  if (value == null) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const gridOptions = {
  rowModelType: 'clientSide',
  modules: [ClientSideRowModelModule]
};

const fetchData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const response = await axios.get(`/api/master/office_reset?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    resetList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Price List:', resetList); // Log to verify the data
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


const createReset = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Office Reset' });
};

const editReset = (resetId) => {
  console.log('Redirecting to edit customer page with ID:', resetId);
  router.push({ name: 'Edit Office Reset', params: { id: resetId } });
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
