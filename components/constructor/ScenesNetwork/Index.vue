<template>
  <svg
    ref="svg"
    v-pointerup-outside="stopDrag"
    :viewBox="`${viewBoxPosition.x} ${viewBoxPosition.y} ${900 * scale} ${900 * scale}`"
    class="noselect"
    @pointerdown="startDrag"
    @pointerup="stopDrag"
    @pointerleave="stopDrag"
  >
    <g
      v-show="ready"
      :key="linesRenderKey"
    >
      <!-- Lines -->
      <path
        v-for="line in lines"
        :key="line.key"
        :d="line.path"
        style="stroke: white; stroke-width: 2; fill: none;"
      />
      <!-- END - Lines -->
      <scene-card
        v-for="scene in scenes"
        :key="scene.id"
        :scene="scene"
        :transform-coords-func="transformCoordsFunc"
        :position="scenesPositions[scene.id]"
        @updateDotsPositions="onUpdateDotsPositions"
        @pointerdown.native.prevent.stop
        @buttonClick="onSceneButtonClick"
      />
    </g>
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
import svgHelper from '@/mixins/svgHelper'

const scrollSpeed = 500
let cursorOffset = null

export default {
  components: { SceneCard },
  mixins: [svgHelper],
  data () {
    return {
      ready: false,
      scale: 1,
      dotsPositions: {},
      lines: {},
      viewBoxPosition: { x: 0, y: 0 }
    }
  },
  computed: {
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    scenesPositions () {
      return this.$store.state.constructorStorage.scenesPositions
    },
    linesRenderKey () {
      return this.$store.state.constructorStorage.renderKey
    }
  },
  watch: {
    scenes (newVal, oldVal) {
      // Метод сработает только 1 раз после загрузки сцен
      if (oldVal.length > 0) { return }
      // Если ID у сцены еще не установлен, то для сцен необходимо задать дефолтные позиции
      if (
        this.$route.name.startsWith('games-id-edit') ||
        (!this.$route.name.startsWith('games-id-edit') && !Object.keys(this.scenesPositions).length)
      ) {
        // Устанавливаем дефолтные значения позиций сцен
        this.scenes.forEach((scene, index) => {
          if (!this.scenesPositions[scene.id]) {
            this.$store.dispatch('constructorStorage/addScenePosition', {
              sceneId: scene.id,
              payload: { x: 50 + (300 * index), y: 0 }
            })
          }
        })
      }
    }
  },
  async mounted () {
    this.$refs.svg.addEventListener('wheel', this.onWheelEventHandler)
    // Waiting until scenes and dotPositions initilize
    await new Promise((resolve) => {
      setInterval(() => {
        if (this.scenes[0] && Object.keys(this.dotsPositions).length) {
          resolve(true)
        }
      }, 10)
    })
    // Focus on 'Start' scene
    this.focusViewOnScene(this.scenes[0])

    this.ready = true
  },
  beforeDestroy () {
    this.$refs.svg.removeEventListener('wheel', this.onWheelEventHandler)
    this.$store.dispatch('constructorStorage/updateAllScenes', [])
  },
  methods: {
    focusViewOnScene (scene) {
      const sceneCardWidth = 220
      const svgRect = this.$refs.svg?.getBoundingClientRect()
      if (!svgRect) { throw new Error('Main svg element have been not found.') }
      if (!scene) { throw new Error('Missed required argument: \'scene\'.') }
      if (!this.dotsPositions[scene.id]) { throw new Error('Dots positions for given scene have been not initilized.') }

      this.viewBoxPosition.x = this.dotsPositions[scene.id].x - (svgRect.width / 2) + sceneCardWidth
      this.viewBoxPosition.y = this.dotsPositions[scene.id].y - (svgRect.height / 2)

      this.scale = 1
    },
    transformCoordsFunc (x, y) {
      return this.transformCoordinatesGlobToSVG(x, y)
    },
    checkIsActionId (value) {
      if (typeof value !== 'string') { return false }
      const searchResult = value.match?.(/^s[0-9]*/gm) // проверка на соответствие идентификатора назначения формату
      return Array.isArray(searchResult) && searchResult[0].length === value.length
    },
    onWheelEventHandler (event) {
      event.preventDefault()
      this.scale += event.deltaY / scrollSpeed
      // Scale limits
      if (this.scale > 2.5) {
        this.scale = 2.5
        return
      }
      if (this.scale < 0.42) {
        this.scale = 0.42
        return
      }
      // Строки ниже позволяют скейлить относительно центра экрана
      // Без них экран уезжает в сторону начала координат
      this.viewBoxPosition.x -= event.deltaY
      this.viewBoxPosition.y -= event.deltaY
    },
    onUpdateDotsPositions (payload) {
      if (payload.action === 'add') {
        // Добавление точек и линий
        const linesToUpdate = []
        payload.dots.forEach((item) => {
          this.dotsPositions[item.id] = item
          linesToUpdate.push(item.id)
        })
        this.updateLinesById(linesToUpdate)
      } else if (payload.action === 'clear') {
        // Удаление точек и линий
        Object.keys(this.dotsPositions)
          .filter(key => key === payload.sceneId || key.startsWith(`${payload.sceneId}_`))
          .forEach((key) => {
            delete this.dotsPositions[key]
          })
        Object.keys(this.lines)
          .filter(key => key.startsWith(`${payload.sceneId}_`) || key.endsWith(`_${payload.sceneId}`))
          .forEach((key) => {
            delete this.lines[key]
          })
      }
      this.$forceUpdate()
    },
    updateLinesById (ids = []) {
      this.scenes.forEach((scene) => {
        scene.actions
          .filter((action) => {
            const from = `${scene.id}_${action.id}`
            const to = this.checkIsActionId(action.to) ? action.to : `${from}_spec`
            return this.dotsPositions[from] && this.dotsPositions[to]
          })
          .forEach((action) => {
            const from = `${scene.id}_${action.id}`
            const to = this.checkIsActionId(action.to) ? action.to : `${from}_spec`
            if (!this.lines[`${from}_${to}`] || ids.includes(from) || ids.includes(to)) {
              this.lines[`${from}_${to}`] = {
                key: `${this.dotsPositions[from]?.x}_${this.dotsPositions[from]?.y}_${this.dotsPositions[to]?.x}_${this.dotsPositions[to]?.y}`,
                path: this.calcLinePath({ from, to })
              }
            }
          })
      })
    },
    calcLinePath (line) {
      const from = this.dotsPositions[line.from]
      const to = this.dotsPositions[line.to]
      if (!from || !to) { return false }
      return `M ${parseInt(from.x)}, ${parseInt(from.y)}
              C ${parseInt(from.x + 100)}, ${parseInt(from.y)}
                ${parseInt(to.x - 100)}, ${parseInt(to.y)}
                ${parseInt(to.x)}, ${parseInt(to.y)}`
    },
    startDrag () {
      document.addEventListener('pointermove', this.dragHandler)
    },
    stopDrag () {
      document.removeEventListener('pointermove', this.dragHandler)
      cursorOffset = null
    },
    dragHandler (e) {
      try {
        const newCursorPos = this.transformCoordsFunc(e.clientX, e.clientY)
        if (cursorOffset === null) {
          cursorOffset = { x: newCursorPos.x, y: newCursorPos.y }
        }
        newCursorPos.x -= cursorOffset.x
        newCursorPos.y -= cursorOffset.y

        this.viewBoxPosition.x += newCursorPos.x / -2
        this.viewBoxPosition.y += newCursorPos.y / -2
      } catch (e) {
        this.stopDrag()
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    onSceneButtonClick (payload) {
      this.$emit('buttonClick', payload)
    }
  }
}
</script>

<style lang="sass">
svg
  z-index: 1
  cursor: grab
</style>
