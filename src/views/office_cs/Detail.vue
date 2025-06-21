<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>Customer Service</strong>
    </CCardHeader>
    <CCardBody>
      <div class="mb-3 d-flex justify-content-between" style="max-width: 350px;">
        <Button id="button-coll-slip" type="button" severity="info" @click="generateCollectionSlip(office_cs.oci_id)" :disabled = "details && (details.is_active == 0 && (details.incoming_source == 1 || details.incoming_source == 2))">
          Collection Slip
        </Button>
        <Button id="button-quotation" type="button" v-if="details && details.req_part == 1" severity="info" @click="generateQuotation(office_cs.oci_id)">
          Quotation
        </Button>
        <Button id="button-quotation" type="button" severity="info" @click="modalHistory = true">
          History
        </Button>
      </div>
      <HistoryDialog
        :modalHistory="modalHistory"
        :historyItemList="historyItemList"
        :filters="filtersHistory"
        :selectedLocation="selectedHistory"
        :lazyParams="lazyParamsHistory"
        :loading="loadingHistory"
        :pagination="paginationHistory"
        @update:modalHistory="modalHistory = $event"
        @update:filters="updateFiltersHistory"
        @update:lazyParams="(params) => { lazyParamsHistory.page = params.page; lazyParamsHistory.rows = params.rows }"
        @page="onHistoryPage"
      />
      <CForm @submit.prevent="save">
          <div class="row g-4">
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputCode">Code</CFormLabel>
                <CFormInput id="inputCode" type="text" placeholder="" v-model="office_cs.code" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputStatus">Status</CFormLabel>
                <multiselect
                  v-model="selectedStatus"
                  :options="statusOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                  disabled
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputDateCreate">Date Create*</CFormLabel>
                <DatePicker v-model="office_cs.date_create" disabled showIcon fluid dateFormat="d-M-yy" iconDisplay="input" inputId="date_created" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCustomer">Customer*</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput v-model="office_cs.customer_name" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                  <CButton id="button-addon2" type="button" color="primary" @click="modalCustomer = true" disabled>
                      <i class="pi pi-search"></i>
                  </CButton>
                </CInputGroup>
                <CustomerDialog
                              :modalCustomer="modalCustomer"
                              :customerList="customerList"
                              :filters="filters"
                              :selectedCustomer="selectedCustomer"
                              :lazyParams="lazyParams"
                              :loading="loading"
                              :pagination="pagination"
                              @update:modalCustomer="modalCustomer = $event"
                              @update:filters="filters = $event"
                              @update:selectedCustomer="selectedCustomer = $event"
                              @update:lazyParams="lazyParams = $event"
                              @choose="handleChooseCustomer"
                            />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputTimeReq">Time Request</CFormLabel>
                <DatePicker id="datepicker-timeonly" v-model="office_cs.time_request" timeOnly fluid showIcon iconDisplay="input" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTimeProcess">Time Process</CFormLabel>
                <CFormInput id="inputTimeProcess" type="text" placeholder="" v-model="office_cs.time_process" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTimeDone">Time Done</CFormLabel>
                <CFormInput id="inputTimeDone" type="text" placeholder="" v-model="office_cs.time_done" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTSNote">TS Note</CFormLabel>
                <CFormTextarea
                  id="inputTSNote"
                  rows="3"
                  v-model="office_cs.note"
                ></CFormTextarea>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputIsDP">DP?*</CFormLabel>
                <multiselect
                  v-model="selectedIsDP"
                  :options="isDPOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                  disabled
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputDPPayment">DP Payment*</CFormLabel>
                <multiselect
                  v-model="selectedDpPayment"
                  :options="dpPaymentOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                  disabled
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTotalPayment">Total Payment*</CFormLabel>
                <CFormInput id="inputTotalPayment" type="text" placeholder="" v-model="office_cs.total_payment" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputDpPercen">DP*</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput v-model="dpPercen" aria-label="Username" />
                  <CInputGroupText>%</CInputGroupText>
                  <CFormInput v-model="totalDp" aria-label="Server" />
                </CInputGroup>
              </div>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <div class="row g-4 mb-5">
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputItemCode">Item Code*</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput v-model="office_cs.item_code" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                  <CButton id="button-addon2" type="button" color="primary" @click="openItemDialog" disabled>
                      <i class="pi pi-search"></i>
                  </CButton>
                </CInputGroup>
                <ItemCsDialog
                  :modalItemCs="showItemDialog"
                  :itemList="items"
                  :customerItemList="customerItems"
                  :filters="filters"
                  :filtersItem="filtersItem"
                  :isItemSelected="isItemSelected"
                  :lazyParams="lazyParams"
                  :lazyParamsItem="lazyParamsItem"
                  :loading="loading"
                  :loadingItem="loadingItem"
                  :pagination="pagination"
                  :paginationItem="paginationItem"
                  @update:modalItemCs="showItemDialog = $event"
                  @update:filters="filters = $event"
                  @update:filtersItem="filtersItem = $event"
                  @update:lazyParams="fetchCustomerItems"
                  @update:lazyParamsItem="fetchItems"
                  @choose="handleItemSelection"
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputProductNo">Product No</CFormLabel>
                <CFormInput id="inputProductNo" type="text" placeholder="" v-model="office_cs.product_code" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemName">Item Name</CFormLabel>
                <CFormInput id="inputItemName" type="text" placeholder="" v-model="office_cs.item_name" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemUnit">Item Unit</CFormLabel>
                <CFormInput id="inputItemUnit" type="text" placeholder="" v-model="office_cs.item_unit" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCategory">Category</CFormLabel>
                <CFormInput id="inputCategory" type="text" placeholder="" v-model="office_cs.category_office" disabled />
              </div>
              <div v-if="details && details.incoming_source == 3">
                <div class="mb-3">
                  <CFormLabel for="inputItemCode">Cost On-Site</CFormLabel>
                  <CInputGroup class="mb-3">
                    <CFormInput v-model="office_cs.cost_onsite" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                    <CButton id="button-addon2" type="button" color="primary" @click="openItemDialog">
                        <i class="pi pi-search"></i>
                    </CButton>
                  </CInputGroup>
                  <CostOnsiteDialog
                    :modalDialog="modalDialog"
                    :costOnsiteList="costOnsiteList"
                    :filters="filtersCostOnsite"
                    :selectedCostOnsite="selectedCostOnsite"
                    :lazyParams="lazyParamsHistory"
                    :loading="loadingHistory"
                    :pagination="paginationHistory"
                    :selectionMode="'single'"
                    @update:modalCostOnsite="modalCostOnsite = $event"
                    @update:filters="updateFiltersHistory"
                    @update:selectedCostOnsite="updateSelectedCostOnsite"
                    @update:lazyParams="(params) => { lazyParamsCostOnsite.page = params.page; lazyParamsCostOnsite.rows = params.rows }"
                    @page="onCostOnsitePage"
                    @choose="handleChooseCostOnsite"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputSerialNumber">Serial Number</CFormLabel>
                <CFormInput id="inputSerialNumber" type="text" placeholder="" v-model="office_cs.serial_number" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputWarranty">Warranty</CFormLabel>
                <multiselect
                  v-model="selectedWarranty"
                  :options="warrantyOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                  />
                </div>
                <div class="mb-3">
                  <CFormLabel for="inputDateWarranty">Date Warranty</CFormLabel>
                  <DatePicker v-model="office_cs.date_warranty" showIcon fluid iconDisplay="input" inputId="date_warranty" :disabled="datepickerWarranty" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCost">Cost</CFormLabel>
                <CFormInput id="inputCost" type="text" placeholder="" :value="formatCost(office_cs.cost)" disabled class="text-end" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCounter">Counter</CFormLabel>
                <CFormInput id="inputCounter" type="text" placeholder="" v-model="office_cs.counter" class="text-end" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputIncSource">Incoming Source</CFormLabel>
                <multiselect
                  v-model="selectedIncSource"
                  :options="incSourceOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputServiceType">Service Type</CFormLabel>
                <multiselect
                  v-model="selectedServiceType"
                  :options="serviceTypeOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTechnician">Technician</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput v-model="office_cs.technician_name" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                  <CButton id="button-addon2" type="button" color="primary" @click="modalTechnician = true">
                      <i class="pi pi-search"></i>
                  </CButton>
                </CInputGroup>
                <CustomerDialog
                              :modalCustomer="modalTechnician"
                              :customerList="technicianList"
                              :filters="filters"
                              :selectedCustomer="selectedTechnician"
                              :lazyParams="lazyParams"
                              :loading="loading"
                              :pagination="pagination"
                              @update:modalCustomer="modalTechnician = $event"
                              @update:filters="filters = $event"
                              @update:selectedCustomer="selectedTechnician = $event"
                              @update:lazyParams="lazyParams = $event"
                              @choose="handleChooseTechnician"
                            />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputProblem">Problem*</CFormLabel>
                <CFormTextarea
                  id="inputProblem"
                  rows="3"
                  v-model="office_cs.problem"
                ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputNote">Note</CFormLabel>
                <CFormTextarea
                  id="inputNote"
                  rows="3"
                  v-model="office_cs.note"
                ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputRmaNumber">Rma Number*</CFormLabel>
                <CFormTextarea
                  id="inputRmaNumber"
                  rows="3"
                  v-model="office_cs.rma_number"
                  @change="saveRMA"
                ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputPoCust">PO Cust</CFormLabel>
                <CFormTextarea
                  id="inputPoCust"
                  rows="3"
                  v-model="office_cs.po_cust"
                ></CFormTextarea>
              </div>
            </div>
          </div>
          <div class="mb-3 custom-flex-container">
            <Button id="button-addon2" type="button" severity="info" @click="changeApprove"
            v-if="details && (details.req_part > 0 && details.approval_cust < 2 && details.is_active < 10 && details.is_active > 0)"
            :disabled="details && ((details.cek_part > x && details.count_status_stock == 0) || (details.dp_type == 1 && details.dp == 0))">
              Approval Customer
            </Button>
            <div class="send-container">
              <InputGroup v-if="details && (details.req_part == 1 && details.approval_cust < 2 && details.is_active < 10)">
                <InputText v-model="office_cs.customer_email" disabled />
                <Button label="Send" severity="info" icon="pi pi-send" @click="sendEmail"/>
              </InputGroup>
            </div>
          </div>
          <div class="mb-3">
            <DataTable
              :value="selectedItem"
              class="fixed-column-table"
              dataKey = "code"
              :scrollable="true"
              editMode="cell"
              @cell-edit-complete="onCellEditComplete">
              <Column header="Action" class="col-product-no">
                <template #body="{ index }">
                  <Button icon="pi pi-trash"
                    class="p-button-danger p-button-sm"
                    @click="removeItem(index)" />
                </template>
              </Column>
              <Column field="is_active" header="Status" class="col-code"></Column>
              <Column field="product_code" header="Product No." class="col-name">
              </Column>
              <Column field="part_id" header="Part Code" class="col-unit"></Column>
              <Column field="part_name" header="Part Name" class="col-unit"></Column>
              <Column field="part_unit" header="Part Unit" class="col-unit"></Column>
              <Column field="pl_price" header="Price List" class="col-unit">
                <template #body="{ data }">
                <span>
                  {{
                    formatNumber(data.pl_price)
                  }}
                </span>
              </template>
              </Column>
              <Column field="price" header="Price" class="col-unit">
                <template #body="{ data }">
                <span>
                  {{
                    formatNumber(data.price)
                  }}
                </span>
              </template>
              </Column>
              <Column field="stock" header="Stock" class="col-unit"></Column>
              <Column field="qty" header="Qty Req" class="col-unit"></Column>
              <Column field="qty_iptn_in" header="Qty In" class="col-unit">
                <template #body="{ data }">
                  {{ data.qty_iptn_in }}
                </template>
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" type="number" />
                </template>
              </Column>
              <Column field="qty_iptn_out" header="Qty Out" class="col-unit">
                <template #body="{ data }">
                  {{ data.qty_iptn_out }}
                </template>
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" type="number" />
                </template>
              </Column>
              <Column field="note" header="Note" class="col-unit">
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" type="text" />
                </template>
              </Column>
              <Column field="rma_number" header="RMA Number" class="col-unit">
                <template #body="{ data }">
                  {{ data.rma_number }}
                </template>
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" type="text" />
                </template>
              </Column>
              <Column field="status_stock" header="Status Part*">
                <template #body="{ data, index }">
                  <Dropdown v-model="data.status_stock" :options="actionOptions" optionLabel="label" optionValue="value"
                  placeholder="Select Action" class="w-full md:w-20rem" @change="onStatusStockChange(data, index)"/>
                </template>
              </Column>
            </DataTable>
            <div class="mb-3">
              <p v-if="((office_cs.cek_part > office_cs.cek_part_done) && (office_cs.cek_iptin_cs > 0 && office_cs.cek_iptin_cs == office_cs.part_process && office_cs.not_stock > 0)) || ((office_cs.cek_part > office_cs.cek_part_done) && (office_cs.not_stock > 0))" style="color:red;font-style: italic;font-size:bold;">
                *Jika ingin Transfer To Technician, pastikan Seluruh Stock pada part terpenuhi semua
              </p>
              <p v-if="office_cs.rma_number == ''" style="color:red;font-style: italic;font-size:bold;">
                *Mohon isi RMA number terlebih dahulu sebelum melakukan request part
              </p>
              <Button id="button-req-to-whs" type="button" severity="help" @click="dialogReqWhs = true" v-if="office_cs.warranty == 0" :disabled = "office_cs.cek_req_ts < 1">
                Request to Warehouse
              </Button>
              <Dialog v-model:visible="dialogReqWhs" modal header="Edit Profile" :style="{ width: '25rem' }">
                <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
                <div class="flex items-center gap-4 mb-4">
                    <label for="username" class="font-semibold w-24">Username</label>
                    <InputText id="username" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <InputText id="email" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="dialogReqWhs = false"></Button>
                    <Button type="button" label="Save" @click="dialogReqWhs = false"></Button>
                </div>
            </Dialog>
            </div>
          </div>
          <div class="mb-3 d-flex justify-content-between">
            <crudButton @revert="revert" @save="save" @back="back" />
            <CButton id="button-addon2" type="button" color="success" @click="post">
              Post
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import crudButton from '@/components/crudButton.vue'
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect';
import '@/assets/multiselect-theme.css';
import DatePicker from 'primevue/datepicker';
import ItemCsDialog from '@/components/ItemCsDialog.vue';
import CustomerDialog from '@/components/CustomerDialog.vue';
import HistoryDialog from '@/components/HistoryDialog.vue';
import CostOnsiteDialog from '@/components/CostOnsiteDialog.vue';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';



