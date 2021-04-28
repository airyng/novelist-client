// import colors from 'vuetify/es5/util/colors'
const envObject = require('dotenv').config()

export default {
  server: {
    // port: process.env.PORT || 3000 // default: 3000
  // host: '0.0.0.0' // default: localhost
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Новеллист',
    title: 'Новеллист',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/styles/overrides.sass',
    '~/assets/styles/global.sass'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/authTokenManager.js',
    '~/plugins/api.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  env: {
    ...envObject.parsed,
    // ...
    appVersion: '0.1.2'
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: null,

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/styles/variables.scss']
    // theme: {
    //   dark: true,
    //   themes: {
    //     dark: {
    //       primary: colors.blue.darken2,
    //       accent: colors.grey.darken3,
    //       secondary: colors.amber.darken3,
    //       info: colors.teal.lighten1,
    //       warning: colors.amber.base,
    //       error: colors.deepOrange.accent4,
    //       success: colors.green.accent3
    //     }
    //   }
    // }
  },

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'games-edit',
        path: '/games/:id/edit',
        component: resolve(__dirname, 'pages/games/add.vue')
      })
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
