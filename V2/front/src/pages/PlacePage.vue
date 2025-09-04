<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'

const gridWidth = 200
const gridHeight = 200
const pixelSize = ref(1)
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const tooltipEl = ref<HTMLDivElement | null>(null)

const isLoading = ref(true)
const coordinates = ref<{ x: number | string; y: number | string }>({ x: 0, y: 0 })

// View (pan/zoom)
const view = ref({
  scale: 1,
  minScale: 1,
  maxScale: 12,
  panX: 0,
  panY: 0
})

const tooltip = ref<{
  visible: boolean
  left: number
  top: number
  xPixel: number
  yPixel: number
  player: string
  last_updated: string | null
}>({
  visible: false,
  left: 0,
  top: 0,
  xPixel: 0,
  yPixel: 0,
  player: '',
  last_updated: null
})

const pixelData = ref<{ color: string; player: string; last_updated: string }[]>([])
const refreshInterval = ref<number | null>(null)

const colorMap: Record<string, string> = {
  RED_WOOL: '#FF0000',
  WHITE_WOOL: '#FFFFFF',
  BLACK_WOOL: '#000000',
  BLUE_WOOL: '#0000FF',
  GREEN_WOOL: '#00FF00',
  YELLOW_WOOL: '#FFFF00',
  ORANGE_WOOL: '#FFA500',
  PURPLE_WOOL: '#800080',
  PINK_WOOL: '#FFC0CB',
  CYAN_WOOL: '#00FFFF',
  LIGHT_GRAY_WOOL: '#D3D3D3',
  GRAY_WOOL: '#808080',
  BROWN_WOOL: '#A52A2A',
  LIME_WOOL: '#00FF00',
  MAGENTA_WOOL: '#FF00FF',
  LIGHT_BLUE_WOOL: '#ADD8E6'
}

onMounted(async () => {
  if (!canvas.value) return
  setupCanvas()
  createPixelData()
  await fetchPixelData()
  render()
  isLoading.value = false
  window.addEventListener('resize', () => { setupCanvas(); render() })

  // Refresh toutes les 10 secondes
  refreshInterval.value = window.setInterval(async () => {
    await fetchPixelData()
    render()
  }, 10000)
})

onUnmounted(() => {
  if (refreshInterval.value !== null) {
    clearInterval(refreshInterval.value)
    refreshInterval.value = null
  }
})

function setupCanvas() {
  if (!canvas.value) return
  const container = canvas.value.parentElement
  if (!container) return

  const availableWidth = container.clientWidth
  const availableHeight = container.clientHeight

  pixelSize.value = Math.max(1, Math.min(
    Math.floor(availableWidth / gridWidth),
    Math.floor(availableHeight / gridHeight)
  ))

  canvas.value.width = gridWidth * pixelSize.value
  canvas.value.height = gridHeight * pixelSize.value
  canvas.value.style.width = `${gridWidth * pixelSize.value}px`
  canvas.value.style.height = `${gridHeight * pixelSize.value}px`

  ctx.value = canvas.value.getContext('2d')

  view.value.scale = 1
  view.value.panX = 0
  view.value.panY = 0
}

function createPixelData() {
  pixelData.value = Array(gridWidth * gridHeight).fill({
    color: '#0f0f23',
    player: '',
    last_updated: ''
  })
}

