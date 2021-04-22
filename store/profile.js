/* eslint-disable no-console */

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
      const userData = await this.$api.getMyGamesList()
      commit('setProperty', ['myGames', userData])
    } catch (err) {
      commit('setProperty', ['myGames', []])
      console.error(err)
    }
  }
}
