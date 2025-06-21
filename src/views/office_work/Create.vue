<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>Customer Service</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="inputDateCreate">Date Create</CFormLabel>
            <DatePicker v-model="form.date_create" disabled showIcon fluid dateFormat="d-M-yy" iconDisplay="input" inputId="date_created" />
          </div>
          <div class="mb-3">
            <CFormLabel for="inputCustomer">Customer*</CFormLabel>
            <CInputGroup class="mb-3">
              <CFormInput v-model="form.customer_name" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
              <CButton id="button-addon2" type="button" color="primary" @click="modalCustomer = true">
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
          <div class="mb-3">
            <CFormLabel for="inputTimeReq">Time Request</CFormLabel>
            <DatePicker id="datepicker-timeonly" v-model="form.time_request" timeOnly fluid showIcon iconDisplay="input" />
          </div>
          <br/>
          <hr/>
          <br/>
          <div class="row g-4">
            <div class="col-md-4">

              <div class="mb-3">
                <CFormLabel for="inputItemCode">Item Code*</CFormLabel>
                <CInputGroup class="mb-3">
                  <CFormInput v-model="form.item_code" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                  <CButton id="button-addon2" type="button" color="primary" @click="openItemDialog">
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
                <CFormInput id="inputProductNo" type="text" placeholder="" v-model="form.product_code" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemName">Item Name</CFormLabel>
                <CFormInput id="inputItemName" type="text" placeholder="" v-model="form.item_name" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemUnit">Item Unit</CFormLabel>
                <CFormInput id="inputItemUnit" type="text" placeholder="" v-model="form.item_unit" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCategory">Category</CFormLabel>
                <CFormInput id="inputCategory" type="text" placeholder="" v-model="form.category_office" disabled />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputSerialNumber">Serial Number</CFormLabel>
                <CFormInput id="inputSerialNumber" type="text" placeholder="" v-model="form.serial_number" />
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
                  <DatePicker v-model="form.date_warranty" showIcon fluid iconDisplay="input" inputId="date_warranty" :disabled="datepickerWarranty" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCost">Cost</CFormLabel>
                <CFormInput id="inputCost" type="text" placeholder="" :value="formatCost(form.cost)" disabled class="text-end" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCounter">Counter</CFormLabel>
                <CFormInput id="inputCounter" type="text" placeholder="" v-model="form.counter" class="text-end" />
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
                  <CFormInput v-model="form.technician_name" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
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
                  v-model="form.problem"
                ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputNote">Note</CFormLabel>
                <CFormTextarea
                  id="inputNote"
                  rows="3"
                  v-model="form.note"
                ></CFormTextarea>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <crudButton @revert="revert" @save="save" @back="back" />
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

// For detecting if we're editing or creating a company
const isEdit = ref(false)
const token = localStorage.getItem('token')

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

const showItemDialog = ref(false);

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

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/item_group/${id}`)
    const item_group = response.data.data
    form.value = { ...item_group, is_active: item_group.is_active === 1 ? '1' : '0' }
    selectedItemSup.value = item_sup_options.value.find(option => option.value === item_group.itemgroup_id);
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
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }else{
    formData.append('is_active', 0)
  }
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
  formData.append('note', form.value.note)
  formData.append('technician_id', form.value.technician_id)
  formData.append('warranty', selectedWarranty.value ? selectedWarranty.value.value : null);
  formData.append('incoming_source', selectedIncSource.value ? selectedIncSource.value.value : null);
  formData.append('service_type', selectedServiceType.value ? selectedServiceType.value.value : null);

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
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
    } else {
      // Create new company
      response = await axios.post('/api/office_cs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
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
