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

  // const confirmEmail = (userId, code) => {
  //   return $axios.post(getApiURL() + `user/${userId}/confirm-email?code=${code}`)
  //   .then(response => {
  //     if (!process.server) {
  //       console.log('confirmEmail() success', response)
  //     }
  //     return response.data
  //   })
  //   .catch(error => {
  //     console.log('confirmEmail() error', error)
  //     return false
  //     // throw error
  //   })
  // }

  const api = {
    // put list of methods here...
    getApiURL,
    getPublishedGameByID,
    getLatestGames
  }

  inject('api', api)
}
