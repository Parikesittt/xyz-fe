<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Facility' : 'Create Facility' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Description*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.description" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Type*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.type" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Category*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.category" />
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
  description: '',
  type: '',
  category: '',
  is_active: '1' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/vendor/${id}`)
    const vendor = response.data.data
    form.value = { ...vendor, is_active: vendor.is_active === 1 ? '1' : '0' }
  } catch (error) {
    console.error('Error fetching vendor data:', error)
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
  }
  formData.append('description', form.value.description)
  formData.append('type_facility', form.value.type)
  formData.append('value', form.value.category)
  formData.append('is_active', form.value.is_active)

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/facility/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Facility berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/facility', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Facility berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
    router.push('/master/business_type')
  } catch (error) {
    console.error('Error saving unit:', error)
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
      description: '',
      type: '',
      category: '',
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Facility' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
