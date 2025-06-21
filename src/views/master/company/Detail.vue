<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Company' : 'Create Company' }}</strong>
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
            <CFormLabel for="exampleFormControlTextarea1">Address</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" rows="3" v-model="form.address" ></CFormTextarea>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Bank</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" rows="3" v-model="form.bank" ></CFormTextarea>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Phone</CFormLabel>
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

const form = ref({
  id: null,
  code: '',
  name: '',
  address: '',
  bank: '',
  phone: '',
  email: '',
  logo: null,
  logoUrl: '',
  is_active: '1' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

// Fetch company data when editing
const fetchCompanyData = async (id) => {
  try {
    const response = await axios.get(`/api/master/company/${id}`)
    const company = response.data.data
    form.value = { ...company, is_active: company.is_active === 1 ? '1' : '0' }
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
  formData.append('code', form.value.code)
  formData.append('name', form.value.name)
  formData.append('address', form.value.address)
  formData.append('bank', form.value.bank)
  formData.append('phone', form.value.phone)
  formData.append('email', form.value.email)
  formData.append('is_active', form.value.is_active)
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
      // Edit existing company
      response = await axios.post(`/api/master/company/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Company berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/company', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Company berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/company') // Redirect to company list page
  } catch (error) {
    console.error('Error saving company:', error)
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
    fetchCompanyData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchCompanyData(newId)
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
