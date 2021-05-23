<template>
  <div v-if="isLoading" class="project-saver">
    <v-progress-circular
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    />
  </div>
</template>

<script>
import { SuccessMessage, ErrorMessages } from '@/plugins/toast'
export default {
  data () {
    return {
      isLoading: false,
      errors: []
    }
  },
  computed: {
    settings () {
      return this.$store.state.constructorStorage.settings
    },
    mainInfo () {
      return this.$store.state.constructorStorage.mainInfo
    },
    id () {
      return this.$store.state.constructorStorage.projectID
    },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    characters () {
      return this.$store.state.constructorStorage.characters
    }
  },
  methods: {
    async beginSaving () {
      // Если режим установлен на тест-драйв, то валидируем
      // иначе просто сохраняем
      if (this.mainInfo.onTestDrive) {
        this.validateAndSave()
      } else {
        this.isLoading = true

        // if (await this.save()) { this.showSuccess() } else { this.showErrors() }
        await this.save() ? this.showSuccess() : this.showErrors()

        this.isLoading = false
      }
    },
    async save () {
      this.clearErrors()

      const json = {
        scenes: this.scenes,
        characters: this.characters,
        version: this.$store.getters['constructorStorage/version']
      }
      const data = {
        json: JSON.stringify(json),
        title: this.mainInfo.title,
        description: this.mainInfo.description,
        onTestDrive: this.mainInfo.onTestDrive,
        id: this.id
      }
      // localStorage.setItem('game', JSON.stringify(data))
      // console.log('saved')
      const responseStatus = await this.$api.saveGame(data)

      if (responseStatus !== 200) {
        this.addError('Неизвестная ошибка. Проверьте все сцены на наличие ошибок.')
        this.showErrors()
        return false
      }
      return true
    },
    async validateAndSave () {
      this.isLoading = true

      this.clearErrors()

      this.checkMainSettings()

      this.checkSeparatedScenes()

      this.checkDeadlockScenes()

      this.checkExitExistence()

      this.checkForEmptyActions()

      this.checkForOverloadTextBoxes()

      if (this.errors.length) {
        this.showErrors()
        this.isLoading = false
        return false
      }

      if (await this.save()) { this.showSuccess() } else { this.showErrors() }

      this.isLoading = false
    },
    showSuccess () {
      SuccessMessage({ title: 'Сохранено!' })
    },
    checkForEmptyActions () {
      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index]

        if (this.isSceneHasEmptyAction(scene)) {
          this.addError("Не во всех сценах указан текст 'экшенов'. Например, в " + scene.title)
          return false
        }
      }
    },
    checkForOverloadTextBoxes () {
      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index]

        if (scene.mainText.length < this.settings.mainTextMinLength) {
          this.addError('Минимальная длина текстового блока - ' + this.settings.mainTextMinLength + ' символов. Проблема на ' + scene.title)
          return false
        }

        if (scene.mainText.length > this.settings.mainTextMaxLength) {
          this.addError('Не все текстовые блоки имеют допустимую длину строки. Например, в ' + scene.title)
          return false
        }

        for (let index2 = 0; index2 < scene.actions.length; index2++) {
          const action = scene.actions[index2]

          if (action.actionText.length > this.settings.actionTextMaxLength) {
            this.addError("Не все 'экшены' имеют допустимую длину строки. Например, в " + scene.title)
            return false
          }
        }
      }

      return true
    },
    isSceneHasEmptyAction (scene) {
      for (let index = 0; index < scene.actions.length; index++) {
        const action = scene.actions[index]

        if (!action.actionText.length) {
          return true
        }
      }

      return false
    },
    checkExitExistence () { // проверяем, если ли в новелле хотя бы один выход
      let gameHasExit = false

      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index]

        if (this.isSceneHasExit(scene)) { gameHasExit = true }
      }

      if (!gameHasExit) { this.addError('В новелле нет ни одной кнопки выхода') }
    },
    checkMainSettings () {
      if (this.mainInfo.title.length < this.settings.mainInfo.title.minLength) { this.addError('Минимальная длина названия новеллы составляет ' + this.settings.mainInfo.title.minLength + ' символов') } else if (this.mainInfo.title.length > this.settings.mainInfo.title.maxLength) { this.addError('Максимальная длина названия новеллы составляет ' + this.settings.mainInfo.title.maxLength + ' символов') }

      if (this.mainInfo.description.length < this.settings.mainInfo.description.minLength) { this.addError('Минимальная длина описания новеллы составляет ' + this.settings.mainInfo.description.minLength + ' символов') } else if (this.mainInfo.description.length > this.settings.mainInfo.description.maxLength) { this.addError('Максимальная длина описания новеллы составляет ' + this.settings.mainInfo.description.maxLength + ' символов') }
    },
    checkDeadlockScenes () { // проверяем все сцены на наличие тупиковых
      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index]

        if (!this.isSceneHasTransition(scene)) {
          this.addError('Не все сцены имеют переход. Например, ' + scene.title)
          return false
        }
      }
    },
    checkSeparatedScenes () {
      const scenesIDsWithTransitions = this.getScenesIDsWithTransitions()

      for (let index = 1; index < this.scenes.length; index++) { // начинаем с 1го индекса, потому как 0ой - это стартовая сцена
        const scene = this.scenes[index]

        if (!scenesIDsWithTransitions.includes(scene.id)) {
          this.addError('Не на все сцены настроен переход. Например, ' + scene.title)
          return false
        }
      }
    },
    clearErrors () {
      this.errors = []
    },
    addError (text) {
      this.errors.push(text)
    },
    showErrors () {
      const swalObj = []

      for (const key in this.errors) {
        if (Object.prototype.hasOwnProperty.call(this.errors, key)) {
          swalObj.push({
            text: this.errors[key]
          })
        }
      }
      ErrorMessages(swalObj)
      // Swal.mixin({
      //   title: 'Ошибка!',
      //   icon: 'error',
      //   toast: true,
      //   position: 'bottom'
      // })
      //   .queue(swalObj)
    },
    isSceneHasExit (scene) { // проверяем, если ли в сцене хотя бы один выход
      let sceneHasExit = false

      for (let index = 0; index < scene.actions.length; index++) {
        const action = scene.actions[index]

        if (action.to === 'quit') {
          sceneHasExit = true
          break
        }
      }

      return sceneHasExit
    },
    isSceneHasTransition (scene) { // проверям, является ли сцена тупиковой (безвыходной)
      let sceneHasTransition = false

      for (let index = 0; index < scene.actions.length; index++) {
        const action = scene.actions[index]

        if (action.to) {
          sceneHasTransition = true
          break
        }
      }

      return sceneHasTransition
    },
    getScenesIDsWithTransitions () { // получаем id сцен, на которые ведут все имеющиеся экшены переходов
      const sceneIDs = []

      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index]

        for (let actionIndex = 0; actionIndex < scene.actions.length; actionIndex++) {
          const action = scene.actions[actionIndex]

          if (action.to && typeof action.to === 'number') { sceneIDs.push(action.to) }
        }
      }
      return sceneIDs
    }
    // removeAction(scene, action){
    //     var index = scene.actions.indexOf(action)

    //     if(index >= 0) scene.actions.splice(index, 1)
    // },
  }
}
</script>

<style lang="sass">
.project-saver
  position: absolute
  top: 20px
  left: 20px
  background-color: rgba(255, 255, 255, 0.3)
  border-radius: 100%
</style>
