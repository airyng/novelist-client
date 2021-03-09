<template>
  <div class="floating-sidebar left">
    <CustomDialog
      title="Выберите фон"
    >
      <template #toggler>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
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
        @OnBackChanged="OnBackChanged"
      />
    </CustomDialog>

    <CustomDialog
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

      <scene-network
        v-if="sceneNetworkDialogActive"
        :scenes="scenes"
        @selectedSceneID="OnSelectedSceneID"
      />
    </CustomDialog>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          rounded
          fab
          dark
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

    <CustomDialog
      title="Основная информация"
    >
      <template #toggler>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
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

      <ConstructorMainSceneInfo
        v-model="localMainInfo"
        :settings="settings.mainInfo"
      />
    </CustomDialog>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-btn
          rounded
          fab
          dark
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
    OnBackChanged (data) {
      this.$emit('OnBackChanged', data)
    },
    onNetworkDialogStateChanged (data) {
      this.sceneNetworkDialogActive = data
    }
  }
}
</script>
