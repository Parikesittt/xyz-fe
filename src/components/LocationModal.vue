<template>
  <OverlayLayer
    v-show="value"
    @overlay-click="cancel"
  >

  <!-- Modal Content -->
    <div class="modal-wrapper">
      <CCard>
        <CCardHeader>{{ largeTitle }}</CCardHeader>
        <CCardBody>
          <!-- Search Box -->
          <CInputGroup class="mb-3 searchbar">
            <CFormInput v-model="filterText" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
            <CButton id="button-addon2" type="button" color="primary" @click="changeFilter">
              Search
            </CButton>
          </CInputGroup>

          <!-- Responsive Table -->
          <div class="box mt-3">
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 650px; height: 500px;"
              :rowData="locationList"
              :columnDefs="columnDefs"
              :pagination="true"
              :paginationPageSize="10"
              :modules="[ClientSideRowModelModule]"
              :rowSelection="'multiple'"
              @grid-ready="onGridReady"
              @selection-changed="handleRowSelection"
              @row-clicked="handleRowClick"
            />
          </div>

          <!-- Pagination -->
          <CPagination
            v-model="pagination.currentPage"
            :total-items="pagination.total"
            :items-per-page="pagination.perPage"
            @change="changePage"
          />

          <!-- Buttons for Cancel and Confirm -->
          <div class="flex justify-end mt-4 align-items-between">
            <CButton color="secondary" @click="cancelSelection">Cancel</CButton>
            <CButton color="primary" @click="confirmSelection">Confirm</CButton>
          </div>
      </CCardBody>
      </CCard>
    </div>
  </OverlayLayer>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, reactive } from 'vue'
import { mdiClose } from '@mdi/js'
import OverlayLayer from '@/Components/OverlayLayer.vue'
import axios from 'axios'
import { AgGridVue } from 'ag-grid-vue3'
import { ClientSideRowModelModule } from 'ag-grid-community'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  largeTitle: {
    type: String,
    default: 'Location Modal'
  },
  button: {
    type: String,
    default: 'info'
  },
  hasCancel: {
    type: Boolean,
    default: true
  },
  hasConfirm: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['update:modelValue', 'location-selected', 'cancel'])

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedLocations = ref([]);

const handleRowSelection = () => {
  selectedLocations.value = gridApi.getSelectedRows();
};

const handleRowClick = (event) => {
  const node = event.node; // Accessing the row's node object
  node.setSelected(!node.isSelected()); // Toggle the row's selection state
  handleRowSelection(); // Update the selected locations
};

const confirmSelection = () => {
  emit('location-selected', selectedLocations.value);
  value.value = false;
};

const cancelSelection = () => {
  value.value = false;
  emit('cancel');
};

const locationList = ref([]) // List of companies fetched from API
const filterText = ref('')
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
})

const columnDefs = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 50,
    supressSizeToFit: true,
  },
  {
    field: 'code',
    headerName: 'Code',
    sortable: true,
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'Location',
    sortable: true,
    flex: 1,
  },
];

let gridApi = null;

const onGridReady = (params) => {
  gridApi = params.api;
};

const fetchData = async (pageNumber = 1, keywords = '') => {
  const page = pageNumber ? pageNumber : pagination.currentPage

  try {
    const response = await axios.get(`/api/master/location?search=${keywords}&page=${page}`)
    locationList.value = response.data.data.data
    pagination.currentPage = response.data.data.current_page
    pagination.perPage = response.data.data.per_page
    pagination.total = response.data.data.total
  } catch (err) {
    console.error('Error fetching data:', err)
  }
}

const changePage = (pageNumber) => {
  pagination.currentPage = pageNumber
  fetchData(pagination.currentPage, filterText.value)
}

const changeFilter = () => {
  fetchData(1, filterText.value)
}

const confirmCancel = (mode) => {
  value.value = false
  emit(mode)
}

const confirm = () => {
  confirmCancel('confirm')
}

const cancel = () => {
  confirmCancel('cancel')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Ensuring the modal takes the full screen */
.modal-wrapper {
  position: fixed; /* Ensures the modal is positioned relative to the viewport */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);  /* Semi-transparent black background */
  z-index: 9999;  /* Make sure the modal is above all content */
  overflow: hidden;  /* Ensure the content can be scrolled */
}

.searchbar{
  width: 600px;
}

.ag-theme-alpine {
  width: 100%;
  height: 400px;
}
</style>
