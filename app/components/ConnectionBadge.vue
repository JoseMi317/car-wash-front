<script setup lang="ts">
const props = defineProps<{
  connected: boolean
  loading?: boolean
}>()

const label = computed(() => {
  if (props.loading) return 'Connecting'
  return props.connected ? 'Firebase Live' : 'No recent data'
})
</script>

<template>
  <div
    class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
    :class="connected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
  >
    <span
      class="h-2 w-2 rounded-full"
      :class="connected ? 'bg-emerald-500' : 'bg-amber-500'"
    />
    {{ label }}
  </div>
</template>
