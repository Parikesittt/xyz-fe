<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Item Group' : 'Create Item Group' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3" v-if="isEdit">
            <CFormLabel for="exampleFormControlInput1">Code*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.code" disabled />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Item Super Group</CFormLabel>
            <multiselect
              v-model="selectedItemSup"
              :options="item_sup_options || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
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
  is_active: '0' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

const item_sup_options = ref([]);
const selectedItemSup = ref(null);


const fetchItemSuperGroup = async () => {
  try {
    const response = await axios.get(`/api/master/item_super_group/all`)
    const item_sups = response.data.data
    item_sup_options.value = item_sups.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item super group list:', error)
  }
}

const fetchItemGroup = async (id) => {
  try {
    const response = await axios.get(`/api/master/item_group/${id}`)
    const item_group = response.data.data
    form.value = { ...item_group, is_active: item_group.is_active === 1 ? '1' : '0' }
    selectedItemSup.value = item_sup_options.value.find(option => option.value === item_group.itemgroup_id);
  } catch (error) {
    console.error('Error fetching item super group data:', error)
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
  formData.append('is_active', form.value.is_active)
  formData.append('itemgroup_id', selectedItemSup.value ? selectedItemSup.value.value : null);

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/item_group/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Item Group berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/item_group', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Item Group berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
    router.push('/master/item_group')
  } catch (error) {
    console.error('Error saving item group:', error)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchItemSuperGroup();
  if (route.params.id) {
    isEdit.value = true
    fetchItemGroup(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchItemGroup(newId)
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
  router.push({ name: 'Item Group' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
