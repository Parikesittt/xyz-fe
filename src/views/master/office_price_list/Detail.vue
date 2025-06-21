<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Price List' : 'Create Price List' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
                        <CFormLabel for="inputItem">Item*</CFormLabel>
                        <CInputGroup class="mb-3">
                          <CFormInput v-model="form.unit_name" placeholder="" aria-label="Search" aria-describedby="button-addon2" />
                          <CButton id="button-addon2" type="button" color="primary" @click="modalItem = true">
                            <i class="pi pi-search"></i>
                          </CButton>
                        </CInputGroup>
                        <ItemPartDialog
                          :modalItemPart="modalItem"
                          :itemPartList="itemList"
                          :filters="filters"
                          :selectedItemPart="selectedItem"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          selectionMode="single"
                          @update:modalItemPart="modalItem = $event"
                          @update:filters="filters = $event"
                          @update:selectedItemPart="selectedItem = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChoose"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputWarehouse">Warehouse*</CFormLabel>
                        <CInputGroup class="mb-3">
                          <CFormInput v-model="form.warehouse_name" placeholder="" aria-label="Search" aria-describedby="button-addon2" />
                          <CButton id="button-addon2" type="button" color="primary" @click="modalWarehouse = true">
                            <i class="pi pi-search"></i>
                          </CButton>
                        </CInputGroup>
                        <LocationDialog
                          :modalLocation="modalWarehouse"
                          :locationList="warehouseList"
                          :filters="filters"
                          :selectedLocation="selectedWarehouse"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          @update:modalLocation="modalWarehouse = $event"
                          @update:filters="filters = $event"
                          @update:selectedLocation="selectedWarehouse = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChooseWarehouse"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputDesc">Description</CFormLabel>
                        <CFormTextarea id="inputDesc" rows="3" v-model="form.description" ></CFormTextarea>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputPeriode">Periode</CFormLabel>
                        <div class="row g-4">
                          <div class="col-md-6">
                            <DatePicker v-model="form.periode_from" showIcon fluid iconDisplay="input" inputId="periode_from" />
                          </div>
                          <div class="col-md-6">
                            <DatePicker v-model="form.periode_to" showIcon fluid iconDisplay="input" inputId="periode_to" />
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputIsActive" class="me-3">Active*</CFormLabel>
                        <CFormCheck
                          id="checkBoxIsActive1"
                          inline
                          type="radio"
                          name="isActiveRadioOptions"
                          value="1"
                          label="Yes"
                          v-model="form.is_active"
                        />
                        <CFormCheck
                          id="checkBoxIsActive2"
                          inline
                          type="radio"
                          name="isActiveRadioOptions"
                          value="0"
                          label="No"
                          v-model="form.is_active"
                        />
                      </div>

                      <div class="mb-3" v-if="isEdit">
                        <CFormLabel for="addItem">Add Item</CFormLabel>
                        <multiselect
                          v-model="selectedAdd"
                          :options="addItemOptions || []"
                          :multiple="false"
                          :track-by="'name'"
                          label="name"
                          placeholder="Pick some options"
                          :close-on-select="true"
                        />
                      </div>

                      <div class="mb-3" v-if="selectedAdd && selectedAdd.value === 1">
                        <CFormLabel for="addItem" class="me-3">Add Item</CFormLabel>
                        <Button @click="modalAddItem = true">
                          <i class="pi pi-plus"></i>
                        </Button>

                        <ItemPartDialog
                          :modalItemPart="modalAddItem"
                          :itemPartList="addItemList"
                          :filters="filters"
                          :selectedItemPart="selectedAddItem"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          selectionMode = "multiple"
                          @update:modalItemPart="modalAddItem = $event"
                          @update:filters="filters = $event"
                          @update:selectedItemPart="selectedAddItem = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChooseAddItem"
                        />

                        <!-- DataTable untuk item yang dipilih -->
                        <div class="table-container">
                          <DataTable
                            :value="selectedAddItem"
                            class="fixed-column-table"
                            editMode = "cell"
                            dataKey = "code"
                            @cell-edit-complete="onCellEditComplete"
                            :scrollable="true">
                            <Column header="Action" class="col-product-no"></Column>
                            <Column field="code" header="Code" class="col-code"></Column>
                            <Column field="name" header="Name" class="col-name">
                              <template #body="{ data }">
                                <span class="text-truncate" :title="data.name">
                                  {{ data.name.length > 20 ? data.name.substring(0, 20) + '...' : data.name }}
                                </span>
                              </template>
                            </Column>
                            <Column field="unit" header="Unit" class="col-unit"></Column>
                            <Column field="price_spi" header="Price SPI" class="col-unit">
                              <template #body="{ data }">
                                {{ data.price_spi || '' }} <!-- Jika kosong, tampilkan empty string -->
                              </template>
                              <template #editor="{ data, field }">
                                <InputText v-model="data[field]" type="number" />
                              </template>
                            </Column>
                            <Column field="price" header="Price" class="col-unit">
                              <template #body="{ data }">
                                {{ data.price || '' }}
                              </template>
                              <template #editor="{ data, field }">
                                <InputText v-model="data[field]" type="number" />
                              </template>
                            </Column>

                          </DataTable>
                        </div>
                      </div>

                      <div class="mb-3 d-flex justify-content-between">
                        <crudButton @revert="revert" @save="save" @back="back" />
                        <CButton id="button-addon2" type="button" color="success" @click="submit">
                          Submit
                        </CButton>
                      </div>
        </CForm>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import crudButton from '@/components/crudButton.vue'
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect'
import Editor from 'primevue/editor';
import ItemPartDialog from '@/components/ItemPartDialog.vue'
import LocationDialog from '@/components/LocationDialog.vue'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';
import InputText from 'primevue/inputtext';

