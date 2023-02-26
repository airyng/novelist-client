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
            class="sTitle w-100"
            @pointerdown="startDrag"
            @pointerup="stopDrag"
          >
            {{ excerpt(scene.title, 24) }}
          </span>
          <div class="text">
            {{ excerpt(scene.mainText, 55) }}
          </div>
        </div>
        <div>
          <div class="actions">
            <span
              v-for="action in [...scene.actions].sort((a, b) => b.sortIndex - a.sortIndex)"
              :key="action.id"
              class="action mt-1"
            >
              {{ excerpt(action.actionText, 24) }}
            </span>
          </div>
          <div class="buttons" :style="`height: ${transform.buttons.height}px`">
            <div
              class="button"
              :class="{ disabled: isFirstScene(scene.id) }"
              @click="onButtonClick('delete')"
            >
              <v-icon>
                mdi-trash-can-outline
              </v-icon>
            </div>

            <v-spacer />

            <div
              class="button"
              @click="onButtonClick('duplicate')"
            >
              <v-icon size="19px">
                mdi-content-copy
              </v-icon>
            </div>

            <div
              class="button"
              @click="onButtonClick('duplicate-with-transition')"
            >
              <v-icon size="19px">
                mdi-content-duplicate
              </v-icon>
            </div>

            <div class="button" @click="onButtonClick('open')">
              Открыть
            </div>
          </div>
        </div>
      </div>
    </foreignObject>
    <!-- Actions points -->
    <circle
      v-for="action in scene.actions"
      :key="action.id"
      :cx="calcActionPosition(action.id).x"
      :cy="calcActionPosition(action.id).y"
      :r="transform.action.r"
      fill="white"
    />
    <!-- Actions points -->
    <circle
      v-for="item in specialActionsFunctions"
      :key="item.id"
      :cx="item.x"
      :cy="item.y"
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
    <special-action-function-card
      v-for="item in specialActionsFunctions"
      :key="`card_${item.id}`"
      :item="item"
    />
  </g>
</template>

<script>
import { excerpt } from '@/plugins/utils'
import SpecialActionFunctionCard from '@/components/constructor/ScenesNetwork/SpecialActionFunctionCard'

export default {
  components: { SpecialActionFunctionCard },
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
        height: 305,
        title: { x: 15, y: 30 },
        action: { x: 15, y: 30, r: 4 },
        buttons: { height: 35 }
      }
    }
  },
  computed: {
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    sceneDotPosition () {
      return {
        id: this.scene.id,
        x: this.position.x,
        y: this.position.y + (this.transform.height / 2) + this.transform.action.r
      }
    },
    specialActionsFunctions () {
      return this.scene.actions
        // Отфильтровываем функции экшнов (выход и т.п.)
        .filter((action) => {
          if (!action?.to) { return false }
          const searchResult = action?.to?.match?.(/^s[0-9]*/gm) // Проверка на соответствие идентификатора назначения формату
          return !(Array.isArray(searchResult) && searchResult[0].length === action?.to?.length)
        })
        .map((action) => {
          const coords = this.calcActionPosition(action.id)
          return {
            id: `${coords.id}_spec`,
            type: action.to,
            x: coords.x + 50,
            y: coords.y
          }
        })
    },
    scenesPositions () {
      return this.$store.state.constructorStorage.scenesPositions
    }
  },
  mounted () {
    this.emitDotsPositions()
  },
  methods: {
    emitDotsPositions () {
      this.$emit('updateDotsPositions', { sceneId: this.scene.id, action: 'clear' })
      this.$emit('updateDotsPositions', { sceneId: this.scene.id, action: 'add', dots: this.scene.actions.map(action => this.calcActionPosition(action.id)) })
      this.$emit('updateDotsPositions', { sceneId: this.scene.id, action: 'add', dots: [this.sceneDotPosition] })
      this.$emit('updateDotsPositions', { sceneId: this.scene.id, action: 'add', dots: this.specialActionsFunctions })
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
          this.cursorOffset = { x: newCursorPos.x - this.position.x, y: newCursorPos.y - this.position.y }
        }
        newCursorPos.x -= this.cursorOffset.x
        newCursorPos.y -= this.cursorOffset.y

        this.$store.dispatch('constructorStorage/addScenePosition', {
          sceneId: this.scene.id,
          payload: { x: newCursorPos.x, y: newCursorPos.y }
        })
        this.emitDotsPositions()
      } catch (e) {
        this.stopDrag()
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    excerpt (text, length) {
      return excerpt(text, length)
    },
    calcActionPosition (actionId) {
      const action = this.scene.actions.find(a => a.id === actionId)
      return {
        id: `${this.scene.id}_${actionId}`,
        x: this.position.x + this.transform.width,
        y: this.position.y + this.transform.height - this.transform.buttons.height - this.transform.action.y * (action.sortIndex + 1) + this.transform.action.r
      }
    },
    onButtonClick (type) {
      this.$emit('buttonClick', { type, sceneId: this.scene.id })
    },
    /**
     * Проверяем является ли переданная сцена(id) первой (стартовой)
     * @param {Number} sceneID Идентификатор сцены
     * @returns {Boolean}
     */
    isFirstScene (sceneID) {
      const index = this.scenes.findIndex(item => item.id === sceneID)
      return index === 0
    }
  }
}
</script>

<style lang="sass">
.sceneCard
  background: rgba(0, 0, 0, .7)
  // border: 2px solid rgba(255, 255, 255, .7)
  border-radius: 12px
  overflow: hidden
  display: flex
  flex-direction: column
  justify-content: space-between
  cursor: default
  & .sTitle
    font-size: 20px
    color: white
    background: rgba(255, 255, 255, .1)
    width: 100%
    padding: 10px
    cursor: grab
    white-space: nowrap
    text-overflow: ellipsis
    overflow-x: hidden
    &:hover
      background: rgba(255, 255, 255, .2)
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
  & .buttons
    width: 100%
    border-top: 1px solid rgba(255, 255, 255, .5)
    display: flex
    align-items: center
    justify-content: flex-end
    transition: opacity .1s ease
    & .button
      padding: 5px
      border-left: 1px solid rgba(255, 255, 255, .5)
      cursor: pointer
      &:first-child
        border-left: none
        border-right: 1px solid rgba(255, 255, 255, .5)
      &:hover
        background-color: rgba(255, 255, 255, .1)
</style>
