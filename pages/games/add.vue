<template>
  <div class="fullsize">
    <ConstructorSceneNetwork @selectedSceneID="onSceneSelected" />
    <ConstructorPopup
      v-model="isScenePopupShow"
      @onClose="closeSceneEditor"
    >
      <ConstructorSceneEditor ref="sceneEditor" :key="selectedSceneID" :sceneid="selectedSceneID" />
    </ConstructorPopup>
  </div>
</template>

<script>
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
  },
  methods: {
    boot () {
      this.$store.dispatch('constructorStorage/setStateToDefault')
      this.addSceneAndGo()
    },
    addSceneAndGo (data = false) {
      const newScene = this.addNewScene()

      // Устанавливаем новую сцену в экшн,
      // если выбранный экшн передан аргументом
      if (data && typeof data.action === 'object' && data.action.to !== undefined) { data.action.to = newScene.id }

      this.$store.dispatch('constructorStorage/goToScene', newScene)
      this.$store.dispatch('constructorStorage/addEmptyAction')

      return newScene
    },
    addNewScene () { // Создаем новую сцену и возвращаем ее
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']
      this.$store.dispatch('constructorStorage/addScene', newScene)
      return newScene
    },
    onSceneSelected (id) {
      this.selectedSceneID = id
    },
    closeSceneEditor () {
      this.$refs.sceneEditor.save()
      this.selectedSceneID = false
    }
  }
}
</script>
