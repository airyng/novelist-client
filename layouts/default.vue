<template>
  <v-app
    :class="$route.name + '-page'"
    :style="{background: $vuetify.theme.themes[theme].background}"
  >
    <v-main>
      <app-top-bar />
      <nuxt />
      <app-footer />
    </v-main>
  </v-app>
</template>

<script>
import { EventBus } from '~/plugins/event'
export default {
  computed: {
    theme () {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
  mounted () {
    EventBus.$on('logged-in', this.afterLoginHandler)
    EventBus.$on('logged-out', this.afterLogoutHandler)

    this.$store.dispatch('tryAutoLogin')
  },
  beforeDestroy () {
    EventBus.$off('logged-in', this.afterLoginHandler)
    EventBus.$off('logged-out', this.afterLogoutHandler)
  },
  methods: {
    afterLoginHandler (settings) {
      if (settings?.redirect !== false) {
        this.$router.push(settings?.redirect || '/')
      }
    },
    afterLogoutHandler () {
      if (window) {
        setTimeout(() => {
          window.location.href = '/' // refresh browser page will reset store state
        }, 500)
      }
    }
  }
}
</script>
