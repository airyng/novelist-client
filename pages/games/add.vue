<template>
  <div class="fullsize">
    <ConstructorSceneNetwork @selectedSceneID="onSceneSelected" />
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
  </div>
</template>

<script>
import { EventBus } from '~/plugins/event'
export default {
  data () {
    return {
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
    }
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
    }
  }
}
</script>
