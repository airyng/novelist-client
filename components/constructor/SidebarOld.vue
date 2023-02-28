<template>
  <div class="floating-sidebar left">
    <custom-dialog
      title="Выберите фон"
    >
      <template #toggler>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              depressed
              class="text-center justify-center mb-4"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon rounded>
                mdi-tab-unselected
              </v-icon>
            </v-btn>
          </template>
          <span>Выбрать фон</span>
        </v-tooltip>
      </template>

      <background-picker
        @onBackChanged="onBackChanged"
      />
    </custom-dialog>

    <custom-dialog
      v-if="scenes"
      ref="sceneNetworkDialog"
      title="Схема сцен"
      :with-container="false"
      dark
      @onDialogStateChanged="onNetworkDialogStateChanged"
    >
      <template #toggler>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              depressed
              fab
              dark
              class="text-center justify-center mb-4"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon rounded>
                mdi-graph-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Схема сцен</span>
        </v-tooltip>
      </template>

      <constructor-scene-network
        v-if="sceneNetworkDialogActive"
        :scenes="scenes"
        @selectedSceneID="OnSelectedSceneID"
      />
    </custom-dialog>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          rounded
          fab
          dark
          depressed
          class="text-center justify-center mb-4"
          :class="{disabled: !previousScene}"
          v-bind="attrs"
          @click.stop="goToScene( previousScene )"
          v-on="on"
        >
          <v-icon rounded>
            mdi-history
          </v-icon>
        </v-btn>
      </template>
      <span>Вернуться на предыдущую сцену</span>
    </v-tooltip>

    <custom-dialog
      title="Основная информация"
    >
      <template #toggler>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              depressed
              class="text-center justify-center mb-4"
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

      <constructor-main-scene-info
        v-model="localMainInfo"
        :settings="settings.mainInfo"
      />
    </custom-dialog>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          rounded
          fab
          dark
          depressed
          class="text-center justify-center mb-4"
          v-bind="attrs"
          v-on="on"
          @click="$emit('OnSaveStarted')"
        >
          <v-icon rounded>
            mdi-content-save-outline
          </v-icon>
        </v-btn>
      </template>
      <span>Сохранить</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    scenes: {
      type: [Array, Boolean], default: false
    },
    previousScene: {
      type: [Object, Boolean], default: false
    },
    mainInfo: {
      type: Object, required: true
    },
    activeScene: {
      type: Object, required: true
    },
    settings: {
      type: Object, required: true
    }
  },
  data () {
    return {
      sceneNetworkDialogActive: false,
      localMainInfo: null
    }
  },
  mounted () {
    this.localMainInfo = this.mainInfo
  },
  methods: {
    OnSelectedSceneID (data) {
      this.$emit('OnSelectedSceneID', data)
      this.$refs.sceneNetworkDialog.close()
    },
    goToScene (scene) {
      this.$emit('OnBackToPrevScene', scene)
    },
    onBackChanged (data) {
      this.$emit('onBackChanged', data)
    },
    onNetworkDialogStateChanged (data) {
      this.sceneNetworkDialogActive = data
    }
  }
}
</script>