const form = ref({
  id: null,
  date_create: null,
  name: '',
  capacity: '',
  std_print: '',
  counter: '0',
  item_status: '0',
  is_ecommerce: '0',
  is_active: '0' // Default to active
})

const office_cs = ref({
  cek_konsum: 0,
  cek_stock: 0,
  cek_trf: 0,
  cek_total: 0,
  cek_part: 0,
  cek_stock_zfp: 0,
  not_stock: 0,
  cek_total_zfp: 0,
})

const not_stock = ref(0);
const cek_stock = ref(0);
const cek_consum = ref(0);
const grand_total = ref(0);
const cek_trf = ref(0);
const cek_total = ref(0);

// For detecting if we're editing or creating a company
const isEdit = ref(false)
const token = localStorage.getItem('token')
const dialogReqWhs = ref(false);

const warrantyOptions = [
  { value: 0, name: 'No' },
  { value: 1, name: 'Yes' },
];
const selectedWarranty = ref(null);
const incSourceOptions = [
  { value: 1, name: 'WALK-IN' },
  { value: 2, name: 'PICK UP' },
  { value: 3, name: 'ON-SITE' },
]
const selectedIncSource = ref(null);
const serviceTypeOptions = [
  { value: 1, name: 'SERVICE' },
  { value: 2, name: 'REPAIR' },
  { value: 3, name: 'SERVICE & REPAIR' },
];
const selectedServiceType = ref(null);
const statusOptions = [
  { value: 0, name: 'Saved' },
  { value: 1, name: 'Posted' },
  { value: 2, name: 'Process' },
  { value: 3, name: 'Done' },
];
const selectedStatus = ref(null);
const isDPOptions = [
  { value: 1, name: 'Yes' },
  { value: 2, name: 'No' },
];
const selectedIsDP = ref(null);
const dpPaymentOptions = [
  { value: 1, name: 'Cash' },
  { value: 2, name: 'EDC' },
  { value: 3, name: 'Transfer' },
];
const selectedDpPayment = ref(null);
const actionOptions = ref([
  { label: 'Select Action', value: null },
  { label: 'Ready', value: 'Ready' },
  { label: 'Indent', value: 'Indent' },
  { label: 'Discontinue', value: 'Discontinue' }
]);

