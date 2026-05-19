<script setup lang="ts">
type Phase = 'wait' | 'pre-wash' | 'soap' | 'brushes' | 'rinse' | 'drying'

const props = defineProps<{
  phase: Phase
  progress: number
  actuators: {
    band: boolean
    water: boolean
    soap: boolean
    brushes: boolean
    drying: boolean
    finish: boolean
  }
}>()

const phases: Array<{ key: Phase, label: string }> = [
  { key: 'pre-wash', label: 'Prelavado' },
  { key: 'soap', label: 'Jabon' },
  { key: 'brushes', label: 'Cepillado' },
  { key: 'rinse', label: 'Enjuague' },
  { key: 'drying', label: 'Secado' }
]

const activeIndex = computed(() => phases.findIndex((item) => item.key === props.phase))

const actuatorItems = computed(() => [
  { label: 'Band', value: props.actuators.band },
  { label: 'Water', value: props.actuators.water },
  { label: 'Soap', value: props.actuators.soap },
  { label: 'Brushes', value: props.actuators.brushes },
  { label: 'Drying', value: props.actuators.drying },
  { label: 'Finish', value: props.actuators.finish }
])
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
        Tunel de lavado
      </p>

      <div class="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <div class="flex min-w-[640px]">
          <PhaseStep
            v-for="(item, index) in phases"
            :key="item.key"
            :label="item.label"
            :active="item.key === phase"
            :done="activeIndex > index"
          />
        </div>
      </div>

      <div class="mt-6">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          <span>Cycle progress</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            class="h-full rounded-full bg-blue-600 transition-all duration-500"
            :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
          />
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="item in actuatorItems"
          :key="item.label"
          class="rounded-lg border px-3 py-4 text-center"
          :class="item.value ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-400'"
        >
          <div
            class="mx-auto h-2.5 w-2.5 rounded-full"
            :class="item.value ? 'bg-emerald-500' : 'bg-slate-300'"
          />
          <p class="mt-2 text-xs font-bold uppercase tracking-wide">
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
