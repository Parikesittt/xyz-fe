<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Vendor' : 'Create Vendor' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="mb-3">
                <CFormLabel for="inputCode">Code*</CFormLabel>
                <CFormInput id="inputCode" type="text" placeholder="" v-model="form.code" @keyup.enter="cekCode" :invalid="codeError !== ''"/>
                <CFormFeedback invalid v-if="codeError">{{ codeError }}</CFormFeedback>
              </div>
              <br/>
              <h5>* After input code vendor must be enter</h5>
              <div class="mb-3">
                <CFormLabel for="inputName">Name*</CFormLabel>
                <CFormInput id="inputName" type="text" placeholder="" v-model="form.name" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputAddress">Address</CFormLabel>
                <CFormTextarea id="inputAddress" rows="3" v-model="form.address" ></CFormTextarea>
              </div>
              <div class="mb-3">
                <CFormLabel for="inputPhone">Phone</CFormLabel>
                <CFormInput id="inputPhone" type="text" placeholder="" v-model="form.phone" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTelefax">Telefax</CFormLabel>
                <CFormInput id="inputTelefax" type="text" placeholder="" v-model="form.telefax" />
              </div>
              <div class="mb-3">
                <CFormLabel for="formFile" class="me-3">Principal*</CFormLabel>
                <CFormCheck
                  id="checkboxPrincipal1"
                  inline
                  type="radio"
                  name="principalRadioOptions"
                  value="1"
                  label="Yes"
                  v-model="form.is_principal"
                />
                <CFormCheck
                  id="checkboxPrincipal2"
                  inline
                  type="radio"
                  name="principalRadioOptions"
                  value="0"
                  label="No"
                  v-model="form.is_principal"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <CFormLabel for="inputEmail">Email</CFormLabel>
                <CFormInput id="inputEmail" type="email" placeholder="" v-model="form.email" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputTerms">Terms*</CFormLabel>
                <CFormInput id="inputTerms" type="number" placeholder="" v-model="form.terms" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputGroup">Group*</CFormLabel>
                <multiselect
                  v-model="selectedVendorGroup"
                  :options="vendorGroupOptions"
                  :multiple="false"
                  :track-by="'value'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputCurrency">Currency*</CFormLabel>
                <multiselect
                  v-model="selectedCurrency"
                  :options="currencyOptions || []"
                  :multiple="false"
                  :track-by="'name'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputType">Type*</CFormLabel>
                <multiselect
                  v-model="selectedType"
                  :options="typeOptions"
                  :multiple="false"
                  :track-by="'value'"
                  label="name"
                  placeholder="Pick some options"
                  :close-on-select="true"
                />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputNPWP">NPWP</CFormLabel>
                <CFormInput id="inputNPWP" type="text" v-model="form.npwp" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputBank">Bank</CFormLabel>
                <CFormInput id="inputBank" type="text" v-model="form.bank" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputRek">No. Rek</CFormLabel>
                <CFormInput id="inputRek" type="text" v-model="form.rek" />
              </div>
              <div class="mb-3">
                <CFormLabel for="inputIsActive" class="me-3">Active*</CFormLabel>
                <CFormCheck
                  id="checkboxactive1"
                  inline
                  type="radio"
                  name="activeRadioOptions"
                  value="1"
                  label="Yes"
                  v-model="form.is_active"
                />
                <CFormCheck
                  id="checkboxactive2"
                  inline
                  type="radio"
                  name="activeRadioOptions"
                  value="0"
                  label="No"
                  v-model="form.is_active"
                />
              </div>
            </div>
          </div>
          <br/>
          <CCard class="mb-4">
            <CCardHeader>
              <strong>Dimention</strong>
            </CCardHeader>
            <CCardBody>
                <CForm>
                  <div class="mb-3">
                    <CFormLabel for="inputHead">Head*</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput v-model="form.location_head" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                      <CButton id="button-addon2" type="button" color="primary" @click = "modalHead = true">
                        <i class="pi pi-search"></i>
                      </CButton>
                      <LocationDialog
                          :modalLocation="modalHead"
                          :locationList="dimention1List"
                          :filters="filtersHead"
                          :selectedLocation="selectedDimention1"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          @update:modalLocation="modalHead = $event"
                          @update:filters="filtersHead = $event"
                          @update:selectedLocation="selectedDimention1 = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChooseHead"
                        />
                    </CInputGroup>
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputDepartment">Department*</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput v-model="form.location_department" placeholder="" aria-label="Search" disabled aria-describedby="button-addon2" />
                      <CButton id="button-addon2" type="button" color="primary" @click="modalDepartment = true">
                        <i class="pi pi-search"></i>
                      </CButton>
                      <LocationDialog
                          :modalLocation="modalDepartment"
                          :locationList="dimention2List"
                          :filters="filtersLocation"
                          :selectedLocation="selectedDimention2"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          @update:modalLocation="modalDepartment = $event"
                          @update:filters="filtersDepartment = $event"
                          @update:selectedLocation="selectedDimention2 = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChooseDepartment"
                        />
                    </CInputGroup>
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="inputLocation">Location*</CFormLabel>
                    <CInputGroup class="mb-3">
                      <CFormInput v-model="form.location_code" placeholder="" disabled aria-label="Search" aria-describedby="button-addon2" />
                      <CButton id="button-addon2" type="button" color="primary" @click="modalLocation = true">
                        <i class="pi pi-search"></i>
                      </CButton>
                    </CInputGroup>
                    <LocationDialog
                          :modalLocation="modalLocation"
                          :locationList="dimention3List"
                          :filters="filtersLocation"
                          :selectedLocation="selectedDimention3"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          @update:modalLocation="modalLocation = $event"
                          @update:filters="filtersLocation = $event"
                          @update:selectedLocation="selectedDimention3 = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChooseLocation"
                        />
                  </div>
                </CForm>
            </CCardBody>
          </CCard>
          <div class="mb-3">
            <crudButton @revert="revert" @save="save" @back="back" />
          </div>
        </CForm>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import crudButton from '@/components/crudButton.vue'
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect';
import LocationModal from '@/components/LocationModal.vue';
import '@/assets/multiselect-theme.css';
import LocationDialog from '@/components/LocationDialog.vue'

