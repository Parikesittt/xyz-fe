<template>
  <Dialog
    :visible="modalCustomer"
    modal
    :style="{ width: '90%', maxWidth: '1000px' }"
    @update:visible="updateModalVisibility"
  >
    <DataTable
      class="compact-dialog-table"
      :filters="filters"
      @update:filters="updateFilters"
      :selection="selectedCustomer"
      @update:selection="updateSelectedCustomer"
      :value="customerList"
      :lazy="true"
      :paginator="true"
      :rows="lazyParams.rows"
      :loading="loading"
      :totalRecords="pagination.total"
      :rowsPerPageOptions="[10,20,50]"
      :selectionMode="selectionMode"
      @page="onPage"
      dataKey="id"
      :scrollable="true"
      scrollHeight="450px"
    >
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" @input="onSearch" placeholder="Keyword Search" style="width: 200px" />
          </IconField>
        </div>
      </template>

      <Column selectionMode="single" headerStyle="width: 3rem"></Column>
      <Column field="accountNum" header="Code" :style="{ width: '120px' }" />
      <Column field="name" header="Customer" :style="{ width: '120px' }">
        <template #body="{ data }">
          <span class="text-truncate" :title="data.name">
            {{ data.name.length > 25 ? data.name.substring(0, 25) + '...' : data.name }}
          </span>
        </template>
      </Column>
      <Column field="address" header="Address" :style="{ width: '200px' }"/>
      <Column field="phone" header="Phone" :style="{ width: '200px' }"/>
    </DataTable>

    <div class="d-flex justify-center flex-wrap gap-4 mt-3">
      <Button label="Cancel" severity="secondary" @click="cancel" />
      <Button label="Choose" severity="success" @click="handleChoose" />
    </div>
  </Dialog>
</template>

<script>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import Button from 'primevue/button';
import Swal from 'sweetalert2'


export default {
  name: 'ItemPartDialog',
  components: {
    Dialog,
    DataTable,
    Column,
    InputText,
    InputIcon,
    IconField,
    Button
  },
  props: {
    modalCustomer: {
      type: Boolean,
      required: true
    },
    customerList: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    selectedCustomer: {
      type: Array,
      required: true
    },
    lazyParams: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    selectionMode: {
      type: String,
      default: 'none',
      validator: (value) => ['single', 'multiple', 'none'].includes(value)
    }
  },
  methods: {
    onSearch() {
      // Emit filters updates to parent component
      this.$emit('update:filters', this.filters);
    },
    onPage(event) {
      // Emit lazy params update to parent component (pagination control)
      this.$emit('update:lazyParams', { page: event.page + 1, rows: event.rows });
    },
    cancel() {
      // Emit visibility change to close the modal
      this.$emit('update:modalCustomer', false);
    },
    handleChoose() {
      // Emit selected items to parent component
      this.$emit('choose', this.selectedCustomer);
      this.cancel();  // Close the modal after choosing
    },
    updateFilters(newFilters) {
      // Emit updated filters
      this.$emit('update:filters', newFilters);
    },
    updateSelectedCustomer(newSelectedCustomer) {
      // Emit updated selected items
      this.$emit('update:selectedCustomer', newSelectedCustomer);
    },
    updateModalVisibility(newVisibility) {
      // Emit visibility changes
      this.$emit('update:modalCustomer', newVisibility);
    }
  }
};
</script>
