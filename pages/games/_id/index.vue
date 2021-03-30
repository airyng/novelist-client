<template>
  <v-container>
    <v-row>
      <v-col>
        <template v-if="item">
          <div class="banner rounded" :style="'background-image: url('+itemBanner+')'" :alt="item.title">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <nuxt-link :to="'/games/'+ item.id + '/play'">
                  <v-btn
                    class="play-btn"
                    v-bind="attrs"
                    fab
                    dark
                    depressed
                    small
                    v-on="on"
                  >
                    <v-icon>mdi-gamepad-variant-outline</v-icon>
                  </v-btn>
                </nuxt-link>
              </template>
              <span>Играть</span>
            </v-tooltip>
          </div>

          <div class="my-2 d-flex align-center">
            <nuxt-link to="/author/test">
              <v-avatar v-if="item.authorAvatar">
                <img :src="item.authorAvatar">
              </v-avatar>
            </nuxt-link>
            <nuxt-link to="/author/test">
              <span class="ml-4">{{ item.authorName || 'Аноним' }}</span>
            </nuxt-link>
            <span class="ml-4 grey--text">Опубликовано: {{ item.published_at }}</span>
            <span class="ml-4 grey--text">Объем: {{ gameLength }}</span>
          </div>

          <h1 class="mt-2">
            {{ item.title }}
          </h1>
          <div>{{ item.description }}</div>

          <nuxt-link :to="'/games/'+ item.id + '/play'">
            <v-btn
              text
              depressed
              color="deep-purple"
              class="mt-2 pa-1"
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
export default {
  asyncData ({ $api, params, error }) {
    // this.scenes = JSON.parse(this.item.json)
    const item = [] // await $api.getPublishedGameByID(params.id)
    if (!item) { return error({ statusCode: 404 }) }
    return { item }
  },
  data () {
    return {
      item: false,
      scenes: []
    }
  },
  computed: {
    gameLength () {
      if (this.scenes.length >= 500) { return 'Эпический' }
      if (this.scenes.length >= 250) { return 'Большой' }
      if (this.scenes.length >= 100) { return 'Средний' }
      if (this.scenes.length >= 50) { return 'Небольшой' }
      return 'Скромный'
    },
    itemBanner () {
      return 'https://novelist.anime-look.ru/storage/backgrounds/September2020/nfqvPsBVxTOpTxMRYGTt.jpg'
    //   if (this.scenes && this.scenes[0] && this.scenes[0] && this.scenes[0].background && this.scenes[0].background.url) { return this.scenes[0].background.url } else { return '/storage/backgrounds/default.jpg' }
    }
  },
  methods: {}
}
</script>

<style lang="sass" scoped>
h1
  word-break: break-word

.banner
  background-position: center
  background-size: cover
  height: 200px
  width: 100%
  position: relative
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
</style>
