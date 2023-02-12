<template>
  <div class="fill-in-height position-relative">
    <constructor-popup
      v-model="isScenePopupShow"
      @onClose="closeSceneEditor"
    >
      <constructor-scene-editor
        ref="sceneEditor"
        :key="selectedSceneID"
        :sceneid="selectedSceneID"
        @moveToScene="onSceneSelected"
      />
    </constructor-popup>

    <constructor-popup
      v-model="isCharacterPopupShow"
      class="char-generator__popup"
      @onClose="closeCharacterEditor"
    >
      <common-character-generator :char="selectedCharacter" @onCharSaved="closeCharacterEditor" />
    </constructor-popup>

    <!-- <constructor-context-circle :position="contextCirclePos">
      <template #zero>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              depressed
              v-bind="attrs"
              v-on="on"
              @click="onSceneSelected(preSelectedSceneID)"
            >
              <v-icon small rounded>
                mdi-open-in-new
              </v-icon>
            </v-btn>
          </template>
          <span>Править сцену</span>
        </v-tooltip>
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
          <span>Дублировать c переходом</span>
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
              @click="duplicateScene(preSelectedSceneID, false)"
            >
              <v-icon rounded>
                mdi-content-copy
              </v-icon>
            </v-btn>
          </template>
          <span>Дублировать</span>
        </v-tooltip>
      </template>

      <template #third>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              depressed
              :disabled="isFirstScene(preSelectedSceneID)"
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
      </template> -->

    <!-- <template #fourth>
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
          <span>Основная информация</span>
        </v-tooltip>
      </template> -->
    <!-- </constructor-context-circle> -->

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
      @clicked="onSceneNetworkClicked"
      @zoom="hideContextCircle"
      @dragStart="hideContextCircle"
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
      preSelectedSceneID: false, // for contextMenu
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
    // EventBus.$on('onAddSceneAndLinkAndGo', this.addSceneAndLinkToActAndOpen)
  },
  // beforeDestroy () {
  // EventBus.$off('onAddSceneAndLinkAndGo', this.addSceneAndLinkToActAndOpen)
  // },
  methods: {
    boot () {
      this.$store.dispatch('constructorStorage/setStateToDefault')

      // Добавляем стартовую сцену, если это страница Add, а не Edit
      if (!this.$route.params.id) {
        this.addNewScene()
      }
    },
    /**
     * Проверяем является ли переданная сцена(id) первой (стартовой)
     * @param {Number} sceneID Идентификатор сцены
     * @returns {Boolean}
     */
    isFirstScene (sceneID) {
      const index = this.scenes.findIndex(item => item.id === sceneID)
      return index === 0
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
    onSceneSelected (id) {
      this.closeSceneEditor(false)
      this.selectedSceneID = id
      setTimeout(() => {
        this.hideContextCircle()
      }, 500)
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
    onSceneNetworkClicked (payload) {
    //   this.hideContextCircle()
    //   if (payload) {
    //     setTimeout(() => {
    //       this.contextCirclePos = payload.position
    //       this.preSelectedSceneID = payload.sceneID
    //     }, 0)
    //   }
      // console.log(payload)
    },
    hideContextCircle (params) {
      this.contextCirclePos = false
      // this.contextCircleScale = false
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
    duplicateScene (sceneID, setTransition = true) {
      const sceneCopy = { ...this.scenes.find(scene => scene.id === sceneID) }
      // Сбрасываем переход без выбора
      if (setTransition) {
        sceneCopy.goNextWithoutChoice = false
        this.$store.dispatch('constructorStorage/updateScene', sceneCopy)
      }

      this.hideContextCircle()
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
