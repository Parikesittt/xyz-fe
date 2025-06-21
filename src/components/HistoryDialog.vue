<template>
  <Dialog
    :visible="modalHistory"
    modal
    :style="{ width: '90%', maxWidth: '1000px' }"
    @update:visible="updateModalVisibility"
  >
    <h3>History</h3>
    <DataTable
      class="compact-dialog-table"
      :filters="filters"
      @update:filters="updateFilters"
      :value="historyItemList"
      :lazy="true"
      :paginator="true"
      :rows="lazyParams.rows"
      :loading="loading"
      :totalRecords="pagination.total"
      :rowsPerPageOptions="[20,50,100]"
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

      <Column field="date_input" header="Date" :style="{ width: '120px' }" :body="dateBody" />
      <Column field="is_active" header="Status" :style="{ width: '100px' }" >
        <template #body="{ data }">
          {{ {0: 'Waiting', 1: 'Process', 2: 'Done'}[data.is_active] ?? '-' }}
        </template>
      </Column>
      <Column field="incoming_source" header="Incoming*" :style="{ width: '100px' }" >
        <template #body="{ data }">
          {{ {1: 'WALK-IN', 2: 'PICK UP', 3: 'ON-SITE'}[data.incoming_source] ?? '-' }}
        </template>
      </Column>
      <Column field="service_type" header="Service*" :style="{ width: '140px' }" >
        <template #body="{ data }">
          {{ {1: 'SERVICE', 2: 'REPAIR', 3: 'SERVICE & REPAIR'}[data.service_type] ?? '-' }}
        </template>
      </Column>
      <Column field="item_name" header="Item" />
      <Column field="serial_number" header="Serial Number*" :style="{ width: '130px' }"/>
      <Column field="warranty" header="Warranty" :style="{ width: '80px' }" >
        <template #body="{ data }">
          {{ data.warranty == 1 ? 'Yes' : 'No' }}
        </template>
      </Column>
      <Column field="date_warranty" header="Date Warranty" :style="{ width: '120px' }" :body="dateWarrantyBody"/>
      <Column field="technician_name" header="Technician*" :style="{ width: '150px' }"/>
      <Column field="problem" header="Problem*" />
      <Column field="note" header="Note" />
      <!-- Hidden columns can be added if needed -->
    </DataTable>

    <div class="d-flex justify-center flex-wrap gap-4 mt-3">
      <Button label="Cancel" severity="secondary" @click="cancel" />
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import Button from 'primevue/button';

defineProps({
  modalHistory: Boolean,
  historyItemList: Array,
  filters: Object,
  lazyParams: Object,
  loading: Boolean,
  pagination: Object
});

const emit = defineEmits([
  'update:filters',
  'update:lazyParams',
  'update:modalHistory'
]);

function onSearch() {
  emit('update:filters', filters);
}
function onPage(event) {
  emit('update:lazyParams', { page: event.page + 1, rows: event.rows });
}
function cancel() {
  emit('update:modalHistory', false);
}
function updateFilters(newFilters) {
  emit('update:filters', newFilters);
}
function updateModalVisibility(newVisibility) {
  emit('update:modalHistory', newVisibility);
}

// Column Body Templates
function dateBody(row) {
  if (!row.date_input) return '';
  const date = new Date(row.date_input);
  return date.toLocaleDateString('id-ID');
}
function dateWarrantyBody(row) {
  if (!row.date_warranty) return '';
  const date = new Date(row.date_warranty);
  return date.toLocaleDateString('id-ID');
}
function statusBody(row) {
  const map = { 0: 'Waiting', 1: 'Process', 2: 'Done' };
  return map[row.is_active] ?? '-';
}
function incomingBody(row) {
  const map = { 1: 'WALK-IN', 2: 'PICK UP', 3: 'ON-SITE' };
  return map[row.incoming_source] ?? '-';
}
function serviceBody(row) {
  const map = { 1: 'SERVICE', 2: 'REPAIR', 3: 'SERVICE & REPAIR' };
  return map[row.service_type] ?? '-';
}
function warrantyBody(row) {
  return row.warranty == 1 ? 'Yes' : 'No';
}
</script>
