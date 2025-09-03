<template>
  <div class="max-w-3xl w-full h-[95vh] mx-auto flex items-center justify-center">
    <!-- Canvas Section -->
    <div class="bg-white/5 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-white/10 mt-[50px]">
      <div class="text-center p-7.5">
        <h1 class="text-white text-3xl">Canvas Actuel</h1>
        <h2 class="text-white text-xl mt-2">
          Pour pouvoir participer à l'évènement, merci de vous connecter sur le serveur de EfreiCraft (efreicraft.fr)
        </h2>
      </div>
      <div class="bg-[#0d0d1a] overflow-hidden relative shadow-xl">
        <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a14]/90 z-50 text-white text-lg">
          <div class="w-12 h-12 border-4 border-white/30 border-t-[#64ffda] rounded-full mb-3.75 animate-spin"></div>
          <div>Chargement des pixels...</div>
        </div>
        <canvas
          ref="canvas"
          class="w-full h-auto block bg-[#0f0f23] image-rendering-pixelated"
          :width="gridWidth * pixelSize"
          :height="gridHeight * pixelSize"
          @mousemove="handleMouseMove"
          @click="handleCanvasClick"
          @contextmenu.prevent
        ></canvas>
        <div class="absolute bottom-3.75 left-3.75 bg-[#1b1b1b]/80 px-3 py-2 rounded-lg font-mono text-sm text-white backdrop-blur-md border border-white">
          x: {{ coordinates.x }}, y: {{ coordinates.y }}
        </div>
        <!-- Tooltip -->
        <div
          v-if="tooltip.visible"
          class="absolute bg-[#1b1b1b]/80 px-3 py-2 rounded-lg font-mono text-sm text-white backdrop-blur-md border border-white"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          Pixel Info: ({{ tooltip.xPixel }}, {{ tooltip.yPixel }})
          <br />
          Placé par: {{ tooltip.player }}
          <br />
          Mis à jour le: {{ tooltip.last_updated }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Canvas configuration
const gridWidth = ref(118)
const gridHeight = ref(83)
const pixelSize = ref(8)

// Canvas references
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

// State management
const isLoading = ref(true)
const coordinates = ref<{ x: number | string; y: number | string }>({ x: 0, y: 0 })
const tooltip = ref<{ visible: boolean; x: number; y: number; xPixel: number; yPixel: number; player: string; last_updated: string | null }>({
  visible: false,
  x: 0,
  y: 0,
  xPixel: 0,
  yPixel: 0,
  player: '',
  last_updated: null
})

// Color management
const pixelData = ref<{ color: string; player: string; last_updated: string }[]>([])

// Map Minecraft colors to hex
const colorMap: Record<string, string> = {
  RED_WOOL: '#FF0000',
  WHITE_WOOL: '#FFFFFF',
  red: '#FF0000',
  white: '#FFFFFF',
  // Add more mappings if needed
}

// Initialize the application
onMounted(async () => {
  if (!canvas.value) return
  ctx.value = canvas.value.getContext('2d')
  setupCanvas()
  createPixelData()
  await fetchPixelData()
  render()
  isLoading.value = false
})

// Set up canvas dimensions
function setupCanvas() {
  if (!canvas.value) return
  canvas.value.width = gridWidth.value * pixelSize.value
  canvas.value.height = gridHeight.value * pixelSize.value
}

// Create initial pixel data
function createPixelData() {
  pixelData.value = Array(gridWidth.value * gridHeight.value).fill({
    color: '#0f0f23',
    player: '',
    last_updated: ''
  })
}

// Fetch pixel data from server
async function fetchPixelData() {
  try {
    const res = await fetch('http://100.121.162.59:44444/getpixels')
    const data = await res.json()

    data.forEach((p: any) => {
      const x = p.x
      const y = p.z // Assuming "z" maps to vertical coordinate
      if (x >= 0 && x < gridWidth.value && y >= 0 && y < gridHeight.value) {
        const idx = y * gridWidth.value + x
        pixelData.value[idx] = {
          color: colorMap[p.color] || p.color || '#000000',
          player: p.placed_by,
          last_updated: p.placed_at
        }
      }
    })
  } catch (err) {
    console.error('Error fetching pixels:', err)
  }
}

// Handle mouse move event
function handleMouseMove(e: MouseEvent) {
  updateCoordinates(e)
}

// Handle canvas click event
function handleCanvasClick(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / pixelSize.value)
  const y = Math.floor((e.clientY - rect.top) / pixelSize.value)

  if (x >= 0 && x < gridWidth.value && y >= 0 && y < gridHeight.value) {
    const idx = y * gridWidth.value + x
    const pixel = pixelData.value[idx]
    tooltip.value = {
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      xPixel: x,
      yPixel: y,
      player: pixel.player || 'Inconnu',
      last_updated: pixel.last_updated || 'N/A'
    }
  }
}

// Draw a single pixel
function drawPixel(x: number, y: number, color: string) {
  if (!ctx.value) return
  ctx.value.fillStyle = color
  ctx.value.fillRect(x * pixelSize.value, y * pixelSize.value, pixelSize.value, pixelSize.value)
}

// Update coordinate display
function updateCoordinates(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / pixelSize.value)
  const y = Math.floor((e.clientY - rect.top) / pixelSize.value)
  if (x >= 0 && x < gridWidth.value && y >= 0 && y < gridHeight.value) {
    coordinates.value = { x, y }
  } else {
    coordinates.value = { x: '-', y: '-' }
  }
}

// Render the entire grid
function render() {
  if (!ctx.value || !canvas.value) return
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  for (let y = 0; y < gridHeight.value; y++) {
    for (let x = 0; x < gridWidth.value; x++) {
      const idx = y * gridWidth.value + x
      drawPixel(x, y, pixelData.value[idx].color)
    }
  }
}
</script>
