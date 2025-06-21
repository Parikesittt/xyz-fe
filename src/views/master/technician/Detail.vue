<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Technician' : 'Create Technician' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Name*</CFormLabel>
            <multiselect
              v-model="selectedUser"
              :options="userOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Phone*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.phone" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Addres*</CFormLabel>
            <CFormTextarea id="exampleFormControlTextarea1" rows="3" v-model="form.address" ></CFormTextarea>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlTextarea1">Email*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="email" placeholder="" v-model="form.email" />
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
  phone: '',
  address: '',
  email: '',
  is_active: '1' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false);

const userOptions = ref([]);
const selectedUser = ref(null);

const fetchUser = async () => {
  try {
    const response = await axios.get(`/api/master/user/all`)
    const user = response.data.data
    userOptions.value = user.map(user => ({
      value: user.id,
      name: user.name,
    }));
  } catch (error) {
    console.error('Error fetching user list:', error)
  }
}

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/technician/${id}`)
    const technician = response.data.data
    form.value = { ...technician, is_active: technician.is_active === 1 ? '1' : '0' }
    selectedUser.value = userOptions.value.find(option => option.value === technician.user_id);
  } catch (error) {
    console.error('Error fetching technician data:', error)
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
  formData.append('phone', form.value.phone)
  formData.append('address', form.value.address)
  formData.append('email', form.value.email)
  formData.append('is_active', form.value.is_active)
  formData.append('name', selectedUser.value ? selectedUser.value.name : null)
  formData.append('user_id', selectedUser.value ? selectedUser.value.value : null)

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/technician/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Technician berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/technician', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Technician berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
    router.push('/master/technician')
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
  fetchUser();
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
  router.push({ name: 'Technician' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
