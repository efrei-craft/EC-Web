<template>
    <nav class="bg-gray-900">
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
                <!-- Logo and Name (left) -->
                <div class="flex-shrink-0 flex items-center">
                    <img class="h-8 w-auto" src="/src/assets/images/ec_logo.png" />
                    <span class="ml-2 text-white font-bold">EFREI CRAFT</span>
                </div>

                <!-- Desktop Navigation (right) -->
                <div class="hidden sm:block">
                    <div class="flex space-x-4">

                        <!-- <a href="#" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Accueil</a>
                        <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Joueurs</a> -->

                        <!-- Vertical line -->
                        <div class="h-6 w-0.5 self-center bg-gray-600 mx-2"></div>

                        <!-- <a class="rounded-md px-3 py-2 text-sm font-bold text-white hover:bg-gray-700 hover:text-white ml-4">Joueurs connectés: 10</a> -->
                        <RouterLink to="/place" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Craft / PLACE</RouterLink>
                        <!-- <a href="#" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>  -->
                    </div>
                </div>

                <!-- Mobile menu button -->
                <button @click="mobileMenuOpen = !mobileMenuOpen" class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
                    <span class="sr-only">Open main menu</span>
                    <Bars3Icon v-if="!mobileMenuOpen" class="block h-6 w-6" aria-hidden="true" />
                    <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                </button>
            </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="sm:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
                <a href="#" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">Dashboard</a>
                <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
                <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const mobileMenuOpen = ref(false);

import { RouterLink } from 'vue-router';
</script>
