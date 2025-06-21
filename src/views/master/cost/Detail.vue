<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Cost' : 'Create Cost' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
                        <CFormLabel for="inputCost">Cost*</CFormLabel>
                        <CFormInput id="inputCost" type="text" placeholder="" v-model="form.cost" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputCancelCost">Cancel Cost*</CFormLabel>
                        <CFormInput id="inputCancelCost" type="text" placeholder="" v-model="form.cancel_cost" />
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
                      <div class="mb-3">
                        <CFormLabel for="addItem" class="me-3">Add Item</CFormLabel>
                        <Button @click="modalItem = true">
                          <i class="pi pi-plus"></i>
                        </Button>

                        <ItemPartDialog
                          :modalItemPart="modalItem"
                          :itemPartList="itemList"
                          :filters="filters"
                          :selectedItemPart="selectedItem"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          selectionMode = "multiple"
                          @update:modalItemPart="modalItem = $event"
                          @update:filters="filters = $event"
                          @update:selectedItemPart="selectedItem = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChoose"
                        />

                        <!-- DataTable untuk item yang dipilih -->
                        <div class="table-container">
                          <DataTable
                            :value="selectedItem"
                            class="fixed-column-table"
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
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';

const form = ref({
  id: null,
  cost: '',
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
const itemList = ref([]);
const selectedItem = ref();
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
const updateSelectedItem = (newSelectedItem) => {
  console.log(newSelectedItem)
  selectedItem.value = newSelectedItem;
}
const handleChoose = () => {
  if (selectedItem.value) {
    console.log('Selected items:', selectedItem.value);

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

const fetchItemPart = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/item/posted/office/1`, {
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

const formattingDate = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fetch company data when editing
const fetchCostData = async (id) => {
  try {
    const response = await axios.get(`/api/master/office_cost/${id}`)
    const cost = response.data.data
    form.value = {
      ...cost,
      cost: cost.cost,
      is_active: cost.is_active === 1 ? '1' : '0'
    }
    if (cost.office_cost_items && Array.isArray(cost.office_cost_items)) {
      // Pemetaan data dari office_part_items
      const mappedItemParts = cost.office_cost_items.map(cost => ({
        product_code: cost.product_code,
        id: cost.id,
        code: cost.item_code,
        name: cost.item_name,
        unit: cost.item_unit,
        category_office: cost.category_office,
      }));

      // Menyimpan hasil pemetaan di selectedItemPart
      selectedItem.value = mappedItemParts;
    } else {
      selectedItem.value = []; // Jika data tidak ada atau tidak berupa array
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
  }
  else{
    const dbDateFrom = formattingDate(form.value.periode_from)
    const dbDateTo = formattingDate(form.value.periode_to)
    formData.append('periode_from', dbDateFrom)
    formData.append('periode_to', dbDateTo)
  }
  const mappedItems = mapItemPart(selectedItem.value);
  console.log('Mapped Items:', mappedItems); // untuk debugging
  formData.append('cost', form.value.cost)
  formData.append('cancel_cost', form.value.cancel_cost)
  formData.append('description', form.value.description)
  formData.append('is_active', form.value.is_active)
  formData.append('office_cost_item', JSON.stringify(mappedItems))
  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/office_cost/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/office_cost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/office_cost') // Redirect to company list page
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
  }else{
    const dbDateFrom = formattingDate(form.value.periode_from)
    const dbDateTo = formattingDate(form.value.periode_to)
    formData.append('periode_from', dbDateFrom)
    formData.append('periode_to', dbDateTo)
  }
  const mappedItems = mapItemPart(selectedItem.value);
  console.log('Mapped Items:', mappedItems);
  formData.append('cost', form.value.cost)
  formData.append('cancel_cost', form.value.cancel_cost)
  formData.append('description', form.value.description)
  formData.append('is_active', form.value.is_active)
  formData.append('office_cost_item', JSON.stringify(mapItemPart(selectedItem.value)))
  formData.append('is_submitted', 4);
  try {
    let response
    if (isEdit.value) {
      // Edit existing cost
      response = await axios.post(`/api/master/office_cost/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new cost
      response = await axios.post('/api/master/office_cost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/office_cost') // Redirect to cost list page
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
    fetchCostData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchCostData(newId)
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
  router.push({ name: 'Company' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
