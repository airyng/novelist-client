/* eslint-disable no-console */
// backend api calls
import { ErrorMessage } from '@/plugins/toast'

export default function ({ $axios }, inject) {
  if (!$axios) { return }
  // May be will be better to move this setting to nuxt.config.js
  // $axios.defaults.withCredentials = true

  const getBackendURL = () => process.env.API_BACKEND_URL
  const getObjectStorageURL = () => process.env.API_OBJECT_STORAGE_URL
  // TODO: Многие вещи в каждом методе повторяются. Нужно оптимизировать.
  // Так же желательно выделить запросы по отдельным файлам, группируя по смыслу.
  const getSexes = () => {
    return $axios.get(getBackendURL() + 'sex')
      .then((response) => {
        return response.data
      }).catch((e) => {
        console.error(e)
        ErrorMessage({
          title: 'Ошибка загрузки данных',
          text: 'Пожалуйста, обновите страницу'
        })
      })
  }

  const getGames = () => {
    return $axios.get(getBackendURL() + 'games')
      .then((response) => {
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
    return $axios.get(getBackendURL() + `games/${id}`)
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
    return $axios.post(getBackendURL() + 'register', formData)
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
    return $axios.post(getBackendURL() + 'login', { email, password })
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

  const refresh = (refreshToken) => {
    return $axios.post(getBackendURL() + 'token', { refresh_token: refreshToken })
      .then((response) => {
        if (!process.server) {
          console.log('login refresh success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        console.error(e)
        return false
      })
  }

  const logout = (refreshToken) => {
    return $axios.delete(getBackendURL() + `logout/${refreshToken}`)
      .then((response) => {
        if (!process.server) {
          console.log('logout success')
        }
      })
  }

  const getProfile = async () => {
    try {
      const response = await $axios.get(getBackendURL() + 'profile')
      console.log('getProfile success', response.data)
      return response.data
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const getMyGamesList = () => {
    return $axios.get(getBackendURL() + 'games/my')
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
    return $axios.post(getBackendURL() + 'games/publish', { id })
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
    return $axios.post(getBackendURL() + 'games/unpublish', { id })
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
    console.log('game', { ...game })
    return $axios.post(getBackendURL() + 'games', game)
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

  const updateGame = (game) => {
    console.log('game', { ...game })
    return $axios.patch(getBackendURL() + `games/${game._id}`, game)
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

  const getBackgrounds = () => {
    return $axios.get(getBackendURL() + 'background/list')
      .then((response) => {
        if (!process.server) {
          console.log('getBackgrounds success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        throw new Error(e)
      })
  }

  const getBackgroundCategories = () => {
    return $axios.get(getBackendURL() + 'background/categories')
      .then((response) => {
        if (!process.server) {
          console.log('getBackgroundCategories success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        throw new Error(e)
      })
  }

  const getUser = (id) => {
    return $axios.get(getBackendURL() + `users/${id}`)
      .then((response) => {
        if (!process.server) {
          console.log('getUser success', response.data)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return false
      })
  }

  const sendReport = (formData) => {
    return $axios.post(getBackendURL() + 'report/send', formData)
      .then((response) => {
        if (!process.server) {
          console.log('sendReport success', response)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const getImageLink = (imageId) => {
    return $axios.get(getObjectStorageURL() + 'link/' + imageId)
      .then((response) => {
        if (!process.server) {
          console.log('getImageLink success', response)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const uploadImage = (data) => {
    return $axios.post(getObjectStorageURL() + 'f', data)
      .then((response) => {
        if (!process.server) {
          console.log('uploadImage success', response)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const deleteImage = (fileId) => {
    return $axios.delete(getObjectStorageURL() + `f/${fileId}`)
      .then((response) => {
        if (!process.server) {
          console.log('deleteImage success', response)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const updateUser = (data) => {
    return $axios.patch(getBackendURL() + `users/${data.id}`, data)
      .then((response) => {
        if (!process.server) {
          console.log('updateUser success', response)
        }
        return response
      })
      .catch((e) => {
        console.error(e)
        return e.response
      })
  }

  const api = {
    // put list of methods here...
    register,
    login,
    refresh,
    logout,
    getProfile,
    getBackendURL,
    getGameByID,
    getGames,
    getMyGamesList,
    publishGame,
    unpublishGame,
    saveGame,
    updateGame,
    getBackgrounds,
    getBackgroundCategories,
    getUser,
    sendReport,
    getSexes,
    uploadImage,
    deleteImage,
    updateUser,
    getImageLink
  }

  inject('api', api)
}

// {"user":{"id":1,"role_id":1,"name":"Airyng","email":"airyng@yandex.ru","avatar":"users\/default.png","email_verified_at":null,"settings":{"locale":"ru"},"created_at":"2020-08-03T12:49:31.000000Z","updated_at":"2020-10-04T05:13:34.000000Z","sex":null},"token":"97|UvvO6WuhrsMxyJgu04Nb4NhCgY7f80Q8WPsXAmmx4CpirmeDCMcCFCURyaPDko6v1iEkpCRzhFh5LtnF"}
