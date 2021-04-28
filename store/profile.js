/* eslint-disable no-console */
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
  async getMyGames ({ commit }) {
    try {
      const myGames = await this.$api.getMyGamesList()
      // adaptaion on air
      myGames.forEach((item) => {
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

  updateMyGames ({ commit }, games) {
    commit('setProperty', ['myGames', games])
  }
}
