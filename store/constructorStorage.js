/* eslint-disable no-console */
import { EventBus } from '~/plugins/event'
import { ErrorMessage } from '~/plugins/toast'

export const state = () => ({
  settings: { // настройки редактора
    mainTextMaxLength: 500,
    mainTextMinLength: 3, // Минимальное кол-во текста в основном текстбоксе
    actionTextMaxLength: 100,
    maxActionsLength: 3,
    maxSceneTitleLength: 50,
    mainInfo: {
      title: {
        minLength: 5,
        maxLength: 120
      },
      description: {
        minLength: 20,
        maxLength: 500
      }
    },
    maxCharactersLength: 10 // Максимально допустипое кол-во персонажей для создания в рамках одной новеллы
  },
  scenes: [], // список сцен
  projectID: null, // ID новеллы
  mainInfo: null,
  characters: [],
  backgrounds: [],
  backgroundCategories: []
})

export const getters = {
  getSceneById (state) {
    return (id) => {
      return state.scenes.filter(scene => scene.id === id)[0]
    }
  },
  getEmptyScene (state) {
    return () => {
      const id = new Date().getTime()
      const title = state.scenes.length ? 'Сцена ' + id : 'Старт'
      return {
        id, // Уникальный идентификатор сцены
        title, // Заголовок сцены (не виден во время игры)
        mainText: '', // Основной текст сцены
        background: { // Данные о фоне
          type: 'color',
          value: '#9E9E9EFF'
        },
        actions: [], // Список экшнов (действий)
        character: false, // ID персонажа
        showCharFromRight: false, // Флаг необходимости отображать анимацию появления персонажа справа
        goNextWithoutChoice: false // Флаг возможности перехода к следующей сцене без клика по экшену. Переход произойдет по двойному клику на блок текста
      }
    }
  },
  getNewCharacter (state) {
    return () => {
      const uid = new Date().getTime()
      return {
        name: '',
        id: '',
        uid,
        userChoose: [],
        isMainCharacter: false
      }
    }
  },
  getNewAction (state) {
    return (params) => {
      return {
        id: new Date().getTime(),
        actionText: params.text || '',
        to: params.to || false,
        condition: params.condition || false
      }
    }
  },
  getConditions (state) {
    return [
      {
        text: 'Нет',
        value: false
      },
      {
        text: 'Игрок посетил сцену',
        value: 'scene_visited'
      },
      {
        text: 'Игрок не посетил сцену',
        value: 'scene_not_visited'
      }
    ]
  },
  getElseConditions (state) {
    return [
      {
        text: 'Заблокировать действие',
        value: 'block'
      },
      {
        text: 'Скрыть действие',
        value: 'hide'
      }
    ]
  },
  getCharPartsSettings (state) {
    return () => [
      { imageID: false, folder: 'Base', nameBase: 'base' },
      { imageID: false, folder: 'Bottoms', nameBase: 'bottom' },
      { imageID: false, folder: 'Eyebrows', nameBase: 'eyebrows' },
      { imageID: false, folder: 'Eyes', nameBase: 'eyes' },
      { imageID: false, folder: 'Mouth', nameBase: 'mouth' },
      // { imageID: false, folder: 'Misc', nameBase: '' },
      { imageID: false, folder: 'Tops', nameBase: 'top' },
      { imageID: false, folder: 'Hair', nameBase: 'hair' }
    ]
  }
}

// TODO: мутации можно вынести в отдельный миксин, так как они везде повторяются
export const mutations = {
  setProperty (state, payload) {
    state[payload[0]] = payload[1]
  }
}