const showItemDialog = ref(false);
const details = ref(null);
const formatNumber = (value) => {
  if (value == null) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const items = ref([]);
const filtersItem = reactive({ global: { value: null, matchMode: 'contains' } });
const selectedItem = ref(null);
const loadingItem = ref(false);
const paginationItem = reactive({ total: 0, currentPage: 1, perPage: 10 });
const lazyParamsItem = reactive({ page: 1, rows: 10 });

// State untuk customer item
const customerItems = ref([]);
const filters = reactive({ global: { value: null, matchMode: 'contains' } });
const selectedCustomerItem = ref(null);
const loading = ref(false);
const pagination = reactive({ total: 0, currentPage: 1, perPage: 10 });
const lazyParams = reactive({ page: 1, rows: 10 });

const modalCustomer = ref(false);
const customerList = ref([]);
const selectedCustomer = ref();

const modalTechnician = ref(false);
const technicianList = ref([]);
const selectedTechnician = ref();

const modalHistory = ref(false)
const historyItemList = ref([])
const loadingHistory = ref(false)
const filtersHistory = reactive({ global: { value: '', matchMode: 'contains' } })
const selectedHistory = ref([])
const lazyParamsHistory = reactive({ page: 1, rows: 50 })
const paginationHistory = reactive({ total: 0 })

const modalCostOnsite = ref(false)
const costOnsiteList = ref([])
const loadingCostOnsite = ref(false)
const filtersCostOnsite = reactive({ global: { value: '', matchMode: 'contains' } })
const selectedCostOnsite = ref([])
const lazyParamsCostOnsite = reactive({ page: 1, rows: 50 })
const paginationCostOnsite = reactive({ total: 0 })

const fetchWarehouseforReq = async () => {
  if(office_cs.value.warranty == 1){
    if(office_cs.value.zfp1 == 0){
      if()
    }
  }
}

const fetchHistoryItem = async () => {
  loadingHistory.value = true;
  try {
    const response = await axios.get(`/api/office_cs/item/${form.value.id}/${form.value.item_id}`, {
      params: {
        page: lazyParamsHistory.page,
        search: filtersHistory.global.value,
        per_page: lazyParamsHistory.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    historyItemList.value = response.data.data;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loadingHistory.value = false;
  }
}

watch([modalHistory, () => lazyParamsHistory.page, () => lazyParamsHistory.rows, () => filtersHistory.global.value], ([show]) => {
  if (show) fetchHistoryItem()
})

const onHistoryPage = (event) => {
  lazyParamsHistory.page = event.page + 1
  lazyParamsHistory.rows = event.rows
}

const onHistorySearch = () => {
  lazyParamsHistory.page = 1
  fetchHistoryItem()
}

const updateFiltersHistory = (newFilters) => {
  filtersHistory.global.value = newFilters.global.value
}

const updateSelectedHistory = (newSelected) => {
  selectedHistory.value = newSelected
}

const handleChooseHistory = (selected) => {
  // Lakukan sesuatu dengan data terpilih
  console.log('Selected history:', selected)
  modalHistory.value = false
}

const fetchCostOnsite = async () => {
  loadingCostOnsite.value = true;
  try {
    const response = await axios.get(`/api/office_cost`, {
      params: {
        page: lazyParamsCostOnsite.page,
        search: filtersCostOnsite.global.value,
        per_page: lazyParamsCostOnsite.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    costOnsiteList.value = response.data.data;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loadingCostOnsite.value = false;
  }
}

watch([modalCostOnsite, () => lazyParamsCostOnsite.page, () => lazyParamsCostOnsite.rows, () => filtersCostOnsite.global.value], ([show]) => {
  if (show) fetchCostOnsite()
})

const onCostOnsitePage = (event) => {
  lazyParamsHistory.page = event.page + 1
  lazyParamsHistory.rows = event.rows
}

const onCostOnsiteSearch = () => {
  lazyParamsHistory.page = 1
  fetchHistoryItem()
}

const updateFiltersCostOnsite = (newFilters) => {
  filtersHistory.global.value = newFilters.global.value
}

const updateSelectedCostOnsite = (newSelected) => {
  selectedHistory.value = newSelected
}

const handleChooseCostOnsite = (selected) => {
  // Lakukan sesuatu dengan data terpilih
  form.value.cost_onsite = selected;
  console.log('Selected history:', selected)
  modalHistory.value = false
}

const datepickerWarranty = ref(true);

const handleDisableDateWarranty = () => {
  if (selectedWarranty.value && selectedWarranty.value.value === 1) {
    datepickerWarranty.value = false; // Set to false if warranty is selected
  } else {
    datepickerWarranty.value = true; // Set to true otherwise
  }
};

// Watch for changes in selectedWarranty to update datepickerWarranty
watch(selectedWarranty, () => {
  handleDisableDateWarranty();
});

const onPage = (event) => {
  lazyParams.value = {
    ...lazyParams.value,
    page: event.page + 1,
    rows: event.rows
  };
  loadDataCustomer();
};

const generateQuotation = (id) => {
  // Pastikan ID ada
  if (!id) {
    Swal.fire({
      title: 'Error',
      text: 'ID tidak ditemukan.',
      icon: 'error',
    });
    return;
  }

  // Panggil API Laravel untuk menggenerate PDF
  axios
    .get(`/api/generate-pdf-quotation/${id}`, { responseType: 'blob' })  // Gunakan responseType 'blob' untuk file
    .then((response) => {
      // Membuat link untuk mendownload PDF
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      link.download = 'Customer_Service.pdf'; // Nama file PDF yang akan diunduh
      link.click();
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan saat menghasilkan PDF.',
        icon: 'error',
      });
    });
};

const generateCollectionSlip = (id) => {
  // Pastikan ID ada
  if (!id) {
    Swal.fire({
      title: 'Error',
      text: 'ID tidak ditemukan.',
      icon: 'error',
    });
    return;
  }

  // Panggil API Laravel untuk menggenerate PDF
  axios
    .get(`/api/generate-pdf-coll-slip/${id}`, { responseType: 'blob' })  // Gunakan responseType 'blob' untuk file
    .then((response) => {
      // Membuat link untuk mendownload PDF
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      link.download = 'Customer_Service.pdf'; // Nama file PDF yang akan diunduh
      link.click();
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan saat menghasilkan PDF.',
        icon: 'error',
      });
    });
};

const searchTimeout = ref(null);
const onSearch = (event) => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    lazyParams.value = {
      ...lazyParams.value,
      page: 1,
      search: filters.value.global.value || '' // Get search value from filters
    };
    loadDataCustomer();
  }, 300);
};
const loadDataCustomer = async () => {
  try {
    loading.value = true;
    loadingItem.value = true;
    await fetchCustomer(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
    loadingItem.value = false;
  }
};
const updateSelectedCustomer = (newSelectedCustomer) => {
  console.log(newSelectedCustomer)
  selectedArea.value = newSelectedCustomer;
}

const handleChooseCustomer = () => {
  if (selectedCustomer.value) {
    console.log('Selected items:', selectedCustomer.value);

    form.value.customer_name = selectedCustomer.value.name;
    form.value.customer_id = selectedCustomer.value.id;
    modalCustomer.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};

const handleChooseTechnician = () => {
  if (selectedTechnician.value) {
    console.log('Selected items:', selectedTechnician.value);

    form.value.technician_name = selectedTechnician.value.name;
    form.value.technician_id = selectedTechnician.value.id;
    modalCustomer.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};

const updateSelectedItem = (newSelectedItem) => {
  if (newSelectedItem) {
    // Cek apakah item sudah terpilih di tabel lain
    if (selectedItem.value && selectedItem.value.item_id !== newSelectedItem.item_id) {
      selectedItem.value = newSelectedItem; // Ganti dengan item baru
    }
  } else {
    selectedItem.value = null;
  }
};

const fetchCustomer = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/customer`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParams.value.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    customerList.value = response.data.data.data;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};

watch(modalCustomer, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParams.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filters.value = {
      global: { value: null }
    };
    loadDataCustomer();
  }
});

// Fungsi fetch untuk items
const fetchItems = async () => {
  loadingItem.value = true;
  try {
    const response = await axios.get('/api/cek_office_cost_items', {
      params: {
        page: lazyParamsItem.page,
        search: filtersItem.global.value,
        per_page: lazyParamsItem.rows
      }
    });

    items.value = response.data.data.data;
    paginationItem.total = response.data.total;
    paginationItem.currentPage = response.data.current_page;
    console.log(items.value)
  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    loadingItem.value = false;
  }
};

// Fungsi fetch untuk customer items
const fetchCustomerItems = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/office_customer_items/${form.value.customer_id}`, {
      params: {
        page: lazyParams.page,
        search: filters.global.value,
        per_page: lazyParams.rows
      }
    });

    customerItems.value = response.data.data.data;
    console.log(customerItems.value)
    pagination.total = response.data.total;
    pagination.currentPage = response.data.current_page;
  } catch (error) {
    console.error('Error fetching customer items:', error);
  } finally {
    loading.value = false;
  }
};

