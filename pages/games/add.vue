<template>
  <div class="fullsize">
    <ConstructorSceneNetwork @selectedSceneID="onSceneSelected" />
    <ConstructorSceneEditorPopup ref="sceneEditor" />
  </div>
</template>

<script>
export default {
  head: {
    title: 'Конструктор Новелл',
    meta: [
      { 'http-equiv': 'pragma', content: 'no-cache' },
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { 'http-equiv': 'expires', content: '0' }
    ],
    script: [
      { src: 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js' }
    ]
  },
  computed: {
    scenes () {
      return this.$store.state.constructorStorage.scenes
    }
  },
  mounted () {
    this.boot()
  },
  methods: {
    boot () {
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
      this.$refs.sceneEditor.setScene(id)
    }
  }
}
</script>
