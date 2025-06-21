<template>
  <Dialog
    :visible="modalItemCs"
    modal
    :style="{ width: '90%', maxWidth: '1000px' }"
    @update:visible="updateModalVisibility"
  >
    <div class="row g-4">
      <div class="col-md-6" :class="{ disabled: isItemSelected }">
        <h4>Item</h4>
        <DataTable
          class="compact-dialog-table"
          :filters="filtersItem"
          @update:filters="updateFiltersItem"
          :value="itemList"
          :lazy="true"
          :paginator="true"
          :rows="lazyParamsItem.rows"
          :loading="loadingItem"
          :totalRecords="paginationItem.total"
          :rowsPerPageOptions="[10,20,50]"
          :selectionMode="selectionModeItem"
          @page="onPageItem"
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
                <InputText v-model="filtersItem['global'].value" @input="onSearchItem" placeholder="Keyword Search" style="width: 200px" />
              </IconField>
            </div>
          </template>

          <Column header="Action" bodyStyle="text-align:center; width: 120px">
            <template #body="{ data }">
              <Button
                label="Choose"
                class="p-button-sm p-button-success"
                @click="handleChooseItem(data)"
              />
            </template>
          </Column>
          <Column field="item_code" header="Item Code" :style="{ width: '120px' }" />
          <Column field="item_name" header="Item Name" :style="{ width: '200px' }">
            <template #body="{ data }">
              <span class="text-truncate" :title="data.item_name">
                {{ data.item_name && data.item_name.length > 25 ? data.item_name.substring(0, 25) + '...' : data.item_name }}
              </span>
            </template>
          </Column>
          <Column field="item_unit" header="Item Unit" :style="{ width: '120px' }"></Column>
          <Column field="product_code" header="Product No." :style="{ width: '120px' }"></Column>
        </DataTable>
      </div>
      <div class="col-md-6" :class="{ disabled: isItemSelected }">
        <h4>Customer Item</h4>
        <DataTable
          class="compact-dialog-table"
          :filters="filters"
          @update:filters="updateFilters"
          :value="customerItemList"
          :lazy="true"
          :paginator="true"
          :rows="lazyParams.rows"
          :loading="loading"
          :totalRecords="pagination.total"
          :rowsPerPageOptions="[10,20,50]"
          :selectionMode="selectionMode"
          @page="onPage"
          dataKey="item_id"
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

          <Column header="Action" bodyStyle="text-align:center; width: 120px">
            <template #body="{ data }">
              <Button
                label="Choose"
                class="p-button-sm p-button-success"
                @click="handleChooseCustomerItem(data)"
              />
            </template>
          </Column>
          <Column field="item_code" header="Item Code" :style="{ width: '120px' }" />
          <Column field="product_code" header="Product No." :style="{ width: '120px' }"></Column>
          <Column field="serial_number" header="Serial Number" :style="{ width: '120px' }"></Column>
          <Column field="warranty" header="Warranty" :style="{ width: '100px' }">
            <template #body="{ data }">
              {{ data.warranty === 'Yes' ? 'Yes' : 'No' }}
            </template>
          </Column>
          <Column field="date_warranty" header="Date Warranty" :style="{ width: '120px' }"></Column>
        </DataTable>
      </div>
    </div>

    <div class="d-flex justify-center flex-wrap gap-4 mt-3">
      <Button label="Close" @click="$emit('update:modalItemCs', false)" />
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
  name: 'ItemCsDialog',
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
    modalItemCs: {
      type: Boolean,
      required: true
    },
    itemList: { // Ganti dari locationList menjadi itemList
      type: Array,
      required: true
    },
    customerItemList: { // Tambahkan prop baru untuk customer item list
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    filtersItem: {
      type: Object,
      required: true
    },
    selectedItem: {
      type: Object, // Ubah ke Object untuk selectionMode="single"
      required: true
    },
    selectedItemCs: {
      type: Object, // Ubah ke Object untuk selectionMode="single"
      required: true
    },
    lazyParams: {
      type: Object,
      required: true
    },
    lazyParamsItem: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    loadingItem: {
      type: Boolean,
      required: true
    },
    pagination: {
      type: Object,
      required: true
    },
    paginationItem: {
      type: Object,
      required: true
    },
    selectionMode: {
      type: String,
      default: 'single',
      validator: (value) => ['single', 'multiple', 'none'].includes(value)
    },
    selectionModeItem: {
      type: String,
      default: 'single',
      validator: (value) => ['single', 'multiple', 'none'].includes(value)
    }
  },
  methods: {
    onSearch() {
      this.$emit('update:filters', this.filters);
    },
    onSearchItem() {
      this.$emit('update:filtersItem', this.filtersItem);
    },
    onPage(event) {
      this.$emit('update:lazyParams', { page: event.page + 1, rows: event.rows });
    },
    onPageItem(event) {
      this.$emit('update:lazyParamsItem', { page: event.page + 1, rows: event.rows });
    },
    cancel() {
      this.$emit('update:modalItemCs', false); // Sesuaikan ke modalItemCs
    },
    handleChoose() {
      const selected = {
        item: this.selectedItem,
        customerItem: this.selectedItemCs // Tapi ini harus diubah
      };
      // Hanya kirim item yang dipilih dari salah satu tabel
      this.$emit('choose', selected);
      this.cancel();
    },
    updateFilters(newFilters) {
      this.$emit('update:filters', newFilters);
    },
    updateFiltersItem(newFiltersItem) {
      this.$emit('update:filtersItem', newFiltersItem);
    },
    updateSelectedItem(newSelectedItem) {
      this.$emit('update:selectedItem', newSelectedItem);
    },
    updateSelectedItemCs(newSelectedItemCs) {
      this.$emit('update:selectedItemCs', newSelectedItemCs);
    },
    updateModalVisibility(newVisibility) {
      this.$emit('update:modalItemCs', newVisibility); // Sesuaikan ke modalItemCs
    },
    handleChooseItem(item) {
      this.$emit('choose', item)
      this.$emit('update:modalItemCs', false)
    },
    handleChooseCustomerItem(item) {
      this.$emit('choose', item)
      this.$emit('update:modalItemCs', false)
    }
  }
};
</script>

<style scoped>
.compact-dialog-table {
  font-size: 0.9rem;
}
.text-truncate {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