const openItemDialog = () => {
  showItemDialog.value = true;
  fetchItems();
  fetchCustomerItems();
};

// Fungsi handle choose dari dialog
const handleItemSelection = (selectedItem) => {
  // Isi data ke form
  form.value.item_id = selectedItem.item_id;
  form.value.item_code = selectedItem.item_code;
  form.value.product_code = selectedItem.product_code;
  form.value.item_name = selectedItem.item_name;
  form.value.item_unit = selectedItem.item_unit;
  form.value.category_office = selectedItem.category_office;
  form.value.serial_number = selectedItem.serial_number;
  selectedWarranty.value = warrantyOptions.find(option => option.value === selectedItem.warranty);
  form.value.cost = selectedItem.cost_service;

  console.log(selectedWarranty.value)

  // Sesuaikan dengan field yang diperlukan
};

const isItemSelected = computed(() => {
  return selectedItem.value !== null;
});

const onStatusStockChange = async (rowData, index) => {
  // event.value adalah value baru dari dropdown
  // rowData adalah data baris terkait
  try {
    // Contoh: panggil API update status part
    await axios.post(`/api/office_cs/saveStatusStock/${rowData.id}/${index}`, {officeParts: selectedItem.value});
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Status updated',
      showConfirmButton: false,
      timer: 1000
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: 'Failed to update status'
    });
    // Optional: rollback value jika gagal
    // rowData.status_stock = event.oldValue;
  }
};

