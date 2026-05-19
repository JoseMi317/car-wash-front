<script setup lang="ts">
defineProps<{
  connected: boolean
  loading: boolean
  currentTime: string
}>()
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
      <div class="flex min-w-0 items-center gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-black text-blue-600">
          CW
        </div>
        <div class="min-w-0">
          <h1 class="truncate text-lg font-bold text-slate-950">
            CarWash Dashboard
          </h1>
          <p class="truncate text-xs font-medium text-slate-500">
            Universidad Mariano Galvez - Ing. Mario Fuentes
          </p>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-4">
        <ConnectionBadge :connected="connected" :loading="loading" />
        <time class="hidden text-sm font-medium text-slate-500 sm:block">
          {{ currentTime }}
        </time>
      </div>
    </div>
  </header>
</template>
