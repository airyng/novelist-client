
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
  activeScene: false, // текущая сцена
  previousScene: false, // предыдущая сцена
  scenes: [], // список сцен
  projectID: null, // ID новеллы
  mainInfo: {
    title: '',
    description: '',
    onTestDrive: false
  }
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
    return () => {
      return {
        id: state.activeScene.actions.length + 1,
        actionText: '',
        to: false
      }
    }
  }
}

export const mutations = {
  setProperty (state, payload) {
    state[payload[0]] = payload[1]
  }
}

export const actions = {
  goToScene ({ commit, state, getters }, elem) { // Переходим на новую сцену
    // сохраняем текущую сцену, в историю переходов
    // теперь будет предыдущей
    commit('setProperty', ['previousScene', state.activeScene])

    if (typeof elem === 'number') {
      commit('setProperty', ['activeScene', getters.getSceneById(state)(elem)])
    } else if (typeof elem === 'object') {
      commit('setProperty', ['activeScene', elem])
    }
  },
  addEmptyAction ({ commit, state, getters }) {
    if (state.settings.maxActionsLength > state.activeScene.actions.length) {
      const activeScene = JSON.parse(JSON.stringify(state.activeScene))
      activeScene.actions.push(getters.getNewAction())
      commit('setProperty', ['activeScene', activeScene])
    }
  },
  addScene ({ commit, state }, scene) {
    const scenes = [...state.scenes]
    scenes.push(scene)
    commit('setProperty', ['scenes', scenes])
  }
}
