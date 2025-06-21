<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Chart of Account' : 'Create Chart of Account' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="inputLedgerAccount">Ledger Account*</CFormLabel>
            <CFormInput id="inputLedgerAccount" type="text" placeholder="" v-model="form.ledger_account" @keyup.enter="cekAccount" :invalid="codeError !== ''"/>
            <CFormFeedback invalid v-if="codeError">{{ codeError }}</CFormFeedback>
          </div>
          <div class="mb-3">
            <CFormLabel for="inputAccountName">Account Name*</CFormLabel>
            <CFormInput id="inputAccountName" type="text" placeholder="" v-model="form.account_name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="inputAccountType">Account Type*</CFormLabel>
            <multiselect
              v-model="selectedAccountType"
              :options="accountTypeOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <!-- <div class="mb-3">
            <CFormLabel for="inputFlag">Flag*</CFormLabel>
            <multiselect
              v-model="selectedFlag"
              :options="flagOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div> -->
          <!-- <div class="mb-3" v-if="selectedAccountType?.value === 'Balance' || selectedAccountType?.value === 'Profit & Loss'">
            <CFormLabel for="inputFlag">Account PO*</CFormLabel>
            <multiselect
              v-model="selectedAccountPO"
              :options="accountPOOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div> -->
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
  ledger_account:'',
  account_name: '',
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)
const selectedAccountType = ref(null);
const accountTypeOptions = [
  { value: 'Header', name: 'Header' },
  { value: 'Total', name: 'Total' },
  { value: 'Balance', name: 'Balance' },
  { value: 'Profit & Loss', name: 'Profit & Loss' },
];
const selectedFlag = ref(null);
const flagOptions = [
  { value: 0, name: 'None'},
  { value: 1, name: 'Inventaris Asset'},
  { value: 2, name: 'Biaya Penyusutan'},
  { value: 3, name: 'Akum Penyusutan'},
];

const accountPOOptions = [
  { value: 0, name: 'No'},
  { value: 1, name: 'Yes'},
];
const selectedAccountPO = ref(null);

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/ledger/${id}`)
    const unit = response.data.data
    form.value = { ...unit, is_active: unit.is_active === 1 ? '1' : '0' }
    selectedAccountType.value = accountTypeOptions.find(option => option.value === unit.account_type)
  } catch (error) {
    console.error('Error fetching unit data:', error)
  }
}

const codeError = ref('');
watch(() => form.value.code, (newCode) => {
  if (!newCode || newCode.length < 8) {
    codeError.value = 'Must be 8 characters!';
  } else {
    codeError.value = '';
  }
});

const cekAccount = async () => {
  if (!form.value.ledger_account) {
    Swal.fire({
      title: 'Warning',
      text: 'Please enter a ledger account',
      icon: 'warning'
    });
    return;
  }

  try {
    const response = await axios.get(`/api/master/ledger/cekAccount/${form.value.ledger_account}`);

    if (response.data[0]) {
      // Code already exists
      Swal.fire({
        title: 'Error',
        text: 'This ledger account already exists',
        icon: 'error'
      });
      form.value.code = ''; // Clear the input
    } else {
      // Code is available
      Swal.fire({
        position: 'top-end',
        title: 'Success',
        text: 'Ledger account is available',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
    }
  } catch (error) {
    console.error('Error checking ledger account:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to check ledger account',
      icon: 'error'
    });
  }
};

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }
  formData.append('ledger_account', form.value.ledger_account)
  formData.append('account_name', form.value.account_name)
  formData.append('account_type', selectedAccountType.value ? selectedAccountType.value.value : null)

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/ledger/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Chart of Account berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/ledger', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Chart of Account berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
    router.push('/master/chart_of_account')
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
