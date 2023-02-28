<template>
  <v-container class="fill-in-height">
    <v-row>
      <v-col>
        <template v-if="item">
          <div class="banner rounded" :style="itemBanner" :alt="item.title">
            <h1 class="mt-2">
              {{ excerpt(item.title, 100) }}
            </h1>
            <nuxt-link :to="'/games/'+ item._id + '/play'">
              <v-btn
                class="play-btn"
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
            <span class="grey--text">Опубликовано: {{ item.published_at }}</span>
            <span class="ml-4 grey--text">Объем: {{ gameLength }}</span>
            <common-auto-save-detection-icon :novella-id="item._id" class="ml-4" />
          </div>

          <div>{{ item.description }}</div>

          <nuxt-link :to="`/games/${item._id}/play`">
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
import { excerpt } from '@/plugins/utils'
import GameAutoSaveManager from '@/plugins/gameAutoSaveManager'

export default {
  async asyncData ({ $api, params, error, store }) {
    let item = false
    if (store.state.latestGames.length) {
      item = store.state.latestGames.find(item => item._id === Number(params.id))
    }
    if (!item) {
      item = await $api.call('getGameByID', params.id)
    }
    if (!item) { return error({ statusCode: 404 }) }
    return { item }
  },
  data () {
    return {
      item: false,
      itemBanner: null
    }
  },
  computed: {
    scenes () {
      return (typeof this.item.json === 'string' ? JSON.parse(this.item.json) : this.item.json)?.scenes
    },
    authorAvatar () {
      return process.env.BACKEND_URL + '/storage/' + this.item.authorAvatar
    },
    computedAuthorName () {
      return this.authorName || this.item.authorName || false
    },
    gameLength () {
      const length = this.scenes.length
      if (length >= 250) {
        return 'Эпический'
      } else if (length >= 150) {
        return 'Большой'
      } else if (length >= 50) {
        return 'Средний'
      } else if (length >= 20) {
        return 'Небольшой'
      }
      return 'Скромный'
    },
    hasAutosave () {
      if (process.server) { return false }
      const gameAutoSaveManager = new GameAutoSaveManager()
      return gameAutoSaveManager.getSave(this.$route.params.id)
    }
  },
  async mounted () {
    this.itemBanner = await this.getGameBannerFromScenes()
  },
  methods: {
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    },
    // TODO: метод с таким функционалом и названием повторяется в разных файлах
    // Нужно как-то это объединить
    async getGameBannerFromScenes () {
      const type = this.scenes?.[0]?.background?.type || 'color'
      const value = this.scenes?.[0]?.background?.value
      const defaultStyle = 'background-color: #333'
      if (!value) {
        return defaultStyle
      } else if (type === 'color') {
        return 'background-color: ' + value
      } else if (type === 'image') {
        const link = await this.$store.dispatch('imagesRepository/linkFetch', value)
        return `background-image: url('${link}')`
      }
      return defaultStyle
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
  animation: move-bg-vertically 40s ease infinite
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
