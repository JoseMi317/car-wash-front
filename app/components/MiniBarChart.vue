<script setup lang="ts">
const props = defineProps<{
  title: string
  bars: Array<{
    label: string
    value: number
  }>
}>()

const maxValue = computed(() => Math.max(1, ...props.bars.map((bar) => bar.value)))
</script>

<template>
  <BaseCard>
    <div class="min-h-32 p-6">
      <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
        {{ title }}
      </p>

      <div class="mt-5 flex h-16 items-end gap-2">
        <div
          v-for="bar in bars"
          :key="bar.label"
          class="flex flex-1 flex-col items-center gap-2"
        >
          <div class="flex h-12 w-full items-end rounded-sm bg-slate-50">
            <div
              class="w-full rounded-sm bg-blue-200"
              :style="{ height: `${Math.max(12, Math.round((bar.value / maxValue) * 100))}%` }"
            />
          </div>
          <span class="text-[10px] font-bold uppercase text-slate-400">
            {{ bar.label }}
          </span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
