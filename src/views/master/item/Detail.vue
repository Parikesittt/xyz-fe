<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>Item</strong>
    </CCardHeader>
    <CCardBody>
      <CTabs activeItemKey="general">
              <CTabList variant="tabs">
                <CTab itemKey="general">General</CTab>
                <CTab itemKey="unitConversion">Unit Conversion</CTab>
                <CTab itemKey="office">Office</CTab>
              </CTabList>
              <CTabContent>
                <CTabPanel class="p-3" itemKey="general">
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
                  </CForm>
                </CTabPanel>
                <CTabPanel class="p-3" itemKey="unitConversion"> Profile tab content </CTabPanel>
                <CTabPanel class="p-3" itemKey="office">
                  <CForm @submit.prevent="save">
                    <div class="mb-3">
                      <CFormLabel for="exampleFormControlInput1" class="me-3">Office</CFormLabel>
                      <CFormCheck
                        id="checkboxOffice1"
                        inline
                        type="radio"
                        name="inlineRadioOptionsIsOffice"
                        value="1"
                        label="Yes"
                        v-model="form.is_office"
                      />
                      <CFormCheck
                        id="checkboxOffice2"
                        inline
                        type="radio"
                        name="inlineRadioOptionsIsOffice"
                        value="0"
                        label="No"
                        v-model="form.is_office"
                      />
                    </div>
                    <div class="mb-3">
                      <CFormLabel for="exampleFormControlInput1">Type Office</CFormLabel>
                      <multiselect
                        v-model="selectedOfficeType"
                        :options="officeTypeOptions || []"
                        :multiple="false"
                        :track-by="'name'"
                        label="name"
                        placeholder="Pick some options"
                        :close-on-select="true"
                      />
                    </div>
                    <div class="mb-3">
                      <CFormLabel for="exampleFormControlInput1">Product Code</CFormLabel>
                      <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.productCode" />
                    </div>
                    <div class="mb-3">
                      <CFormLabel for="exampleFormControlInput1" class="me-3">Contol Item</CFormLabel>
                      <CFormCheck
                        id="checkboxControlItem1"
                        inline
                        type="radio"
                        name="inlineRadioOptionsControlItem"
                        value="1"
                        label="Yes"
                        v-model="form.control_item"
                      />
                      <CFormCheck
                        id="checkboxControlItem2"
                        inline
                        type="radio"
                        name="inlineRadioOptionsControlItem"
                        value="0"
                        label="No"
                        v-model="form.control_item"
                      />
                    </div>
                    <div class="mb-3">
                      <CFormLabel for="exampleFormControlInput1">Remark</CFormLabel>
                      <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.remark" />
                    </div>
                    <div class="mb-3">
                      <CFormLabel for="exampleFormControlInput1">Minimum Stock</CFormLabel>
                      <CInputGroup class="mb-3">
                        <CFormInput id="exampleFormControlInput1" type="text" placeholder="" v-model="form.minimum_stock" style="text-align:right" />
                      </CInputGroup>
                    </div>
                    <div class="custom-flex-container">
                      <div class="custom-flex-item">
                        <Button label="Add Item Part" @click="modalItemPart = true" />

                        <ItemPartDialog
                          :modalItemPart="modalItemPart"
                          :itemPartList="itemPartList"
                          :filters="filters"
                          :selectedItemPart="selectedItemPart"
                          :lazyParams="lazyParams"
                          :loading="loading"
                          :pagination="pagination"
                          selectionMode="multiple"
                          @update:modalItemPart="modalItemPart = $event"
                          @update:filters="filters = $event"
                          @update:selectedItemPart="selectedItemPart = $event"
                          @update:lazyParams="lazyParams = $event"
                          @choose="handleChoose"
                        />

                        <!-- DataTable untuk item yang dipilih -->
                        <div class="table-container">
                          <DataTable
                            :value="selectedItemPart"
                            class="fixed-column-table"
                            :scrollable="true">
                            <Column field="product_code" header="Product No." class="col-product-no"></Column>
                            <Column field="code" header="Code" class="col-code"></Column>
                            <Column field="name" header="Name" class="col-name">
                              <template #body="{ data }">
                                <span class="text-truncate" :title="data.name">
                                  {{ data.name.length > 20 ? data.name.substring(0, 20) + '...' : data.name }}
                                </span>
                              </template>
                            </Column>
                            <Column field="unit" header="Unit" class="col-unit"></Column>
                          </DataTable>
                        </div>
                      </div>

                      <!-- Duplikat untuk item kedua jika diperlukan -->
                      <div class="custom-flex-item">
                        <!-- Sama seperti di atas -->
                        <Button label="Add Product Code" @click="modalProductCode = true" />

                        <!-- Dialog dengan ukuran yang lebih compact -->
                        <Dialog
                          v-model:visible="modalProductCode"
                          modal
                          header="Add Product"
                          :style="{ width: '90%', maxWidth: '1000px' }">

                          <form @submit.prevent="addProduct">
                            <div class="mb-3">
                              <label for="product_no" class="me-3">Product No.</label>
                              <InputText id="product_no" v-model="newProduct.product_code" />
                            </div>

                            <div class="mb-3">
                              <label for="unit_code" class="me-3">Unit Code</label>
                              <InputText id="unit_code" v-model="newProduct.unit_code" />
                            </div>

                            <div class="mb-3" >
                              <label for="unit_name" class="me-3">Unit Name</label>
                              <InputText id="unit_name" v-model="newProduct.unit_name" />
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
                                        v-model="newProduct.is_active"
                                      />
                                      <CFormCheck
                                        id="checkboxIsactive2"
                                        inline
                                        type="radio"
                                        name="inlineRadioOptionsIsActive"
                                        value="0"
                                        label="No"
                                        v-model="newProduct.is_active"
                                      />
                                    </div>

                            <div class="d-flex justify-center flex-wrap gap-4 mt-3">
                              <Button label="Cancel" severity="secondary" @click="modalProductCode = false" />
                              <Button label="Choose" severity="success" @click="saveProductCode"/>
                            </div>
                          </form>
                        </Dialog>

                        <div class="table-container">
                          <DataTable :value="productCode" dataKey="id">
                            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="width: 25%">
                              <template #body="{ data, field }">
                                {{ data[field] }}
                              </template>
                              <template #editor="{ data, field }">
                                <template>
                                  <InputText v-model="data[field]" autofocus fluid />
                                </template>
                              </template>
                            </Column>

                            <!-- Action Column for Save/Update -->
                            <Column header="Action">
                              <template #body="{ data }">
                                <Button
                                  v-if="data.id"
                                  label="Edit"
                                  icon="pi pi-save"
                                  size="small"
                                  @click="modalEdit = true"
                                />
                                <Dialog
                                  v-model:visible="modalEdit"
                                  modal
                                  header="Add Product"
                                  :style="{ width: '90%', maxWidth: '1000px' }">

                                  <form @submit.prevent="addProduct">
                                    <div class="mb-3">
                                      <label for="product_no" class="me-3">Product No.</label>
                                      <InputText id="product_no"  />
                                    </div>

                                    <div class="mb-3">
                                      <label for="unit_code" class="me-3">Unit Code</label>
                                      <InputText id="unit_code" />
                                    </div>

                                    <div class="mb-3" >
                                      <label for="unit_name" class="me-3">Unit Name</label>
                                      <InputText id="unit_name"  />
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

                                    <div class="d-flex justify-center flex-wrap gap-4 mt-3">
                                      <Button label="Cancel" severity="secondary" @click="modalProductCode = false" />
                                      <Button label="Choose" severity="success" @click="saveProductCode"/>
                                    </div>
                                  </form>
                                </Dialog>
                              </template>
                            </Column>
                          </DataTable>
                        </div>
                      </div>
                    </div>
                  </CForm>
                </CTabPanel>
              </CTabContent>
      </CTabs>
      <div class="mb-3 d-flex justify-content-between">
        <crudButton @revert="revert" @save="save" @back="back" />
        <CButton id="button-addon2" type="button" color="success" @click="post">
          Post
        </CButton>
      </div>
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
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import ToggleButton from 'primevue/togglebutton';
import '@/assets/multiselect-theme.css';
import ItemPartDialog from '@/components/ItemPartDialog.vue';


