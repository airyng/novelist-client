<template>
  <div
    v-if="sceneid && scene"
    class="d-flex flex-column fullsize position-relative scene-container"
    :style="backgroundStyle"
  >
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12">
          <h1 class="d-inline-block py-2 big-white-txt-shadow" style="outline: none" contenteditable="true">
            <input
              v-model="scene.title"
              type="text"
              name="sceneTitle"
              :maxlength="settings.maxSceneTitleLength"
              :style="'outline: none; width:' + scene.title.length * 20 + 'px; cursor: pointer; min-width: 50px!important'"
            >
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="d-flex flex-column fullsize" style="max-width: 1200px">
      <v-row class="text-blocks">
        <CharacterCanvas
          v-if="character"
          :updated-at="charUpdatedAt"
          :char-id="character.id"
          :height="characterHeight"
          class="character"
        />
        <v-col class="d-flex flex-column justify-end" cols="12">
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
              @OnGoToScene="goToScene"
            />
          </div>
          <v-btn
            v-if="settings.maxActionsLength > scene.actions.length"
            rounded
            fab
            dark
            depressed
            class="text-center justify-center mb-5"
            title="Добавить действие"
            @click.stop="addAction()"
          >
            <v-icon rounded>
              mdi-plus
            </v-icon>
          </v-btn>
          <v-textarea
            v-model="scene.mainText"
            class="mainTextBlock"
            name="mainText"
            label="Основной текст"
            filled
            rows="3"
            :counter="settings.mainTextMaxLength"
            background-color="#444"
            dark
            clearable
            no-resize
          />
        </v-col>
      </v-row>
    </v-container>

    <div class="btns-container">
      <CustomDialog
        title="Выбрать фон"
      >
        <template #toggler>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                rounded
                fab
                dark
                depressed
                class="text-center justify-center mb-4"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon rounded>
                  mdi-tab-unselected
                </v-icon>
              </v-btn>
            </template>
            <span>Выбрать фон</span>
          </v-tooltip>
        </template>

        <ConstructorBackgroundPicker @OnBackChanged="setBackground" />
      </CustomDialog>

      <CustomDialog
        ref="characterPickerDialog"
        title="Добавить персонажа"
      >
        <template #toggler>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                v-show="!character"
                rounded
                fab
                dark
                depressed
                class="text-center justify-center mb-4"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon rounded>
                  mdi-account-plus
                </v-icon>
              </v-btn>
            </template>
            <span>Добавить персонажа</span>
          </v-tooltip>
        </template>

        <ConstructorCharacterPicker @onCharacterPicked="addCharacter" />
      </CustomDialog>

      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            v-show="character"
            rounded
            fab
            dark
            depressed
            class="text-center justify-center mb-4"
            v-bind="attrs"
            v-on="on"
            @click="removeCharacter"
          >
            <v-icon rounded>
              mdi-account-minus
            </v-icon>
          </v-btn>
        </template>
        <span>Убрать персонажа</span>
      </v-tooltip>
    </div>
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
      scene: false,
      charUpdatedAt: 0,
      characterHeight: 0
    }
  },
  computed: {
    backgroundStyle () {
      const defaultStyle = 'background-color: #333'
      if (!this.scene.background) {
        return defaultStyle
      } else if (this.scene.background.type === 'color') {
        return 'background-color: ' + this.scene.background.value
      } else if (this.scene.background.type === 'image') {
        return 'background-image: url(' + this.scene.background.value + ')'
      } else {
        return defaultStyle
      }
    },
    settings () {
      return this.$store.state.constructorStorage.settings
    },
    character () {
      if (this.scene.character) {
        return this.$store.state.constructorStorage.characters.filter(char => char.uid === this.scene.character)[0]
      } else {
        return false
      }
    }
  },
  mounted () {
    this.getSceneFromStorage()
    this.setCharacterSettings()
    window.addEventListener('resize', () => this.setCharacterSettings())
  },
  methods: {
    removeCharacter () {
      this.scene.character = false
    },
    setCharacterSettings () {
      this.characterHeight = Math.ceil(window.innerHeight / 1.3)
      this.charUpdatedAt = new Date().getTime()
    },
    addCharacter (char) {
      this.$refs.characterPickerDialog.close()
      this.scene.character = char.uid
      this.charUpdatedAt = new Date().getTime()
      this.save(this.scene)
    },
    getSceneFromStorage () {
      this.scene = { ...this.$store.getters['constructorStorage/getSceneById'](this.sceneid) }
    },
    save (scene) {
      const _scene = scene || this.scene
      this.$store.dispatch('constructorStorage/updateScene', _scene)
      this.getSceneFromStorage()
    },
    goToScene (toSceneID) {
      this.$emit('moveToScene', toSceneID)
    },
    // Возможно управление экшнами стоит вынести в отдельный компонент
    // который будет отвечать только за них
    addAction () {
      this.$store.dispatch('constructorStorage/addAction', { scene: this.scene })
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

      if (actionIndex === false) { return }
      if (payload.direction === 'up') {
        this.scene.actions = moveArrElem([...this.scene.actions], actionIndex, actionIndex - 1)
      }

      if (payload.direction === 'down') {
        // нельзя уйти ниже последнего значения
        if (actionIndex >= this.scene.actions.length - 1) { return }

        this.scene.actions = moveArrElem([...this.scene.actions], actionIndex, actionIndex + 1)
      }
    },
    setBackground (backObj) {
      this.scene.background = backObj || false
    }
  }
}
</script>

<style lang="sass">
.scene-container
  background-size: cover
  background-position: center
.mainTextBlock
  max-height: 150px
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
.btns-container
  position: absolute
  top: 65px
  right: 10px
  z-index: 8

.character
  position: absolute
  left: 200px
  bottom: -10px
</style>