const form = ref({
  id: null,
  cost: '',
  unit_name: '',
  unit_product_no: '',
  unit_item: '',
  location_id:'',
  warehouse_id:'',
  warehouse_name:'',
  cancel_cost: '',
  description: '',
  periode_from: '',
  periode_to: '',
  is_active: '1' // Default to active
})
const token = localStorage.getItem("token");

// For detecting if we're editing or creating a company
const isEdit = ref(false)
const modalItem = ref(false);
const modalAddItem = ref(false);
const modalWarehouse = ref(false);
const itemList = ref([]);
const addItemList = ref([]);
const warehouseList = ref([]);
const selectedItem = ref([]);
const selectedAddItem = ref([]);
const selectedWarehouse = ref([]);
const addItemOptions = [
  { value: 1, name: 'Manual' },
  { value: 2, name: 'Upload' },
];
const selectedAdd = ref(null);
const filters = ref({
  global: { value: null },
});
const loading = ref(false);
const lazyParams = ref({
  page: 1,
  rows: 10,
  search: ''
});
const onPage = (event) => {
  lazyParams.value = {
    ...lazyParams.value,
    page: event.page + 1,
    rows: event.rows
  };
  loadData();
};
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});
const searchTimeout = ref(null);
const onSearch = (event) => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    lazyParams.value = {
      ...lazyParams.value,
      page: 1,
      search: filters.value.global.value || '' // Get search value from filters
    };
    loadData();
  }, 300);
};
const loadData = async () => {
  try {
    loading.value = true;
    await fetchItemPart(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const loadDataWarehouse = async () => {
  try {
    loading.value = true;
    await fetchWarehouse(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const loadDataAddItem = async () => {
  try {
    loading.value = true;
    await fetchAddItem(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const updateSelectedItem = (newSelectedItem) => {
  console.log(newSelectedItem)
  selectedItem.value = newSelectedItem;
}
const updateSelectedAddItem = (newSelectedItem) => {
  console.log(newSelectedItem)
  selectedAddItem.value = newSelectedItem;
}
const updateSelectedWarehouse = (newSelectedWarehouse) => {
  console.log(newSelectedWarehouse)
  selectedWarehouse.value = newSelectedWarehouse;
}
const handleChoose = () => {
  if (selectedItem.value) {
    console.log('Selected items:', selectedItem.value.name);

    form.value.unit_name = selectedItem.value.name
    form.value.unit_product_no = selectedItem.value.unit
    form.value.unit_item = selectedItem.value.product_code

    modalItem.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};
const handleChooseAddItem = () => {
  if (selectedAddItem.value) {
    console.log('Selected items:', selectedAddItem.value);

    modalAddItem.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};

const handleChooseWarehouse = () => {
  if (selectedWarehouse.value) {
    console.log('selected warehouse: ', selectedWarehouse.value.name);

    form.value.warehouse_name = selectedWarehouse.value.name;
    form.value.warehouse_id = selectedWarehouse.value.id;
    form.value.location_id = selectedWarehouse.value.location_id;

    modalWarehouse.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};
const onCellEditComplete = (event) => {
  event.data[event.field] = event.newValue;
  console.log('Data sebelum edit:', event.originalValue);
  console.log('Data setelah edit:', event.newValue);
  console.log('Seluruh array:', selectedAddItem.value);
}
// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const mapItemPart = (items) => {
  if (!items || !Array.isArray(items)) return [];

  return items.map(item => ({
    id: item.id,
    product_code: item.product_code,
    code: item.code,
    name: item.name,
    unit: item.unit,
    category_office: item.category_office
  }));
};
const mapAddItem = (items) => {
  if (!items || !Array.isArray(items)) return [];

  return items.map(item => ({
    id:item.id,
    product_code: item.product_code,
    code: item.item_code,
    name: item.item_name,
    unit: item.item_unit,
    price_spi: '',
    price: '',
  }));
};

const mapWarehouse = (items) => {
  if (!items || !Array.isArray(items)) return [];

  return items.map(item => ({
    id: item.id,
    location_id: item.location_id,
    code: item.code,
    name: item.name,
  }));
};

const fetchItemPart = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/item`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParams.value.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedItem = mapItemPart(response.data.data.data);
    itemList.value = mappedItem;
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};
const fetchWarehouse = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/warehouse`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParams.value.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedWarehouse = mapWarehouse(response.data.data.data)
    warehouseList.value = mappedWarehouse;
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};
const fetchAddItem = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/office_price_list/add_item/${form.value.unit_item}`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParams.value.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedItemPart = mapAddItem(response.data.data.data)
    addItemList.value = mappedItemPart;
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};

watch(modalItem, (newValue) => {
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
    loadData();
  }
});
watch(modalWarehouse, (newValue) => {
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
    loadDataWarehouse();
  }
});
watch(modalAddItem, (newValue) => {
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
    loadDataAddItem();
  }
});

const formattingDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fetch company data when editing
const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/office_price_list/${id}`)
    const pricelist = response.data.data
    form.value = {
      ...pricelist,
      is_active: pricelist.is_active === 1 ? '1' : '0'
    }
    console.log(form.value)
  } catch (error) {
    console.error('Error fetching company data:', error)
  }
}

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
    formData.append('periode_from', form.value.periode_from)
    formData.append('periode_to', form.value.periode_to)
    formData.append('price_list_items', JSON.stringify(selectedAddItem.value))
  }
  else{
    const dbDateFrom = formattingDate(form.value.periode_from)
    const dbDateTo = formattingDate(form.value.periode_to)
    formData.append('periode_from', dbDateFrom)
    formData.append('periode_to', dbDateTo)
  }
  formData.append('unit_name', form.value.unit_name)
  formData.append('unit_item', form.value.unit_item)
  formData.append('unit_product_no', form.value.unit_product_no)
  formData.append('warehouse_id', form.value.warehouse_id)
  formData.append('warehouse_name', form.value.warehouse_name)
  formData.append('location_id', form.value.location_id)
  formData.append('description', form.value.description)
  formData.append('is_active', form.value.is_active)
  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/office_price_list/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Price List berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/office_price_list', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Price List berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/office_price_list') // Redirect to company list page
  } catch (error) {
    console.error('Error saving cost:', error)
  }
}

const submit = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
    formData.append('periode_from', form.value.periode_from)
    formData.append('periode_to', form.value.periode_to)
    formData.append('price_list_items', JSON.stringify(selectedAddItem.value))
  }else{
    const dbDateFrom = formattingDate(form.value.periode_from)
    const dbDateTo = formattingDate(form.value.periode_to)
    formData.append('periode_from', dbDateFrom)
    formData.append('periode_to', dbDateTo)
  }
  formData.append('unit_name', form.value.unit_name)
  formData.append('unit_item', form.value.unit_item)
  formData.append('unit_product_no', form.value.unit_product_no)
  formData.append('warehouse_id', form.value.warehouse_id)
  formData.append('warehouse_name', form.value.warehouse_name)
  formData.append('location_id', form.value.location_id)
  formData.append('is_active', form.value.is_active)
  formData.append('is_submitted', 4);
  try {
    let response
    if (isEdit.value) {
      // Edit existing cost
      response = await axios.post(`/api/master/office_price_list/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Price List berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new Price List
      response = await axios.post('/api/master/office_price_list', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Price List berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/office_price_list') // Redirect to cost list page
  } catch (error) {
    console.error('Error saving cost:', error)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  if (route.params.id) {
    isEdit.value = true
    fetchData(route.params.id)
    console.log(route.params.id)
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
      code: '',
      name: '',
      address: '',
      phone: '',
      email: '',
      logo: null,
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Price List' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
