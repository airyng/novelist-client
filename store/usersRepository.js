import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/plugins/api'

export const plugins = [api]

Vue.use(Vuex)

export const state = () => ({
  list: {}
})

export const getters = {}

export const mutations = {
  addToList (state, payload) {
    state.list[payload[0]] = payload[1]
  }
}

export const actions = {

  async userFetch ({ commit, state }, userId) {
    if (state.list[userId]) { return state.list[userId] }

    const getUserResponse = await this.$api.call('getUser', userId)

    if (getUserResponse.status === 200) {
      commit('addToList', [userId, getUserResponse.data])
      return getUserResponse.data
    }
    return null
  }
}
