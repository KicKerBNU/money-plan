<template>
  <RouterView />
  <Toaster />
  <ConfirmModal />
  <PwaUpdatePrompt />
</template>

<script setup lang="ts">
import ConfirmModal from '@/utils/components/ConfirmModal.vue'
import PwaUpdatePrompt from '@/utils/components/PwaUpdatePrompt.vue'
import Toaster from '@/utils/components/Toaster.vue'
</script>
