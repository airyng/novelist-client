<template>
  <v-row v-if="localAction && localActiveScene">
    <v-col sm="10" class="d-flex">
      <!-- Кнопки перемещения очередности -->
      <div
        v-if="localActiveScene.actions.length > 1"
        class="d-flex flex-column mt-1 mr-1"
      >
        <v-icon
          class="curs-pointer"
          :class="{disabled: localActiveScene.actions.indexOf(action) <= 0}"
          rounded
          @click="changeActionOrder(action, 'up')"
        >
          mdi-arrow-up-drop-circle-outline
        </v-icon>
        <v-icon
          class="curs-pointer"
          rounded
          :class="{disabled: localActiveScene.actions.indexOf(action) >= localActiveScene.actions.length - 1}"
          @click="changeActionOrder(action, 'down')"
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
            @click:close="clearActionToParam(action)"
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
            @click:close="clearActionToParam(action)"
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
        v-if="localActiveScene.actions.length > 1"
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
        :current-scene="localActiveScene"
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
    actionTextMaxLength: { type: Number, required: true },
    activeScene: { type: Object, required: true },
    action: { type: Object, required: true },
    scenes: { type: Array, required: true }
  },
  data () {
    return {
      scenePickerDialog: false,
      pickedAction: false, // экшн, который будет передан в компонент для настройки
      localAction: null,
      localActiveScene: null
    }
  },
  watch: {
    action () {
      this.setDataFromProps()
    },
    activeScene () {
      this.setDataFromProps()
    }
  },
  mounted () {
    this.setDataFromProps()
  },
  methods: {
    setDataFromProps () {
      if (this.localActiveScene !== this.activeScene) {
        this.localActiveScene = { ...this.activeScene }
      }
      if (this.localAction !== this.action) {
        this.localAction = { ...this.action }
      }
    },
    setQuitAction (action) {
      const data = { type: 'quit', action }
      this.setAction(data)
    },
    changeActionOrder (action, direction) {
      const index = this.localActiveScene.actions.indexOf(action)

      if (direction === 'up') {
        // нельзя уйти выше первого значения
        if (index <= 0) { return }

        this.localActiveScene.actions = this.moveArrElem(this.localActiveScene.actions, index, index - 1)
      }

      if (direction === 'down') {
        // нельзя уйти ниже последнего значения
        if (index >= this.localActiveScene.actions.length - 1) { return }

        this.localActiveScene.actions = this.moveArrElem(this.localActiveScene.actions, index, index + 1)
      }

      this.$emit('updatedScene', this.localActiveScene)
    },
    moveArrElem (arr, oldIndex, newIndex) {
      if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1
        while (k--) {
          arr.push(undefined)
        }
      }
      arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
      return arr // for testing
    },
    clearActionToParam (action) {
      action.to = false
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
        for (const action in this.localActiveScene.actions) {
          if (this.localActiveScene.actions[action].id === data.action.id) {
            this.localActiveScene.actions[action].to = data.scene.id
          }
        }
        this.$emit('updatedScene', this.localActiveScene)
        // закрываем диалоговое окно выбора сцены
        // возможно стоит вынести в отдельный метод,
        // если текущий метод будет еще где-то использоваться
        this.closeScenePicker()
      }

      if (data.type === 'quit') {
        for (const action in this.localActiveScene.actions) {
          if (this.localActiveScene.actions[action].id === data.action.id) {
            this.localActiveScene.actions[action].to = 'quit'
          }
        }
        this.$emit('updatedScene', this.localActiveScene)
      }
    },
    onAddSceneAndGo (data) {
      this.$emit('onAddSceneAndGo', data)
      this.closeScenePicker()
    },
    removeAction (action) {
      const index = this.localActiveScene.actions.indexOf(action)

      if (index >= 0) {
        this.localActiveScene.actions.splice(index, 1)
        this.$emit('updatedScene', this.localActiveScene)
      }
    },
    getSceneById (id) {
      return this.scenes.filter(scene => scene.id === id)[0]
    }
  }
}
</script>
