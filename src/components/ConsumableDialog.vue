<template>
  <Dialog
    :visible="modalConsumable"
    modal
    header="Item Part"
    :style="{ width: '90%', maxWidth: '1000px' }"
    @update:visible="updateModalVisibility"
  >
    <DataTable
      class="compact-dialog-table"
      :filters="filters"
      @update:filters="updateFilters"
      :selection="selectedConsumable"
      @update:selection="updateSelectedConsumable"
      :value="consumableList"
      :lazy="true"
      :paginator="true"
      :rows="lazyParams.rows"
      :loading="loading"
      :totalRecords="pagination.total"
      :rowsPerPageOptions="[10,20,50]"
      :selectionMode="selectionMode"
      @page="onPage"
      dataKey="item_code"
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

      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="product_code" header="Product No." :style="{ width: '120px' }" />
      <Column field="item_code" header="Item Code" :style="{ width: '120px' }" />
      <Column field="item_name" header="Name" :style="{ width: '200px' }">
        <template #body="{ data }">
          <span class="text-truncate" :title="data.item_name">
            {{ data.item_name.length > 25 ? data.item_name.substring(0, 25) + '...' : data.item_name }}
          </span>
        </template>
      </Column>
      <Column field="item_unit" header="Unit" :style="{ width: '80px' }" />
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
    modalConsumable: {
      type: Boolean,
      required: true
    },
    consumableList: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    selectedConsumable: {
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
      this.$emit('update:modalConsumable', false);
    },
    handleChoose() {
      // Emit selected items to parent component
      this.$emit('choose', this.selectedConsumable);
      this.cancel();  // Close the modal after choosing
    },
    updateFilters(newFilters) {
      // Emit updated filters
      this.$emit('update:filters', newFilters);
    },
    updateSelectedConsumable(newSelectedConsumable) {
      // Emit updated selected items
      this.$emit('update:selectedConsumable', newSelectedConsumable);
    },
    updateModalVisibility(newVisibility) {
      // Emit visibility changes
      this.$emit('update:modalConsumable', newVisibility);
    }
  }
};
</script>
