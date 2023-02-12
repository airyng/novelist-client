<template>
  <g>
    <foreignObject
      :x="position.x"
      :y="position.y"
      :width="transform.width"
      :height="transform.height"
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        class="sceneCard noselect"
        :style="{ width: `${transform.width}px`, height: `${transform.height}px`}"
      >
        <div class="w-100 d-flex flex-column">
          <span
            v-pointerup-outside="stopDrag"
            class="title w-100"
            @pointerdown="startDrag"
            @pointerup="stopDrag"
          >
            {{ excerpt(scene.title, 24) }}
          </span>
          <div class="text">
            {{ excerpt(scene.mainText, 55) }}
          </div>
        </div>
        <div class="actions">
          <span
            v-for="action in scene.actions"
            :key="action.id"
            class="action mt-1"
          >
            {{ excerpt(action.actionText, 24) }}
          </span>
        </div>
      </div>
    </foreignObject>
    <!-- Actions points -->
    <circle
      v-for="(action, aIndex) in scene.actions"
      :key="aIndex"
      :cx="calcActionPosition(aIndex).x"
      :cy="calcActionPosition(aIndex).y"
      :r="transform.action.r"
      fill="white"
    />
    <!-- Scene point -->
    <circle
      :cx="sceneDotPosition.x"
      :cy="sceneDotPosition.y"
      :r="transform.action.r"
      fill="white"
    />
  </g>
</template>

<script>
import { excerpt } from '@/plugins/utils'

export default {
  props: {
    scene: { type: Object, required: true },
    position: { type: Object, default: () => ({ x: 0, y: 0 }) },
    transformCoordsFunc: { type: Function, required: true }
  },
  data () {
    return {
      cursorOffset: null,
      transform: {
        width: 220,
        height: 280,
        title: { x: 15, y: 30 },
        action: { x: 15, y: 30, r: 4 }
      }
    }
  },
  computed: {
    sceneDotPosition () {
      return {
        id: this.scene.id,
        x: this.position.x,
        y: this.position.y + (this.transform.height / 2) + this.transform.action.r
      }
    }
  },
  mounted () {
    this.$emit('updateDotsPositions', this.scene.actions.map((action, i) => this.calcActionPosition(i)))
    this.$emit('updateDotsPositions', [this.sceneDotPosition])
  },
  methods: {
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
          this.cursorOffset = { x: newCursorPos.x - this.position.x, y: newCursorPos.y - this.position.y }
        }
        newCursorPos.x -= this.cursorOffset.x
        newCursorPos.y -= this.cursorOffset.y

        this.$emit('updateScenePosition', { x: newCursorPos.x, y: newCursorPos.y })
        this.$emit('updateDotsPositions', this.scene.actions.map((action, i) => this.calcActionPosition(i)))
        this.$emit('updateDotsPositions', [this.sceneDotPosition])
      } catch (e) {
        this.stopDrag()
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    excerpt (text, length) {
      return excerpt(text, length)
    },
    calcActionPosition (actionIndex) {
      return {
        id: `${this.scene.id}_${this.scene.actions[actionIndex].id}`,
        x: this.position.x + this.transform.width,
        y: this.position.y + this.transform.height - this.transform.action.y * (actionIndex + 1) + this.transform.action.r
      }
    }
  }
}
</script>

<style lang="sass">
.sceneCard
  background: rgba(0, 0, 0, .7)
  border: 1px solid rgba(255, 255, 255, .7)
  border-radius: 12px
  overflow: hidden
  display: flex
  flex-direction: column
  justify-content: space-between
  cursor: default
  & .title
    font-size: 18px
    color: white
    background: rgba(255, 255, 255, .1)
    width: 100%
    padding: 10px
    cursor: grab
  & .text
    font-size: 16px
    color: white
    width: 100%
    padding: 10px
  & .actions
    padding: 10px
    display: flex
    flex-direction: column
    justify-content: flex-end
    align-items: flex-end
    & .action
      font-size: 14px
      color: white
      background: $purpleColor
      width: fit-content
      white-space: nowrap
      display: block
      padding: 5px 20px 5px 5px
      text-align: right
      border-radius: 12px
      transform: translateX(20px)
</style>
