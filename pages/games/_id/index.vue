<template>
  <v-container>
    <v-row>
      <v-col>
        <template v-if="item">
          <div class="banner rounded" :style="'background-image: url('+itemBanner+')'" :alt="item.title">
            <h1 class="mt-2">
              {{ excerpt(item.title, 100) }}
            </h1>
            <nuxt-link :to="'/games/'+ item.id + '/play'">
              <v-btn
                class="play-btn"
                v-bind="attrs"
                fab
                dark
                depressed
                small
              >
                <v-icon>mdi-gamepad-variant-outline</v-icon>
              </v-btn>
            </nuxt-link>
          </div>

          <div class="novella-infohead">
            <nuxt-link :to="'/author/'+item.user_id">
              <v-avatar v-if="item.authorAvatar">
                <img :src="authorAvatar">
              </v-avatar>
            </nuxt-link>
            <nuxt-link v-if="computedAuthorName" :to="'/author/'+item.user_id">
              <span class="ml-4">{{ computedAuthorName }}</span>
            </nuxt-link>
            <span class="ml-4 grey--text">Опубликовано: {{ item.published_at }}</span>
            <span class="ml-4 grey--text">Объем: {{ gameLength }}</span>
            <CommonAutoSaveDetectionIcon :novella-id="item.id" class="ml-4" />
          </div>

          <div>{{ item.description }}</div>

          <nuxt-link :to="'/games/'+ item.id + '/play'">
            <v-btn
              text
              depressed
              class="mt-2 py-1 px-2"
            >
              <v-icon>mdi-gamepad-variant-outline</v-icon>&nbsp;Играть
            </v-btn>
          </nuxt-link>
        </template>
        <p v-else class="grey--text">
          Загрузка...
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { excerpt, getGameBannerFromScenes } from '@/plugins/utils'
import GameAutoSaveManager from '@/plugins/gameAutoSaveManager'
export default {
  async asyncData ({ $api, params, error, store }) {
    let item = false
    if (store.state.latestGames.length) {
      item = store.state.latestGames.find(item => item.id === Number(params.id))
    }
    if (!item) {
      item = await $api.getGameByID(params.id)
    }
    if (!item) { return error({ statusCode: 404 }) }
    return { item }
  },
  data () {
    return {
      item: false
    }
  },
  computed: {
    scenes () {
      return JSON.parse(this.item.json)
    },
    authorAvatar () {
      return process.env.BACKEND_URL + '/storage/' + this.item.authorAvatar
    },
    computedAuthorName () {
      return this.authorName || this.item.authorName || false
    },
    gameLength () {
      if (this.scenes.length >= 500) { return 'Эпический' }
      if (this.scenes.length >= 250) { return 'Большой' }
      if (this.scenes.length >= 100) { return 'Средний' }
      if (this.scenes.length >= 50) { return 'Небольшой' }
      return 'Скромный'
    },
    itemBanner () {
      return getGameBannerFromScenes(this.scenes)
    },
    hasAutosave () {
      if (process.server) { return false }
      const gameAutoSaveManager = new GameAutoSaveManager()
      return gameAutoSaveManager.getSave(this.$route.params.id)
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
h1
  word-break: break-word
  position: absolute
  bottom: 0
  left: 0
  padding: 10px 10px 20px 20px
  width: 100%
  background: linear-gradient( 0deg, rgb(30 30 30) 0%, rgba(0,0,0,0) 100%)
  @media (max-width: 500px)
    font-size: 1.3em
.novella-infohead
  margin: 8px 0
  display: flex
  align-items: center
  @media (max-width: 600px)
    flex-direction: column
    align-items: start
    & .v-avatar
      margin-left: 16px

.banner
  background-position: center
  background-size: cover
  height: 200px
  width: 100%
  position: relative
  animation: move-bg-vertically 60s ease infinite
  @media (min-width: 500px)
    height: 300px
  @media (min-width: 1200px)
    height: 400px
  @media (min-width: 1400px)
    height: 500px
  @media (min-width: 1900px)
    height: 600px
  & .play-btn
    position: absolute
    bottom: -20px
    right: 2%
    z-index: 2

</style>
