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
  <h1 class="text-3xl font-bold underline bg-gray-200 p-4">
    Hello world!
  </h1>
</template>
