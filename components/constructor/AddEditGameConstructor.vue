<template>
  <div class="fullsize position-relative">
    <ConstructorPopup
      v-model="isScenePopupShow"
      @onClose="closeSceneEditor"
    >
      <ConstructorSceneEditor
        ref="sceneEditor"
        :key="selectedSceneID"
        :sceneid="selectedSceneID"
        @moveToScene="onSceneSelected"
      />
    </ConstructorPopup>
    <ConstructorPopup
      v-model="isCharacterPopupShow"
      class="char-generator__popup"
      @onClose="closeCharacterEditor"
    >
      <CommonCharacterGenerator :char="selectedCharacter" @onCharSaved="closeCharacterEditor" />
    </ConstructorPopup>

    <ConstructorContextCircle :position="contextCirclePos">
      <template #zero>
        <v-btn
          rounded
          fab
          dark
          depressed
          @click="onSceneSelected(preSelectedSceneID)"
        >
          <v-icon small rounded>
            mdi-open-in-new
          </v-icon>
        </v-btn>
      </template>

      <template #first>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              depressed
              v-bind="attrs"
              v-on="on"
              @click="duplicateScene(preSelectedSceneID)"
            >
              <v-icon rounded>
                mdi-content-duplicate
              </v-icon>
            </v-btn>
          </template>
          <span>Дублировать</span>
        </v-tooltip>
      </template>

      <template #second>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              depressed
              v-bind="attrs"
              v-on="on"
              @click="callToDeleteScene(preSelectedSceneID)"
            >
              <v-icon rounded>
                mdi-delete-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Удалить</span>
        </v-tooltip>
      </template>

      <template #third>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              disabled
              depressed
              v-bind="attrs"
              v-on="on"
            >
              <v-icon rounded>
                mdi-cog-outline
              </v-icon>
            </v-btn>
          </template>
          <!-- <span>Основная информация</span> -->
        </v-tooltip>
      </template>
    </ConstructorContextCircle>

    <div class="bottom-bar">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            rounded
            fab
            dark
            depressed
            v-bind="attrs"
            class="ml-5 mb-5"
            v-on="on"
            @click="saveProject"
          >
            <v-icon rounded>
              mdi-content-save-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Сохранить проект</span>
      </v-tooltip>

      <CustomDialog
        title="Основная информация"
        @onDialogStateChanged="mainSettingsDialogStateChanged"
      >
        <template #toggler>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                rounded
                fab
                dark
                depressed
                class="ml-5 mb-5"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon rounded>
                  mdi-cog-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Основная информация</span>
          </v-tooltip>
        </template>

        <ConstructorMainSceneInfo ref="mainSceneInfo" />
      </CustomDialog>

      <div class=" left-right-stroke">
        <ConstructorCharacterList with-add-btn @onCharacterClick="openCharacterEditor" />
      </div>
    </div>

    <ConstructorSceneNetwork
      @clicked="onSceneNetworkClicked"
      @zoom="hideContextCircle"
      @dragStart="hideContextCircle"
    />
    <CommonNightSkyCanvas />

    <ConstructorProjectSaver
      ref="projectSaver"
    />
    <ConstructorProjectLoader
      @onRestoreState="onRestoreState"
    />
  </div>
</template>

<script>
import { EventBus } from '@/plugins/event'
import Swal from 'sweetalert2'
import gameChecker from '@/plugins/gameChecker'

export default {
  middleware: ['authenticated'],
  data () {
    return {
      selectedCharacter: false,
      selectedSceneID: false,
      visScriptLoaded: false,
      contextCirclePos: false,
      preSelectedSceneID: false // for contextMenu
    }
  },
  head: {
    title: 'Конструктор Новелл',
    meta: [
      { 'http-equiv': 'pragma', content: 'no-cache' },
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { 'http-equiv': 'expires', content: '0' }
    ]
  },
  computed: {
    isScenePopupShow () { return !!this.selectedSceneID },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    isCharacterPopupShow () { return !!this.selectedCharacter }
  },
  mounted () {
    this.boot()
    EventBus.$on('onAddSceneAndLinkAndGo', this.addSceneAndLinkToActAndOpen)
  },
  methods: {
    boot () {
      this.$store.dispatch('constructorStorage/setStateToDefault')
      this.addNewScene()
    },
    addNewScene () { // Создаем новую сцену и возвращаем ее
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']()
      this.$store.dispatch('constructorStorage/addScene', newScene)
      return newScene
    },
    onSceneSelected (id) {
      this.closeSceneEditor()
      this.selectedSceneID = id
      setTimeout(() => {
        this.hideContextCircle()
      }, 500)
    },
    closeSceneEditor () {
      this.$refs.sceneEditor?.save()
      this.selectedSceneID = false
    },
    openCharacterEditor (char) {
      this.selectedCharacter = char || true
    },
    closeCharacterEditor () {
      this.selectedCharacter = false
    },
    mainSettingsDialogStateChanged (val) {
      if (!val) {
        this.$refs.mainSceneInfo.save()
        // this.saveProject()
      }
    },
    onSceneNetworkClicked (payload) {
      this.hideContextCircle()
      if (payload) {
        setTimeout(() => {
          this.contextCirclePos = payload.position
          this.preSelectedSceneID = payload.sceneID
        }, 0)
      }
      // console.log(payload)
    },
    hideContextCircle (params) {
      this.contextCirclePos = false
      this.contextCircleScale = false
    },
    callToDeleteScene (sceneID) {
      Swal.fire({
        title: 'Вы действительно хотите удалить сцену "' + this.getSceneById(sceneID).title + '"?',
        text: 'Все действия ведущие на эту сцену будут также удалены.',
        showDenyButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        denyButtonText: 'Удалить',
        cancelButtonText: 'Отмена'
      }).then((result) => {
        if (result.isDenied) {
          this.deleteScene(sceneID)
        }
      })
    },
    getSceneById (id) {
      return { ...this.$store.getters['constructorStorage/getSceneById'](id) }
    },
    deleteScene (sceneID) {
      this.hideContextCircle()
      this.$store.dispatch('constructorStorage/deleteScene', sceneID)
      this.$store.dispatch('constructorStorage/deleteActionToScene', sceneID)
    },
    duplicateScene (sceneID) {
      const sceneCopy = this.scenes.find(scene => scene.id === sceneID)
      this.hideContextCircle()
      this.$store.dispatch('constructorStorage/copyScene', sceneCopy)
    },
    saveProject () {
      this.$refs.projectSaver.beginSaving()
    },
    onRestoreState (gameData) {
      // console.log('debug gameData', gameData)
      this.$store.dispatch('constructorStorage/updateProjectID', gameData.id)
      this.$store.dispatch('constructorStorage/updateMainSettings', {
        title: gameData.title,
        description: gameData.description,
        onTestDrive: (gameData.status !== 'draft')
      })

      let game = JSON.parse(gameData.json)
      if (!gameChecker.isLatestVersion(game)) {
        game = gameChecker.updateGameToLatestVersion(game)
      }
      this.$store.dispatch('constructorStorage/updateAllScenes', game.scenes)
      this.$store.dispatch('constructorStorage/updateAllCharacters', game.characters)
    }
  }
}
</script>

<style lang="sass">
.bottom-bar
  position: absolute
  z-index: 10
  left: 0
  bottom: 10px

@keyframes move-bg-pos
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%

.v-menu__content
  z-index: 999!important
</style>
