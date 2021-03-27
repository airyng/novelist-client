<template>
  <v-card class="mx-auto">
    <v-list-item>
      <nuxt-link to="/author/test">
        <v-list-item-avatar v-if="item.authorAvatar">
          <img :src="item.authorAvatar">
        </v-list-item-avatar>
        <v-list-item-avatar v-else color="grey" />
      </nuxt-link>

      <v-list-item-content>
        <nuxt-link :to="'/games/'+ item.id">
          <v-list-item-title class="headline">
            {{ item.title }}
          </v-list-item-title>
        </nuxt-link>

        <v-list-item-subtitle>
          <nuxt-link to="/author/test">
            {{ item.authorName || 'Аноним' }}
          </nuxt-link>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <nuxt-link :to="'/games/'+ item.id">
      <v-img
        :src="itemBanner"
        height="194"
      />
      <v-card-text>
        {{ itemExcerpt }}
      </v-card-text>
    </nuxt-link>

    <v-card-actions>
      <nuxt-link :to="'/games/'+ item.id + '/play'">
        <v-btn depressed text color="deep-purple">
          Играть
        </v-btn>
      </nuxt-link>
      <nuxt-link :to="'/games/'+ item.id">
        <v-btn depressed text color="deep-purple">
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
export default {
  props: {
    item: { type: Object, required: true }
  },
  data () {
    return {
      scenes: false
    }
  },
  computed: {
    itemExcerpt () {
      return excerpt(this.item.description, 120)
    },
    itemBanner () {
      return 'https://novelist.anime-look.ru/storage/backgrounds/September2020/nfqvPsBVxTOpTxMRYGTt.jpg'
    //   if (this.scenes && this.scenes[0] && this.scenes[0] && this.scenes[0].background && this.scenes[0].background.url) { return this.scenes[0].background.url } else { return '/storage/backgrounds/default.jpg' }
    }
  },
  mounted () {
    // this.scenes = JSON.parse(this.item.json)
  },
  methods: {
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    }
  }
}
</script>
