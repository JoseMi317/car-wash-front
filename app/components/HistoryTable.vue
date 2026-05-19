<script setup lang="ts">
import type { CarWashHistoryEvent } from '../composables/useCarWash'

defineProps<{
  items: CarWashHistoryEvent[]
}>()

const formatTime = (value?: number) => {
  if (!value) return '--'

  return new Intl.DateTimeFormat('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value))
}

const eventLabel = (event: CarWashHistoryEvent) => {
  if (event.event === 'demo_state_sent') return 'Demo update'
  return event.event.replaceAll('_', ' ')
}
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
        Historial de lavados
      </p>

      <div class="mt-5 overflow-x-auto">
        <table class="w-full min-w-[680px] text-left">
          <thead>
            <tr class="border-b border-slate-100 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              <th class="py-3 pr-4">#</th>
              <th class="px-4 py-3">Hora</th>
              <th class="px-4 py-3">Evento</th>
              <th class="px-4 py-3">Fase</th>
              <th class="px-4 py-3">Duracion</th>
              <th class="py-3 pl-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="!items.length"
              class="text-center text-sm font-medium text-slate-400"
            >
              <td colspan="6" class="py-8">
                Sin registros aun
              </td>
            </tr>

            <tr
              v-for="(item, index) in items"
              :key="item.id"
              class="border-b border-slate-50 text-sm last:border-b-0"
            >
              <td class="py-4 pr-4 font-bold tabular-nums text-slate-500">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-4 font-medium text-slate-500">
                {{ formatTime(item.createdAt) }}
              </td>
              <td class="px-4 py-4 font-semibold capitalize text-slate-800">
                {{ eventLabel(item) }}
              </td>
              <td class="px-4 py-4 font-medium text-slate-500">
                {{ item.phase || '--' }}
              </td>
              <td class="px-4 py-4 font-medium text-slate-500">
                {{ item.cycleTimeSeconds ? `${item.cycleTimeSeconds}s` : '--' }}
              </td>
              <td class="py-4 pl-4 font-bold capitalize text-slate-800">
                {{ item.status || '--' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </BaseCard>
</template>
