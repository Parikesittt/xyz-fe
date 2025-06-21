<template>
  <div>
    <CTabs :activeItemKey=1>
      <CTabList variant="pills">
        <CTab aria-controls="service-tab-pane" :itemKey="1">Service</CTab>
        <CTab aria-controls="monitoring-tab-pane" :itemKey="2">Monitoring</CTab>
        <CTab aria-controls="zfp1-tab-pane" :itemKey="3">Adjusment ZFP1</CTab>
        <CTab aria-controls="zfp2-tab-pane" :itemKey="4">Adjusment ZFP2</CTab>
        <CTab aria-controls="listZFP-tab-pane" :itemKey="5">List ZFPN</CTab>
        <CTab aria-controls="multi-tab-pane" :itemKey="6">Multi Print</CTab>
      </CTabList>
      <CTabContent>
        <CTabPanel class="p-3" aria-labelledby="service-tab-pane" :itemKey="1">
          <div>
            <div class="mb-3">
              <h3>Office CS</h3>
            </div>
            <!-- Search Input and Create Button -->
            <CInputGroup class="mb-3">
              <CFormInput v-model="filterText" placeholder="Search" aria-label="Search"
                aria-describedby="button-addon2" />
              <CButton id="button-addon2" type="button" color="primary" @click="changeFilter">
                Search
              </CButton>
            </CInputGroup>
            <div class="d-flex gap-3 mb-4">
              <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="label" optionValue="value"
                placeholder="Select Status" class="w-full md:w-20rem" @change="onFilterChange" />
              <Dropdown v-model="selectedIncomingSource" :options="incomingSourceOptions" optionLabel="label"
                optionValue="value" placeholder="Select Incoming Source" class="w-full md:w-20rem"
                @change="onFilterChange" />
            </div>

            <!-- Create Button -->
            <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
              <CButton color="primary" @click="createCS">
                <CIcon icon="cil-plus" class="me-2" />
                Create
              </CButton>
            </div>

            <DataTable :value="csList" :paginator="true" :rows="pagination.perPage" :totalRecords="pagination.total"
              :loading="loading" :lazy="true" @page="onPageChange" class="p-datatable-striped">
              <Column field="is_active" header="Status" :sortable="true">
                <template #body="{ data }">
                  <Tag :value="getStatusText(data)" :style="getStatusStyle(data)" class="status-tag" />
                </template>
              </Column>
              <Column field="zfp1" header="ZFP" :sortable="true" />
              <Column field="warranty" header="Warranty" :sortable="true" />
              <Column field="is_part" header="Part" :sortable="true" />
              <Column field="rma_number" header="RMA Number" :sortable="true" />
              <Column field="technician_name" header="Technician" :sortable="true" />
              <Column field="dp" header="DP" :sortable="true" />
              <Column field="code" header="CS Code" :sortable="true" />
              <Column field="date_create" header="Date" :sortable="true" />
              <Column field="cust_item" header="Item Service" :sortable="true" />
              <Column field="location_name" header="Store" :sortable="true" />
              <Column field="customer_code" header="Customer Code" :sortable="true" />
              <Column field="customer_name" header="Customer Name" :sortable="true" />
              <Column field="incomingsource" header="Inc. Source" :sortable="true" />
              <Column field="cs_name" header="CS" :sortable="true" />
              <Column field="time_process" header="Process" :sortable="true" />
              <Column field="user_process" header="User Process" :sortable="true" />
              <Column field="time_done_ts" header="Done TS" :sortable="true" />
              <Column field="user_done_ts" header="User Done TS" :sortable="true" />
              <Column field="time_done" header="Done" :sortable="true" />
              <Column field="date_input_rma" header="Req. Date" :sortable="true" />
              <Column field="date_finish_rma" header="Finish Date" :sortable="true" />

              <Column header="Actions">
                <template #body="{ data }">
                  <Button icon="pi pi-pencil" class="p-button-warning mr-2" @click="editCs(data.id)" />
                </template>
              </Column>
            </DataTable>
          </div>
        </CTabPanel>
        <CTabPanel class="p-3" aria-labelledby="search-tab-pane" :itemKey="2">
          <div>
            <!-- Search Input and Create Button -->
            <CInputGroup class="mb-3">
              <CFormInput v-model="filterTextSearch" placeholder="Search" aria-label="Search"
                aria-describedby="button-addon2" />
              <CButton id="button-addon2" type="button" color="primary" @click="changeFilterSearch">
                Search
              </CButton>
            </CInputGroup>

            <DataTable :value="searchPriceList" :paginator="true" :rows="pagination.perPage"
              :totalRecords="pagination.total" :loading="loading" :lazy="true" @page="onPageChangeSearch"
              class="p-datatable-striped">
              <Column field="is_active" header="Status" :sortable="true">
                <template #body="{ data }">
                  <Tag :value="getStatusText(data)" :style="getStatusStyle(data)" class="status-tag" />
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
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { AgGridVue } from 'ag-grid-vue3';
import { ClientSideRowModelModule } from 'ag-grid-community';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';

const csList = ref([]);
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

