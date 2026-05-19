<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    subtitle: string
    mark: string
    tone?: 'blue' | 'emerald' | 'amber'
  }>(),
  {
    tone: 'blue'
  }
)

const toneClasses = computed(() => {
  const options = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  }

  return options[props.tone]
})
</script>

<template>
  <BaseCard>
    <div class="flex min-h-32 items-center justify-between gap-6 p-6">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
          {{ title }}
        </p>
        <p class="mt-5 text-4xl font-black tabular-nums text-slate-950">
          {{ value }}
        </p>
        <p class="mt-3 text-sm font-medium text-slate-500">
          {{ subtitle }}
        </p>
      </div>

      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black"
        :class="toneClasses"
      >
        {{ mark }}
      </div>
    </div>
  </BaseCard>
</template>
