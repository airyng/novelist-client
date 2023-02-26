<template>
  <svg
    ref="svg"
    v-pointerup-outside="stopDrag"
    :viewBox="`${viewBoxPosition.x} ${viewBoxPosition.y} ${900 * scale} ${900 * scale}`"
    class="noselect"
    style="buffered-rendering: dynamic;"
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
import { checkIsActionId } from '@/plugins/utils'

const scrollSpeed = 500
let cursorOffset = null

export default {
  components: { SceneCard },
  mixins: [svgHelper],
  beforeRouteLeave () {
    this.$store.dispatch('constructorStorage/updateAllScenes', [])
  },
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
    // Этот вотчер необходим чтобы обновлять линии
    // после неочевидных изменений через сторедж, вроде удаления сцен
    linesRenderKey () {
      // Находим точки с идентификаторами сцен, которых уже нет и удаляем их
      Object.keys(this.dotsPositions)
        .forEach((key) => {
          const sceneId = key.split('_')[0]
          const sceneIndex = this.scenes.findIndex(scene => scene.id === sceneId)
          if (sceneIndex < 0) {
            delete this.dotsPositions[key]
          }
        })
      // Генерируем линии заново
      this.lines = {}
      this.updateLines()
    },
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
        this.updateLines(linesToUpdate)
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
    updateLines (ids = []) {
      this.scenes.forEach((scene) => {
        scene.actions
          .filter((action) => {
            const from = `${scene.id}_${action.id}`
            const to = checkIsActionId(action.to) ? action.to : `${from}_spec`
            return this.dotsPositions[from] && this.dotsPositions[to]
          })
          .forEach((action) => {
            const from = `${scene.id}_${action.id}`
            const to = checkIsActionId(action.to) ? action.to : `${from}_spec`
            const key = `${from}_${to}`
            if (!this.lines[key]) {
              this.lines[key] = {
                key,
                path: this.calcLinePath({ from, to })
              }
            }
            if (ids.includes(from) || ids.includes(to)) {
              this.lines[key].path = this.calcLinePath({ from, to })
            }
          })
      })
    },
    calcLinePath (line) {
      const from = this.dotsPositions[line.from]
      const to = this.dotsPositions[line.to]
      if (!from || !to) { return false }
      return `M ${from.x}, ${from.y}
              C ${from.x + 100}, ${from.y}
                ${to.x - 100}, ${to.y}
                ${to.x}, ${to.y}`
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
