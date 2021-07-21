/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/plugins/api'
import { EventBus } from '~/plugins/event'

export const plugins = [api]

Vue.use(Vuex)

export const state = () => ({
  latestGames: [],
  userData: false,
  isProcessingTryAutoLogin: false,
  isLoggedIn: null
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
  async authorize ({ commit }, tokenData) {
    try {
      if (tokenData) {
        // set given token in cookie
        this.$atm.setToken(tokenData)
        const userData = await this.$api.getMe()
        commit('setProperty', ['userData', userData])
        commit('setProperty', ['isLoggedIn', true])
        EventBus.$emit('logged-in', { redirect: '/' })
      } else {
        commit('setProperty', ['isLoggedIn', false])
      }
    } catch (err) {
      commit('setProperty', ['isLoggedIn', false])
      console.error(err)
    }
  },

  async tryAutoLogin ({ commit, state, dispatch }) {
    if (state.isLoggedIn || state.isProcessingTryAutoLogin) { return true }
    try {
      if (!this.$atm.getToken()) { throw new Error ('Unauthorized') }
      commit('setProperty', ['isProcessingTryAutoLogin', true])

      await dispatch('refreshToken')

      const userData = await this.$api.getMe() // if cookie present from previous login this will succeed
      if (userData) {
        commit('setProperty', ['userData', userData])
        commit('setProperty', ['isLoggedIn', true])
        EventBus.$emit('logged-in')
      } else {
        throw new Error ('Unauthorized')
      }
      return userData
    } catch (err) {
      commit('setProperty', ['isLoggedIn', false])
      commit('setProperty', ['userData', null])
      console.log('tryAutoLogin - failed')
    } finally {
      commit('setProperty', ['isProcessingTryAutoLogin', false])
    }
  },

  async refreshToken ({ dispatch }) {
    const newTokenData = await this.$api.refresh(this.$atm.getToken())
    if (newTokenData) { this.$atm.setToken(newTokenData) }
    else { dispatch('logout') }
  },

  async logout ({ commit }) {
    try {
      this.$atm.purge() // clear header and cookies
      await this.$api.logout()
      commit('setProperty', ['isLoggedIn', false])
      commit('setProperty', ['userData', null])
    } finally {
      EventBus.$emit('logged-out')
    }
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
