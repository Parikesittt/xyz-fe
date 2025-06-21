<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Bank Account' : 'Create Bank Account' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Bank*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.bank" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Account Number*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.accountNum" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Account Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Location</CFormLabel>
            <multiselect
              v-model="selectedLocation"
              :options="locationOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Description*</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" rows="3" v-model="form.desc" ></CFormTextarea>
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
import api from '../../../api/api'

const form = ref({
  id: null,
  bank: '',
  accountNum: '',
  name: '',
  desc: '',
  is_active: '0' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

const locationOptions = ref([]);
const selectedLocation = ref(null);


const fetchLocations = async () => {
  try {
    const response = await api.get(`/api/master/location/all`)
    const locs = response.data.data
    locationOptions.value = locs.map(loc => ({
      value: loc.id,
      name: loc.name,
    }));
  } catch (error) {
    console.error('Error fetching location list:', error)
  }
}

const fetchData = async (id) => {
  try {
    const response = await api.get(`/api/master/bankaccount/${id}`)
    const bank = response.data.data
    form.value = { ...bank, accountNum: bank.name, desc:bank.description, is_active: bank.is_active === 1 ? '1' : '0' }
    selectedLocation.value = locationOptions.value.find(option => option.value === bank.location_id)
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
  formData.append('bank', form.value.bank)
  formData.append('accountNum', form.value.accountNum)
  formData.append('name', form.value.name)
  formData.append('desc', form.value.desc)
  formData.append('is_active', form.value.is_active)
  formData.append('location_id', selectedLocation.value ? selectedLocation.value.value : null);

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await api.post(`/api/master/bankaccount/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Bank Account berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await api.post('/api/master/bankaccount', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Bank Account berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
    router.push('/master/bankaccount')
  } catch (error) {
    console.error('Error saving bank account:', error)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchLocations();
  fetchData();
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
  router.push({ name: 'Bank Account' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
