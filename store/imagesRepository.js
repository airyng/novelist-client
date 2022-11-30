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

  async linkFetch ({ commit, state }, imageId) {
    if (state.list[imageId]) { return state.list[imageId] }

    const getImageLinkResponse = await this.$api.getImageLink(imageId)

    if (getImageLinkResponse.status === 200) {
      commit('addToList', [imageId, getImageLinkResponse.data])
      return getImageLinkResponse.data
    }
    return null
  }
}
