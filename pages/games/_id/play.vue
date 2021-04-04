<template>
  <div class="game" :style="backgroundStyle">
    <v-container class="d-flex flex-column fullsize" style="max-width: 1200px">
      <CharacterCanvas
        v-if="character"
        :updated-at="charUpdatedAt"
        :char-id="character.id"
        :height="characterHeight"
        transition
        class="character"
      />
      <v-row class="text-blocks">
        <v-col class="d-flex flex-column justify-end" cols="12">
          <div class="actions">
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
                <v-icon v-if="typeof action.to == 'number'" color="white">
                  mdi-chevron-right
                </v-icon>
                <v-icon v-if="action.to == 'quit'" color="white">
                  mdi-location-exit
                </v-icon>
                <span>{{ action.actionText }}</span>
              </div>
            </div>
          </div>

          <div class="mainTextBlock" @click="skipTextTyping">
            <span v-if="character" class="charName">{{ character.name }}</span>
            <p class="pa-5 mb-0" :class="{'mt-5': character}">
              {{ mainText }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- <project-loader
      @onRestoreState="onRestoreState"
    /> -->
  </div>
</template>

<script>
import { InfoMessage } from '@/plugins/toast'
const defaultGame = {
  scenes: [
    { id: 1617138553349, title: 'Сцена 1617138553349', mainText: 'Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1  ', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138591912, actionText: 'Дальше...', to: 1617138591890, condition: false }, { id: 1617138591912, actionText: 'Дальше...', to: 1617138591890, condition: false }], character: 1617138569818 },
    { id: 1617138591890, title: 'Сцена 1617138591890', mainText: 'Сцена 2', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138593593, actionText: 'Дальше...', to: 1617138593566, condition: false }, { id: 1617138596746, actionText: 'На выход', to: 1617138596717, condition: false }], character: 1617138569818 },
    { id: 1617138593566, title: 'Сцена 1617138593566', mainText: 'Сцена 3', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138621744, actionText: 'На выход', to: 1617138596717, condition: false }], character: false },
    { id: 1617138596717, title: 'Финал', mainText: 'Сцена 4', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138650148, actionText: 'Выход', to: 'quit', condition: false }], character: 1617138569818 }
  ],
  characters: [{ name: 'fjkdsjfs', id: '1.1_6.3_1.1_2.1_1.3_6.4_14', uid: 1617138569818 }]
}
export default {
  data () {
    return {
      activeScene: false, // текущая сцена
      scenes: [], // список сцен
      characters: [],
      projectID: null, // ID новеллы
      charUpdatedAt: 0,
      characterHeight: 0,
      mainText: '',
      textSkiped: false,
      actionsShowed: false,
      sceneHistory: []
    }
  },
  computed: {
    backgroundStyle () {
      if (!this.activeScene.background) { return '' }

      if (this.activeScene.background.type === 'image') {
        return 'background-image: url(' + this.activeScene.background.url + ');'
      } else if (this.activeScene.background.type === 'color') {
        const hex = this.activeScene.background.value
        return 'background-color: ' + hex
      } else {
        return ''
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
    character (newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        // console.log('debug', newVal, oldVal)
        this.setCharacterSettings()
      }
    },
    activeScene () {
      this.startTextTyping()
    }
  },
  mounted () {
    // данные загружаются из компонента project loader
    this.boot()
    this.setCharacterSettings()
    window.addEventListener('resize', () => this.setCharacterSettings())
  },
  methods: {
    boot () {
      if (process.server) { return false }
      const localSavedGame = localStorage.getItem('game')
      if (localSavedGame) {
        const savedGameObject = JSON.parse(localSavedGame)
        savedGameObject.json = JSON.parse(savedGameObject.json)
        console.log(savedGameObject)
        this.scenes = [...savedGameObject.json.scenes]
        this.characters = [...savedGameObject.json.characters]
      } else {
        this.scenes = [...defaultGame.scenes]
        this.characters = [...defaultGame.characters]
      }
      this.goToScene(this.scenes[0])
      // eslint-disable-next-line no-console
      console.log('Game booted.')
    },
    setCharacterSettings () {
      this.characterHeight = Math.ceil(window.innerHeight / 1.3)
      this.charUpdatedAt = new Date().getTime()
    },
    onRestoreState (gameData) {
      this.projectID = gameData.id
      this.scenes = JSON.parse(gameData.json)

      this.goToScene(this.scenes[0])
    },
    goToScene (elem) { // Переходим на новую сцену
      if (typeof elem === 'number') {
        this.activeScene = this.getSceneById(elem)
        this.addSceneToHistory(this.activeScene)
      } else if (typeof elem === 'object' && typeof elem.id === 'number') {
        this.activeScene = this.getSceneById(elem.id)
        this.addSceneToHistory(this.activeScene)
      } else if (elem === 'quit') {
        InfoMessage('Игра окончена')
        this.$router.push('/')
      }
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

      if (action.condition.type === 'scene_visited' && !isActionExistInHistory) {
        isConditionMatch = true
      } else if (action.condition.type === 'scene_not_visited' && isActionExistInHistory) {
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

.games-id-play-page
  overflow: hidden
  & footer
    display: none

.mainTextBlock
  height: 30%
  max-height: 400px
  min-height: 150px
  background-color: #444444e6
  position: relative
  color: white
  cursor: pointer
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

</style>
