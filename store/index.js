/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/plugins/api'

export const plugins = [api]

Vue.use(Vuex)

export const state = () => ({
  latestGames: [],
  userData: false
})
export const getters = {
  // defaultAvatar () {
  //   return require('@/assets/img/defaultAvatar.png')
  // },
}

export const mutations = {
  setProperty (state, payload) {
    state[payload[0]] = payload[1]
  }
}

export const actions = {
  logout () {
    // TO DO
  },
  async getLatestGames ({ commit }) {
    try {
      const result = await this.$api.getLatestGames()
      commit('setProperty', ['latestGames', result])
    } catch (err) {
      throw err
    }
  }
  // async forgotPassword({ commit, dispatch, getters }, { Email } ) {
  //   try {
  //     await this.$api.forgotPassword(Email)
  //   } catch (err) {
  //     throw err
  //   }
  // },
}