const form = ref({
  id: null,
  name: '',
  capacity: '',
  std_print: '',
  item_status: '0',
  is_ecommerce: '0',
  product_no: '',
  unit_code: '',
  unit_name: '',
  is_active: '0' // Default to active
})
const modalProductCode = ref(false);
const modalEdit = ref(false);
const modalItemPart = ref(false);
const filters = ref({
  global: { value: null },
});
const loading = ref(false);
const lazyParams = ref({
  page: 1,
  rows: 10,
  search: ''
});
const productCode = ref([]);
const newProduct = ref({
  product_code: '',
  unit_code: '',
  unit_name: '',
  is_active: '1',
});
const addProduct = () => {
  // Menambahkan produk baru ke tabel
  const product = { ...newProduct.value, id: Math.floor(Math.random() * 1000) }; // Menggunakan ID acak
  productCode.value.push(product);
  modalProductCode.value = false;
};

const saveProductCode = async () => {
  const productCodeForm = new FormData()
  productCodeForm.append('product_code', newProduct.value.product_code)
  productCodeForm.append('item_code_unit', newProduct.value.unit_code)
  productCodeForm.append('item_name_unit', newProduct.value.unit_name)
  productCodeForm.append('is_active', newProduct.value.is_active)
  console.log(productCodeForm.value)
  try {
    let response
    response = await axios.post(`/api/master/item/saveProductCode/${form.value.id}`, productCodeForm, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    Swal.fire({
              position: "top-end",
              title: 'Berhasil',
              text: 'Product Code berhasil dibuat',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
    });
    modalProductCode.value = false;
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

const columns = [
  { field: 'product_code', header: 'Product No.' },
  { field: 'unit_code', header: 'Unit Code' },
  { field: 'unit_name', header: 'Unit Name' },
];

const onPage = (event) => {
  lazyParams.value = {
    ...lazyParams.value,
    page: event.page + 1,
    rows: event.rows
  };
  loadData();
};

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
    await fetchItemPart(lazyParams.value.page, lazyParams.value.search);
  } finally {
    loading.value = false;
  }
};
const updateSelectedItemPart = (newSelectedItemPart) => {
  console.log(newSelectedItemPart);
  selectedItemPart.value = newSelectedItemPart;
}
const handleChoose = () => {
  if (selectedItemPart.value && selectedItemPart.value.length > 0) {
    // Here you can process the selected items
    console.log('Selected items:', selectedItemPart.value);

    // Update your form or other data as needed
    // For example:
    form.value.office_part_code = selectedItemPart.value[0].code;

    // Close the dialog
    modalItemPart.value = false;
  } else {
    // Show error if no items selected
    Swal.fire({
      title: 'Warning',
      text: 'Please select at least one item',
      icon: 'warning'
    });
  }
};

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
  { value: 0, name: 'Non PPN' },
];
const selectedPPN = ref(null);
const fromUnitOptions = ref([]);
const selectedFromUnit = ref(null);
const convertOptions = ref([]);
const selectedConvert = ref(null);
const officeTypeOptions = [
  { value: 1, name: 'Unit' },
  { value: 2, name: 'Part' },
  { value: 3, name: 'Consumable' },
  { value: 4, name: 'Optional' },
];
const selectedOfficeType = ref(null);

