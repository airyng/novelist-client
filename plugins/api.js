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

  const getPublishedGameByID = (id) => {
    return $axios.get(getApiURL() + `game/${id}`)
      .then((response) => {
        if (!process.server) {
          console.log('getPublishedGameByID success', response.data)
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

  const register = (formData) => {
    return $axios.post(getApiURL() + 'register', formData)
      .then((response) => {
        if (!process.server) {
          console.log('register success', response.data)
        }
        return response.data
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
          console.log('login refresh', response.data)
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
    // return $axios.get(getApiURL() + '/game/get-my')
    // .then((response) => {
    //     if (!process.server) {
    //       console.log('login success', response.data)
    //     }
    //       Swal.fire({
    //         title: 'Вход выполнен!',
    //         icon: 'success',
    //         toast: true,
    //         timer: 3000,
    //         position: 'bottom',
    //         timerProgressBar: true,
    //         showConfirmButton: false
    //       })
    //     return response.data
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //   //     Swal.fire({
    //   //       title: 'Ошибка загрузки данных',
    //   //       text: 'Пожалуйста, обновите страницу',
    //   //       icon: 'error',
    //   //       toast: true,
    //   //       timer: 10000,
    //   //       position: 'bottom',
    //   //       timerProgressBar: true,
    //   //       showConfirmButton: false
    //   //     })
    //   })
  }

  const api = {
    // put list of methods here...
    register,
    login,
    refresh,
    logout,
    getMe,
    getApiURL,
    getPublishedGameByID,
    getLatestGames,
    getMyGamesList
  }

  inject('api', api)
}

// {"user":{"id":1,"role_id":1,"name":"Airyng","email":"airyng@yandex.ru","avatar":"users\/default.png","email_verified_at":null,"settings":{"locale":"ru"},"created_at":"2020-08-03T12:49:31.000000Z","updated_at":"2020-10-04T05:13:34.000000Z","sex":null},"token":"97|UvvO6WuhrsMxyJgu04Nb4NhCgY7f80Q8WPsXAmmx4CpirmeDCMcCFCURyaPDko6v1iEkpCRzhFh5LtnF"}
