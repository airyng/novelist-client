<template>
  <v-row v-if="localAction && activeScene">
    <v-col sm="10" class="d-flex">
      <!-- Кнопки перемещения очередности -->
      <div
        v-if="activeScene.actions.length > 1"
        class="d-flex flex-column mt-1 mr-1"
      >
        <v-icon
          class="curs-pointer"
          rounded
          @click="changeActionOrder('up')"
        >
          mdi-arrow-up-drop-circle-outline
        </v-icon>
        <v-icon
          class="curs-pointer"
          rounded
          @click="changeActionOrder('down')"
        >
          mdi-arrow-down-drop-circle-outline
        </v-icon>
      </div>
      <!-- Кнопки перемещения очередности - конец -->

      <!-- Вероятно изменение текста не будет работать! нужно как-то обновлять сответствующий пропс -->
      <v-text-field
        v-model="localAction.actionText"
        name="actionText"
        label="Действие/Ответ"
        filled
        :counter="actionTextMaxLength"
        background-color="#444"
        dark
        @input="save"
      />
    </v-col>
    <v-col sm="2">
      <v-tooltip v-if="typeof action.to == 'number'" top>
        <template #activator="{ on, attrs }">
          <v-chip
            close
            color="purple"
            text-color="white"
            v-bind="attrs"
            @click:close="clearActionToParam"
            @click="OnGoToScene(action.to)"
            v-on="on"
          >
            {{ getSceneById(action.to).title }}
          </v-chip>
        </template>
        <span>Переход на {{ getSceneById(action.to).title }}</span>
      </v-tooltip>

      <v-tooltip v-if="action.to == 'quit'" top>
        <template #activator="{ on, attrs }">
          <v-chip
            close
            color="black"
            text-color="white"
            v-bind="attrs"
            @click:close="clearActionToParam"
            v-on="on"
          >
            Выход
          </v-chip>
        </template>
        <span>Выход из новеллы</span>
      </v-tooltip>

      <v-menu left bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            rounded
            fab
            dark
            small
            class="text-center justify-center"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon rounded>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="openScenePicker(action)"
          >
            <v-list-item-title>
              Переход на сцену
            </v-list-item-title>
          </v-list-item>

          <v-list-item
            @click="setQuitAction(action)"
          >
            <v-list-item-title>
              Выход
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-if="activeScene.actions.length > 1"
        rounded
        fab
        dark
        small
        class="text-center justify-center"
        @click="removeAction(action)"
      >
        <v-icon rounded>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <CustomDialog
      :toggler="scenePickerDialog"
      title="Выберите сцену"
      @onDialogStateChanged="onScenePickerDialogStateChanged"
    >
      <ConstructorScenePicker
        :current-scene="activeScene"
        :scenes="scenes"
        :action="pickedAction"
        @callToAddingScene="onAddSceneAndGo"
        @OnScenePicked="setAction"
      />
    </CustomDialog>
  </v-row>
</template>

<script>
export default {
  props: {
    scene: { type: Object, required: true },
    action: { type: Object, required: true }
  },
  data () {
    return {
      activeScene: null,
      localAction: null,
      scenePickerDialog: false,
      pickedAction: false // экшн, который будет передан в компонент для настройки
    }
  },
  computed: {
    actionTextMaxLength () {
      return this.$store.state.constructorStorage.settings.actionTextMaxLength
    },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    }
  },
  watch: {
    scene () {
      this.getSceneFromStorage()
    },
    action () {
      this.setLocalAction()
    }
  },
  mounted () {
    this.getSceneFromStorage()
    this.setLocalAction()
  },
  methods: {
    getSceneFromStorage () {
      this.activeScene = { ...this.scene }
    },
    setLocalAction () {
      this.localAction = { ...this.action }
    },
    // setDataFromProps () {
    // if (this.localActiveScene !== this.activeScene) {
    //   this.localActiveScene = { ...this.activeScene }
    // }
    //   if (this.localAction !== this.action) {
    //     this.localAction = { ...this.action }
    //   }
    // },
    setQuitAction (action) {
      const data = { type: 'quit', action }
      this.setAction(data)
    },
    changeActionOrder (direction) {
      this.$emit('onOrderChange', { id: this.localAction.id, direction })
    },
    clearActionToParam (action) {
      this.localAction.to = false
      this.$emit('onSave', this.localAction)
    },
    OnGoToScene (scene) {
      this.$emit('OnGoToScene', scene)
    },
    openScenePicker (action) { // передаем выбранный экшн
      this.scenePickerDialog = true
      this.pickedAction = action
    },
    closeScenePicker () {
      this.scenePickerDialog = false
    },
    onScenePickerDialogStateChanged (data) {
      this.scenePickerDialog = data
    },
    setAction (data) { // {type: [string], action: [object], scene: [object]}
      if (data.type === 'scene') {
        for (const action in this.activeScene.actions) {
          if (this.activeScene.actions[action].id === data.action.id) {
            this.activeScene.actions[action].to = data.scene.id
          }
        }
        this.$emit('updatedScene', this.activeScene)
        // закрываем диалоговое окно выбора сцены
        // возможно стоит вынести в отдельный метод,
        // если текущий метод будет еще где-то использоваться
        this.closeScenePicker()
      }

      if (data.type === 'quit') {
        // for (const action in this.activeScene.actions) {
        //   if (this.activeScene.actions[action].id === data.action.id) {
        this.localAction.to = 'quit'
        // }
        // }
        this.$emit('onSave', this.localAction)
      }
    },
    onAddSceneAndGo (data) {
      this.$emit('onAddSceneAndGo', data)
      this.closeScenePicker()
    },
    removeAction () {
      this.$emit('onRemove', this.localAction.id)
    },
    save () {
      this.$emit('onSave', this.localAction)
    },
    getSceneById (id) {
      return { ...this.$store.getters['constructorStorage/getSceneById'](this.id) }
    }
  }
}
</script>