async function fetchPixelData() {
  try {
    const backendUrl =
      import.meta.env.VITE_PRODUCTION === 'True'
        ? 'https://web-backend.efreicraft.fr/getpixels'
        : 'http://100.121.162.59:44444/getpixels'
    const res = await fetch(backendUrl)
    const data = await res.json()
    data.forEach((p: any) => {
      const x = p.x
      const y = p.z
      if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
        const idx = y * gridWidth + x
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

function drawPixel(x: number, y: number, color: string) {
  if (!ctx.value) return
  ctx.value.fillStyle = color
  ctx.value.fillRect(x * pixelSize.value, y * pixelSize.value, pixelSize.value, pixelSize.value)
}

function render() {
  if (!ctx.value || !canvas.value) return
  const c = canvas.value
  const context = ctx.value

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, c.width, c.height)

  context.setTransform(view.value.scale, 0, 0, view.value.scale, view.value.panX, view.value.panY)
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const idx = y * gridWidth + x
      drawPixel(x, y, pixelData.value[idx].color)
    }
  }
}

function toWorld(e: MouseEvent) {
  const mx = e.offsetX
  const my = e.offsetY
  const worldX = (mx - view.value.panX) / view.value.scale
  const worldY = (my - view.value.panY) / view.value.scale
  return { worldX, worldY }
}

function updateCoordinates(e: MouseEvent) {
  const { worldX, worldY } = toWorld(e)
  const x = Math.floor(worldX / pixelSize.value)
  const y = Math.floor(worldY / pixelSize.value)
  coordinates.value = x >= 0 && x < gridWidth && y >= 0 && y < gridHeight ? { x, y } : { x: '-', y: '-' }
}

function handleMouseMove(e: MouseEvent) {
  updateCoordinates(e)
}

function handleWheel(e: WheelEvent) {
  if (!canvas.value) return
  const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15
  const dir = e.ctrlKey ? 1 / factor : factor

  const mx = e.offsetX
  const my = e.offsetY

  const wx = (mx - view.value.panX) / view.value.scale
  const wy = (my - view.value.panY) / view.value.scale

  let newScale = view.value.scale * dir
  newScale = Math.max(view.value.minScale, Math.min(view.value.maxScale, newScale))

  view.value.panX = mx - wx * newScale
  view.value.panY = my - wy * newScale
  view.value.scale = newScale

  render()
}

async function handleCanvasClick(e: MouseEvent) {
  if (!canvas.value || !containerRef.value) return

  const { worldX, worldY } = toWorld(e)
  const x = Math.floor(worldX / pixelSize.value)
  const y = Math.floor(worldY / pixelSize.value)
  if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return

  const idx = y * gridWidth + x
  const pixel = pixelData.value[idx]

  const canvasRect = canvas.value.getBoundingClientRect()
  const containerRect = containerRef.value.getBoundingClientRect()
  const canvasLeftInContainer = canvasRect.left - containerRect.left
  const canvasTopInContainer = canvasRect.top - containerRect.top

  const pixelCenterXWorld = x * pixelSize.value + pixelSize.value / 2
  const pixelTopYWorld = y * pixelSize.value

  const screenX = canvasLeftInContainer + pixelCenterXWorld * view.value.scale + view.value.panX
  const screenY = canvasTopInContainer + pixelTopYWorld * view.value.scale + view.value.panY

  tooltip.value = {
    visible: true,
    left: screenX,
    top: screenY,
    xPixel: x,
    yPixel: y,
    player: pixel.player || 'Inconnu',
    last_updated: pixel.last_updated || 'N/A'
  }

  await nextTick()
  const el = tooltipEl.value
  if (!el || !containerRef.value) return
  const { width: tw, height: th } = el.getBoundingClientRect()
  const pad = 8
  let left = screenX - tw / 2
  let top = screenY - th - 10
  if (top < pad) top = screenY + 12
  const maxLeft = containerRef.value.getBoundingClientRect().width - tw - pad
  if (left < pad) left = pad
  if (left > maxLeft) left = maxLeft
  tooltip.value.left = Math.round(left)
  tooltip.value.top = Math.round(top)
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center bg-gradient-to-b from-[#0a0a14] to-[#131330] overflow-hidden p-2">
    <div class="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 w-full max-w-[98vw] h-full max-h-[98vh] flex flex-col">
      <div class="text-center p-4 bg-white/5 rounded-t-xl border-b border-white/10">
        <h1 class="text-white text-3xl font-bold bg-gradient-to-r from-[#64ffda] to-[#7c84ff] bg-clip-text text-transparent">Canvas Actuel</h1>
        <h2 class="text-white/80 text-lg mt-2">
          Pour participer à l'évènement, connectez-vous sur le serveur EfreiCraft (efreicraft.fr)
        </h2>
      </div>

      <div ref="containerRef" class="relative flex-1 w-full overflow-hidden">
        <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a14]/90 z-50 text-white text-lg">
          <div class="w-12 h-12 border-4 border-white/30 border-t-[#64ffda] rounded-full mb-3 animate-spin"></div>
          Chargement des pixels...
        </div>

        <div class="canvas-container w-full h-full flex justify-center items-center p-1">
          <canvas
            ref="canvas"
            class="block image-rendering-pixelated bg-[#0f0f23] shadow-lg transition-all duration-300 hover:shadow-[#64ffda]/20"
            @mousemove="handleMouseMove"
            @click="handleCanvasClick"
            @wheel.prevent="handleWheel"
            @contextmenu.prevent
          ></canvas>
        </div>

        <div class="absolute bottom-3 left-3 bg-[#1b1b1b]/80 px-3 py-2 rounded-lg font-mono text-sm text-white backdrop-blur-md border border-white/30 shadow-lg">
          x: {{ coordinates.x }}, y: {{ coordinates.y }}
        </div>

        <div
          v-if="tooltip.visible"
          ref="tooltipEl"
          class="absolute bg-[#1b1b1b]/90 px-4 py-3 rounded-lg font-mono text-sm text-white backdrop-blur-md border border-white/30 shadow-lg z-50 pointer-events-none"
          :style="{ left: tooltip.left + 'px', top: tooltip.top + 'px' }"
        >
          <div class="font-bold text-[#64ffda] mb-1">Pixel: ({{ tooltip.xPixel }}, {{ tooltip.yPixel }})</div>
          <div>Placé par: <span class="text-[#7c84ff]">{{ tooltip.player }}</span></div>
          <div>Mis à jour le: {{ tooltip.last_updated }}</div>
          <div class="absolute w-3 h-3 bg-[#1b1b1b]/90 rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2 border-r border-b border-white/30"></div>
        </div>
      </div>
    </div>
  </div>
</template>
