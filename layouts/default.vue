<template>
  <v-app :class="$route.name + '-page'">
    <TopBar />
    <v-main>
      <nuxt />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script>
import { EventBus } from '~/plugins/event'
export default {
  mounted () {
    let isAutoRefreshStarted = false
    EventBus.$on('logged-in', (settings) => {
      // auto refresh auth token
      if (!isAutoRefreshStarted) {
        isAutoRefreshStarted = true
        setInterval(() => this.$store.dispatch('refreshToken'), 1000 * 30 * 5) // refresh each 5 min
      }
      if (settings && settings.redirect) {
        this.$router.push(settings.redirect)
      }
    })
    EventBus.$on('logged-out', (settings) => {
      if (window) {
        setTimeout(() => {
          window.location.href = '/' // refresh browser page will reset store state
        }, 1000)
      }
    })

    this.$store.dispatch('tryAutoLogin')
  }
}
</script>
