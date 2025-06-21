<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Financial Statement' : 'Create Financial Statement' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3" v-if="!isEdit">
            <CFormLabel for="inputCode">Code*</CFormLabel>
            <multiselect
              v-model="selectedCode"
              :options="codeOptions || []"
              :multiple="false"
              :track-by="'code'"
              label="code"
              placeholder="Pick some options"
              :close-on-select="true"
            />
          </div>
          <div class="mb-3" v-if="isEdit">
            <CFormLabel for="inputFSCode">Code*</CFormLabel>
            <CFormInput id="inputFSCode" type="text" placeholder="" v-model="form.fs_code" disabled/>
          </div>
          <div class="mb-3">
            <CFormLabel for="inputName">Name*</CFormLabel>
            <CFormInput id="inputName" type="text" placeholder="" v-model="form.fs_name" disabled/>
          </div>
          <br/>
          <div class="mb-3">
            <Button label=" + Ledger Account" @click="handleLedgerButtonClick" />
            <div class="table-container mt-3">
              <DataTable :value="ledgerAccounts" class="p-datatable-sm" editMode="cell" @cell-edit-complete="onCellEditComplete">
                <Column header="Ledger Account" style="width: 50px">
                  <template #body="{ data }">
                    <div class="d-flex align-items-center">
                      <span class="me-2">{{ data.code }}</span>
                    </div>
                  </template>
                </Column>
                <Column header="" style="width: 5px">
                  <template #body="{ data, index }">
                    <div class="d-flex align-items-center">
                      <Button icon="pi pi-search"
                              class="p-button-sm p-button-text"
                              @click="openLedgerSearch(data, index)" />
                    </div>
                  </template>
                </Column>
                <Column field="name" header="Account Name" style="width: 100px">
                  <template #body="{ data }">
                    <div class="d-flex align-items-center">
                      <span class="me-2">{{ data.name || '' }}</span>
                    </div>
                  </template>
                  <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="text" />
                  </template>
                </Column>
                <Column field="accountType" header="Account Type" style="width: 50px">
                  <template #body="{ data }">
                    <Dropdown v-model="data.accountType"
                            :options="['Header', 'Empty Header', 'Total', 'Balance', 'Profit & Loss']"
                            class="p-inputtext-sm" />
                  </template>
                </Column>
                <Column field="position" header="Column Position" style="width: 50px">
                  <template #body="{ data }">
                    <Dropdown v-model="data.position"
                            :options="['Left', 'Normal']"
                            class="p-inputtext-sm" />
                  </template>
                </Column>
                <Column header="Balance" style="width: 50px">
                  <template #body="{ data }">
                    <Dropdown v-model="data.balance"
                            :options="['Normal', 'Debit', 'Credit']"
                            class="p-inputtext-sm" />
                  </template>
                </Column>
                <Column field="formula_list" header="Formula List" style="width: 50px">
                  <template #body="{ data }">
                    {{ data.formula_list }}
                  </template>
                  <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="text" />
                  </template>
                </Column>
                <Column field="style_bold" header="Bold" style="width: 50px">
                  <template #body="{ data }">
                    {{ data.style_bold }}
                  </template>
                  <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="text" />
                  </template>
                </Column>
                <Column field="style_underline" header="Underline" style="width: 50px">
                  <template #body="{ data }">
                    {{ data.style_underline }}
                  </template>
                  <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="text" />
                  </template>
                </Column>
                <Column field="style_paragraf" header="Paragraf" style="width: 50px">
                  <template #body="{ data }">
                    {{ data.style_paragraf }}
                  </template>
                  <template #editor="{ data, field }">
                    <InputText v-model="data[field]" type="text" />
                  </template>
                </Column>
                <Column field="show_account" header="Show Account" style="width: 50px">
                  <template #body="{ data }">
                    {{ data.show_account }}
                  </template>
                  <template #editor="{ data, field }">
  <InputText :modelValue="data[field]" @update:modelValue="(val) => data[field] = val" />
