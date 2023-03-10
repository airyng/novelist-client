/* eslint-disable no-console */
import { ErrorMessage } from '@/plugins/toast'

export default function ({ $axios, store }, inject) {
  if (!$axios) { return }

  const backendURL = process.env.API_BACKEND_URL
  const objectStorageURL = process.env.API_OBJECT_STORAGE_URL

  inject('api', {
    config: {
      getSexes: {
        method: 'get',
        getPath: () => `${backendURL}sex`
      },
      getGames: {
        method: 'get',
        getPath: (params) => {
          let query = ''
          if (params) {
            query = '?' + (new URLSearchParams(params)).toString()
          }
          return `${backendURL}games${query}`
        }
      },
      getGameByID: {
        method: 'get',
        getPath: id => `${backendURL}games/${id}`
      },
      register: {
        method: 'post',
        getPath: () => `${backendURL}register`
      },
      login: {
        method: 'post',
        getPath: () => `${backendURL}login`,
        reconnect: false,
        returnType: 'all'
      },
      refresh: {
        method: 'post',
        getPath: () => `${backendURL}token`,
        reconnect: false
      },
      logout: {
        method: 'delete',
        getPath: refreshToken => `${backendURL}logout/${refreshToken}`,
        reconnect: false
      },
      getProfile: {
        method: 'get',
        getPath: () => `${backendURL}profile`
      },
      getMyGamesList: {
        method: 'get',
        getPath: () => `${backendURL}games/my`
      },
      publishGame: {
        method: 'post',
        getPath: () => `${backendURL}games/publish`
      },
      unpublishGame: {
        method: 'post',
        getPath: () => `${backendURL}games/unpublish`
      },
      saveGame: {
        method: 'post',
        getPath: () => `${backendURL}games`,
        returnType: 'all'
      },
      updateGame: {
        method: 'patch',
        getPath: id => `${backendURL}games/${id}`,
        returnType: 'all'
      },
      getBackgroundCategories: {
        method: 'get',
        getPath: () => `${backendURL}tags`
      },
      getUser: {
        method: 'get',
        getPath: id => `${backendURL}users/${id}`
      },
      sendReport: {
        method: 'post',
        getPath: () => `${backendURL}reports`,
        returnType: 'all'
      },
      getImageLink: {
        method: 'get',
        getPath: imageId => `${objectStorageURL}link/${imageId}`,
        returnType: 'all'
      },
      uploadImage: {
        method: 'post',
        getPath: () => `${objectStorageURL}f`,
        returnType: 'all'
      },
      deleteImage: {
        method: 'delete',
        getPath: fileId => `${objectStorageURL}f/${fileId}`,
        returnType: 'all'
      },
      updateUser: {
        method: 'patch',
        getPath: id => `${backendURL}users/${id}`,
        returnType: 'all'
      },
      getScenesPositions: {
        method: 'get',
        getPath: gameId => `${backendURL}scenes-positions/${gameId}`,
        returnType: 'all'
      },
      upsertScenesPositions: {
        method: 'post',
        getPath: () => `${backendURL}scenes-positions`,
        returnType: 'all'
      },
      getBackgrounds: {
        method: 'get',
        getPath: () => `${backendURL}backgrounds`
      }
    },
    async call (name, params, payload = null) {
      this.requestsInProgress.include(name)
      const reconnect = true
      const { method, getPath, returnType = 'data' } = this.config[name]

      if (!$axios[method]) {
        this.requestsInProgress.exclude(name)
        throw new Error('Call to undefined api method.')
      }

      try {
        const response = await $axios[method](getPath(params), payload) // main request
        return this._responseHandler({ name, returnType }, response)
      } catch (e) {
        console.error(e)
        if (![403, 401].includes(e.request.status)) {
          this.requestsInProgress.exclude(name)
          return false
        }
      }
      if (!reconnect) {
        this.requestsInProgress.exclude(name)
        return false
      }
      try {
        const success = await store.dispatch('refreshToken')
        if (!success) {
          await store.dispatch('logout')
          throw new Error('Can\'t retrieve new token by existent resfreshToken.')
        }
      } catch (e) {
        this.requestsInProgress.exclude(name)
        console.error(e)
      }
      try {
        const response = await $axios[method](getPath(params), payload) // main request
        return this._responseHandler({ name, returnType }, response)
      } catch (e) {
        console.error(e)
        ErrorMessage({
          title: '???????????? ???????????????? ????????????',
          text: '????????????????????, ???????????????? ????????????????'
        })
        this.requestsInProgress.exclude(name)
        return false
      }
    },
    _responseHandler (config, response) {
      console.log(`${config.name} success`, response?.data)
      this.requestsInProgress.exclude(config.name)
      return config.returnType === 'all' ? response : response?.[config.returnType]
    },
    requestsInProgress: {
      list: [],
      include (requestName) {
        this.list.push(requestName)
      },
      exclude (requestName) {
        const index = this.list.findIndex(req => req === requestName)
        this.list.splice(index, 1)
      }
    },
    waitUntilRequestResolves (requestName) {
      return new Promise((resolve) => {
        let timeout = 1000
        const intervalId = setInterval(() => {
          if (!this.requestsInProgress.list.includes(requestName)) {
            clearInterval(intervalId)
            resolve(true)
          }
          timeout--
          if (timeout < 0) {
            resolve(false)
          }
        }, 10)
      })
    }
  })
}
