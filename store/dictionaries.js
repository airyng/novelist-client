import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/plugins/api'

export const plugins = [api]

Vue.use(Vuex)

export const state = () => ({
  latestGames: [],
  sexTypes: []
})

export const getters = {}

export const mutations = {
  setProperty (state, payload) {
    state[payload[0]] = payload[1]
  }
}

export const actions = {
  async sexFetch ({ commit }) {
    const result = await this.$api.call('getSexes')
    commit('setProperty', ['sexTypes', result])
  },
  /**
   * Метод получает список из последних опубликованных новелл
   * и сохраняет его в хранилище
   */
  async gamesFetch ({ commit }) {
    const result = await this.$api.call('getGames', { status: 'published' })
    commit('setProperty', ['latestGames', result])
  }
}
