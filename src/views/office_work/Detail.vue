<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>Customer Service</strong>
    </CCardHeader>
    <CCardBody>
      <CForm>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputStatus">Status*</CFormLabel>
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
                <CFormLabel for="inputCode">Code*</CFormLabel>
                <CFormInput id="inputCode" type="text" placeholder="" v-model="form.code" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputDateCreate">Date Create*</CFormLabel>
                <DatePicker v-model="form.date_create" disabled showIcon fluid dateFormat="d-M-yy" iconDisplay="input" inputId="date_created" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTechnician">Technician*</CFormLabel>
                <CFormInput id="inputTechnician" type="text" placeholder="" v-model="form.technician_name" disabled />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputSerialNumber">Serial Number*</CFormLabel>
                <CFormInput id="inputSerialNumber" type="text" placeholder="" v-model="form.serial_number" disabled/>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemCode">Item Code*</CFormLabel>
                <CFormInput id="inputItemCode" type="text" placeholder="" v-model="form.product_code" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemName">Item Name*</CFormLabel>
                <CFormInput id="inputItemName" type="text" placeholder="" v-model="form.item_name" disabled />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputItemUnit">Item Unit*</CFormLabel>
                <CFormInput id="inputItemUnit" type="text" placeholder="" v-model="form.item_unit" disabled />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <CFormLabel for="inputProblem">Problem*</CFormLabel>
                <CFormTextarea
                  id="inputProblem"
                  rows="3"
                  v-model="form.problem"
                  disabled
                ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCsNote">CS Note*</CFormLabel>
                <CFormTextarea
                  id="inputCsNote"
                  rows="3"
                  v-model="form.note_cs"
                  disabled
                ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputNote">Note</CFormLabel>
                <CFormTextarea
                  id="inputNote"
                  rows="3"
                  v-model="form.note_ts"
                  @change="saveNote"
                ></CFormTextarea>
              </div>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <div class="d-flex gap-4 mb-3">
            <CButton id="button-coll-slip" type="button" color="info" @click="modalPart = true" >
              Part
            </CButton>
            <ItemPartDialog
              :modalItemPart="modalPart"
              :itemPartList="parts"
              :filters="filtersPart"
              :selectedItemPart="selectedItem"
              :lazyParams="lazyParamsPart"
              :loading="loadingPart"
              :pagination="paginationPart"
              selectionMode="multiple"
              @update:modalItemPart="modalPart = $event"
              @update:filters="filtersPart = $event"
              @update:selectedItemPart="selectedItem = $event"
              @update:lazyParams="lazyParamsPart = $event"
              @choose="handleChoosePart"
            />
            <CButton id="button-quotation" type="button" color="info" @click="modalConsumable = true">
              Consumable
            </CButton>
            <ConsumableDialog
              :modalConsumable="modalConsumable"
              :consumableList="consumables"
              :filters="filtersConsumable"
              :selectedConsumable="selectedItem"
              :lazyParams="lazyParamsConsumable"
              :loading="loadingConsumable"
              :pagination="paginationConsumable"
              selectionMode="multiple"
              @update:modalConsumable="modalConsumable = $event"
              @update:filters="filters = $event"
              @update:selectedConsumable="selectedItem = $event"
              @update:lazyParams="lazyParams = $event"
              @choose="handleChooseConsumable"
            />
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
              <Column field="item_code" header="Part Code" class="col-unit"></Column>
              <Column field="item_name" header="Part Name" class="col-unit"></Column>
              <Column field="item_name" header="Part Unit" class="col-unit"></Column>
              <Column field="qty" header="Qty" class="col-unit">
                <template #body="{ data }">
                    {{ data.qty }}
                  </template>
                  <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="number" />
                  </template>
              </Column>
              <Column field="qty_iptn_out" header="Qty from CS" class="col-unit"></Column>
              <Column field="note" header="Note" class="col-unit">
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" type="text" />
                </template>
              </Column>
            </DataTable>
          </div>
          <div class="mb-3 d-flex justify-content-end">
            <Button id="button-addon2" type="button" color="info" @click="req_part">
              Request Part
            </Button>
          </div>
          <div class="mb-3 d-flex justify-content-between">
            <CButton id="button-addon2" type="button" color="secondary" @click="back">
              Back
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
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import ItemPartDialog from '@/components/ItemPartDialog.vue';
import ConsumableDialog from '@/components/ConsumableDialog.vue';
import Button from 'primevue/button';


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

const statusOptions = [
  { value: 0, name: 'Saved' },
  { value: 1, name: 'Posted' },
  { value: 2, name: 'Process' },
  { value: 3, name: 'Done' },
];
const selectedStatus = ref(null);

const details = ref(null);
const selectedItem = ref([]);
const onCellEditComplete = (event) => {
  event.data[event.field] = event.newValue;

  // Perbarui array secara keseluruhan untuk memaksa reaktivitas
  selectedItem.value = [...selectedItem.value];
  console.log('Data sebelum edit:', event.originalValue);
  console.log('Data setelah edit:', event.newValue);
}

const parts = ref([]);
const filtersPart = reactive({ global: { value: null, matchMode: 'contains' } });
const selectedPart = ref(null);
const loadingPart = ref(false);
const paginationPart = reactive({ total: 0, currentPage: 1, perPage: 10 });
const lazyParamsPart = reactive({ page: 1, rows: 10 });
const modalPart = ref(false);

