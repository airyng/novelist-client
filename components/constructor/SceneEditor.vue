<template>
  <div v-if="sceneid && scene" class="d-flex flex-column fullsize">
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12">
          <h1 class="d-inline-block py-2 big-white-txt-shadow">
            {{ scene.title }}
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="d-flex flex-column fullsize" style="max-width: 1200px">
      <v-row class="text-blocks">
        <v-col class="d-flex flex-column justify-end" cols="12">
          <v-btn
            v-if="settings.maxActionsLength > scene.actions.length"
            rounded
            fab
            dark
            class="text-center justify-center mb-5"
            title="Добавить действие"
            @click.stop="addAction()"
          >
            <v-icon rounded>
              mdi-plus
            </v-icon>
          </v-btn>
          <div
            v-for="(action, index) in scene.actions"
            :key="index"
            cols="12"
            class="scene-action-col"
          >
            <ConstructorSceneAction
              class="pb-0"
              :action="action"
              :scene="scene"
              @onSave="saveAction"
              @onRemove="removeAction"
              @onOrderChange="changeActionOrder"
            />
          </div>

          <v-textarea
            v-model="scene.mainText"
            class="mainTextBlock"
            name="mainText"
            label="Основной текст"
            filled
            rows="6"
            :counter="settings.mainTextMaxLength"
            background-color="#444"
            dark
            clearable
            no-resize
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { moveArrElem } from '@/plugins/utils'

export default {
  props: {
    sceneid: { type: [Number, Boolean], default: false }
  },
  data () {
    return {
      scene: false
    }
  },
  computed: {
    settings () {
      return this.$store.state.constructorStorage.settings
    }
  },
  mounted () {
    this.getSceneFromStorage()
  },
  methods: {
    getSceneFromStorage () {
      this.scene = { ...this.$store.getters['constructorStorage/getSceneById'](this.sceneid) }
    },
    save (scene) {
      const _scene = scene || this.scene
      this.$store.dispatch('constructorStorage/updateScene', _scene)
      this.getSceneFromStorage()
    },
    // Возможно управление экшнами стоит вынести в отдельный компонент
    // который будет отвечать только за них
    addAction () {
      this.$store.dispatch('constructorStorage/addAction', this.scene)
      this.getSceneFromStorage()
    },
    saveAction (action) {
      this.scene.actions = this.scene.actions.map((element) => {
        if (element.id === action.id) { element = action }
        return element
      })
    },
    removeAction (id) {
      this.scene.actions = this.scene.actions.filter(item => item.id !== id)
      this.$store.dispatch('constructorStorage/updateScene', this.scene)
      this.getSceneFromStorage()
    },
    changeActionOrder (payload) {
      let actionIndex = false
      for (let index = 0; index < this.scene.actions.length; index++) {
        const element = this.scene.actions[index]
        if (element.id === payload.id) {
          actionIndex = index
          break
        }
      }

      if (!actionIndex) { return }
      if (payload.direction === 'up') {
        this.scene.actions = moveArrElem([...this.scene.actions], actionIndex, actionIndex - 1)
      }

      if (payload.direction === 'down') {
        // нельзя уйти ниже последнего значения
        if (actionIndex >= this.scene.actions.length - 1) { return }

        this.scene.actions = moveArrElem([...this.scene.actions], actionIndex, actionIndex + 1)
      }
    }
  }
}
</script>

<style lang="sass">
.mainTextBlock
  max-height: 250px
  background-color: #444
  position: relative
  &::after, &::before
    content: ''
    position: absolute
    height: 100%
    top: 0
    background: linear-gradient(90deg, #444444 0%, #4444448b 45%, #44444400 90%, #44444400 100%)
  &::before
    width: 500px
    transform: translateX(calc(-100% + 2px)) scaleX(-1)
  &::after
    width: 500px
    transform: translateX(calc(100% - 2px))
    right: 0
  & .v-input__control .v-input__slot::before, & .v-input__control .v-input__slot::after
    display: none !important
// .sceneEditor-container
//   height: 100%
</style>
