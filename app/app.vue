<script setup lang="ts">
const {
  current,
  history,
  loading,
  error,
  listenCurrentState,
  listenHistory
} = useCarWash()

const now = ref(Date.now())
let clockInterval: ReturnType<typeof setInterval> | undefined
let unsubscribeCurrent: (() => void) | undefined
let unsubscribeHistory: (() => void) | undefined

const statusLabels = {
  wait: 'En espera',
  washing: 'Lavando',
  finished: 'Finalizado',
  error: 'Error'
}

const phaseLabels = {
  wait: 'Sin proceso activo',
  'pre-wash': 'Prelavado',
  soap: 'Jabon',
  brushes: 'Cepillado',
  rinse: 'Enjuague',
  drying: 'Secado'
}

const currentTime = computed(() => {
  return new Intl.DateTimeFormat('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(now.value))
})

const lastUpdated = computed(() => {
  if (!current.value.updatedAt) return '--'

  return new Intl.DateTimeFormat('es-GT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(current.value.updatedAt))
})

const isConnected = computed(() => {
  if (error.value || !current.value.updatedAt) return false
  return now.value - current.value.updatedAt < 45_000
})

const cycleTime = computed(() => {
  const seconds = Math.max(0, current.value.cycleTimeSeconds)
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60

  if (!minutes) return `${remainder}s`
  return `${minutes}m ${remainder}s`
})

const cyclesToday = computed(() => {
  const start = new Date(now.value)
  start.setHours(0, 0, 0, 0)

  return history.value.filter((item) => (item.createdAt ?? 0) >= start.getTime()).length
})

const washesByDay = computed(() => {
  const labels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'] as const

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now.value)
    day.setDate(day.getDate() - 6 + index)

    const start = new Date(day)
    start.setHours(0, 0, 0, 0)

    const end = new Date(day)
    end.setHours(23, 59, 59, 999)

    return {
      label: labels[day.getDay()]!,
      value: history.value.filter((item) => {
        const createdAt = item.createdAt ?? 0
        return createdAt >= start.getTime() && createdAt <= end.getTime()
      }).length
    }
  })
})

const latestHistory = computed(() => history.value.slice(0, 8))

onMounted(() => {
  unsubscribeCurrent = listenCurrentState()
  unsubscribeHistory = listenHistory()
  clockInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  unsubscribeCurrent?.()
  unsubscribeHistory?.()

  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-950">
    <DashboardHeader
      :connected="isConnected"
      :loading="loading"
      :current-time="currentTime"
    />

    <main class="mx-auto grid max-w-7xl gap-5 px-6 py-6">
      <div
        v-if="error"
        class="rounded-lg border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700"
      >
        Firebase error: {{ error }}
      </div>

      <section class="grid gap-5 lg:grid-cols-3">
        <MetricCard
          title="Vehiculos atendidos"
          :value="current.vehiclesServed"
          subtitle="Total registrado"
          mark="CAR"
          tone="blue"
        />

        <MetricCard
          title="Tiempo de ciclo"
          :value="cycleTime"
          subtitle="Duracion actual"
          mark="SEC"
          tone="emerald"
        />

        <MiniBarChart
          title="Lavados por dia"
          :bars="washesByDay"
        />
      </section>

      <section class="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <WashTunnel
          :phase="current.phase"
          :progress="current.progress"
          :actuators="current.actuators"
        />

        <SystemStatusCard
          :status="current.status"
          :status-label="statusLabels[current.status]"
          :phase-label="phaseLabels[current.phase]"
          :vehicles-served="current.vehiclesServed"
          :cycles-today="cyclesToday"
          :cycle-time="cycleTime"
          :last-updated="lastUpdated"
          :error-message="current.error"
        />
      </section>

      <HistoryTable :items="latestHistory" />
    </main>
  </div>
</template>
