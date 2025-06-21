<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Item' : 'Create Item' }}</strong>
    </CCardHeader>
    <CCardBody>
      <CForm @submit.prevent="save">
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
            <CFormLabel for="exampleFormControlInput1">Item Group</CFormLabel>
            <multiselect
              v-model="selectedItemGroup"
              :options="itemGroupOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Item Subgroup</CFormLabel>
            <multiselect
              v-model="selectedItemSub"
              :options="itemSubOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Name*</CFormLabel>
            <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Unit</CFormLabel>
            <multiselect
              v-model="selectedUnit"
              :options="unitOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Capacity*</CFormLabel>
            <CInputGroup class="mb-3">
              <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.capacity" />
              <CInputGroupText id="basic-addon2">ml</CInputGroupText>
            </CInputGroup>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Standard Print*</CFormLabel>
            <CInputGroup class="mb-3">
              <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.std_print" />
              <CInputGroupText id="basic-addon2">pages</CInputGroupText>
            </CInputGroup>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Type*</CFormLabel>
            <multiselect
              v-model="selectedType"
              :options="typeOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Masa Item*</CFormLabel>
            <div class="mb-3 d-flex justify-content-between">
              <multiselect
                v-model="selectedMasaItem"
                :options="masaItemOptions || []"
                :multiple="false"
                :track-by="'name'"
                label="name"
                placeholder="Pick some options"
                :close-on-select="true"
              />
              <CInputGroupText id="basic-addon2">TAHUN</CInputGroupText>
            </div>
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Item Category*</CFormLabel>
            <multiselect
              v-model="selectedItemCat"
              :options="itemCatOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="formFile" class="me-3">Item Status*</CFormLabel>
            <CFormCheck
              id="checkboxStatus1"
              inline
              type="radio"
              name="inlineRadioOptionsStatus"
              value="1"
              label="Moving"
              v-model="form.item_status"
            />
            <CFormCheck
              id="checkboxStatus2"
              inline
              type="radio"
              name="inlineRadioOptionsStatus"
              value="0"
              label="Non Moving"
              v-model="form.item_status"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="exampleFormControlInput1">Type PPN*</CFormLabel>
            <multiselect
              v-model="selectedPPN"
              :options="PPNOptions || []"
              :multiple="false"
              :track-by="'name'"
              label="name"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="formFile" class="me-3">Ecommerce*</CFormLabel>
            <CFormCheck
              id="checkboxEcommerce1"
              inline
              type="radio"
              name="inlineRadioOptionsECommerce"
              value="1"
              label="Yes"
              v-model="form.is_ecommerce"
            />
            <CFormCheck
              id="checkboxEcommerce2"
              inline
              type="radio"
              name="inlineRadioOptionsECommerce"
              value="0"
              label="No"
              v-model="form.is_ecommerce"
            />
          </div>
          <div class="mb-3">
            <CFormLabel for="formFile" class="me-3">Active*</CFormLabel>
            <CFormCheck
              id="checkboxIsactive1"
              inline
              type="radio"
              name="inlineRadioOptionsIsActive"
              value="1"
              label="Yes"
              v-model="form.is_active"
            />
            <CFormCheck
              id="checkboxIsactive2"
              inline
              type="radio"
              name="inlineRadioOptionsIsActive"
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
  capacity: '',
  std_print: '',
  item_status: '0',
  is_ecommerce: '0',
  is_active: '0' // Default to active
})

// For detecting if we're editing or creating a company
const isEdit = ref(false)

