<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Location' : 'Create Location' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Dimention Head</CFormLabel>
            <multiselect
              v-model="selectedDimention"
              :options="dimention_options"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Code*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.code" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">City</CFormLabel>
            <multiselect
              v-model="selectedCity"
              :options="city_options || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Location Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.location_name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Daily POB Estimated</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.daily_pob" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Price POB Estimated</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.price_pob" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Backcharge</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.backcharge" />
          </div>
          <div class="mb-3">
            <CFormLabel for="formFile" class="me-3">Active*</CFormLabel>
            <CFormCheck
              id="inlineCheckbox1"
              inline
              type="radio"
              name="inlineRadioOptions"
              value="1"
              label="Yes"
              v-model="form.is_active"
            />
            <CFormCheck
              id="inlineCheckbox2"
              inline
              type="radio"
              name="inlineRadioOptions"
              value="0"
              label="No"
              v-model="form.is_active"
            />
          </div>
          <div class="mb-3">
            <crudButton @revert="revert" @save="save" @back="back" />
          </div>
        </CForm>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import crudButton from '@/components/crudButton.vue'
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect';
import '@/assets/multiselect-theme.css';

const form = ref({
  id: null,
  code: '',
  location_name: '',
  daily_pob: '',
  price_pob: '',
  backcharge: '',
  is_active: '1' // Default to active
});

const dimention_options = [
  {value: 0, name: 'XYZ'},
  {value: 1, name: 'Department'},
  {value: 3, name: 'Location'}
];

const selectedDimention = ref(null);

const city_options = ref([]);
const selectedCity = ref(null);

// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const fetchCityData = async () => {
  try {
    const response = await axios.get(`/api/master/city/all`)
    const cities = response.data.data
    city_options.value = cities.map(city => ({
      value: city.id,
      name: city.name,
    }));
  } catch (error) {
    console.error('Error fetching city list:', error)
  }
}

// Fetch company data when editing
const fetchLocationData = async (id) => {
  try {
    const response = await axios.get(`/api/master/location/${id}`)
    const location = response.data.data
    form.value = { ...location, id: location.id, location_name: location.name, is_active: location.is_active === 1 ? '1' : '0' }
    selectedDimention.value = dimention_options.find(option => option.value === location.dimention_type);

    // Set selected city based on the location data
    selectedCity.value = city_options.value.find(option => option.name === location.city_name);
  } catch (error) {
    console.error('Error fetching location data:', error)
  }
}

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }
  formData.append('code', form.value.code)
  formData.append('dimention_type', selectedDimention.value ? selectedDimention.value.value : null);
  formData.append('name', form.value.location_name)
  formData.append('daily_pob', form.value.daily_pob)
  formData.append('price_pob', form.value.price_pob)
  formData.append('backcharge', form.value.backcharge)
  formData.append('city_name', selectedCity.value ? selectedCity.value.name : null);
  formData.append('is_active', form.value.is_active);

  try {
    let response
    if (isEdit.value) {
      // Edit existing location
      response = await axios.post(`/api/master/location/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Location berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/location', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Location berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/location') // Redirect to company list page
  } catch (error) {
    console.error('Error saving company:', error)
  }
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchCityData();
  if (route.params.id) {
    isEdit.value = true
    fetchLocationData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchLocationData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      code: '',
      location_name: '',
      daily_pob: '',
      price_pob: '',
      backcharge: '',
      is_active: '1'
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Location' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