</template>
                </Column>
                <Column field="invert_sign" header="Invert Sign" style="width: 50px">
                  <template #body="{ data }">
                    <Checkbox v-model="data.invert_sign" :binary="true" />
                  </template>
                </Column>
                <Column header="Action" style="width: 20px">
                  <template #body="{ index }">
                    <Button icon="pi pi-trash"
                            class="p-button-danger p-button-sm"
                            @click="removeLedgerAccount(index)" />
                  </template>
                </Column>
              </DataTable>
            </div>

            <!-- Add Dialog component for ledger search -->
            <Dialog v-model:visible="ledgerSearchDialog"
                  modal
                  header="Search Ledger Account"
                  :style="{width: '50vw'}">
            <div class="p-fluid">
              <div class="p-field mb-3">
                <span class="p-input-icon-left w-100">
                  <i class="pi pi-search" />
                  <InputText v-model="ledgerSearchText"
                            placeholder="Search"
                            class="w-100" />
                </span>
              </div>
              <DataTable :value="filteredLedgerAccounts"
                        v-model:selection="selectedLedger"
                        selectionMode="single"
                        dataKey="code"
                        :paginator="true"
                        :rows="10"
                        :loading="loading">
                <Column field="ledger_account" header="Code"></Column>
                <Column field="account_name" header="Name"></Column>
                <Column header="Action">
                  <template #body="{ data }">
                    <Button label="Choose"
                            @click="chooseLedger(data)" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </Dialog>
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
import ItemPartDialog from '@/components/ItemPartDialog.vue';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox'


const form = ref({
  id: null,
  description: '',
  fs_id: '',
  fs_code: '',
  fs_name: '',
  type: '',
  category: '',
  is_active: '1' // Default to active
})

const TypeOptions = [
  { value: 1, name: '1' },
  { value: 2, name: '2' },
  { value: 3, name: '3' },
];
const selectedType = ref(null);
const codeOptions = ref([]);
const selectedCode = ref(null);
watch(selectedCode, (newValue) => {
  if (newValue) {
    form.value.fs_id = newValue.value
    form.value.fs_code = newValue.code || ''
    form.value.fs_name = newValue.name || ''
  } else {
    // Reset form values if nothing is selected
    form.value.fs_id = ''
    form.value.fs_code = ''
    form.value.fs_name = ''
  }
})
const filteredLedgerAccounts = ref([]);
const loading = ref(false);
const onCellEditComplete = (event) => {
  event.data[event.field] = event.newValue;

  // Perbarui array secara keseluruhan untuk memaksa reaktivitas
  ledgerAccounts.value = [...ledgerAccounts.value];
  console.log('Data sebelum edit:', event.originalValue);
  console.log('Data setelah edit:', event.newValue);
}

// Add this method to fetch ledger accounts
const fetchLedgerAccounts = async (search = '') => {
  try {
    loading.value = true;
    const response = await axios.get('/api/master/ledger', {
      params: {
        search: search
      }
    });
    filteredLedgerAccounts.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching ledger accounts:', error);
  } finally {
    loading.value = false;
  }
};

const ledgerAccounts = ref([]);
const ledgerSearchDialog = ref(false);
const ledgerSearchText = ref('');
const selectedLedger = ref(null);
const currentEditIndex = ref(null);

// Add methods to handle ledger accounts
const addNewLedgerAccount = () => {
  const newAccount = {
    code: '',
    name: '',
    accountType: '',
    position: 'Left',
    balance: 'Normal',
    formula_list: '',
    style_bold: '',
    style_underline: '',
    style_paragraf: '',
    show_account: '',
    invert_sign: false,
  };
  ledgerAccounts.value = [...ledgerAccounts.value, newAccount];
  console.log('Added new row:', ledgerAccounts.value);
};

const openLedgerSearch = (data, rowIndex) => {
  console.log('Opening search for row:', rowIndex);
  currentEditIndex.value = rowIndex;
  ledgerSearchDialog.value = true;
  fetchLedgerAccounts();
};