const form = ref({
  id: null,
  code: '',
  name: '',
  address: '',
  phone: '',
  telefax: '',
  email: '',
  terms: '',
  npwp: '',
  bank: '',
  rek: '',
  location_head: '',
  location_department: '',
  location_code: '',
  is_principal: '',
  is_active: '1' // Default to active
});


const modalHead = ref(false);
const modalDepartment = ref(false);
const modalLocation = ref(false);

const filtersLocation = ref({
  global: { value: null },
});
const filtersDepartment = ref({
  global: { value: null },
});
const filtersHead = ref({
  global: { value: null },
});
const loading = ref(false);
const lazyParams = ref({
  page: 1,
  rows: 10,
  search: ''
});
const onPage = (event) => {
  lazyParams.value = {
    ...lazyParams.value,
    page: event.page + 1,
    rows: event.rows
  };
  loadData();
};
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});
const searchTimeout = ref(null);
const onSearch = (event) => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    lazyParams.value = {
      ...lazyParams.value,
      page: 1,
      search: filters.value.global.value || '' // Get search value from filters
    };
    loadData();
  }, 300);
};
const loadData = async () => {
  try {
    loading.value = true;
    await fetchLocationData(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const updateSelectedLocation = (newSelectedLocation) => {
  console.log(newSelectedLocation)
  selectedDimention3.value = newSelectedLocation;
}
const handleChooseLocation = () => {
  if (selectedDimention3.value) {
    // Here you can process the selected items
    console.log('Selected items:', selectedDimention3.value);

    // Update your form or other data as needed
    // For example:
    form.value.location_code = selectedDimention3.value.code || '';

    // Close the dialog
    modalLocation.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};
const handleChooseDepartment = () => {
  if (selectedDimention2.value) {
    // Here you can process the selected items
    console.log('Selected items:', selectedDimention2.value);

    // Update your form or other data as needed
    // For example:
    form.value.location_department = selectedDimention2.value.code || '';

    // Close the dialog
    modalDepartment.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};
const handleChooseHead = () => {
  if (selectedDimention1.value) {
    // Here you can process the selected items
    console.log('Selected items:', selectedDimention1.value);

    // Update your form or other data as needed
    // For example:
    form.value.location_head = selectedDimention1.value.code || '';

    // Close the dialog
    modalHead.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};
watch(modalLocation, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParams.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filtersLocation.value = {
      global: { value: null }
    };
    loadData();
  }
});
watch(modalHead, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParams.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filtersHead.value = {
      global: { value: null }
    };
    loadData();
  }
});
watch(modalDepartment, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParams.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filtersDepartment.value = {
      global: { value: null }
    };
    loadData();
  }
});

// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const typeOptions = [
  {value: 2, name: 'Eksternal'},
  {value: 1, name: 'Internal'},
];
const selectedType = ref(null);


const warehouseCentralTypeOptions = ref([]);
const selectedWarehouseCentralType = ref(null);
const dimention1List = ref([]);
const selectedDimention1 = ref();
const dimention2List = ref([]);
const selectedDimention2 = ref();
const dimention3List = ref([]);
const selectedDimention3 = ref();

const vendorGroupOptions = ref([]);
const selectedVendorGroup = ref(null);
const currencyOptions = ref([]);
const selectedCurrency = ref(null);
const codeError = ref('');
watch(() => form.value.code, (newCode) => {
  if (!newCode || newCode.length < 8) {
    codeError.value = 'Must be 8 characters!';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(newCode)) {
    codeError.value = 'Must contain both letters and numbers';
  } else {
    codeError.value = '';
  }
});

