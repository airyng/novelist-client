import { EventBus } from '~/plugins/event'

export const state = () => ({
  settings: { // настройки редактора
    mainTextMaxLength: 500,
    mainTextMinLength: 5,
    actionTextMaxLength: 80,
    maxActionsLength: 3,
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
  mainInfo: null
})

export const getters = {
  getSceneById (state) {
    return (id) => {
      return state.scenes.filter(scene => scene.id === id)[0]
    }
  },
  getEmptyScene (state) {
    const id = state.scenes.length + 1
    return {
      id,
      title: 'Сцена ' + id,
      mainText: '',
      background: null,
      actions: []
    }
  },
  getNewAction (state) {
    return (scene) => {
      if (!scene) { return false }
      return {
        id: scene.actions.length + 1,
        actionText: '',
        to: false
      }
    }
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

  // addEmptyAction ({ commit, state, getters }) {
  //   if (state.settings.maxActionsLength > state.activeScene.actions.length) {
  //     const activeScene = JSON.parse(JSON.stringify(state.activeScene))
  //     activeScene.actions.push(getters.getNewAction())
  //     commit('setProperty', ['activeScene', activeScene])
  //   }
  // },

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

  addAction ({ dispatch, state, getters }, scene) {
    if (state.settings.maxActionsLength > scene.actions.length) {
      const _scene = JSON.parse(JSON.stringify(scene))
      _scene.actions.push(getters.getNewAction(_scene))
      dispatch('updateScene', _scene)
    } else {
      // To do: Show error message
    }
  }
}
