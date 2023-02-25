<template>
  <div v-if="localAction && activeScene">
    <div class="d-flex" style="width: 100%">
      <!-- Кнопки перемещения очередности -->
      <div
        v-if="activeScene.actions.length > 1"
        class="d-flex flex-column mt-1 mr-1"
      >
        <v-icon
          rounded
          class="curs-pointer"
          :class="{
            disabled: action.sortIndex >= activeScene.actions.length - 1
          }"
          @click="changeActionOrder('up')"
        >
          mdi-arrow-up-drop-circle-outline
        </v-icon>
        <v-icon
          rounded
          class="curs-pointer"
          :class="{
            disabled: action.sortIndex === 0
          }"
          @click="changeActionOrder('down')"
        >
          mdi-arrow-down-drop-circle-outline
        </v-icon>
      </div>
      <!-- Кнопки перемещения очередности - конец -->

      <v-text-field
        v-model="localAction.actionText"
        name="actionText"
        label="Действие/Ответ"
        filled
        :counter="actionTextMaxLength"
        background-color="#444"
        dense
        dark
        @input="save"
      />
      <div class="d-flex mt-n6 align-center">
        <v-tooltip v-if="hasCondition" top>
          <template #activator="{ on, attrs }">
            <v-chip
              close
              color="black"
              text-color="white"
              v-bind="attrs"
              class="mt-1 ml-1"
              @click:close="clearActionCondition"
              v-on="on"
            >
              Условие
            </v-chip>
          </template>
          <span>Если {{ pickedConditionText }}</span>
        </v-tooltip>
        <v-icon
          v-if="hasCondition && typeof localAction.to == 'number'"
          class="ml-1"
          style="height: 42px"
        >
          mdi-arrow-right-bold
        </v-icon>

        <v-tooltip v-if="localAction.to === 'quit'" top>
          <template #activator="{ on, attrs }">
            <v-chip
              close
              color="black"
              text-color="white"
              class="ml-1"
              v-bind="attrs"
              @click:close="clearActionToParam"
              v-on="on"
            >
              Выход
            </v-chip>
          </template>
          <span>Выход из новеллы</span>
        </v-tooltip>

        <v-tooltip v-if="checkIsActionId(localAction.to)" top>
          <template #activator="{ on, attrs }">
            <v-chip
              close
              color="purple"
              text-color="white"
              v-bind="attrs"
              class="mt-1 ml-1"
              @click:close="clearActionToParam"
              @click="OnGoToScene(localAction.to)"
              v-on="on"
            >
              {{ excerpt(getSceneById(localAction.to).title, 15) }}
            </v-chip>
          </template>
          <span>Переход на {{ getSceneById(localAction.to).title || '...' }}</span>
        </v-tooltip>

        <v-menu left bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              rounded
              fab
              dark
              small
              depressed
              class="text-center justify-center ml-1"
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
              @click="openScenePicker"
            >
              <v-list-item-title>
                Переход на сцену
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              @click="addNewScene"
            >
              <v-list-item-title>
                Добавить сцену
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              @click="openActionConditionPicker"
            >
              <v-list-item-title>
                Переход по условию
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              @click="setQuitAction()"
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
          depressed
          class="text-center justify-center ml-1"
          @click="removeAction()"
        >
          <v-icon rounded>
            mdi-close
          </v-icon>
        </v-btn>

        <v-tooltip v-if="activeScene.actions.length === 1" top>
          <template #activator="{ on, attrs }">
            <div class="d-flex" v-bind="attrs" v-on="on">
              <v-switch
                v-model="activeScene.goNextWithoutChoice"
                class="ml-2 pb-0"
                @change="saveGoNextWithoutChoice"
              />
            </div>
          </template>
          <span>Продолжить без выбора</span>
        </v-tooltip>
      </div>
    </div>

    <custom-dialog
      :toggler="scenePickerDialog"
      title="Выберите сцену"
      @onDialogStateChanged="onScenePickerDialogStateChanged"
    >
      <constructor-scene-picker
        :scene="activeScene"
        @OnScenePicked="setAction"
      />
    </custom-dialog>

    <custom-dialog
      :toggler="conditionPickerDialog"
      title="Укажите условие перехода на сцену"
      @onDialogStateChanged="onConditionPickerDialogStateChanged"
    >
      <constructor-condition-picker
        :scene="activeScene"
        :action="localAction"
        @OnConditionPicked="setCondition"
      />
    </custom-dialog>
  </div>
</template>

<script>
import { excerpt, checkIsActionId } from '@/plugins/utils'

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
      conditionPickerDialog: false,
      pickedAction: false // экшн, который будет передан в компонент для настройки
    }
  },
  computed: {
    actionTextMaxLength () {
      return this.$store.state.constructorStorage.settings.actionTextMaxLength
    },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    conditions () {
      return this.$store.getters['constructorStorage/getConditions']
    },
    hasCondition () {
      return typeof this.localAction.condition === 'object' && typeof this.localAction.condition.type === 'string'
    },
    pickedConditionText () {
      if (!this.localAction.condition || !this.localAction.to) { return false }
      const conditionText = this.conditions.find(item => this.localAction.condition.type === item.value).text
      const sceneName = this.getSceneById(this.localAction.to).title
      return conditionText + ' \'' + sceneName + '\''
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
    checkIsActionId (payload) { return checkIsActionId(payload) },
    saveGoNextWithoutChoice () {
      this.$emit('onSaveSceneParams', { key: 'goNextWithoutChoice', value: this.activeScene.goNextWithoutChoice })
    },
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    },
    getSceneFromStorage () {
      this.activeScene = { ...this.scene }
    },
    setLocalAction () {
      this.localAction = { ...this.action }
    },
    setQuitAction () {
      const action = this.localAction
      const data = { type: 'quit', action }
      this.setAction(data)
    },
    changeActionOrder (direction) {
      this.$emit('onOrderChange', { id: this.localAction.id, direction })
    },
    clearActionToParam () {
      this.localAction.to = false
      this.save()
    },
    OnGoToScene (toScene) {
      this.$emit('onGoToScene', toScene)
    },
    openActionConditionPicker () {
      this.conditionPickerDialog = true
    },
    onConditionPickerDialogStateChanged (data) { // Метод под вопросом
      this.conditionPickerDialog = data
    },
    addNewScene () {
      const newScene = this.$store.getters['constructorStorage/getEmptyScene']()
      this.$store.dispatch('constructorStorage/addScene', newScene)
      this.setAction({ type: 'scene', scene: newScene })
    },
    setCondition (data) {
      this.localAction.condition = data
      this.conditionPickerDialog = false
      this.save()
    },
    openScenePicker () { // передаем выбранный экшн
      this.scenePickerDialog = true
      this.pickedAction = this.localAction
    },
    closeScenePicker () {
      this.scenePickerDialog = false
    },
    clearActionCondition () {
      this.localAction.condition = false
      this.save()
    },
    onScenePickerDialogStateChanged (data) {
      this.scenePickerDialog = data
    },
    setAction (data) { // {type: [string], action: [object], scene: [object]}
      if (data.type === 'scene') {
        this.localAction.to = data.scene.id
        this.save()
        this.closeScenePicker()
      }

      if (data.type === 'quit') {
        this.localAction.to = 'quit'
        this.save()
      }
    },
    removeAction () {
      this.$emit('onRemove', this.localAction.id)
    },
    save () {
      this.$emit('onSave', this.localAction)
    },
    getSceneById (id) {
      return { ...this.$store.getters['constructorStorage/getSceneById'](id) }
    }
  }
}
</script>
