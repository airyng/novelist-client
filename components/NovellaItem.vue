<template>
  <v-card class="novella-item mx-auto" :elevation="0">
    <v-list-item>
      <nuxt-link
        v-if="author && author.avatar_id && getAuthorId(author)"
        :to="'/author/'+getAuthorId(author)"
      >
        <profile-user-avatar :avatar-id="author.avatar_id" />
      </nuxt-link>

      <v-list-item-content>
        <nuxt-link :to="'/games/'+ item._id">
          <v-list-item-title class="headline">
            {{ item.title }}
          </v-list-item-title>
        </nuxt-link>

        <v-list-item-subtitle v-if="getAuthorId(author)">
          <nuxt-link :to="'/author/'+getAuthorId(author)">
            <span v-if="author.name">{{ author.name }}</span>
            <i v-else>Аноним</i>
          </nuxt-link>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <nuxt-link :to="'/games/'+ item._id">
      <div
        class="itemBanner"
        :style="itemBanner"
      />
      <v-card-text>
        <div>{{ itemExcerpt }}</div>
      </v-card-text>
    </nuxt-link>

    <common-auto-save-detection-icon :novella-id="item._id" class="ml-3" />

    <v-card-actions>
      <nuxt-link :to="'/games/'+ item._id + '/play'">
        <v-btn depressed text>
          Играть
        </v-btn>
      </nuxt-link>
      <nuxt-link class="more-button" :to="'/games/'+ item._id">
        <v-btn depressed text>
          Подробнее
        </v-btn>
      </nuxt-link>
      <v-spacer />
      <v-btn depressed icon disabled>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn depressed icon disabled>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { excerpt } from '@/plugins/utils'
import { screen } from '@/mixins/screen'
import gameChecker from '@/plugins/gameChecker'

export default {
  mixins: [screen],
  props: {
    item: { type: Object, required: true }
  },
  data () {
    return {
      itemBanner: null
    }
  },
  computed: {
    jsonData () {
      return gameChecker.updateGameToLatestVersion(JSON.parse(this.item.json))
    },
    scenes () {
      return this.jsonData.scenes
    },
    author () {
      return this.item.author
    },
    itemExcerpt () {
      return excerpt(this.item.description, 120)
    }
  },
  async mounted () {
    this.itemBanner = await this.getGameBannerFromScenes()
  },
  methods: {
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    },
    getAuthorId (author) {
      if (typeof author === 'string') { return author }
      if (typeof author === 'object' && author !== null) { return author?._id }
      return false
    },
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
.novella-item
  color: $mainTextColor
  background-color: $subBackColor
  .itemBanner
    height: 200px
    background-size: cover
  & .v-list-item__subtitle, & .v-list-item__title
    color: $mainTextColor
  .more-button
    @media (max-width: 500px)
      display: none
</style>
