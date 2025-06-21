<template>
  <div class="d-flex justify-content-between gap-2">
    <CButton color="danger" @click="$emit('revert')">
        Revert
    </CButton>
    <div class="d-flex gap-2">
      <CButton color="secondary" @click="$emit('back')">
            Back
      </CButton>
      <CButton color="success" @click="$emit('save')">
            Save
      </CButton>
    </div>
  </div>
</template>