const item_sup_options = ref([]);
const selectedItemSup = ref(null);
const itemGroupOptions = ref([]);
const selectedItemGroup = ref(null);
const itemSubOptions = ref([]);
const selectedItemSub = ref(null);
const unitOptions = ref([]);
const selectedUnit = ref(null);
const typeOptions = [
  { value: 1, name: 'Fix Asset - Asset' },
  { value: 2, name: 'Kitchen Equipment - Asset' },
  { value: 3, name: 'Kitchen Supplies - Non Asset' },
  { value: 4, name: 'Row Material - Non Asset' },
  { value: 5, name: 'ATK - Non Asset' },
  { value: 6, name: 'Sparepart - Non Asset' },
];
const selectedType = ref(null);
const masaItemOptions = [
  { value: 4, name: '4' },
  { value: 8, name: '8' },
  { value: 10, name: '10' },
  { value: 16, name: '16' },
  { value: 20, name: '20' },
]
const selectedMasaItem = ref(null);
const itemCatOptions = ref([]);
const selectedItemCat = ref(null);
const PPNOptions = [
  { value: 1, name: 'PPN' },
  { value: 2, name: 'Non PPN' },
];
const selectedPPN = ref(null);
const fromUnitOptions = ref([]);
const selectedFromUnit = ref(null);
const convertOptions = ref([]);
const selectedConvert = ref(null);


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

const fetchItemGroup = async (superGroupId) => {
  try {
    const response = await axios.get(`/api/master/item/getItemGroup/${superGroupId}`)
    const groups = response.data.data
    itemGroupOptions.value = groups.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item group list:', error)
  }
}

// Add this watch effect after the fetchItemGroup function
watch(selectedItemSup, (newValue) => {
  if (newValue) {
    fetchItemGroup(newValue.value);
    // Reset the dependent selection when parent changes
    selectedItemGroup.value = null;
  } else {
    // Clear the options when nothing is selected
    itemGroupOptions.value = [];
  }
});

const fetchItemSubgroup = async (itemGroupId) => {
  try {
    const response = await axios.get(`/api/master/item/getItemSubgroup/${itemGroupId}`)
    const subs = response.data.data
    itemSubOptions.value = subs.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item subgroup list:', error)
  }
}

watch(selectedItemGroup, (newValue) => {
  if (newValue) {
    fetchItemSubgroup(newValue.value);
    // Reset the dependent selection when parent changes
    selectedItemSub.value = null;
  } else {
    // Clear the options when nothing is selected
    itemSubOptions.value = [];
  }
});

const fetchUnit = async () => {
  try {
    const response = await axios.get(`/api/master/unit/all`)
    const units = response.data.data;
    unitOptions.value = units.map(unit => ({
      id: unit.id,
      value: unit.unit,
      name: unit.desc
    }))
  } catch (error) {
    console.error('Error fetching unit list:', error)
  }
}

const fetchItemCategory = async () => {
  try {
    const response = await axios.get(`/api/master/item_sub/all`)
    const item_subs = response.data.data;
    itemCatOptions.value = item_subs.map(sub => ({
      value: sub.id,
      name: sub.name,
    }))
  } catch (error) {
    console.error('Error fetching Item Category List: ', error)
  }
}

const fetchData = async (id) => {
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
  formData.append('capacity', form.value.capacity)
  formData.append('std_print', form.value.std_print)
  formData.append('item_status', form.value.item_status)
  formData.append('is_ecommerce', form.value.is_ecommerce)
  formData.append('is_active', form.value.is_active)
  formData.append('itemgroup_id', selectedItemSup.value ? selectedItemSup.value.value : null);
  formData.append('itemcategory_id', selectedItemGroup.value ? selectedItemGroup.value.value : null);
  formData.append('subcategory_id', selectedItemSub.value ? selectedItemSub.value.value : null);
  formData.append('unit_id', selectedUnit.value ? selectedUnit.value.id : null);
  formData.append('item_class', selectedType.value ? selectedType.value.value : 0);
  formData.append('masa_item', selectedType.value ? selectedType.value.value : 0);
  formData.append('item_sales_tax', selectedPPN.value ? selectedPPN.value.value : null);
  formData.append('item_subcategory_id', selectedItemCat.value ? selectedItemCat.value.value : null);
  formData.append('from_unit', selectedFromUnit.value ? selectedFromUnit.value.value : null);
  formData.append('conversion', selectedConvert.value ? selectedConvert.value.value : null);

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/item/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Item berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/item', formData, {
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
    router.push('/master/item')
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchItemSuperGroup();
  fetchUnit();
  fetchItemCategory();
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
  router.push({ name: 'Item Group' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
