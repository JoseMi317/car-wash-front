<script setup lang="ts">
defineProps<{
  status: 'wait' | 'washing' | 'finished' | 'error'
  statusLabel: string
  phaseLabel: string
  vehiclesServed: number
  cyclesToday: number
  cycleTime: string
  lastUpdated: string
  errorMessage: string | null
}>()
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
        Estado del sistema
      </p>

      <div class="flex min-h-40 flex-col items-center justify-center border-b border-slate-100 py-8 text-center">
        <StatusIndicator :status="status" />
        <p class="mt-5 text-xl font-black text-slate-950">
          {{ statusLabel }}
        </p>
        <p class="mt-1 text-sm font-medium text-slate-500">
          {{ errorMessage || 'System ready' }}
        </p>
      </div>

      <div class="grid gap-5 py-5">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Fase actual
          </p>
          <p class="mt-2 text-lg font-black text-slate-950">
            {{ phaseLabel }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Ciclos hoy
            </p>
            <p class="mt-2 text-2xl font-black tabular-nums text-slate-950">
              {{ cyclesToday }}
            </p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Vehiculos
            </p>
            <p class="mt-2 text-2xl font-black tabular-nums text-slate-950">
              {{ vehiclesServed }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Tiempo
            </p>
            <p class="mt-2 text-base font-black text-slate-950">
              {{ cycleTime }}
            </p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Ultima lectura
            </p>
            <p class="mt-2 text-base font-black text-slate-950">
              {{ lastUpdated }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
