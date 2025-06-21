<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Warehouse' : 'Create Warehouse' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Warehouse Type</CFormLabel>
            <multiselect
              v-model="selectedWarehouseType"
              :options="warehouseTypeOptions"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3" v-if="isEdit">
            <CFormLabel for="exampleFormControlInput1">Type Warranty</CFormLabel>
            <multiselect
              v-model="selectedWarrantyType"
              :options="warrantyTypeOptions"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3" v-if="isEdit">
            <CFormLabel for="exampleFormControlInput1">Central Stores</CFormLabel>
            <multiselect
              v-model="selectedCentralStore"
              :options="centralStoreOptions"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3" v-if="selectedWarehouseType?.value === 1">
            <CFormLabel for="exampleFormControlInput1">Warehouse Type</CFormLabel>
            <multiselect
              v-model="selectedWarehouseCentralType"
              :options="warehouseCentralTypeOptions"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">XYZ</CFormLabel>
            <multiselect
              v-model="selectedDimention1"
              :options="dimention1Options"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
              :disabled="!selectedWarehouseType"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Department</CFormLabel>
            <multiselect
              v-model="selectedDimention2"
              :options="dimention2Options"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
              :disabled="!selectedWarehouseType"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Location</CFormLabel>
            <multiselect
              v-model="selectedDimention3"
              :options="dimention3Options"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
              :disabled="!selectedWarehouseType"
              :searchable="true"
            />
          </div>
          <div class="mb-3" v-if="isEdit">
            <CFormLabel for="exampleFormControlInput1">Code*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.code" disabled />
          </div>
          <!-- <div class="mb-3">
            <CInputGroup class="mb-3">
              <CFormInput
                aria-describedby="button-addon2"
                v-model="form.location"
              />
              <CButton
                id="button-addon2"
                type="button"
                color="secondary"
                variant="outline"
                @click="openModal"
              >
                Button
              </CButton>
            </CInputGroup>
            <LocationModal
              v-model = "isModalActive"
              large-title = "Location"
              button = "primary"
              :has-cancel = "true"
              @location-selected="handleLocationSelection"
            />
          </div> -->
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Warehouse Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
          </div>
          <!-- <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Customer*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.description" />
          </div> -->
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Currency*</CFormLabel>
            <multiselect
              v-model="selectedCurrency"
              :options="currencyOptions"
              :multiple="false"
              :track-by="'value'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
              :disabled="!selectedWarehouseType"
              :searchable="true"
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
import LocationModal from '@/components/LocationModal.vue';
import '@/assets/multiselect-theme.css';

const form = ref({
  id: null,
  name: '',
  is_active: '1' // Default to active
});


const location_options = ref([]);
const selectedLocation = ref(null);
const isModalActive = ref(false);

const openModal = () => {
  isModalActive.value = true;
}

const handleLocationSelection = (location) => {
  // form.value.location = location // Store the selected location name
  selectedLocation.value = location // Store the full location object
  console.log(selectedLocation);
  isModalActive.value = false // Close the modal
}


// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

const currencyOptions = [
  { value: 1, name: 'Rupiah (Rp)' },
  { value: 2, name: 'Dollar ($)' }
];
const selectedCurrency = ref(null);

const warehouseTypeOptions = [
  {value: 1, name: 'Warehouse'},
  {value: 2, name: 'Store'},
];
const selectedWarehouseType = ref(null);

const warrantyTypeOptions = [
  {value: 0, name: 'Non Warranty'},
  {value: 1, name: 'Warranty'},
];
const selectedWarrantyType = ref(null);


const warehouseCentralTypeOptions = ref([]);
const selectedWarehouseCentralType = ref(null);
const dimention1Options = ref([]);
const selectedDimention1 = ref(null);
const dimention2Options = ref([]);
const selectedDimention2 = ref(null);
const dimention3Options = ref([]);
const selectedDimention3 = ref(null);

const centralStoreOptions = ref([]);
const selectedCentralStore = ref(null);

const fetchCentralStore = async () => {
  try {
    const response = await axios.get(`/api/master/warehouse/stores_central`)
    const centralStore = response.data.data
    centralStoreOptions.value = centralStore.map(centralStore => ({
      id: centralStore.id,
      value: centralStore.code,
      name: centralStore.name,
    }));
    // console.log(response)
  } catch (error) {
    console.log('Error fetching central store list: ', error)
  }
}

const fetchLocationData = async () => {
  try {
    const response = await axios.get(`/api/master/location/all`)
    const locations = response.data.data
    locations.forEach((location) => {
      const mappedLocation = {
        id: location.id,
        value: location.code,
        name: location.name,
      };

      if(location.dimention_type === 0){
        dimention1Options.value.push(mappedLocation);
      } else if (location.dimention_type === 1){
        dimention2Options.value.push(mappedLocation);
      } else if (location.dimention_type === 3){
        dimention3Options.value.push(mappedLocation);
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
const fetchWarehouseData = async (id) => {
  try {
    const response = await axios.get(`/api/master/warehouse/${id}`)
    const warehouse = response.data.data
    form.value = { ...warehouse, id: warehouse.id, is_active: warehouse.is_active === 1 ? '1' : '0' }

    selectedWarehouseType.value = warehouseTypeOptions.find(option => option.value === warehouse.warehouse_type);
    selectedWarehouseCentralType.value = warehouseCentralTypeOptions.value.find(option => option.value === warehouse.warehouse_central_type);
    selectedDimention1.value = dimention1Options.value.find(option => option.value === warehouse.dimention1);
    selectedDimention2.value = dimention2Options.value.find(option => option.value === warehouse.dimention2);
    selectedDimention3.value = dimention3Options.value.find(option => option.value === warehouse.dimention3);
    selectedCurrency.value = currencyOptions.find(option => option.value === warehouse.currency);
    if(warehouse.is_warranty && warehouse.central_warehouse_id){
      selectedWarrantyType.value = warrantyTypeOptions.find(option => option.value === warehouse.is_warranty);
      selectedCentralStore.value = centralStoreOptions.value.find(option => option.id === warehouse.central_warehouse_id);
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
  }
}

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
    formData.append('is_warranty', selectedWarrantyType.value ? selectedWarrantyType.value.value : null);
    formData.append('central_warehouse_id', selectedCentralStore.value ? selectedCentralStore.value.id : null);
  }
  formData.append('warehouse_type', selectedWarehouseType.value ? selectedWarehouseType.value.value : null);
  formData.append('warehouse_central_type', selectedWarehouseCentralType.value ? selectedWarehouseCentralType.value.value : null);
  formData.append('location_id', selectedDimention3.value ? selectedDimention3.value.id : null);
  formData.append('currency', selectedCurrency.value ? selectedCurrency.value.value : null);
  formData.append('dimention1', selectedDimention1.value ? selectedDimention1.value.value : null);
  formData.append('dimention2', selectedDimention2.value ? selectedDimention2.value.value : null);
  formData.append('dimention3', selectedDimention3.value ? selectedDimention3.value.value : null);
  formData.append('name', form.value.name);
  formData.append('is_active', form.value.is_active);

  try {
    let response
    if (isEdit.value) {
      // Edit existing location
      response = await axios.post(`/api/master/warehouse/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Warehouse berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/master/warehouse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Warehouse berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/master/warehouse') // Redirect to company list page
  } catch (error) {
    console.error('Error saving warehouse:', error)
  }
}

const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchWarehouseCentralType();
  fetchLocationData();
  // fetchLocationData();
  if (route.params.id) {
    isEdit.value = true
    fetchCentralStore();
    fetchWarehouseData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchWarehouseData(newId)
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
