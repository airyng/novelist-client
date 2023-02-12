<template>
  <svg
    ref="svg"
    v-pointerup-outside="stopDrag"
    :viewBox="`${viewBoxPosition.x} ${viewBoxPosition.y} ${900 * scale} ${900 * scale}`"
    @pointerdown="startDrag"
    @pointerup="stopDrag"
    @pointerleave="stopDrag"
  >
    <g :key="linesRenderKey">
      <path
        v-for="(line, index) in lines"
        :key="index"
        :d="calcLinePath(line)"
        style="stroke: white; stroke-width: 2; fill: none;"
      />
    </g>
    <scene-card
      v-for="scene in scenes"
      :key="scene.id"
      :scene="scene"
      :transform-coords-func="transformCoordsFunc"
      :position="scenesPositions[scene.id]"
      @updateScenePosition="onUpdateScenePosition(scene.id, $event)"
      @updateDotsPositions="onUpdatePositions"
      @pointerdown.native.prevent.stop
    />
  </svg>
</template>

<script>
/*
  TODO: Жесты на мобильных телефона не реализованы.
  нужно реализовать:
    свайпы - перемещения
    щипки - зум
*/
import SceneCard from '@/components/constructor/ScenesNetwork/SceneCard'
import svgHellper from '@/mixins/svgHelper'

const scrollSpeed = 500

export default {
  components: { SceneCard },
  mixins: [svgHellper],
  data () {
    return {
      scale: 1,
      dotsPositions: {},
      scenesPositions: {},
      linesRenderKey: 0,
      cursorOffset: null,
      viewBoxPosition: { x: 0, y: 0 }
    }
  },
  computed: {
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    lines () {
      return this.scenes
        .map((scene) => {
          return scene.actions
            .filter((action) => {
              const searchResult = action.to.match(/^s[0-9]*/gm) // проверка на соответствие идентификатора назначения формату
              return Array.isArray(searchResult) && searchResult[0].length === action.to.length
            })
            .map(action => ({
              from: `${scene.id}_${action.id}`,
              to: action.to
            }))
        })
        .flat()
    }
  },
  watch: {
    scenes: {
      deep: true,
      handler () {
        // Устанавливаем дефолтные значения позиций сцен
        this.scenes.forEach((scene, index) => {
          if (!this.scenesPositions[scene.id]) {
            this.scenesPositions[scene.id] = { x: 50 + (300 * index), y: 0 }
          }
        })
        this.linesRenderKey++
      }
    }
  },
  mounted () {
    this.$refs.svg.addEventListener('wheel', this.onWheelEventHandler)
  },
  beforeDestroy () {
    this.$refs.svg.removeEventListener('wheel', this.onWheelEventHandler)
  },
  methods: {
    onWheelEventHandler (event) {
      event.preventDefault()
      this.scale += event.deltaY / scrollSpeed
      // Scale limits
      if (this.scale > 2.5) { this.scale = 2.5 }
      if (this.scale < 0.42) { this.scale = 0.42 }
    },
    onUpdateScenePosition (id, payload) {
      this.scenesPositions[id] = payload
    },
    onUpdatePositions (payload) {
      payload.forEach((item) => {
        this.dotsPositions[item.id] = item
      })
      this.linesRenderKey++
    },
    transformCoordsFunc (x, y) {
      return this.transformCoordinatesGlobToSVG(x, y)
    },
    calcLinePath (line) {
      if (!this.dotsPositions[line.from] || !this.dotsPositions[line.to]) { return false }
      return `M ${this.dotsPositions[line.from].x}, ${this.dotsPositions[line.from].y}
              C ${this.dotsPositions[line.from].x + 100}, ${this.dotsPositions[line.from].y}
                ${this.dotsPositions[line.to].x - 100}, ${this.dotsPositions[line.to].y}
                ${this.dotsPositions[line.to].x}, ${this.dotsPositions[line.to].y}`
    },
    startDrag () {
      document.addEventListener('pointermove', this.dragHandler)
    },
    stopDrag () {
      document.removeEventListener('pointermove', this.dragHandler)
      this.cursorOffset = null
    },
    dragHandler (e) {
      try {
        const newCursorPos = this.transformCoordsFunc(e.clientX, e.clientY)
        if (this.cursorOffset === null) {
          this.cursorOffset = { x: newCursorPos.x, y: newCursorPos.y }
        }
        newCursorPos.x -= this.cursorOffset.x
        newCursorPos.y -= this.cursorOffset.y

        this.viewBoxPosition.x += newCursorPos.x / -2
        this.viewBoxPosition.y += newCursorPos.y / -2
      } catch (e) {
        this.stopDrag()
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
  }
}
</script>

<style lang="sass">
svg
  z-index: 1
  cursor: grab
</style>