const fetchVendorGroup = async () => {
  try {
    const response = await axios.get(`/api/master/vendor_groups`)
    const vendorGroup = response.data.data
    vendorGroupOptions.value = vendorGroup.map(item => ({
      id: item.id,
      value: item.group,
      name: item.name,
    }));
    // console.log(response)
  } catch (error) {
    console.log('Error fetching vendor group list: ', error)
  }
}

const fetchCurrency = async () => {
  try {
    const response = await axios.get(`/api/master/currency`)
    const currency = response.data.data
    currencyOptions.value = currency.map(item => ({
      value: item.code,
      name: item.code,
    }));
    // console.log(response)
  } catch (error) {
    console.log('Error fetching currency list: ', error)
  }
}

const fetchLocationData = async () => {
  try {
    const response = await axios.get(`/api/master/location/all`)
    const locations = response.data.data
    locations.forEach((location) => {
      const mappedLocation = {
        id: location.id,
        code: location.code,
        name: location.name,
      };

      if(location.dimention_type === 0){
        dimention1List.value.push(mappedLocation);
      } else if (location.dimention_type === 1){
        dimention2List.value.push(mappedLocation);
      } else if (location.dimention_type === 3){
        dimention3List.value.push(mappedLocation);
      }
    });
  } catch (error) {
    console.error('Error fetching location list:', error)
  }
}

const fetchWarehouseCentralType = async () => {
  try {
    const response = await axios.get(`/api/master/item_sub/all`)
    const item_subs = response.data.data
    warehouseCentralTypeOptions.value = item_subs.map(item_sub => ({
      value: item_sub.id,
      name: item_sub.name,
    }));
  } catch (error) {
    console.error('Error fetching location list:', error)
  }
}

// Fetch company data when editing
const fetchVendorData = async (id) => {
  try {
    const response = await axios.get(`/api/master/vendor/${id}`)
    const vendor = response.data.data
    form.value = { ...vendor, code: vendor.accountNum, id: vendor.id, is_active: vendor.is_active === 1 ? '1' : '0', is_principal: vendor.is_principal === 1 ? '1' : '0' }

    selectedType.value = typeOptions.find(option => option.value === vendor.type);
    selectedVendorGroup.value = vendorGroupOptions.value.find(option => option.value === vendor.vend_group);
    selectedCurrency.value = currencyOptions.value.find(option => option.value === vendor.currency);
  } catch (error) {
    console.error('Error fetching vendor data:', error)
  }
}

const cekCode = async () => {
  if (!form.value.code) {
    Swal.fire({
      title: 'Warning',
      text: 'Please enter a vendor code',
      icon: 'warning'
    });
    return;
  }

  try {
    const response = await axios.get(`/api/master/supplier/${form.value.code}`);

    if (response.data.data[0]) {
      // Code already exists
      Swal.fire({
        title: 'Error',
        text: 'This vendor code already exists',
        icon: 'error'
      });
      form.value.code = ''; // Clear the input
    } else {
      // Code is available
      Swal.fire({
        position: 'top-end',
        title: 'Success',
        text: 'Vendor code is available',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
    }
  } catch (error) {
    console.error('Error checking vendor code:', error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to check vendor code',
      icon: 'error'
    });
  }
};

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }
  formData.append('vend_group', selectedVendorGroup.value ? selectedVendorGroup.value.value : null);
  formData.append('currency', selectedCurrency.value ? selectedCurrency.value.value : null);
  formData.append('type', selectedType.value ? selectedType.value.value : null);
  formData.append('accountNum', form.value.code);
  formData.append('name', form.value.name);
  formData.append('address', form.value.address);
  formData.append('phone', form.value.phone);
  formData.append('telefax', form.value.telefax);
  formData.append('email', form.value.email);
  formData.append('terms', form.value.terms);
  formData.append('npwp', form.value.npwp);
  formData.append('bank', form.value.bank);
  formData.append('rek', form.value.rek);
  formData.append('location_head', form.value.location_head);
  formData.append('location_department', form.value.location_department);
  formData.append('location_code', form.value.location_code);
  formData.append('is_principal', form.value.is_principal);
  formData.append('is_active', form.value.is_active);

  try {
    let response
    if (isEdit.value) {
      // Edit existing location
      response = await axios.post(`/api/master/vendor/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Vendor berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/vendor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Vendor berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/vendor') // Redirect to company list page
  } catch (error) {
    console.error('Error saving warehouse:', error)
  }
}

const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchVendorGroup();
  fetchCurrency();
  // fetchLocationData();
  if (route.params.id) {
    isEdit.value = true
    fetchVendorData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchVendorData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      name: '',
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
