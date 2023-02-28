<template>
  <div class="banner flex-wrap d-flex align-end flex-column justify-end" :style="itemBanner">
    <div class="novella-info">
      <v-chip
        v-show="item"
        color="orange"
        text-color="white"
      >
        Выбор редакции
        <v-icon right>
          mdi-star
        </v-icon>
      </v-chip>
      <template v-if="item">
        <nuxt-link :to="'/games/'+ item._id">
          <h1 class="mt-2">
            {{ excerpt(item.title, 100) }}
          </h1>
          <div>{{ excerpt(item.description, 200) }}</div>
        </nuxt-link>
        <nuxt-link :to="'/games/'+ item._id + '/play'">
          <v-btn
            text
            depressed
            class="mt-2 py-1 px-2"
          >
            <v-icon>mdi-gamepad-variant-outline</v-icon>&nbsp;Играть
          </v-btn>
        </nuxt-link>
      </template>
    </div>
    <v-progress-linear :value="progress" background-color="black" color="#673ab7" />
  </div>
</template>

<script>
import { excerpt } from '@/plugins/utils'

// Список id новелл, которые будем показывать в слайдере
const favoriteGamesID = ['63237eb6cc8eb2fa2d2b3fcb']
const secForSwap = 15 // Секунд для каждого перелистывания

export default {
  data () {
    return {
      currentItemIndex: -1, // -1 - это стартовое значение, которое изменится на ноль при инициализации компонента
      item: false,
      progress: 0,
      itemBanner: null
    }
  },
  computed: {
    novellaData () {
      return this.item?.json ? JSON.parse(this.item.json) : null
    },
    scenes () {
      return this.novellaData?.scenes
    }
  },
  mounted () {
    // Запускаем таймер перелистывания слайдов
    this.setNewItem()
    setInterval(() => {
      this.setNewItem()
    }, secForSwap * 1000)

    // Запускаем progress-bar для визуализации прогресса
    setInterval(() => {
      this.progress += 1
    }, (secForSwap * 1000) / 100)
  },
  methods: {
    async setNewItem () {
      if (!favoriteGamesID.length) { return false }
      // Инкрементируем индекс или возвращаем в начало массива
      this.currentItemIndex++
      if (this.currentItemIndex >= favoriteGamesID.length) {
        this.currentItemIndex = 0
      }
      // Получаем id новеллы
      const gameID = favoriteGamesID[this.currentItemIndex]

      // Получаем данные новеллы из хранилища
      if (this.$store.state.latestGames.length) {
        this.item = this.$store.state.latestGames.find(item => item._id === gameID)
      }
      // Или, если данные не были получены ранее, то загружаем их отдельно
      if (!this.item) {
        this.item = await this.$api.call('getGameByID', gameID)
      }
      this.itemBanner = await this.getGameBannerFromScenes(this.item)
      // Обнуляем прогресс-бар
      this.progress = 0
    },
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    },
    async getGameBannerFromScenes (item) {
      const scenes = JSON.parse(item.json)?.scenes || null
      const type = scenes?.[0]?.background?.type || 'color'
      const value = scenes?.[0]?.background?.value
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
  animation: move-bg-vertically 40s ease infinite
  border-radius: 16px!important
  overflow: hidden
  @media (min-width: 500px)
    min-height: 300px
  @media (min-width: 1200px)
    min-height: 400px
  @media (min-width: 1400px)
    min-height: 500px
</style>
