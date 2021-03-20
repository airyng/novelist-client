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
      <CharacterGenerator :char="selectedCharacter" />
    </ConstructorPopup>

    <div class="bottom-char-bar left-right-stroke">
      <div
        v-for="char in characters"
        :key="char.uid"
        class="charPreview mr-2"
        @click.stop="openCharacterEditor(char)"
      >
        <CharacterCanvas
          :updated-at="updatedAt"
          :char-id="char.id"
          portrait
          height="150"
        />
        <span>{{ char.name }}</span>
      </div>

      <div class="charPreview" @click="openCharacterEditor()">
        <img src="@/assets/images/constructor/icon-add-character.png" class="add-char-btn">
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
      selectedCharacter: false,
      visScriptLoaded: false,
      updatedAt: 0
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
    isCharacterPopupShow () { return !!this.selectedCharacter },
    characters () {
      return this.$store.state.constructorStorage.characters
    },
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
  display: flex
  align-items: center
  padding: 10px

.charPreview
  display: flex
  width: 150px
  justify-content: center
  align-items: center
  cursor: pointer
  flex-direction: column
  border-radius: 12px
  height: 190px
  &:hover
    border: 1px solid white

.add-char-btn
  display: flex
  width: 50px
  height: 50px
  transition: all .2s ease

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
