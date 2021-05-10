/* eslint-disable no-console */
// backend api calls
import { ErrorMessage, SuccessMessage } from '@/plugins/toast'

export default function ({ $axios }, inject) {
  if (!$axios) { return }
  // May be will be better to move this setting to nuxt.config.js
  // $axios.defaults.withCredentials = true

  const getApiURL = () => process.env.API_CLIENT_URL // process.server ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_CLIENT_URL

  const getLatestGames = () => {
    return $axios.get(getApiURL() + 'game/published')
      .then((response) => {
        if (!process.server) {
          console.log('getLatestGames success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        console.error(e)
        ErrorMessage({
          title: 'Ошибка загрузки данных',
          text: 'Пожалуйста, обновите страницу'
        })
      })
  }

  const getGameByID = (id) => {
    return $axios.get(getApiURL() + `game/${id}`)
      .then((response) => {
        if (!process.server) {
          console.log('getGameByID success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        console.error(e)
        ErrorMessage({
          title: 'Ошибка загрузки данных',
          text: 'Пожалуйста, обновите страницу'
        })
        return false
      })
  }

  const register = (formData) => {
    return $axios.post(getApiURL() + 'register', formData)
      .then((response) => {
        if (!process.server) {
          console.log('register success', response.data)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const login = ({ email, password }) => {
    return $axios.post(getApiURL() + 'auth/login', { email, password })
      .then((response) => {
        if (!process.server) {
          console.log('login success', response.data)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const refresh = (token) => {
    return $axios.post(getApiURL() + 'auth/refresh', { token })
      .then((response) => {
        if (!process.server) {
          console.log('login refresh success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const logout = () => {
    return $axios.post(getApiURL() + 'auth/logout')
      .then((response) => {
        if (!process.server) {
          console.log('logout success')
        }
      })
  }

  const getMe = () => {
    return $axios.get(getApiURL() + 'auth/me')
      .then((response) => {
        if (!process.server) {
          console.log('getMe success', response.data)
        }
        SuccessMessage({
          title: 'Вход выполнен!'
        })
        return response.data
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const getMyGamesList = () => {
    return $axios.get(getApiURL() + 'game/my')
      .then((response) => {
        if (!process.server) {
          console.log('getMyGamesList success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const publishGame = (id) => {
    return $axios.post(getApiURL() + 'game/publish', { id })
      .then((response) => {
        if (!process.server) {
          console.log('publishGame success', response.data)
        }
        return response.status
      })
      .catch((e) => {
        console.error(e)
        return e.response.status
      })
  }

  const unpublishGame = (id) => {
    return $axios.post(getApiURL() + 'game/unpublish', { id })
      .then((response) => {
        if (!process.server) {
          console.log('unpublishGame success', response.data)
        }
        return response.status
      })
      .catch((e) => {
        console.error(e)
        return e.response.status
      })
  }

  const saveGame = (game) => {
    return $axios.post(getApiURL() + 'game/save', game)
      .then((response) => {
        if (!process.server) {
          console.log('saveGame success', response.data)
        }
        return response.status
      })
      .catch((e) => {
        console.error(e)
        return e.response.status
      })
  }

  const api = {
    // put list of methods here...
    register,
    login,
    refresh,
    logout,
    getMe,
    getApiURL,
    getGameByID,
    getLatestGames,
    getMyGamesList,
    publishGame,
    unpublishGame,
    saveGame
  }

  inject('api', api)
}

// {"user":{"id":1,"role_id":1,"name":"Airyng","email":"airyng@yandex.ru","avatar":"users\/default.png","email_verified_at":null,"settings":{"locale":"ru"},"created_at":"2020-08-03T12:49:31.000000Z","updated_at":"2020-10-04T05:13:34.000000Z","sex":null},"token":"97|UvvO6WuhrsMxyJgu04Nb4NhCgY7f80Q8WPsXAmmx4CpirmeDCMcCFCURyaPDko6v1iEkpCRzhFh5LtnF"}
