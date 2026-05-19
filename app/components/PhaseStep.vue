<script setup lang="ts">
defineProps<{
  label: string
  active: boolean
  done: boolean
}>()
</script>

<template>
  <div
    class="flex min-h-20 flex-1 flex-col items-center justify-center gap-2 border-r border-slate-200 px-3 text-center last:border-r-0"
    :class="active ? 'bg-blue-50' : done ? 'bg-emerald-50' : 'bg-slate-50'"
  >
    <div
      class="h-3 w-3 rounded-full border-2"
      :class="active ? 'border-blue-600 bg-blue-600' : done ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'"
    />
    <span
      class="text-[11px] font-bold uppercase tracking-wide"
      :class="active ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-400'"
    >
      {{ label }}
    </span>
  </div>
</template>
