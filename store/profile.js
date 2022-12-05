/* eslint-disable no-console */
// TODO: Очень странно, что этот модуль называется profile,
// но находится здесь именно информация и методы связанные с играми текущего пользователя,
// при том, что основная информация содержится в индексном модуле.
// Нужно либо переименовать этот модуль во что-то более релевантное,
// либо перенестил данные о пользователе сюда.
import gameChecker from '@/plugins/gameChecker'

export const state = () => ({
  myGames: []
})

export const getters = {
}

export const mutations = {
  setProperty (state, payload) {
    state[payload[0]] = payload[1]
  }
}

export const actions = {
  /**
   * Метод запрашивает список игр созданных пользователем
   * и сохранает в storage
   */
  async getMyGames ({ commit }) {
    try {
      const myGames = await this.$api.call('getMyGamesList')
      // adaptaion on air
      myGames?.forEach((item) => {
        let game = JSON.parse(item.json)
        if (!gameChecker.isLatestVersion(game)) {
          game = gameChecker.updateGameToLatestVersion(game)
          item.json = JSON.stringify(game)
        }
      })

      commit('setProperty', ['myGames', myGames])
    } catch (err) {
      commit('setProperty', ['myGames', []])
      console.error(err)
    }
  },
  /**
   * Метод обновляет данные об игре пользователя
   */
  updateMyGames ({ commit }, games) {
    commit('setProperty', ['myGames', games])
  }
}
