<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Cost' : 'Create Cost' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
                        <CFormLabel for="inputArea">Area*</CFormLabel>
                        <CInputGroup class="mb-3">
                          <CFormInput v-model="form.area_name" placeholder="" aria-label="Search" aria-describedby="button-addon2" />
                          <CButton id="button-addon2" type="button" color="primary" @click="modalArea = true">
                            <i class="pi pi-search"></i>
                          </CButton>
                        </CInputGroup>
                        <LocationDialog
                          :modalLocation="modalArea"
                          :locationList="areaList"
                          :filters="filters"
                          :selectedLocation="selectedArea"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          @update:modalLocation="modalArea = $event"
                          @update:filters="filters = $event"
                          @update:selectedLocation="selectedArea = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChoose"
                        />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputLocation">Location*</CFormLabel>
                        <CFormInput id="inputLocation" type="text" placeholder="" v-model="form.location" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel for="inputCost">Cost*</CFormLabel>
                        <CFormInput id="inputCost" type="text" placeholder="" :value="formatCost(form.cost)"
                        @input="handleCostInput" />
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
import LocationDialog from '@/components/LocationDialog.vue'
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
const isEdit = ref(false)
const modalArea = ref(false);
const areaList = ref([]);
const selectedArea = ref();
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
    await fetchArea(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const updateSelectedArea = (newSelectedArea) => {
  console.log(newSelectedArea)
  selectedArea.value = newSelectedArea;
}
const handleChoose = () => {
  if (selectedArea.value) {
    console.log('Selected items:', selectedArea.value);

    form.value.area_name = selectedArea.value.name;
    form.value.area_id = selectedArea.value.id;
    modalArea.value = false;
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

const mapArea = (items) => {
  if (!items || !Array.isArray(items)) return [];

  return items.map(item => ({
    id: item.id,
    code: item.code,
    name: item.name,
  }));
};

const fetchArea = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/office_cost/onsite_area`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const mappedArea = mapArea(response.data.data);
    areaList.value = mappedArea;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};

watch(modalArea, (newValue) => {
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
    const response = await axios.get(`/api/master/office_cost/onsite/${id}`)
    const cost = response.data.data
    form.value = {
      ...cost,
      cost: cost.price,
      is_active: cost.is_active === 1 ? '1' : '0'
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
  }
  formData.append('area_name', form.value.area_name)
  formData.append('area_id', form.value.area_id)
  formData.append('location', form.value.location)
  formData.append('price', form.value.cost)
  formData.append('is_active', form.value.is_active)
  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/office_cost/onsite/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost Onsite berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/office_cost/onsite', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost Onsite berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/office_cost/onsite') // Redirect to company list page
  } catch (error) {
    console.error('Error saving cost:', error)
  }
}

const submit = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }
  formData.append('area_name', form.value.area_name)
  formData.append('area_id', form.value.area_id)
  formData.append('location', form.value.location)
  formData.append('price', form.value.cost)
  formData.append('is_active', form.value.is_active)
  formData.append('is_submitted', 1);
  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/office_cost/onsite/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost Onsite berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/office_cost/onsite', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Cost Onsite berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/office_cost/onsite') // Redirect to company list page
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
