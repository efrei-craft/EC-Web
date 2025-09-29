<template>
  <div class="bg-white">
    <main>
      <!-- Hero section -->
      <div class="relative isolate overflow-hidden bg-gray-900 pb-16 pt-14 sm:pb-20">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl min-h-[80vh] flex flex-col justify-center items-center text-center">
            <div class="text-center">
              <div class="flex flex-col items-center justify-center">
          <img src="/src/assets/images/ec_logo.png" class="h-32 w-auto mb-4" alt="Logo de l'EFREI CRAFT">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">Le club Minecraft de l'EFREI.</h1>
              </div>
              <p class="mt-6 text-lg leading-8 text-gray-300">Nous sommes un club de l'EFREI dédié au jeu Minecraft (Bedrock & Java). Nous organisons des événements, des tournois et bien plus encore. Rejoignez-nous!</p>
              <div class="mt-10 flex items-center justify-center gap-x-6">
          <a href="https://discord.gg/f2uDScHZaN" class="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 flex items-center">
              <img src="/src/assets/svgs/discord-icon.svg" class="w-5 h-5 mr-2 text-white" alt="Discord">
              <span>Lien Discord</span>
          </a>
          <div class="relative inline-block text-left">
              <button @click="isServerDropdownOpen = !isServerDropdownOpen" type="button" class="rounded-md bg-indigo-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 flex items-center">
                <span class="pr-2">IP:</span>
                <span class="mr-1.5 font-mono bg-indigo-950 px-2 py-0.5 rounded">{{ selectedServer.ip }}</span>
                <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>

              <div v-if="isServerDropdownOpen" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div class="py-1">
                <a v-for="server in servers" :key="server.name"
               @click="selectServer(server); isServerDropdownOpen = false"
               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
               :class="{ 'bg-gray-100': server.name === selectedServer.name }">
              {{ server.name }}
                </a>
            </div>
              </div>
          </div>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isServerDropdownOpen = ref(false)

const servers = [
  { name: 'Minijeux & Vanilla', ip: 'efrei-craft.fr' },
  { name: 'Moddé', ip: 'modded.efrei-craft.fr' },
  { name: 'GTNH', ip: 'gtnh.efrei-craft.fr' },
]

const selectedServer = ref(servers[0])

const selectServer = (server: any) => {
  selectedServer.value = server
}


</script>