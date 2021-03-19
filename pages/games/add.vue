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
      <CharacterGenerator />
    </ConstructorPopup>

    <div class="bottom-char-bar left-right-stroke">
      <CharacterCanvas
        v-for="id in charIds"
        :key="id"
        :updated-at="updatedAt"
        :char-id="id"
        portrait
        class="charPreview mr-2"
        height="150"
      />
      <div class="add-char-btn" @click="openCharacterEditor">
        <img src="@/assets/images/constructor/icon-add-character.png">
      </div>
    </div>

    <ConstructorSceneNetwork @selectedSceneID="onSceneSelected" />
    <CommonNightSkyCanvas />
  </div>
</template>

<script>
import { EventBus } from '~/plugins/event'
export default {
  data () {
    return {
      selectedSceneID: false,
      isCharacterPopupShow: false,
      visScriptLoaded: false,
      updatedAt: 0,
      charIds: [
        '2.2_1.3_1.2_5.5_1.3_5.3_3',
        '4.3_4.2_1.2_1.1_1.1_2.2_10'
      ]
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
    }
  },
  mounted () {
    this.boot()
    this.updatedAt = new Date().getTime()
    EventBus.$on('onAddSceneAndLinkAndGo', this.addSceneAndLinkToActAndOpen)
  },
  methods: {
    boot () {
      this.$store.dispatch('constructorStorage/setStateToDefault')
      this.addNewScene()
    },
    addNewScene () { // Создаем новую сцену и возвращаем ее
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']
      this.$store.dispatch('constructorStorage/addScene', newScene)
      return newScene
    },
    onSceneSelected (id) {
      this.closeSceneEditor()
      this.selectedSceneID = id
    },
    closeSceneEditor () {
      this.$refs.sceneEditor?.save()
      this.selectedSceneID = false
    },
    openCharacterEditor () {
      this.isCharacterPopupShow = true
    },
    closeCharacterEditor () {
      this.isCharacterPopupShow = false
    }
  }
}
</script>

<style lang="sass">
footer
  display: none

.bottom-char-bar
  position: absolute
  z-index: 10
  left: 0
  bottom: 10px
  display: flex
  align-items: center
  padding: 10px

.add-char-btn
  display: flex
  width: 100%
  max-width: 50px
  cursor: pointer
  & img
    width: 100%
    transition: all .2s ease
  &:hover
    img
      transform: rotateZ(-5deg)

.charPreview
  display: flex
  width: 150px
  justify-content: center

.char-generator__popup .editor-window
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)
  background-size: 400% 400%
  animation: move-bg-pos 100s ease infinite

@keyframes move-bg-pos
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%
</style>
