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
    EventBus.$on('logged-in', (settings) => {
      if (settings) {
        if (settings.redirect) {
          this.$router.push(settings.redirect)
        }
      }
    })
    EventBus.$on('logged-out', (settings) => {
      if (window) {
        window.location.href = '/' // refresh browser page will reset store state
      }
    })

    this.$store.dispatch('tryAutoLogin')
  }
}
</script>
