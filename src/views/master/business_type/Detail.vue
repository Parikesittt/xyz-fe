<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Business Type' : 'Create Business Type' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Code*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.code" />
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
  name: '',
  code: '',
  is_active: '1' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/business_type/${id}`)
    const unit = response.data.data
    form.value = { ...unit, is_active: unit.is_active === 1 ? '1' : '0' }
  } catch (error) {
    console.error('Error fetching unit data:', error)
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
  formData.append('name', form.value.name)
  formData.append('code', form.value.code)
  formData.append('is_active', form.value.is_active)

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/business_type/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Business Type berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/business_type', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Business Type berhasil dibuat',
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
      unit: '',
      desc: '',
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Business Type' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
