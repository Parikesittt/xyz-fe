<template>
  <CCard class="mb-4">
    <CCardHeader>
      <strong>{{ isEdit ? 'Edit Role' : 'Create Role' }}</strong>
    </CCardHeader>
    <CCardBody>
        <CForm @submit.prevent="save">
          <div class="mb-3">
            <CFormLabel for="inputName">Name*</CFormLabel>
            <CFormInput id="inputName" type="text" placeholder="" v-model="form.name" />
          </div>
          <div class="mb-3">
            <CFormLabel for="inputPermission">Permission*</CFormLabel>
            <DataTable
              :value="paginatedPermissions"
              paginator
              :rows="perPage"
              :totalRecords="filteredPermissions.length"
              :first="(currentPage - 1) * perPage"
              :rowsPerPageOptions="[5, 10, 20, 50]"
              class="p-datatable-striped"
              selectionMode="multiple"
              v-model:selection="selectedPermissions"
            >
              <template #header>
                <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filterText" placeholder="Keyword Search" @change="changeFilter" debounce="300"/>
                    </IconField>
                </div>
            </template>
              <Column selectionMode="multiple" headerStyle="width: 3em" />
              <Column field="name" header="Name" :sortable="true" />

            </DataTable>
          </div>
          <div class="mb-3">
            <crudButton @revert="revert" @save="save" @back="back" />
          </div>
        </CForm>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import crudButton from '@/components/crudButton.vue'
import Swal from 'sweetalert2'
import Multiselect from 'vue-multiselect';
import LocationModal from '@/components/LocationModal.vue';
import '@/assets/multiselect-theme.css';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Column from 'primevue/column';

const form = ref({
  id: null,
  name: '',
});

const permissionList = ref([]);
const allPermissions = ref([])
const selectedPermissions = ref([]);
const filterText = ref('');
const debounceTimeout = ref(null);
const loading = ref(false);
const token = localStorage.getItem("token");

const currentPage = ref(1);
const perPage = ref(10);

const filteredPermissions = computed(() => {
  if (!filterText.value) return allPermissions.value;
  return allPermissions.value.filter(p =>
    p.name.toLowerCase().includes(filterText.value.toLowerCase())
  );
});
const paginatedPermissions = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredPermissions.value.slice(start, start + perPage.value);
});

const totalPages = computed(() =>
  Math.ceil(filteredPermissions.value.length / perPage.value)
)

const fetchPermissionData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage;
  loading.value = true;
  try {
    const response = await axios.get('/api/admin/permission/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    allPermissions.value = response.data.data;
    console.log('Total permissions:', allPermissions.value.length);

    console.log('Role List:', permissionList); // Log to verify the data
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
};

const changeFilter = () => {
  currentPage.value = 1;
  console.log('Filter changed, filtered results:', filteredPermissions.value.length);
};

// Update onPageChange
const onPageChange = (event) => {
  console.log('Page change event:', event);
  currentPage.value = event.page + 1;
};


const location_options = ref([]);
const selectedLocation = ref(null);

// For detecting if we're editing or creating a company
const isEdit = ref(false)

// Get route params (id from URL)
const route = useRoute()
const router = useRouter()

// Fetch company data when editing
const fetchRoleData = async (id) => {
  try {
    const response = await axios.get(`/api/admin/role/${id}`)
    const role = response.data.data
    form.value = { ...role, id: role.id}

    selectedPermissions.value = permissionList.value.filter(permission =>
      role.permissions.some(apiPermission => apiPermission.id === permission.id)
    );

  } catch (error) {
    console.error('Error fetching location data:', error)
  }
}

// Handle form submission (Create or Edit)
const save = async () => {
  const formData = new FormData()
  if(isEdit.value){
    formData.append('_method', 'PUT');
  }
  formData.append('name', form.value.name);
  const permissionNames = selectedPermissions.value.map(p => p.name);
  permissionNames.forEach(name => {
    formData.append('permissions[]', name); // Kirim dalam format array
  });
  try {
    let response
    if (isEdit.value) {
      // Edit existing location
      response = await axios.post(`/api/admin/role/${form.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Role berhasil diperbarui',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log(formData)
    } else {
      // Create new company
      response = await axios.post('/api/admin/role', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      Swal.fire({
                position: "top-end",
                title: 'Berhasil',
                text: 'Role berhasil dibuat',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
      });
      console.log('create')
    }
    router.push('/admin/role') // Redirect to company list page
  } catch (error) {
    console.error('Error saving branch:', error)
  }
}

const handleFileUpload = (event) => {
  form.value.logo = event.target.files[0]
}

// Check if we're in "edit" mode or "create" mode
onMounted(() => {
  fetchPermissionData();
  // fetchLocationData();
  if (route.params.id) {
    isEdit.value = true
    fetchRoleData(route.params.id)
    console.log(route.params.id)
  }
})

// Watch for route changes (in case params change)
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    fetchRoleData(newId)
    console.log(form.value)
  } else {
    isEdit.value = false
    form.value = {
      id: null,
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      logo: null,
      logoUrl: '',
      is_active: '1'
    }
  }
})

const revert = () => {
  console.log('revert clicked');
}

const back = () => {
  router.push({ name: 'Role' });
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
