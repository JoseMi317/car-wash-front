<script setup lang="ts">
const {
  current,
  loading,
  error,
  listenCurrentState,
  sendDemoState
} = useCarWash()

let unsubscribe: (() => void) | undefined

onMounted(() => {
  unsubscribe = listenCurrentState()
})

onBeforeUnmount(() => {
  unsubscribe?.()
})
</script>

<template>
  <main>
    <h1>CarWash Arqui 2026</h1>

    <p v-if="loading">Conectando con Firebase...</p>
    <p v-else-if="error">Error: {{ error }}</p>

    <section v-else>
      <p>Estado: {{ current.status }}</p>
      <p>Fase: {{ current.phase }}</p>
      <p>Progreso: {{ current.progres }}%</p>
      <p>Vehículos atendidos: {{ current.vehiclesServed }}</p>
      <p>Tiempo ciclo: {{ current.cycleTimeSeconds }}s</p>

      <button @click="sendDemoState">
        Enviar dato demo
      </button>
    </section>
  </main>
</template>
