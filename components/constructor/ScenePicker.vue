<template>
  <div>
    <v-item-group mandatory>
      <v-row>
        <template v-if="scenes.length > 1">
          <v-col cols="12">
            <v-text-field
              v-model="searchKeyword"
              :clearable="true"
              label="Поиск сцены по названию"
            />
          </v-col>

          <v-col cols="12">
            <v-btn depressed rounded dark @click="callToAddingScene">
              Добавить сцену
            </v-btn>
          </v-col>

          <v-col cols="12">
            <v-list flat>
              <v-list-item-group color="indigo">
                <v-list-item
                  v-for="(_scene, i) in filteredScenes"
                  :key="i"
                >
                  <v-list-item-icon>
                    <v-avatar v-if="_scene.background && _scene.background.type === 'image'">
                      <img
                        :src="$store.state.imagesRepository.list[_scene.background.value]"
                        :alt="_scene.title"
                      >
                    </v-avatar>
                    <v-avatar
                      v-else-if="_scene.background && _scene.background.value"
                      :color="_scene.background.value"
                    />
                    <v-avatar v-else color="grey" />
                  </v-list-item-icon>

                  <v-list-item-content @click="setScene(_scene)">
                    <v-list-item-title>{{ _scene.title || '...' }} - {{ _scene.mainText || '...' }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="12" class="pt-5">
            <p>Сцены еще не были добавлены.</p>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-btn depressed color="purple" rounded dark @click="callToAddingScene">
              Добавить сцену
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-item-group>
  </div>
</template>

<script>
export default {
  name: 'ScenePicker',
  props: {
    scene: { type: Object, required: true }
  },
  data () {
    return {
      searchKeyword: '',
      excerptLimit: 50
    }
  },
  computed: {
    filteredScenes () {
      const scenesWithoutCurrent = this.scenes.filter(scene => scene.id !== this.scene.id)

      if (!this.searchKeyword) { return scenesWithoutCurrent }

      return scenesWithoutCurrent.filter((scene) => {
        if (scene.title.includes(this.searchKeyword)) {
          return true
        } else {
          return scene.mainText.substring(0, this.excerptLimit).includes(this.searchKeyword)
        }
      })
    },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    }
  },
  methods: {
    callToAddingScene () {
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']()
      this.$store.dispatch('constructorStorage/addScene', newScene)
      this.setScene(newScene)
    //   this.$emit('callToAddingScene')
    },
    setScene (scene) {
      this.$emit('OnScenePicked', { type: 'scene', scene })
    }
  }
}
</script>
