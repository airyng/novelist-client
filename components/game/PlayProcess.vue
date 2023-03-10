<template>
  <div class="game" :style="backgroundStyle">
    <v-container class="d-flex flex-column fullsize" style="max-width: 1200px">
      <character-canvas
        v-if="character"
        ref="character"
        :updated-at="charUpdatedAt"
        :char-id="character.id"
        :height="characterHeight"
        transition
        :from-right="activeScene.showCharFromRight"
        class="character"
      />
      <v-row class="text-blocks">
        <v-col class="d-flex flex-column justify-end" cols="12">
          <div v-if="!activeScene.goNextWithoutChoice" class="actions">
            <div
              class="actions-container"
              :class="{ showed: actionsShowed}"
            >
              <div
                v-for="(action, index) in activeScene.actions"
                :key="index"
                class="action-btn mt-2"
                :class="getClassesForCondition(action)"
                @click="goToScene(action.to)"
              >
                <v-icon v-if="checkIsSceneId(action.to)" color="white">
                  mdi-chevron-right
                </v-icon>
                <v-icon v-if="action.to == 'quit'" color="white">
                  mdi-location-exit
                </v-icon>
                <span>{{ action.actionText }}</span>
              </div>
            </div>
          </div>

          <div
            class="mainTextBlock"
            :class="{
              'curs-pointer': activeScene.goNextWithoutChoice || !textSkiped,
              'pt-5 pl-1': character
            }"
            @click="onClickToMainText"
          >
            <span v-if="character" class="charName">{{ character.name }}</span>
            <span v-if="activeScene.goNextWithoutChoice && textSkiped" class="goNextLable">Нажмите, чтобы продолжить</span>
            <span class="pa-5 mb-0 mainText">
              {{ mainText }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// Менеджер автосохранений игрового процесса
import GameAutoSaveManager from '@/plugins/gameAutoSaveManager'
import { checkIsSceneId } from '@/plugins/utils'

export default {
  props: {
    scenes: { type: Array, required: true },
    characters: { type: Array, required: true },
    startOnScene: { type: [Number, String], default: null }
  },
  data () {
    return {
      updateIndex: 0,
      activeScene: false, // текущая сцена
      charUpdatedAt: 0,
      characterHeight: 0,
      mainText: '',
      textSkiped: false,
      actionsShowed: false,
      sceneHistory: [],
      gameAutoSaveManager: null
    }
  },
  computed: {
    back () {
      return this.activeScene?.background?.value
    },
    backgroundImageLink () {
      // eslint-disable-next-line no-unused-expressions
      this.updateIndex
      if (this.activeScene?.background?.type !== 'image') { return false }
      return this.$store.state.imagesRepository.list[this.back] || false
    },
    backgroundStyle () {
      const defaultStyle = 'background-color: #333'
      if (!this.activeScene.background) {
        return defaultStyle
      } else if (this.activeScene.background.type === 'color') {
        return 'background-color: ' + this.back
      } else if (this.activeScene.background.type === 'image' && this.backgroundImageLink) {
        return `background-image: url('${this.backgroundImageLink}')`
      } else {
        return defaultStyle
      }
    },
    character () {
      if (this.activeScene.character) {
        return this.characters.find(char => char.uid === this.activeScene.character)
      } else {
        return false
      }
    }
  },
  watch: {
    // character (newVal, oldVal) {
    //   if (newVal.id !== oldVal.id) {
    //     // console.log('debug', newVal, oldVal)
    //     this.setCharacterSettings()
    //   }
    // },
    activeScene () {
      this.startTextTyping()
    }
  },
  mounted () {
    this.gameAutoSaveManager = new GameAutoSaveManager()
    this.setCharacterSettings()
    window.addEventListener('resize', () => this.setCharacterSettings())

    this.goToStart()
  },
  methods: {
    checkIsSceneId (payload) {
      return checkIsSceneId(payload)
    },
    onClickToMainText () {
      // При если текст весь выведен и есть возможность перейти дальше без выбора, то переходим
      // Иначе сбрасываем анимацию текста
      if (this.textSkiped && this.activeScene.goNextWithoutChoice) {
        this.goToScene(this.activeScene.actions[0].to)
      } else {
        this.skipTextTyping()
      }
    },
    goToStart () {
      if (this.startOnScene) {
        this.goToScene(this.scenes.find(item => Number(item.id) === Number(this.startOnScene)))
      } else {
        this.goToScene(this.scenes[0])
      }
    },
    setCharacterSettings () {
      this.characterHeight = Math.ceil(window.innerHeight / 1.3)
      this.charUpdatedAt = new Date().getTime()
    },
    // Переходим на новую сцену
    async goToScene (elem) {
      let nextScene = null

      if (checkIsSceneId(elem)) {
        nextScene = this.getSceneById(elem)
      } else if (typeof elem === 'object' && checkIsSceneId(elem.id)) {
        nextScene = this.getSceneById(elem.id)
      } else if (elem === 'quit') {
        this.$emit('gameOver')
        return
      }

      // Анимируем уход персонажа
      if (this.character && this.$refs.character) {
        if (nextScene.character !== this.activeScene.character) {
          await this.$refs.character.hideCharacter()
        }
      }

      if (nextScene?.background?.type === 'image') {
        // Загружаем фоновое изображение, если еще не загружено
        this.$store.dispatch('imagesRepository/linkFetch', nextScene.background.value)
          .then(() => { this.updateIndex++ })
      }

      this.activeScene = nextScene
      this.addSceneToHistory(this.activeScene)
      this.gameAutoSaveManager.save({ gameID: this.$route.params.id, lastSceneID: nextScene.id, characters: this.characters })
    },
    addSceneToHistory (scene) {
      this.sceneHistory.push(scene.id)
      // уникализируем
      this.sceneHistory = this.sceneHistory.filter((elem, index, self) => {
        return index === self.indexOf(elem)
      })
    },
    getSceneById (id) {
      return this.scenes.find(scene => scene.id === id)
    },
    getClassesForCondition (action) {
      if (!action.condition) { return {} }

      const isActionExistInHistory = this.sceneHistory.includes(action.condition.value)

      let isConditionMatch = false

      if (action.condition.type === 'scene_visited' && isActionExistInHistory) {
        isConditionMatch = true
      } else if (action.condition.type === 'scene_not_visited' && !isActionExistInHistory) {
        isConditionMatch = true
      }

      if (!isConditionMatch) { return {} }

      if (action.condition.else === 'block') {
        return ['disabled']
      } else if (action.condition.else === 'hide') {
        return ['hidden']
      }
    },
    skipTextTyping () {
      this.textSkiped = true
    },
    startTextTyping () {
      const that = this
      this.mainText = ''
      this.textSkiped = false
      let i = 0
      const txt = this.activeScene.mainText
      const speed = 50 /* Скорость/длительность эффекта в миллисекундах */

      function typeWriter () {
        that.actionsShowed = false
        if (i < txt.length) {
          that.mainText += txt.charAt(i)
          i++
          if (that.textSkiped) {
            typeWriter()
          } else {
            setTimeout(typeWriter, speed)
          }
        } else {
          // Это конец анимации текста
          // нужно показать экшены
          that.actionsShowed = true
          that.textSkiped = true
        }
      }
      typeWriter() // start
    }
  }
}
</script>

<style lang="sass">
.text-blocks
  z-index: 1
.actions
  margin-bottom: 30px
  width: 100%
  position: relative

.actions-container
  display: none
  width: 100%
  position: absolute
  &.showed
    animation-iteration-count: 1
    animation-name: emergence
    animation-duration: 1s
    animation-delay: 0s
    display: block
    bottom: 0
    opacity: 1
.action-btn
  width: 100%
  padding: 10px 5px
  color: white
  cursor: pointer
  border-radius: 12px
  background-color: rgba(68, 68, 68, 0.8)
  transition: all .3s ease
  &:hover
    background-color: rgba(68, 68, 68, 1)
  &.hidden
    display: none
  &.disabled
    opacity: 0.8
    pointer-events: none

@keyframes emergence
  0%
    bottom: -200px
    opacity: 0
  70%
    bottom: -200px
    opacity: 0
  100%
    bottom: 0
    opacity: 1

.mainTextBlock
  height: 30%
  max-height: 400px
  min-height: 150px
  background-color: #444444e6
  position: relative
  color: white
  & .mainText
    height: 100%
    overflow: hidden auto
    white-space: pre-line
  & *
    -webkit-touch-callout: none
    -webkit-user-select: none
    -khtml-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

  & .charName
    position: absolute
    top: -10px
    border-radius: 15px
    left: 0
    padding: 10px
    min-width: 100px
    overflow: hidden
    max-width: 300px
    background-color: rgb(68 68 68)
  & .goNextLable
    position: absolute
    bottom: 10px
    right: 10px
    color: #8c8c8c
    animation: fadeUp .5s

  &::after, &::before
    content: ''
    position: absolute
    height: 100%
    top: 0
    background: linear-gradient(90deg, #444444e6 3%, #4444444d 45%, #44444400 70%, #44444400 100%)
  &::before
    width: 500px
    transform: translateX(-100%) scaleX(-1)
    left: 0
    // @media (max-width: 768px)
      // left: 1px
  &::after
    width: 500px
    transform: translateX(100%)
    right: 0
    // @media (max-width: 768px)
      // right: 1px
  & .v-input__control .v-input__slot::before, & .v-input__control .v-input__slot::after
    display: none !important

.character
  position: absolute
  left: 200px
  bottom: -10px
  @media (max-width: 768px)
    left: 0

@keyframes fadeUp
  0%
    transform: translateY(50px)
    opacity: 0
  70%
    opacity: 0.1
  100%
    transform: translateY(0)
    opacity: 1
</style>
