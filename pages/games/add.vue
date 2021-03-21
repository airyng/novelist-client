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
      <CharacterGenerator :char="selectedCharacter" @onCharSaved="closeCharacterEditor" />
    </ConstructorPopup>

    <div class="bottom-char-bar left-right-stroke">
      <ConstructorCharacterList with-add-btn @onCharacterClick="openCharacterEditor" />
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
      selectedCharacter: false,
      selectedSceneID: false,
      visScriptLoaded: false
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
