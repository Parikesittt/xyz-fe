<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit City' : 'Create City' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Code*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.code" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
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

const form = ref({
  id: null,
  code: '',
  name: '',
  is_active: '1' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

// Fetch company data when editing
const fetchCityData = async (id) => {
  try {
    const response = await axios.get(`/api/master/city/${id}`)
    const city = response.data.data
    form.value = { ...city, is_active: city.is_active === 1 ? '1' : '0' }
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
  formData.append('code', form.value.code)
  formData.append('name', form.value.name)
  formData.append('is_active', form.value.is_active)

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/city/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'City berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/city', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'City berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
      console.log('create')
    }
    router.push('/master/city')
  } catch (error) {
    console.error('Error saving city:', error)
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
    fetchCityData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchCityData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      code: '',
      name: '',
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'City' });
};

</script>
