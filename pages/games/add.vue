<template>
  <div
    v-if="activeScene"
    v-resize="getWindowSize"
    class="constructor"
    :style="backgroundStyle"
  >
    <v-container v-if="!isMobileScreen" fluid>
      <ConstructorSidebar
        :previous-scene="previousScene"
        :scenes="scenes"
        :main-info="mainInfo"
        :active-scene="activeScene"
        :settings="settings"
        @OnSelectedSceneID="OnSelectedSceneID"
        @OnBackToPrevScene="goToScene"
        @OnBackChanged="OnBackChanged"
        @OnSaveStarted="OnSaveStarted"
      />

      <ConstructorSceneSettingsSidebar
        :active-scene="activeScene"
        @OnCallToRemoveScene="removeScene"
      />

      <v-row justify="center">
        <v-col class="col-12">
          <h1 class="inline-block py-2 big-white-txt-shadow">
            {{ activeScene.title }}
          </h1>
        </v-col>
      </v-row>

      <v-row class="text-blocks">
        <v-col class="mainTextBlock" sm="12" md="8" offset-md="2">
          <v-textarea
            v-model="activeScene.mainText"
            name="mainText"
            label="Основной текст"
            filled
            rows="6"
            :counter="settings.mainTextMaxLength"
            background-color="#444"
            dark
            clearable
          />
        </v-col>

        <div class="sceneActions">
          <v-col
            v-for="(action, index) in activeScene.actions"
            :key="index"
            sm="12"
            md="8"
            offset-md="2"
            class="scene-action-col"
          >
            <ConstructorSceneAction
              class="pb-0"
              :scenes="scenes"
              :action="action"
              :active-scene="activeScene"
              :action-text-max-length="settings.actionTextMaxLength"
              @OnGoToScene="goToScene"
              @onAddSceneAndGo="addSceneAndGo"
              @updatedScene="onUpdatedScene"
            />
          </v-col>

          <v-col xs="12" md="8" offset-md="2">
            <v-btn
              v-if="settings.maxActionsLength > activeScene.actions.length"
              rounded
              fab
              dark
              class="text-center justify-center"
              @click.stop="addAction()"
            >
              <v-icon rounded>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
        </div>
      </v-row>
    </v-container>
    <v-container v-else fluid>
      <h4 class="text-center">
        На данный момент конструктор не доступен для мобильных устройств. Данная функция находится в разработке. Приносим извинения за временные неудобства!
      </h4>
    </v-container>
    <ConstructorProjectSaver
      :id="projectID"
      ref="projectSaver"
      :main-info="mainInfo"
      :scenes="scenes"
      :settings="settings"
      @saved="onProjectSaved"
    />

    <ConstructorProjectLoader
      @onRestoreState="onRestoreState"
    />
  </div>
</template>

<script>

import { SuccessMessage } from '@/plugins/toast' // ErrorMessage
import { screen } from '@/mixins/screen'

export default {
  mixins: [screen],
  data () {
    return {
      windowSize: { x: 0, y: 0 },
      settings: { // настройки редактора
        mainTextMaxLength: 500,
        mainTextMinLength: 5,
        actionTextMaxLength: 80,
        maxActionsLength: 3,
        mainInfo: {
          title: {
            minLength: 5,
            maxLength: 120
          },
          description: {
            minLength: 20,
            maxLength: 500
          }
        }
      },
      activeScene: false, // текущая сцена
      previousScene: false, // предыдущая сцена
      scenes: [], // список сцен
      projectID: null, // ID новеллы
      mainInfo: {
        title: '',
        description: '',
        onTestDrive: false
      }
    }
  },
  computed: {
    backgroundStyle () {
      if (!this.activeScene.background) { return '' }

      if (this.activeScene.background.url) {
        return 'background-image: url(' + this.activeScene.background.url + ');'
      } else if (this.activeScene.background.rgba) {
        const rgba = this.activeScene.background.rgba
        return 'background-color: rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + rgba.a + ');'
      } else {
        return ''
      }
    }
  },
  mounted () {
    document.addEventListener('DOMContentLoaded', () => this.getWindowSize())
    this.boot()
  },
  methods: {
    onUpdatedScene (activeScene) {
      this.activeScene = activeScene
    },
    getWindowSize () {
      this.windowSize = this.$root.windowSize
    },
    boot () {
      this.addSceneAndGo()
      // eslint-disable-next-line no-console
      console.log('Constructor booted.')
    },
    onRestoreState (gameData) {
      this.projectID = gameData.id
      this.mainInfo.title = gameData.title
      this.mainInfo.description = gameData.description
      this.mainInfo.onTestDrive = (gameData.status !== 'draft')
      this.mainInfo.status = gameData.status
      this.scenes = JSON.parse(gameData.json)

      this.goToScene(this.scenes[0])
      // сбрасываем возможность перехода к предыдущей сцене - previousScene
      this.previousScene = false
    },
    onProjectSaved (id) {
      this.projectID = id
    },
    addSceneAndGo (data = false) {
      const newScene = this.addNewScene()

      // Устанавливаем новую сцену в экшн,
      // если выбранный экшн передан аргументом
      if (data && typeof data.action === 'object' && data.action.to !== undefined) { data.action.to = newScene.id }

      this.goToScene(newScene)
      this.addAction()

      return newScene
    },
    goToScene (elem) { // Переходим на новую сцену
      // if( !this.scenes.includes( scene ) ) return false
      // сохраняем текущую сцену, в историю переходов
      // теперь будет предыдущей
      this.previousScene = this.activeScene

      if (typeof elem === 'number') { this.activeScene = this.getSceneById(elem) } else if (typeof elem === 'object') { this.activeScene = elem }
    },
    getSceneById (id) {
      return this.scenes.filter(scene => scene.id === id)[0]
    },
    addNewScene () { // Создаем новую сцену и возвращаем ее
      const newScene = this.getEmptyScene()
      this.scenes.push(newScene)

      return newScene
    },
    getEmptyScene () {
      const id = this.scenes.length + 1
      return {
        id,
        title: 'Сцена ' + id,
        mainText: '',
        background: null,
        actions: []
      }
    },
    removeScene (scene) {
      const sceneIndex = this.scenes.indexOf(scene)
      const sceneID = scene.id
      this.scenes.map((scene) => {
        scene.actions.map((action) => {
          if (action.to === sceneID) { action.to = false }
          return action
        })
        return scene
      })

      this.scenes.splice(sceneIndex, 1)

      this.goToScene(this.scenes[0])
      this.previousScene = false
      SuccessMessage(false, 'Сцена успешно удалена!')
    },
    addAction () {
      if (this.settings.maxActionsLength > this.activeScene.actions.length) { this.activeScene.actions.push(this.getNewAction()) }
    },
    getNewAction () {
      return {
        id: this.activeScene.actions.length + 1,
        actionText: '',
        to: false
      }
    },
    OnBackChanged (background) {
      this.activeScene.background = background
    },
    OnSelectedSceneID (id) {
      this.goToScene(id)
    },
    OnSaveStarted () {
      this.$refs.projectSaver.beginSaving()
    }
  }
}
</script>

<style lang="sass">
.text-blocks
    position: absolute
    width: 100%
    bottom: 0

.mainTextBlock
    height: 200px
    width: 100%

.sceneActions
    height: 300px
    width: 100%
    margin-top: 10px

.scene-action-col
    height: 85px
    padding-bottom: 0

</style>