export const actions = {
  updateMainSettings ({ commit }, data) {
    commit('setProperty', ['mainInfo', data])
  },
  setStateToDefault ({ commit }) {
    const mainInfo = {
      title: '',
      description: '',
      onTestDrive: false
    }
    commit('setProperty', ['scenes', []])
    commit('setProperty', ['characters', []])
    commit('setProperty', ['projectID', null])
    commit('setProperty', ['mainInfo', mainInfo])
  },
  addScene ({ commit, state }, scene) {
    const scenes = [...state.scenes]
    scenes.push(scene)
    commit('setProperty', ['scenes', scenes])
    // TODO: желательно отказаться от таких вызовов событий
    EventBus.$emit('callToReinitSceneNetwork')
  },
  // TODO: уместно будет, чтобы этот метод назывался не update, а set
  updateProjectID ({ commit, state }, ID) {
    if (!state.projectID) {
      commit('setProperty', ['projectID', ID])
    } else {
      console.error('Unable to set projectID')
    }
  },
  updateScene ({ commit, state }, scene) {
    const scenes = state.scenes.map((item) => {
      if (item.id === scene.id) { item = scene }
      return item
    })
    commit('setProperty', ['scenes', scenes])
    EventBus.$emit('callToReinitSceneNetwork')
  },
  // TODO: уместно будет, чтобы этот метод назывался не update, а set
  updateAllScenes ({ commit }, scenes) {
    commit('setProperty', ['scenes', scenes])
    EventBus.$emit('callToReinitSceneNetwork')
  },
  deleteScene ({ commit, state }, sceneID) {
    const scenes = state.scenes.filter(scene => scene.id !== sceneID)
    commit('setProperty', ['scenes', scenes])
    EventBus.$emit('callToReinitSceneNetwork')
  },
  copyScene ({ dispatch, getters }, { sceneToCopy, setTransition = false }) {
    if (!sceneToCopy) { return }
    // TODO: Это не копирование, а булщит полный.
    // Нужно сделать глубокое копирование всего объекта в одну строку
    const newScene = getters.getEmptyScene()
    newScene.background = sceneToCopy.background
    newScene.character = sceneToCopy.character
    newScene.mainText = sceneToCopy.mainText
    dispatch('addScene', newScene)

    // Устанавливаем экшн переход с копии на новую сцену
    if (setTransition) {
      dispatch('addAction', { scene: sceneToCopy, actionParams: { text: 'Далее...', to: newScene.id } })
    }
  },
  // TODO: надо переименовать этот метод на deleteActionFromScene
  deleteActionToScene ({ dispatch, state }, sceneID) {
    for (let index = 0; index < state.scenes.length; index++) {
      const scene = state.scenes[index]
      const actionToThisScene = scene.actions.find(action => action.to === sceneID)
      if (actionToThisScene) {
        const sceneWithoutThisAction = { ...scene }
        sceneWithoutThisAction.actions = sceneWithoutThisAction.actions.filter(action => action.id !== actionToThisScene.id)
        dispatch('updateScene', sceneWithoutThisAction)
        break
      }
    }
  },
  addAction ({ dispatch, state, getters }, { scene, actionParams }) {
    if (state.settings.maxActionsLength > scene.actions.length) {
      const _scene = JSON.parse(JSON.stringify(scene))
      _scene.actions.push(getters.getNewAction(actionParams || {}))
      dispatch('updateScene', _scene)
    } else {
      // To do: Show error message (Swal)
      ErrorMessage(
        {
          title: 'Действие не создано',
          text: 'Достигнуто максимально возможное кол-во действий'
        }
      )
    }
  },
  // Если находим совпадение по имени, то обновляем персонажа
  // Если нет, то добавляем, как нового
  updateCharacterList ({ state, commit }, character) {
    let isFoundMatch = false
    const characters = state.characters.map((char) => {
      if (char.uid === character.uid) {
        const uid = char.uid
        char = character
        char.uid = uid
        isFoundMatch = true
      }
      return char
    })
    if (!isFoundMatch) {
      characters.push(character)
    }
    commit('setProperty', ['characters', characters])
  },
  updateAllCharacters ({ state, commit }, characters) {
    commit('setProperty', ['characters', characters])
  },
  removeCharacterFromList ({ state, commit }, character) {
    const characters = state.characters.filter(char => char.uid !== character.uid)
    commit('setProperty', ['characters', characters])
  },
  async loadBackgrounds ({ commit, dispatch }) {
    const result = await this.$api.call('getBackgrounds')
    for (let index = 0; index < result.length; index++) {
      const item = result[index]
      item.url = await dispatch('imagesRepository/linkFetch', item.image_id, { root: true })
    }
    commit('setProperty', ['backgrounds', result])
  },
  async loadBackgroundCategories ({ commit }) {
    const result = await this.$api.call('getBackgroundCategories')
    commit('setProperty', ['backgroundCategories', result])
  }
}