const chooseLedger = (ledger) => {
  console.log('Selected ledger:', ledger);
  console.log('Current edit index:', currentEditIndex.value);
  console.log('Current ledgerAccounts:', ledgerAccounts.value);

  const updatedAccounts = [...ledgerAccounts.value];
  updatedAccounts[currentEditIndex.value] = {
    ...updatedAccounts[currentEditIndex.value],
    ledger_id: ledger.id,
    code: ledger.ledger_account,
    name: ledger.account_name,
    accountType: ledger.account_type
  };

  ledgerAccounts.value = updatedAccounts;
  console.log('Updated accounts:', ledgerAccounts.value);

  ledgerSearchDialog.value = false;
  currentEditIndex.value = null;
};

watch(ledgerAccounts, (newVal) => {
  console.log('ledgerAccounts changed deeply', newVal);
}, { deep: true });

// Update the removeLedgerAccount function
const removeLedgerAccount = async (index) => {
  try {
    const rowToDelete = ledgerAccounts.value[index];

    // Check if the row has an ID (exists in database)
    if (rowToDelete.fsr_item_id) {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        // Delete from database
        await axios.delete(`/api/master/financial_statement_row/deleteItem/${rowToDelete.fsr_item_id}`);

        // Remove from frontend array
        ledgerAccounts.value.splice(index, 1);

        // Show success message
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Item deleted successfully',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      // If row doesn't exist in database, just remove from frontend
      ledgerAccounts.value.splice(index, 1);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    // Show error message
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Error deleting item',
      text: error.response?.data?.message || 'Something went wrong!',
      showConfirmButton: false,
      timer: 1500
    });
  }
};

// Update Button click handler
const handleLedgerButtonClick = () => {
  addNewLedgerAccount();
};

// For detecting if we're editing or creating a company
const isEdit = ref(false)

const fetchData = async (id) => {
  try {
    const response = await axios.get(`/api/master/financial_statement_row/${id}`)
    const fsr = response.data.data
    form.value = { ...fsr, fs_id: fsr.financial_statement_id, fs_name: fsr.name, fs_code: fsr.code, is_active: fsr.is_active === 1 ? '1' : '0' }
    if (fsr.financial_statement_row_items && fsr.financial_statement_row_items.length > 0) {
      ledgerAccounts.value = fsr.financial_statement_row_items.map(item => ({
        fsr_item_id: item.id,
        ledger_id: item.ledger_id,
        code: item.ledger_account || '',
        name: item.account_name || '',
        accountType: item.account_type || 'Header',
        position: item.column_position || 'Left',
        balance: item.balance || 'Normal',
        formula_list: item.formula_list || '',
        style_bold: item.style_bold || 0,
        style_underline: item.style_underline || 0,
        style_paragraf: item.style_paragraf || 0,
        show_account: item.show_account || 0,
        invert_sign: item.invert_sign === 1
      }));
    }
  } catch (error) {
    console.error('Error fetching vendor data:', error)
  }
}

const fetchCodeData = async () => {
  try {
    const response = await axios.get(`/api/master/financial_statement/all`)
    const fs = response.data.data
    codeOptions.value = fs.map(item => ({
      value: item.id,
      code: item.code,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching item super group list:', error)
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
  formData.append('code', form.value.fs_code)
  formData.append('name', form.value.fs_name)
  formData.append('fs_id', form.value.fs_id)
  formData.append('type', selectedType.value ? selectedType.value.value : null)
  formData.append('is_active', form.value.is_active)
  formData.append('financial_statement_row_items', JSON.stringify(ledgerAccounts.value))

  try {
    let response
    if (isEdit.value) {
      // Edit existing company
      response = await axios.post(`/api/master/financial_statement_row/update/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Financial Statement berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    } else {
      // Create new company
      response = await axios.post('/api/master/financial_statement_row', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Financial Statement berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
      });
    }
    router.push('/master/financial_statement_row')
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
  fetchCodeData();
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
      description: '',
      type: '',
      category: '',
      is_active: 1
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Financial Statement' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.table-container {
  margin-top: 1rem;
}

:deep(.p-datatable-sm) {
  font-size: 0.875rem;
}

:deep(.p-button-sm) {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

:deep(.p-dropdown-sm) {
  height: 2rem;
  font-size: 0.875rem;
}
</style>
