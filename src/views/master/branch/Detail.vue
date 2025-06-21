<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Branch' : 'Create Branch' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Location*</CFormLabel>
            <multiselect
              v-model="selectedLocation"
              :options="location_options"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Description*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.description" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Address</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" rows="3" v-model="form.address" ></CFormTextarea>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Phone</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="62..." v-model="form.phone" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Email</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="email" placeholder="example@dummy.com" v-model="form.email" />
          </div>
          <div class="mb-3">
              <CFormLabel for="formFile">Upload Logo</CFormLabel>
              <CFormInput id="formFile" type="file" @change="handleFileUpload" />
              <small>Pictures types: JPG/PNG/GIF</small>
              <br>
              <small>Max file size: 200kb</small>
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
import LocationModal from '@/components/LocationModal.vue';
import '@/assets/multiselect-theme.css';

const form = ref({
  id: null,
  name: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  logo: null,
  logoUrl: '',
  is_active: '1' // Default to active
});


const location_options = ref([]);
const selectedLocation = ref(null);

// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const fetchLocationData = async () => {
  try {
    const response = await api.get(`/api/master/location/all`)
    const locations = response.data.data
    location_options.value = locations.map(location => ({
      value: location.id,
      name: location.name,
    }));
  } catch (error) {
    console.error('Error fetching location list:', error)
  }
}

// Fetch company data when editing
const fetchBranchData = async (id) => {
  try {
    const response = await api.get(`/api/master/branch/${id}`)
    const branch = response.data.data
    form.value = { ...branch, id: branch.id, is_active: branch.is_active === 1 ? '1' : '0' }


    selectedLocation.value = location_options.value.find(option => option.value === branch.location_id);
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
  formData.append('location_id', selectedLocation.value ? selectedLocation.value.value : null);
  formData.append('name', form.value.name);
  formData.append('description', form.value.description);
  formData.append('address', form.value.address);
  formData.append('phone', form.value.phone);
  formData.append('email', form.value.email);
  formData.append('is_active', form.value.is_active);
  if (form.value.logo)
  {
    formData.append('file', form.value.logo)
  }else{
    formData.append('file_path', form.value.file_path)
    formData.append('file_type', form.value.file_type)
  }

  try {
    let response
    if (isEdit.value) {
      // Edit existing location
      response = await api.post(`/api/master/branch/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Branch berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await api.post('/api/master/branch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Branch berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/branch') // Redirect to company list page
  } catch (error) {
    console.error('Error saving branch:', error)
  }
}

const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchLocationData();
  // fetchLocationData();
  if (route.params.id) {
    isEdit.value = true
    fetchBranchData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchBranchData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      logo: null,
      logoUrl: '',
      is_active: '1'
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Branch' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
