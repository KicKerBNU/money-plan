<template>
  <RouterView />
  <Toaster />
  <ConfirmModal />
</template>

<script setup lang="ts">
import ConfirmModal from '@/utils/components/ConfirmModal.vue'
import Toaster from '@/utils/components/Toaster.vue'
</script>
