/* eslint-disable no-console */
// backend api calls

export default function ({ $axios }, inject) {
  if (!$axios) { return }
  // May be will be better to move this setting to nuxt.config.js
  // $axios.defaults.withCredentials = true

  const getApiURL = () => process.env.VUE_APP_API_CLIENT_URL // process.server ? process.env.VUE_APP_API_URL : process.env.VUE_APP_API_CLIENT_URL

  const getLatestGames = () => {
    return $axios.get(getApiURL() + 'game')
      .then((response) => {
        if (!process.server) {
          console.log('getLatestGames success', response.data)
        }
        return response.data
      })
      .catch((e) => {
        console.error(e)
      //     Swal.fire({
      //       title: 'Ошибка загрузки данных',
      //       text: 'Пожалуйста, обновите страницу',
      //       icon: 'error',
      //       toast: true,
      //       timer: 10000,
      //       position: 'bottom',
      //       timerProgressBar: true,
      //       showConfirmButton: false
      //     })
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
      //     Swal.fire({
      //       title: 'Ошибка загрузки данных',
      //       text: 'Пожалуйста, обновите страницу',
      //       icon: 'error',
      //       toast: true,
      //       timer: 10000,
      //       position: 'bottom',
      //       timerProgressBar: true,
      //       showConfirmButton: false
      //     })
      })
  }

  const login = ({ login, password }) => {
    return { accessToken: 'token', expires: '10.10.2021' }
    // return $axios.post(getApiURL() + 'login', { login, password })
    //   .then((response) => {
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

  const logout = () => {
    // To do
  }

  const getMe = () => {
    return {
      id: 1,
      role_id: 1,
      name: 'Airyng',
      email: 'airyng@yandex.ru',
      avatar: 'users/default.png',
      email_verified_at: null,
      settings: { locale: 'ru' },
      created_at: '2020-08-03T12:49:31.000000Z',
      updated_at: '2020-10-04T05:13:34.000000Z',
      sex: null
    }
    // return $axios.get(getApiURL() + 'user/me')
    //   .then((response) => {
    //     if (!process.server) {
    //       console.log('getMe success', response.data)
    //     }
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
    login,
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
