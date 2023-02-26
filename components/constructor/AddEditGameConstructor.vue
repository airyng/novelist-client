<template>
  <div class="game-constructor fill-in-height position-relative">
    <constructor-popup
      v-model="isScenePopupShow"
      @onClose="closeSceneEditor"
    >
      <constructor-scene-editor
        ref="sceneEditor"
        :key="selectedSceneID"
        :scene-id="selectedSceneID"
        @moveToScene="selectScene"
      />
    </constructor-popup>

    <constructor-popup
      v-model="isCharacterPopupShow"
      class="char-generator__popup"
      @onClose="closeCharacterEditor"
    >
      <common-character-generator :char="selectedCharacter" @onCharSaved="closeCharacterEditor" />
    </constructor-popup>

    <div class="bottom-bar">
      <v-tooltip v-if="showPlayBtn" top>
        <template #activator="{ on, attrs }">
          <v-btn
            rounded
            fab
            dark
            depressed
            v-bind="attrs"
            class="ml-5 mb-5"
            v-on="on"
            @click="goToPlay"
          >
            <v-icon rounded>
              mdi-gamepad-variant-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Тест-Драйв</span>
      </v-tooltip>

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

      <custom-dialog
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

        <constructor-main-scene-info ref="mainSceneInfo" />
      </custom-dialog>
    </div>

    <div class="char-bar">
      <div class="left-right-stroke">
        <constructor-character-list with-add-btn @onCharacterClick="openCharacterEditor" />
      </div>
    </div>

    <common-night-sky-canvas />

    <constructor-scenes-network
      class="fullsize pos-abs"
      @buttonClick="onSceneButtonClick"
    />

    <constructor-project-saver
      ref="projectSaver"
      @saved="onSaved"
    />
    <constructor-project-loader
      @onRestoreState="onRestoreState"
    />
    <common-screen-rotation-alert />
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import gameChecker from '@/plugins/gameChecker'

export default {
  middleware: ['authenticated'],
  data () {
    return {
      selectedCharacter: false,
      selectedSceneID: false,
      contextCirclePos: false,
      showPlayBtn: false
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
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    isScenePopupShow () { return !!this.selectedSceneID },
    isCharacterPopupShow () { return !!this.selectedCharacter }
  },
  mounted () {
    this.boot()
  },
  methods: {
    boot () {
      this.$store.dispatch('constructorStorage/setStateToDefault')

      // Добавляем стартовую сцену, если это страница Add, а не Edit
      if (!this.$route.params.id) {
        this.addNewScene()
      }
    },
    addNewScene () { // Создаем новую сцену и возвращаем ее
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']()
      this.$store.dispatch('constructorStorage/addScene', newScene)
      return newScene
    },
    goToPlay () {
      // Перезагружаем страницу вместо плавного перехода
      // затем, чтобы обновился кеш и подтянулись свежие изменения
      window.location = '/games/' + this.$route.params.id + '/play'
    },
    selectScene (id) {
      this.closeSceneEditor(false)
      this.selectedSceneID = id
    },
    closeSceneEditor (doAutoSave = true) {
      this.$refs.sceneEditor?.save()
      this.selectedSceneID = false
      if (doAutoSave) { this.autoSave() }
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
      } else {
        this.$refs.mainSceneInfo?.setDataFromProps?.()
      }
    },
    onSceneButtonClick ({ type, sceneId }) {
      const behaviors = {
        open: () => this.selectScene(sceneId),
        delete: () => this.deleteSceneHandler(sceneId),
        'duplicate-with-transition': () => this.duplicateScene(sceneId),
        duplicate: () => this.duplicateScene(sceneId, false)
      }
      behaviors[type]?.()
    },
    deleteSceneHandler (sceneID) {
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
      this.$store.dispatch('constructorStorage/deleteScene', sceneID)
      this.$store.dispatch('constructorStorage/deleteSceneIdFromActions', sceneID)
    },
    duplicateScene (sceneID, setTransition = true) {
      const sceneCopy = { ...this.scenes.find(scene => scene.id === sceneID) }
      // Сбрасываем переход без выбора
      if (setTransition) {
        sceneCopy.goNextWithoutChoice = false
        this.$store.dispatch('constructorStorage/updateScene', sceneCopy)
      }
      this.$store.dispatch('constructorStorage/copyScene', { sceneToCopy: sceneCopy, setTransition })
    },
    saveProject () {
      this.$refs.projectSaver.save()
    },
    // Метод сохранения данных при условии
    // что новелла в статусе "черновик"
    autoSave () {
      if (this.$refs?.projectSaver?.mainInfo && this.$refs.projectSaver.mainInfo.status === 'draft') {
        this.$refs.projectSaver.save(false)
      }
    },
    onSaved (payload) {
      this.showPlayBtn = payload.status !== 'draft'
      // Если это первое сохранение проекта, то нужно сделать редирект на страницу редактирования
      if (this.$route.path === '/games/add') {
        this.$router.push(`/games/${payload._id}/edit`)
      }
    },
    onRestoreState (gameData) {
      this.$store.dispatch('constructorStorage/updateProjectID', gameData._id)
      this.$store.dispatch('constructorStorage/updateMainSettings', {
        title: gameData.title,
        description: gameData.description,
        status: gameData.status
      })

      let game = JSON.parse(gameData.json)

      if (!gameChecker.isLatestVersion(game)) {
        game = gameChecker.updateGameToLatestVersion(game)
      }
      this.$store.dispatch('constructorStorage/updateAllScenes', game.scenes)
      this.$store.dispatch('constructorStorage/updateAllCharacters', game.characters)
      this.$store.dispatch('constructorStorage/setUnsavedChangesProp', false)
    }
  }
}
</script>

<style lang="sass">
.game-constructor
  background-color: #696969

.bottom-bar
  position: fixed
  z-index: 10
  left: 10px
  bottom: 256px
  width: 100px

.char-bar
  position: fixed
  left: 0
  bottom: 48px
  z-index: 10

.v-menu__content
  z-index: 999!important
</style>