const statusOptions = ref([
  { label: 'All', value: 100 },
  { label: 'Saved', value: 0 },
  { label: 'Post', value: 1 },
  { label: 'Process', value: 2 },
  { label: 'Send Offer', value: 3 },
  { label: 'Need Approval Customer', value: 12 },
  { label: 'Approval Customer', value: 13 },
  { label: 'Process - Request Part', value: 4 },
  { label: 'Part Ready on TS', value: 6 },
  { label: 'Done', value: 7 },
  { label: 'Receive Bad Part', value: 15 },
  { label: 'Part Ready to Pickup', value: 8 },
  { label: 'Part Ready to Destroyed', value: 16 },
  { label: 'Paid', value: 9 },
  { label: 'Canceled', value: 10 },
  { label: 'Destroyed', value: 11 }
]);

const incomingSourceOptions = ref([
  { label: 'All', value: 100 },
  { label: 'WALK-IN', value: 1 },
  { label: 'PICK UP', value: 2 },
  { label: 'ON-SITE', value: 3 }
]);

// Filter Values
const selectedStatus = ref(0); // Default All
const selectedIncomingSource = ref(100); // Default All


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

// Fungsi untuk mendapatkan teks status
const getStatusText = (data) => {
  if (data.is_active === 0 || data.is_active === null) return 'Saved';
  if (data.is_active === 1) return 'Post';
  if (data.is_active === 2) return 'Process';
  if (data.is_active === 3) return 'Send Offer';
  if (data.is_active === 4 && data.approval_cust === 0 && data.req_part_to_whs === 0 && data.part_total > data.part_done)
    return 'Need Approval Customer';
  if (data.is_active === 4 && data.approval_cust === 2 && data.req_part_to_whs === 0 && data.part_total > data.part_done && data.part_process <= 0)
    return 'Approval Customer';
  if (data.is_active === 4 && data.approval_cust === 1 && data.req_part_to_whs === 0)
    return 'Cancel Customer';
  if (data.is_active === 4 && data.approval_cust === 2 && data.req_part === 1 && data.part_total > data.part_done && data.part_process > 0)
    return 'Process - Request Part';
  if (data.is_active === 4 && data.req_part === 1 && data.part_total === data.part_done)
    return 'Part Ready on TS';
  if (data.is_active === 7 && data.send_bad_part === 0 && data.is_done_ts === 0)
    return 'Done by TS';
  if (data.is_active === 7 && data.send_bad_part === 0 && data.is_done_ts === 1)
    return 'Done By CS';
  // Tambahkan kondisi lainnya sesuai kebutuhan
  if (data.is_active === 10) return 'Canceled';
  if (data.is_active === 11) return 'Destroyed';

  return data.is_active ? 'Active' : 'Inactive';
};

// Fungsi untuk mendapatkan style warna
const getStatusStyle = (data) => {
  // Warna sesuai kondisi
  if (data.is_active === 0 || data.is_active === null)
    return { backgroundColor: '#cfe2ff', color: '#084298' }; // blue
  if (data.is_active === 1)
    return { backgroundColor: '#fff3cd', color: '#664d03' }; // orange
  if (data.is_active === 2)
    return { backgroundColor: '#fff3cd', color: '#856404' }; // yellow
  if (data.is_active === 3 || (data.is_active === 4 && data.approval_cust === 2))
    return { backgroundColor: '#d1e7dd', color: '#0f5132' }; // green
  if (data.is_active === 4 && (data.approval_cust === 1 || data.approval_cust === 0))
    return { backgroundColor: '#f8d7da', color: '#842029' }; // red
  if (data.is_active === 5)
    return { backgroundColor: '#e2e3e5', color: '#41464b' }; // grey
  if (data.is_active === 6 || data.is_active === 8)
    return { backgroundColor: '#e2d9f3', color: '#6f42c1' }; // purple
  if (data.is_active === 7)
    return { backgroundColor: '#f5d0e7', color: '#d63384' }; // pink
  if (data.is_active === 10)
    return { backgroundColor: '#212529', color: '#ffffff' }; // black
  if (data.is_active === 11)
    return { backgroundColor: '#ffffff', color: '#000000', border: '1px solid #dee2e6' }; // white

  return {};
};

const onFilterChange = () => {
  fetchData(1, filterText.value);
};

onMounted(() => {
  fetchData(1, '', 0, 100); // initial load
});

const fetchData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const statusFilter = selectedStatus.value ?? 100;
    const incomingFilter = selectedIncomingSource.value ?? 100;
    const response = await axios.get(`/api/office_cs/${statusFilter}/${incomingFilter}?search=${keywords}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    csList.value = response.data.data.data; // Set company data
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;

    console.log('Item List:', csList.value.created_at); // Log to verify the data
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

const createCS = () => {
  console.log('Redirecting to create page');
  router.push({ name: 'Create Office CS' });
};

const uploadItem = () => {
  console.log('Redirecting to upload page');
  router.push({ name: 'Upload Item' });
};

const editCs = (csId) => {
  console.log('Redirecting to edit item group page with ID:', csId);
  router.push({ name: 'Edit Office CS', params: { id: csId } });
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


</script>

<style scoped>
.ctable-address {
  white-space: nowrap;
  /* Prevent text from wrapping */
  overflow: hidden;
  /* Hide any overflowed text */
  text-overflow: ellipsis;
  /* Add "..." when the text overflows */
  max-width: 200px;
  /* Set max width for address column */
}

.table-responsive {
  overflow-x: auto;
  /* Add horizontal scrolling */
}

.status-tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
