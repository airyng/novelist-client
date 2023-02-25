<template>
  <div
    v-if="sceneId && scene"
    class="d-flex flex-column fullsize position-relative scene-container"
    :style="backgroundStyle"
  >
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12">
          <h1
            class="d-inline-block py-2 big-white-txt-shadow c-pointer"
            @click="selectTitleInput"
          >
            <input
              ref="titleInput"
              v-model="scene.title"
              type="text"
              name="sceneTitle"
              onFocus="this.select()"
              :maxlength="settings.maxSceneTitleLength"
            >
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="d-flex flex-column fullsize" style="max-width: 1200px">
      <v-row class="text-blocks">
        <character-canvas
          v-if="character"
          :updated-at="charUpdatedAt"
          :char-id="character.id"
          :height="characterHeight"
          transition
          :from-right="scene.showCharFromRight"
          class="character"
        />
        <v-col class="d-flex flex-column justify-end" cols="12">
          <div
            v-for="action in [...scene.actions].sort((a, b) => b.sortIndex - a.sortIndex)"
            :key="action.id"
            cols="12"
            class="scene-action-col"
          >
            <constructor-scene-action
              class="pb-0"
              :action="action"
              :scene="scene"
              @onSave="saveAction"
              @onRemove="removeAction"
              @onOrderChange="changeActionOrder"
              @onGoToScene="goToScene"
              @onSaveSceneParams="saveSceneParams"
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
      <custom-dialog
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

        <constructor-background-picker
          v-if="scene.background"
          :value="scene.background.value"
          :active-type="scene.background.type"
          @OnBackChanged="setBackground"
        />
      </custom-dialog>

      <custom-dialog
        v-show="!character"
        ref="characterPickerDialog"
        title="Добавить персонажа"
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
                  mdi-account-plus
                </v-icon>
              </v-btn>
            </template>
            <span>Добавить персонажа</span>
          </v-tooltip>
        </template>

        <constructor-character-picker @onCharacterPicked="addCharacter" />
      </custom-dialog>

      <div v-show="character">
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
      <div v-show="character">
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
              @click="toggleCharSide"
            >
              <v-icon rounded>
                {{ scene.showCharFromRight ? 'mdi-account-arrow-left-outline' : 'mdi-account-arrow-right-outline' }}
              </v-icon>
            </v-btn>
          </template>
          <span>Сторона появления персонажа</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sceneId: { type: String, default: null }
  },
  data () {
    return {
      scene: false,
      charUpdatedAt: 0,
      characterHeight: 0
    }
  },
  computed: {
    back () {
      return this.scene?.background?.value
    },
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

    if (!this.scene.background) {
      this.scene.background = {
        value: 'background-color: #333',
        type: 'color'
      }
    }
  },
  methods: {
    selectTitleInput () {
      this.$refs.titleInput.select()
    },
    // Изменяем поле по ключу key значением value внутри объекта scene
    saveSceneParams (payload) {
      // if (Object.prototype.hasOwnProperty.call(this.scene, payload.key)) {
      this.scene[payload.key] = payload.value
      // }
    },
    removeCharacter () {
      this.scene.character = false
    },
    toggleCharSide () {
      this.scene.showCharFromRight = !this.scene.showCharFromRight
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
      this.scene = { ...this.$store.getters['constructorStorage/getSceneById'](this.sceneId) }
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
      // При добавлении экшна необходимо сбрасывать значение goNextWithoutChoice
      this.scene.goNextWithoutChoice = false

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
      let _actions = JSON.parse(JSON.stringify(this.scene.actions))

      _actions = _actions.sort((a, b) => a.sortIndex - b.sortIndex)

      const actionIndex = _actions.findIndex(action => action.id === payload.id)
      const direction = payload.direction === 'up' ? 1 : -1
      if (payload.direction === 'up' && actionIndex + direction > this.scene.actions.length - 1) { return }
      if (payload.direction === 'down' && actionIndex - 1 < 0) { return }

      const temp = _actions[actionIndex].sortIndex
      _actions[actionIndex].sortIndex = _actions[actionIndex + direction].sortIndex
      _actions[actionIndex + direction].sortIndex = temp

      this.scene.actions = _actions
    },
    setBackground (backObj) {
      this.scene.background = backObj || false
    }
  }
}
</script>

<style lang="sass">
// TODO: Нужно сделать этот блок стилей в скоупе
h1
  outline: none
  width: 40%
  white-space: nowrap
  position: relative
  text-overflow: ellipsis
  input
    outline: none
    width: 100%
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
  @media screen and (min-width: 959px) and (max-height: 695px)
    top: 10px
    right: 60px
    display: flex
    flex-direction: row
    & > *
        margin-left: 10px

.character
  position: absolute
  left: 50px
  bottom: -10px
</style>