const formatCost = (value) => {
  if (!value) return '';
  // Remove non-digit characters and convert to number
  const number = Number(value.toString().replace(/[^\d]/g, ''));
  // Format number with commas
  return number.toLocaleString('en-US');
};

const handleCostInput = (event) => {
  // Remove non-digit characters
  const rawValue = event.target.value.replace(/[^\d]/g, '');
  // Store raw number in form
  form.value.cost = rawValue;
};

const fetchTechnician = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/technician`, {
      params: {
        page: lazyParams.page,
        search: filters.global.value,
        per_page: lazyParams.rows
      }
    });

    technicianList.value = response.data.data.data;
    console.log(technicianList.value)
    pagination.total = response.data.total;
    pagination.currentPage = response.data.current_page;
  } catch (error) {
    console.error('Error fetching technician:', error);
  } finally {
    loading.value = false;
  }
};

const fetchItemGroup = async (superGroupId) => {
  try {
    const response = await axios.get(`/api/master/item/getItemGroup/${superGroupId}`)
    const groups = response.data.data
    itemGroupOptions.value = groups.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item group list:', error)
  }
}


const fetchItemSubgroup = async (itemGroupId) => {
  try {
    const response = await axios.get(`/api/master/item/getItemSubgroup/${itemGroupId}`)
    const subs = response.data.data
    itemSubOptions.value = subs.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item subgroup list:', error)
  }
}

const saveRMA = async () => {
  if (!form.value.code) {
    Swal.fire({
      title: 'Warning',
      text: 'Please enter a vendor code',
      icon: 'warning'
    });
    return;
  }

  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('rma_number', form.value.rma_number);
  formData.append('po_service', form.value.po_cust);

  try {
    const response = await axios.post(`/api/office_cs/saveRMA/${form.value.id}`, formData);
    Swal.fire({
      position: 'top-end',
      title: 'Success',
      text: 'RMA Number saved',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error saving RMA Number :', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to save RMA Number',
      icon: 'error'
    });
  }
};

const sendEmail = async () => {
  const formData = new FormData();
  formData.append('item_id', form.value.item_id);
  formData.append('customer_id', form.value.customer_id);
  formData.append('cs_item_id', form.value.oci_id);

  try {
    const response = await axios.post(`/api/office_cs/email`, formData);
    Swal.fire({
      position: 'top-end',
      title: 'Success',
      text: 'Email has been sent',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error saving RMA Number :', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to sent email',
      icon: 'error'
    });
  }
};

const changeApprove = async () => {
  if(details && (details.dp_type == 1 && details.dp == 0)){
    Swal.fire({
      title: 'Warning',
      text: 'DP Payment tidak boleh 0 jika DP type "Yes"!',
      icon: 'warning'
    });
  }else if (details && (details.dp_type == 1 && (details.dp_payment__type == '' || details.dp_payment_type == undefined))){
    Swal.fire({
      title: 'Warning',
      text: 'DP Payment type tidak boleh kosong jika DP type "Yes"',
      icon: 'warning'
    });
  }else{

    const result = await Swal.fire({
        title: "Confirm",
        text: "Apakah anda yakin menyetujui service ini? Pastikan semua data termasuk DP telah sesuai",
        footer: "DP tidak bisa diedit jika anda sudah menekan tombol Yes",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

    if (result.isConfirmed) {
      try {
        let response
        const formData = new FormData();
        formData.append('approval_cust', 2);

          // Edit existing company
        response = await axios.post(`/api/office_cs/approveCustWithId/${form.value.oci_id}/0`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        Swal.fire({
          position: "top-end",
          title: 'Berhasil',
          text: 'Berhasil diposting',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000
        });
      } catch (error) {
        console.error('Error saving item:', error)
      }
    }
  }
};

const fetchUnit = async () => {
  try {
    const response = await axios.get(`/api/master/unit/all`)
    const units = response.data.data;
    unitOptions.value = units.map(unit => ({
      id: unit.id,
      value: unit.unit,
      name: unit.desc
    }))
  } catch (error) {
    console.error('Error fetching unit list:', error)
  }
}

const fetchItemCategory = async () => {
  try {
    const response = await axios.get(`/api/master/item_sub/all`)
    const item_subs = response.data.data;
    itemCatOptions.value = item_subs.map(sub => ({
      value: sub.id,
      name: sub.name,
    }))
  } catch (error) {
    console.error('Error fetching Item Category List: ', error)
  }
}

const mapItemPart = (items) => {
  if (!items || !Array.isArray(items)) return [];

  return items.map(item => ({
    id: item.id,
    product_code: item.product_code,  // Menyesuaikan dengan field 'Product No.' di tabel
    item_code: item.part_id,             // Menyesuaikan dengan field 'Item Code' di tabel
    item_name: item.part_name,             // Menyesuaikan dengan field 'Name' di tabel
    item_unit: item.part_unit,              // Menyesuaikan dengan field 'Unit' di tabel
    qty: item.qty,
    qty_iptn_out: item.qty_iptn_out,
    note: item.note,
  }));
};

const fetchDetailCs = async (id) => {
  try {
    const response = await axios.get(`/api/office_cs/detailCs/${id}`)
    const cs = response.data.data
    office_cs.value = { ...cs, is_active: cs.is_active === 1 ? '1' : '0' }
    await fetchData(id);
  } catch (error) {
    console.error('Error fetching detail CS:', error)
  }
}

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/office_cs/show/${id}`)
    const cs = response.data.data
    form.value = { ...cs, is_active: cs.is_active === 1 ? '1' : '0' }

    const detail = await axios.get(`/api/office_cs/detailCs/${id}`)
    details.value = detail.data.data
    selectedStatus.value = statusOptions.find(option => option.value === details.value.is_active_item);
    office_cs.value = { ...details.value }
    selectedWarranty.value = warrantyOptions.find(option => option.value === details.value.warranty);
    selectedIncSource.value = incSourceOptions.find(option => option.value === details.value.incoming_source);
    selectedServiceType.value = serviceTypeOptions.find(option => option.value === details.value.service_type);

    const detailPart = await axios.get(`/api/office_cs/detailParts/${id}`)
    const detailParts = detailPart.data.data
    selectedItem.value = detailParts;
    detailParts.forEach(detailPart => {
      if((detailPart.stock == null || detailPart.stock == 0) && detailPart.is_active != 9 && detailPart.is_active != 5){
        detailPart.stock = 0;
        not_stock.value = not_stock.value + 1;
      }else{
        detailPart.stock = detailPart.stock;
        if(detailPart.stock >= detailPart.qty && detailPart.is_active != 9 && detailPart.is_active != 5){
          cek_stock.value = cek_stock.value + 1;
          if(detailPart.type_item_office == 3){
            cek_consum.value = cek_consum.value + 1;
          }
        }else if(detailPart.is_active != 9 && detailPart.is_active != 5){
          not_stock.value = not_stock.value + 1;
        }
      }

      if(detailPart.is_active < 9){
        grand_total.value = grand_total.value + (Number(detailPart.qty) * Number(detailPart.price));
      }

      if(detailPart.is_active != 9 && detailPart.iptn_out_ts_id > 0){
        cek_trf.value = cek_trf.value + 1;
      }

      if(detailPart.is_active != 9){
        cek_total.value = cek_total.value + 1;
      }
    });
    office_cs.value = {
      ...office_cs.value,
      cek_konsum: cek_consum.value,
      cek_stock: cek_stock.value,
      cek_trf: cek_trf.value,
      cek_total: cek_total.value,
      cek_part: detailParts.length,
      not_stock: not_stock.value,
      cek_stock_zfp: cek_stock.value - cek_consum.value,
      cek_total_zfp: cek_total.value - cek_consum.value,
    }
    const statusTFPart = await axios.get(`/api/office_cs/statusTransferPart/${id}`)
    const statusTFParts = statusTFPart.data.data

    const statusPickup = await axios.get(`/api/office_cs/statusPickup/${id}`)
    const statusPickups = statusPickup.data.data

    console.log(office_cs.value)

  } catch (error) {
    console.error('Error fetching item super group data:', error)
  }
}

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()

  formData.append('_method', 'PUT');
  formData.append('is_active', 0)
  formData.append('date_create', form.value.date_create)
  formData.append('customer_id', form.value.customer_id)
  formData.append('cost', form.value.cost)
  formData.append('item_id', form.value.item_id)
  formData.append('item_code', form.value.item_code)
  formData.append('product_number', form.value.product_code)
  formData.append('item_name', form.value.item_name)
  formData.append('item_unit', form.value.item_unit)
  formData.append('category_office', form.value.category_office)
  formData.append('serial_number', form.value.serial_number)
  formData.append('counter', form.value.counter)
  formData.append('problem', form.value.problem)
  formData.append('note_cs', form.value.note)
  formData.append('technician_id', form.value.technician_id)
  formData.append('cs_id', form.value.cs_id)
  formData.append('oci_id', form.value.oci_id)
  formData.append('is_active_item', form.value.is_active_item)
  formData.append('item_id', form.value.item_id)
  formData.append('type', form.value.type)
  formData.append('approval_cust', form.value.approval_cust)
  formData.append('warranty', form.value.warranty)
  formData.append('req_part', form.value.req_part)
  formData.append('req_part_to_whs', form.value.req_part_to_whs)
  formData.append('req_part_done', form.value.req_part_done)
  formData.append('incoming_source', form.value.incoming_source)
  formData.append('service_type', form.value.service_type)
  formData.append('note_ts', form.value.note_ts)
  formData.append('job_request', form.value.job_request)
  formData.append('date_input', form.value.date_input)
  formData.append('time_request', form.value.time_request)
  formData.append('time_process', form.value.time_process)
  formData.append('time_done', form.value.time_done)
  formData.append('technician_id', form.value.technician_id)
  formData.append('user_ts', form.value.user_ts)
  formData.append('technician_name', form.value.technician_name)
  formData.append('customer_email', form.value.customer_email)
  formData.append('cek_cust_item_service', form.value.cek_cust_item_service)
  formData.append('cek_part', form.value.cek_part)
  formData.append('count_status_stock', form.value.count_status_stock)
  formData.append('cek_req_ts', form.value.cek_req_ts)
  formData.append('cek_req_cs', form.value.cek_req_cs)
  formData.append('cek_ipto_whs', form.value.cek_ipto_whs)
  formData.append('cek_iptin_cs', form.value.cek_iptin_cs)
  formData.append('cek_ipto_cs', form.value.cek_ipto_cs)
  formData.append('cek_qty_out', form.value.cek_qty_out)
  formData.append('cancel_count', form.value.cancel_count)
  formData.append('cek_part_on_ts', form.value.cek_part_on_ts)
  formData.append('cek_part_done', form.value.cek_part_done)
  formData.append('part_total', form.value.part_total)
  formData.append('part_process', form.value.part_process)
  formData.append('part_done', form.value.part_done)
  formData.append('cost_onsite', form.value.cost_onsite)
  formData.append('customer_npwp', form.value.customer_npwp)
  formData.append('customer_phone', form.value.customer_phone)
  formData.append('customer_email', form.value.customer_email)
  formData.append('is_not_dp', form.value.is_not_dp)
  formData.append('is_berikat', form.value.is_berikat)
  formData.append('dp_persen', form.value.dp_persen)
  formData.append('dp', form.value.dp)
  formData.append('dp_type', selectedIsDP.value ? selectedIsDP.value.value : null)
  formData.append('dp_payment_type', selectedDpPayment.value ? selectedDpPayment.value.value : null);
  formData.append('incoming_source', selectedIncSource.value ? selectedIncSource.value.value : null);
  formData.append('service_type', selectedServiceType.value ? selectedServiceType.value.value : null);
  formData.append('warranty', selectedWarranty.value ? selectedWarranty.value.value : null);

  try {
    let response
    response = await axios.post(`/api/office_cs/update/${form.value.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    Swal.fire({
              position: "top-end",
              title: 'Berhasil',
              text: 'Berhasil diperbarui',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
    });
    router.push('/office_cs')
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

const post = async() => {
  const formData = new FormData()
  formData.append('_method', 'PUT');
  formData.append('is_active', 1);
    formData.append('date_create', form.value.date_create)
  formData.append('customer_id', form.value.customer_id)
  formData.append('cost', form.value.cost)
  formData.append('item_id', form.value.item_id)
  formData.append('item_code', form.value.item_code)
  formData.append('product_number', form.value.product_code)
  formData.append('item_name', form.value.item_name)
  formData.append('item_unit', form.value.item_unit)
  formData.append('category_office', form.value.category_office)
  formData.append('serial_number', form.value.serial_number)
  formData.append('counter', form.value.counter)
  formData.append('problem', form.value.problem)
  formData.append('note_cs', form.value.note)
  formData.append('technician_id', form.value.technician_id)
  formData.append('cs_id', form.value.cs_id)
  formData.append('oci_id', form.value.oci_id)
  formData.append('is_active_item', form.value.is_active_item)
  formData.append('item_id', form.value.item_id)
  formData.append('type', form.value.type)
  formData.append('approval_cust', form.value.approval_cust)
  formData.append('warranty', form.value.warranty)
  formData.append('req_part', form.value.req_part)
  formData.append('req_part_to_whs', form.value.req_part_to_whs)
  formData.append('req_part_done', form.value.req_part_done)
  formData.append('incoming_source', form.value.incoming_source)
  formData.append('service_type', form.value.service_type)
  formData.append('note_ts', form.value.note_ts)
  formData.append('job_request', form.value.job_request)
  formData.append('date_input', form.value.date_input)
  formData.append('time_request', form.value.time_request)
  formData.append('time_process', form.value.time_process)
  formData.append('time_done', form.value.time_done)
  formData.append('technician_id', form.value.technician_id)
  formData.append('user_ts', form.value.user_ts)
  formData.append('technician_name', form.value.technician_name)
  formData.append('customer_email', form.value.customer_email)
  formData.append('cek_cust_item_service', form.value.cek_cust_item_service)
  formData.append('cek_part', form.value.cek_part)
  formData.append('count_status_stock', form.value.count_status_stock)
  formData.append('cek_req_ts', form.value.cek_req_ts)
  formData.append('cek_req_cs', form.value.cek_req_cs)
  formData.append('cek_ipto_whs', form.value.cek_ipto_whs)
  formData.append('cek_iptin_cs', form.value.cek_iptin_cs)
  formData.append('cek_ipto_cs', form.value.cek_ipto_cs)
  formData.append('cek_qty_out', form.value.cek_qty_out)
  formData.append('cancel_count', form.value.cancel_count)
  formData.append('cek_part_on_ts', form.value.cek_part_on_ts)
  formData.append('cek_part_done', form.value.cek_part_done)
  formData.append('part_total', form.value.part_total)
  formData.append('part_process', form.value.part_process)
  formData.append('part_done', form.value.part_done)
  formData.append('cost_onsite', form.value.cost_onsite)
  formData.append('customer_npwp', form.value.customer_npwp)
  formData.append('customer_phone', form.value.customer_phone)
  formData.append('customer_email', form.value.customer_email)
  formData.append('is_not_dp', form.value.is_not_dp)
  formData.append('is_berikat', form.value.is_berikat)
  formData.append('dp_persen', form.value.dp_persen)
  formData.append('dp', form.value.dp)
  formData.append('dp_type', selectedIsDP.value ? selectedIsDP.value.value : null)
  formData.append('dp_payment_type', selectedDpPayment.value ? selectedDpPayment.value.value : null);
  formData.append('incoming_source', selectedIncSource.value ? selectedIncSource.value.value : null);
  formData.append('service_type', selectedServiceType.value ? selectedServiceType.value.value : null);
  formData.append('warranty', selectedWarranty.value ? selectedWarranty.value.value : null);

  try {
    let response

      // Edit existing company
      response = await axios.post(`/api/office_cs/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Berhasil diposting',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    router.push('/office_cs')
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchTechnician();
  form.value.date_create = new Date();
  selectedIncSource.value = incSourceOptions.find(option => option.value === 1);
  selectedServiceType.value = serviceTypeOptions.find(option => option.value === 1);
  if (route.params.id) {
    isEdit.value = true
    fetchData(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      name: '',
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Item Group' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
.custom-flex-container {
  display: flex;
  justify-content: space-between;  /* Push items to the edges */
  align-items: center;  /* Vertically center items */
  width: 100%;  /* Ensure the container takes full width */
}

/* Prevent button from expanding vertically */
.approval-btn {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: auto;
}

.send-container {
  display: flex;
  gap: 10px;  /* Add space between the input and the "Send" button */
  align-items: center;  /* Vertically center the items */
  flex-shrink: 0;
}
</style>
