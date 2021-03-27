import { EventBus } from '~/plugins/event'
import { ErrorMessage } from '~/plugins/toast'

export const state = () => ({
  settings: { // настройки редактора
    mainTextMaxLength: 500,
    mainTextMinLength: 5,
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
    }
  },
  scenes: [], // список сцен
  projectID: null, // ID новеллы
  mainInfo: null,
  characters: []
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
      return {
        id,
        title: 'Сцена ' + id,
        mainText: '',
        background: null,
        actions: [],
        character: false
      }
    }
  },
  getNewCharacter (state) {
    return () => {
      const uid = new Date().getTime()
      return {
        name: '',
        id: '',
        uid
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
    commit('setProperty', ['projectID', null])
    commit('setProperty', ['mainInfo', mainInfo])
  },

  addScene ({ commit, state }, scene) {
    const scenes = [...state.scenes]
    scenes.push(scene)
    commit('setProperty', ['scenes', scenes])
    EventBus.$emit('callToReinitSceneNetwork')
  },

  updateScene ({ commit, state }, scene) {
    const scenes = state.scenes.map((item) => {
      if (item.id === scene.id) { item = scene }
      return item
    })
    commit('setProperty', ['scenes', scenes])
    EventBus.$emit('callToReinitSceneNetwork')
  },

  deleteScene ({ commit, state }, sceneID) {
    const scenes = state.scenes.filter(scene => scene.id !== sceneID)
    commit('setProperty', ['scenes', scenes])
    EventBus.$emit('callToReinitSceneNetwork')
  },

  copyScene ({ dispatch, getters }, sceneToCopy) {
    if (!sceneToCopy) { return }
    const newScene = getters.getEmptyScene()
    newScene.background = sceneToCopy.background
    newScene.character = sceneToCopy.character
    newScene.mainText = sceneToCopy.mainText
    dispatch('addScene', newScene)

    // Устанавливаем экшн переход с копии на новую сцену
    dispatch('addAction', { scene: sceneToCopy, actionParams: { text: 'Дальше...', to: newScene.id } })
  },

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
  removeCharacterFromList ({ state, commit }, character) {
    const characters = state.characters.filter(char => char.uid !== character.uid)
    commit('setProperty', ['characters', characters])
  }
}