// State untuk customer item
const consumables = ref([]);
const filtersConsumable = ref({ global: { value: null, matchMode: 'contains' } });
const selectedConsumable = ref([]);
const loadingConsumable = ref(false);
const paginationConsumable = ref({ total: 0, currentPage: 1, perPage: 10 });
const lazyParamsConsumable = ref({ page: 1, rows: 10, search:'' });
const modalConsumable = ref(false);

const fetchParts = async () => {
  loadingPart.value = true;
  try {
    const response = await axios.get(`/api/office_work_select_part/${form.value.oci_id}/${form.value.item_id}`, {
      params: {
        page: lazyParamsPart.page,
        search: filtersPart.global.value,
        per_page: lazyParamsPart.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    parts.value = response.data.data;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loadingPart.value = false;
  }
}

watch([modalPart, () => lazyParamsPart.page, () => lazyParamsPart.rows, () => filtersPart.global.value], ([show]) => {
  if (show) fetchParts()
})

const onPartPage = (event) => {
  lazyParamsPart.page = event.page + 1
  lazyParamsPart.rows = event.rows
}

const onPartSearch = () => {
  lazyParamsPart.page = 1
  fetchHistoryItem()
}

const updateFiltersPart = (newFilters) => {
  filtersPart.global.value = newFilters.global.value
}

const updateSelectedPart = (newSelected) => {
  selectedPart.value = newSelected
}

const handleChoosePart = (selected) => {
  // Lakukan sesuatu dengan data terpilih
  console.log('Selected history:', selected)
  modalPart.value = false
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

const fetchConsumables = async (pageNumber = 1, keywords = '') => {
  loadingPart.value = true;
  try {
    const response = await axios.get(`/api/office_consumable_items/${form.value.item_code}/${form.value.oci_id}`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParamsConsumable.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    consumables.value = response.data.data;
    paginationConsumable.currentPage = response.data.data.current_page;
    paginationConsumable.perPage = response.data.data.per_page;
    paginationConsumable.total = response.data.data.total;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loadingPart.value = false;
  }
};

const loadDataConsumable = async () => {
  try {
    loadingConsumable.value = true;
    await fetchConsumables(lazyParamsConsumable.value.page, lazyParamsConsumable.value.search);
  } finally {
    loadingConsumable.value = false;
  }
};

watch(modalConsumable, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParamsConsumable.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filtersConsumable.value = {
      global: { value: null }
    };
    loadDataConsumable();
  }
});

const removeItem = async (index) => {
  selectedItem.value.splice(index,1);
};

const onConsumablePage = (event) => {
  lazyParamsPart.page = event.page + 1
  lazyParamsPart.rows = event.rows
}

const onConsumableSearch = () => {
  lazyParamsPart.page = 1
  fetchHistoryItem()
}

const updateFiltersConsumable = (newFilters) => {
  filtersConsumable.global.value = newFilters.global.value
}

const updateSelectedConsumable = (newSelected) => {
  selectedConsumable.value = newSelected
}

function handleChooseConsumable(selected) {
  // Debug log
  console.log('Selected:', selected, Array.isArray(selected));
}

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
    const response = await axios.get(`/api/office_cs/show/${id}`)
    const cs = response.data.data
    form.value = { ...cs, is_active: cs.is_active === 1 ? '1' : '0' }

    const detail = await axios.get(`/api/office_cs/detailCs/${id}`)
    details.value = detail.data.data
    console.log(details)
    selectedStatus.value = statusOptions.find(option => option.value === details.value.is_active_item);
    form.value = { ...details.value }
    const detailPart = await axios.get(`/api/office_cs/detailParts/${id}`)
    const detailParts = detailPart.data.data
    selectedItem.value = mapItemPart(detailParts)

    const statusTFPart = await axios.get(`/api/office_cs/statusTransferPart/${id}`)
    const statusTFParts = statusTFPart.data.data

    const statusPickup = await axios.get(`/api/office_cs/statusPickup/${id}`)
    const statusPickups = statusPickup.data.data

    
  } catch (error) {
    console.error('Error fetching item super group data:', error)
  }
}

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const saveNote = async () => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('problem', form.value.problem);
  formData.append('note_cs', form.value.note_cs);
  formData.append('note_ts', form.value.note_ts);

  try {
    const response = await axios.post(`/api/office_cs/saveNote/${form.value.id}`, formData);
    Swal.fire({
      position: 'top-end',
      title: 'Success',
      text: 'Note saved',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  } catch (error) {
    console.error('Error saving Note :', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to save Note',
      icon: 'error'
    });
  }
};

const req_part = async() => {
  const formData = new FormData()
  formData.append('_method', 'PUT');
  formData.append('office_parts', JSON.stringify(selectedItem.value))

  const result = await Swal.fire({
        title: 'Confirm',
        text: "Apakah anda yakin untuk me-request part ini",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText:'No'
      });

      if (result.isConfirmed) {
         try {
          let response

            // Edit existing company
            response = await axios.post(`/api/office_cs/processParts/${form.value.id}/0`, formData, {
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
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  form.value.date_create = new Date();
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
  router.push({ name: 'Office Work' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
