/* eslint-disable no-console */
// atm - auth token manager
export default function ({ $axios, $cookiz }, inject) {
  const atm = {}

  atm.getToken = function () {
    if (process.server) {
      return $cookiz.get('access_token')
    } else {
      return $cookiz.get('access_token') || window.localStorage.getItem('access_token')
    }
  }

  atm.hasToken = function () {
    return !!this.getToken()
  }

  atm._setTokenToHeader = function () {
    const that = this
    $axios.interceptors.request.use(function (config) {
      const token = that.getToken()
      config.headers.Authorization = 'Bearer ' + token
      return config
    }, function (err) {
      return Promise.reject(err)
    })
  }

  atm.setToken = function (tokenData) {
    if (typeof tokenData !== 'object') {
      console.error('Given argument is not an object.')
      return false
    }
    // console.log('Trying to save token', tokenData)

    if (tokenData.access_token && tokenData.expires_in) {
      // console.log('Saving token', tokenData)
      try {
        $cookiz.set(
          'access_token',
          tokenData.access_token,
          {
            maxAge: tokenData.expires_in,
            path: '/'
          }
        )
        if (!process.server) {
          window.localStorage.setItem('access_token', tokenData.access_token)
        }
        // console.log('Looks like success', $cookiz.get('access_token'))
      } catch (err) {
        throw new Error(err)
      }

      this._setTokenToHeader(tokenData.access_token)
      return true
    } else {
      console.error('Given argument is not in token object type.')
      return false
    }
  }

  atm.purge = function () {
    $cookiz.remove('access_token')
    this._setTokenToHeader('')
    if (!process.server) {
      window.localStorage.removeItem('access_token')
      console.log('purge')
    }
    console.log('after purge atm debug', this.getToken())
  }

  atm.init = function () {
    if (this.hasToken()) {
      this._setTokenToHeader(this.getToken())
      // console.log('atm debug', this.getToken())
      return true
    } else {
      return false
    }
  }

  atm.init()

  inject('atm', atm)
}
