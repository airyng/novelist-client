/* eslint-disable no-console */
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
  backgroundCategories: [],
  hasUnsavedChanges: false,
  scenesPositions: {},
  renderKey: 0
})

export const getters = {
  getSceneById (state) {
    return (id) => {
      return state.scenes.find(scene => scene.id === id)
    }
  },
  getEmptyScene (state) {
    const extremeSceneId = state.scenes.map(s => parseInt(s.id.slice(1)))?.sort((a, b) => a - b)?.pop() || 0
    return () => {
      const id = `s${extremeSceneId + 1}`
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
    const extremeCharacterId = state.characters.map(c => parseInt(c.id.slice(1)))?.sort((a, b) => a - b)?.pop() || 0
    return () => {
      const uid = `c${extremeCharacterId + 1}`
      return {
        name: '',
        id: '', // Надо понять зачем нужен id, если есть uid. Уже не помню
        uid,
        userChoose: [],
        isMainCharacter: false
      }
    }
  },
  getNewAction (state) {
    const extremeActionId = state.scenes.map(scene => scene.actions)?.flat()?.map(a => parseInt(a.id.slice(1)))?.sort((a, b) => a - b)?.pop() || 0
    return (params) => {
      return {
        id: `a${extremeActionId + 1}`,
        actionText: params.text || '',
        to: params.to || false,
        sortIndex: 0,
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
  },
  addScenePosition (state, { sceneId, payload }) {
    state.scenesPositions[sceneId] = payload
  },
  deleteScenePosition (state, sceneId) {
    delete state.scenesPositions[sceneId]
  }
}

export const actions = {
  addScenePosition ({ commit, state }, payload) {
    commit('addScenePosition', payload)
  },
  setScenesPositions ({ commit, state }, { value }) {
    Object.keys(value).forEach((key) => {
      commit('addScenePosition', { sceneId: key, payload: value[key] })
    })
  },
  setUnsavedChangesProp ({ commit }, bPayload) {
    commit('setProperty', ['hasUnsavedChanges', bPayload])
  },
  updateMainSettings ({ commit }, data) {
    commit('setProperty', ['mainInfo', data])
    commit('setProperty', ['hasUnsavedChanges', true])
  },
  setStateToDefault ({ commit }) {
    const mainInfo = {
      title: 'Без названия',
      description: 'Описание отсутствует.',
      status: 'draft' // ['draft', 'test_drive', 'published']
    }
    commit('setProperty', ['scenes', []])
    commit('setProperty', ['characters', []])
    commit('setProperty', ['projectID', null])
    commit('setProperty', ['mainInfo', mainInfo])
    commit('setProperty', ['hasUnsavedChanges', false])
  },
  addScene ({ commit, state }, scene) {
    const scenes = [...state.scenes]
    scenes.push(scene)
    commit('setProperty', ['scenes', scenes])
    commit('setProperty', ['hasUnsavedChanges', true])
    commit('setProperty', ['renderKey', state.renderKey + 1])
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
    const sceneIndex = state.scenes.findIndex(_scene => _scene.id === scene.id)
    const _scenes = [...state.scenes]
    _scenes[sceneIndex] = scene
    commit('setProperty', ['scenes', _scenes])
    commit('setProperty', ['hasUnsavedChanges', true])
    commit('setProperty', ['renderKey', state.renderKey + 1])
  },
  // TODO: уместно будет, чтобы этот метод назывался не update, а set
  updateAllScenes ({ commit, state }, scenes) {
    commit('setProperty', ['scenes', scenes])
    commit('setProperty', ['hasUnsavedChanges', true])
    commit('setProperty', ['renderKey', state.renderKey + 1])
  },
  deleteScene ({ commit, state }, sceneID) {
    const scenes = state.scenes.filter(scene => scene.id !== sceneID)
    console.log('delete', sceneID)
    commit('deleteScenePosition', sceneID)
    commit('setProperty', ['scenes', scenes])
    commit('setProperty', ['hasUnsavedChanges', true])
    commit('setProperty', ['renderKey', state.renderKey + 1])
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
  deleteSceneIdFromActions ({ dispatch, state }, sceneId) {
    state.scenes.forEach((scene) => {
      const hasTransitionToDesiredScene = scene.actions.findIndex(action => action.to === sceneId) >= 0
      if (hasTransitionToDesiredScene) {
        const _scene = JSON.parse(JSON.stringify(scene))
        _scene.actions = _scene.actions.map((action) => {
          if (action.to === sceneId) { action.to = false }
          return action
        })
        dispatch('updateScene', _scene)
      }
    })
  },
  addAction ({ dispatch, state, getters }, { scene, actionParams }) {
    if (state.settings.maxActionsLength > scene.actions.length) {
      const _scene = JSON.parse(JSON.stringify(scene))
      // Увеличиваем индекс сортировки всех экшнов, чтобы
      // подготовить место под новый элемент
      _scene.actions.forEach((action) => {
        action.sortIndex++
      })
      _scene.actions.push(getters.getNewAction(actionParams || {}))
      dispatch('updateScene', _scene)
    } else {
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
    commit('setProperty', ['hasUnsavedChanges', true])
  },
  updateAllCharacters ({ state, commit }, characters) {
    commit('setProperty', ['characters', characters])
    commit('setProperty', ['hasUnsavedChanges', true])
  },
  removeCharacterFromList ({ state, commit }, character) {
    const characters = state.characters.filter(char => char.uid !== character.uid)
    commit('setProperty', ['characters', characters])
    commit('setProperty', ['hasUnsavedChanges', true])
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
