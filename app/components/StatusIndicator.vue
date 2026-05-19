<script setup lang="ts">
const props = defineProps<{
  status: 'wait' | 'washing' | 'finished' | 'error'
}>()

const statusClasses = computed(() => {
  const options = {
    wait: 'border-emerald-200 bg-emerald-500 shadow-emerald-200',
    washing: 'border-blue-200 bg-blue-600 shadow-blue-200',
    finished: 'border-amber-200 bg-amber-500 shadow-amber-200',
    error: 'border-rose-200 bg-rose-600 shadow-rose-200'
  }

  return options[props.status]
})
</script>

<template>
  <span
    class="inline-flex h-8 w-8 rounded-full border-8 shadow-lg"
    :class="statusClasses"
  />
</template>
