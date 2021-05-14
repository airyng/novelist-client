<template>
  <div v-if="item" class="banner d-flex align-end" :style="'background-image: url('+itemBanner+')'" :alt="item.title">
    <div class="novella-info">
      <v-chip
        color="orange"
        text-color="white"
      >
        Выбор редакции
        <v-icon right>
          mdi-star
        </v-icon>
      </v-chip>
      <nuxt-link :to="'/games/'+ item.id">
        <h1 class="mt-2">
          {{ excerpt(item.title, 100) }}
        </h1>
        <div>{{ excerpt(item.description, 200) }}</div>
      </nuxt-link>
      <nuxt-link :to="'/games/'+ item.id + '/play'">
        <v-btn
          text
          depressed
          class="mt-2 py-1 px-2"
        >
          <v-icon>mdi-gamepad-variant-outline</v-icon>&nbsp;Играть
        </v-btn>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { excerpt } from '@/plugins/utils'

const favoriteGameID = 21
export default {
  data () {
    return {
      item: false
    }
  },
  computed: {
    scenes () {
      return JSON.parse(this.item.json)
    },
    itemBanner () {
      if (this.scenes && this.scenes[0] && this.scenes[0] && this.scenes[0].background && this.scenes[0].background.url) {
        return process.env.BACKEND_URL + this.scenes[0].background.url
      } else {
        return process.env.BACKEND_URL + '/storage/backgrounds/default.jpg'
      }
    }
  },
  async mounted () {
    if (this.$store.state.latestGames.length) {
      this.item = this.$store.state.latestGames.find(item => item.id === Number(favoriteGameID))
    }
    if (!this.item) {
      this.item = await this.$api.getGameByID(favoriteGameID)
    }
  },
  methods: {
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    }
  }
}
</script>

<style lang="sass" scoped>
.novella-info
  word-break: break-word
  padding: 10px 10px 20px 20px
  width: 100%
  background: linear-gradient( 0deg, rgb(0 0 0) 0%, rgba(0,0,0,0) 100%)
  @media (max-width: 500px)
    & > *
      font-size: 1em

.banner
  background-position: center
  background-size: cover
  min-height: 200px
  width: 100%
  animation: move-bg-vertically 60s ease infinite
  border-radius: 16px!important
  overflow: hidden
  @media (min-width: 500px)
    min-height: 300px
  @media (min-width: 1200px)
    min-height: 400px
  @media (min-width: 1400px)
    min-height: 500px
</style>