const itemPartList = ref([]);
const selectedItemPart = ref();
const filterText = ref('');
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});
const token = localStorage.getItem("token");

const mapItemPart = (item) => {
  return {
    id: item.id,
    product_code: item.product_code,  // Menyesuaikan dengan field 'Product No.' di tabel
    code: item.item_code,             // Menyesuaikan dengan field 'Item Code' di tabel
    name: item.item_name,             // Menyesuaikan dengan field 'Name' di tabel
    unit: item.item_unit              // Menyesuaikan dengan field 'Unit' di tabel
  };
};

const fetchItemPart = async (pageNumber = 1, keywords = '') => {
  try {
    const response = await axios.get(`/api/master/item/posteds`, {
      params: {
        page: pageNumber,
        search: keywords,
        per_page: lazyParams.value.rows
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    itemPartList.value = response.data.data.data;
    pagination.currentPage = response.data.data.current_page;
    pagination.perPage = response.data.data.per_page;
    pagination.total = response.data.data.total;
  } catch (err) {
    console.error('Error fetching data:', err);
  }
};

watch(modalItemPart, (newValue) => {
  if (newValue) {
    // Reset parameters and load initial data when dialog opens
    lazyParams.value = {
      page: 1,
      rows: 10,
      search: ''
    };
    filters.value = {
      global: { value: null }
    };
    loadData();
  }
});

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

const fetchCurrentGroup = async () => {
  try {
    const response = await axios.get(`/api/master/item_group/all`)
    const groups = response.data.data
    itemGroupOptions.value = groups.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching Item Group List: ', error)
  }
}

const fetchCurrentSub = async () => {
  try {
    const response = await axios.get(`/api/master/subcategory/all`)
    const subs = response.data.data
    itemSubOptions.value = subs.map(item => ({
      value: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item subgroup list:', error)
  }
}

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/item/${id}`)
    const item = response.data.data
    form.value = { ...item, is_active: item.is_active === 1 ? '1' : '0', is_ecommerce: item.is_ecommerce === 1 ? '1' : '0', is_office: item.is_office === 1 ? '1' : '0',  item_status: item.item_status === 1 ? '1' : '0', control_item: item.control_item === 1 ? '1' : '0', productCode: item.product_code}
    selectedItemSup.value = item_sup_options.value.find(option => option.value === item.itemgroup_id);
    if (item.itemgroup_id) {
      await fetchItemGroup(item.itemgroup_id);
      selectedItemGroup.value = itemGroupOptions.value.find(option => option.value === item.itemcategory_id);
    }
    if (item.itemcategory_id) {
      await fetchItemSubgroup(item.itemcategory_id);
      selectedItemSub.value = itemSubOptions.value.find(option => option.value === item.subcategory_id);
    }
    selectedUnit.value = unitOptions.value.find(option => option.id === item.unit_id);
    selectedType.value = typeOptions.find(option => option.value === item.item_class);
    selectedMasaItem.value = masaItemOptions.find(option => option.value === item.masa_item);
    selectedPPN.value = PPNOptions.find(option => option.value === item.item_sales_tax);
    selectedItemCat.value = itemCatOptions.value.find(option => option.value === item.item_subcategory_id);
    selectedOfficeType.value = officeTypeOptions.find(option => option.value === item.type_item_office);
    if (item.office_part_items && Array.isArray(item.office_part_items)) {
      // Pemetaan data dari office_part_items
      const mappedItemParts = item.office_part_items.map(itemPart => ({
        product_code: itemPart.product_code,
        code: itemPart.item_code,
        name: itemPart.item_name,
        unit: itemPart.item_unit,
      }));

      // Menyimpan hasil pemetaan di selectedItemPart
      selectedItemPart.value = mappedItemParts;
    } else {
      selectedItemPart.value = []; // Jika data tidak ada atau tidak berupa array
    }

    const response_product_code = await axios.get(`/api/master/item/getProductCode/${item.id}`);
    const product_code = response_product_code.data.data;
    productCode.value = product_code;

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

  formData.append('_method', 'PUT');

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
  formData.append('is_office', form.value.is_office);
  formData.append('type_item_office', selectedOfficeType.value ? selectedOfficeType.value.value : null);
  formData.append('control_item', form.value.control_item);
  formData.append('product_code', form.value.productCode);
  formData.append('remark', form.value.remark);
  formData.append('minimum_stock', form.value.minimum_stock);

  try {
    let response
      // Edit existing company
      response = await axios.post(`/api/master/item/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      let officeResponse
      officeResponse = await axios.post(`/api/master/item/postOfficePart/${form.value.id}/${form.value.office_part_code}`)
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Item berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    router.push('/master/item')
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

const post = async () => {
  const postFormData = new FormData()

  postFormData.append('_method', 'PUT');

  try {
    save();
    let response
      // Edit existing company
      response = await axios.post(`/api/master/item/post/${form.value.id}`, postFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Item berhasil diposting',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    router.push('/master/item')
  } catch (error) {
    console.error('Error saving item:', error)
  }
}


// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchItemSuperGroup();
  fetchUnit();
  fetchItemCategory();
  fetchData(route.params.id);
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Item' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.selected-items-table {
  width: 100% !important;
  min-width: 0 !important; /* Override min-width yang ditentukan */
}

/* Kontainer pembungkus untuk scroll horizontal jika diperlukan */
.table-container {
  width: 100%;
  overflow-x: auto;
}

/* Mengatur flex container dengan lebih baik */
.custom-flex-container {
  display: flex;
  flex-direction: column; /* Default mobile: tampilkan sebagai kolom */
  width: 100%;
  gap: 1rem;
}

/* Item dalam flex container */
.custom-flex-item {
  width: 100%;
}

/* Media query untuk layar lebih besar */
@media (min-width: 992px) {
  .custom-flex-container {
    flex-direction: row; /* Pada layar lebih besar, tampilkan sebagai baris */
  }

  .custom-flex-item {
    flex: 0 0 calc(50% - 0.5rem); /* Tetapkan ukuran tetap untuk setiap item */
    max-width: calc(50% - 0.5rem);
  }
}

/* CSS khusus untuk PrimeVue DataTable */
.compact-dialog-table {
  /* Pengaturan ukuran untuk tabel dalam dialog */
  font-size: 0.875rem;
}

.compact-dialog-table .p-datatable-wrapper {
  /* Batasi tinggi tabel dalam dialog untuk menghindari scroll berlebihan */
  max-height: 450px;
}

.compact-dialog-table .p-datatable-header {
  padding: 0.5rem 1rem;
}

.compact-dialog-table .p-datatable-thead > tr > th {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.compact-dialog-table .p-datatable-tbody > tr > td {
  padding: 0.5rem;
}

/* Ukuran kolom tetap untuk semua tabel */
.fixed-column-table {
  table-layout: fixed;
  width: 100%;
}

.fixed-column-table .p-column-title,
.fixed-column-table .p-column-header-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Lebar kolom yang tetap */
.col-product-no {
  width: 120px;
}

.col-code {
  width: 120px;
}

.col-name {
  width: 200px;
}

.col-unit {
  width: 80px;
}

/* Text ellipsis untuk sel dengan teks panjang */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

/* Class untuk layout flex container */
.custom-flex-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}

@media (min-width: 992px) {
  .custom-flex-container {
    flex-direction: row;
  }

  .custom-flex-item {
    flex: 0 0 calc(50% - 0.5rem);
    max-width: calc(50% - 0.5rem);
    min-width: 0;
  }
}
</style>
