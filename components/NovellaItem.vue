<template>
  <v-card class="mx-auto" :elevation="0">
    <v-list-item>
      <nuxt-link :to="'/author/'+item.user_id">
        <v-list-item-avatar>
          <img :src="authorAvatar">
        </v-list-item-avatar>
      </nuxt-link>

      <v-list-item-content>
        <nuxt-link :to="'/games/'+ item.id">
          <v-list-item-title class="headline">
            {{ item.title }}
          </v-list-item-title>
        </nuxt-link>

        <v-list-item-subtitle>
          <nuxt-link :to="'/author/'+item.user_id">
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
      <nuxt-link v-if="!isSmallMobileScreen" :to="'/games/'+ item.id">
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
import { screen } from '@/mixins/screen'
export default {
  mixins: [screen],
  props: {
    item: { type: Object, required: true }
  },
  computed: {
    scenes () {
      return JSON.parse(this.item.json)
    },
    authorAvatar () {
      return process.env.BACKEND_URL + '/storage/' + this.item.authorAvatar
    },
    itemExcerpt () {
      return excerpt(this.item.description, 120)
    },
    itemBanner () {
      if (
        this.scenes &&
        this.scenes[0] &&
        this.scenes[0] &&
        this.scenes[0].background &&
        (this.scenes[0].background.url || this.scenes[0].background.value)
      ) {
        return process.env.BACKEND_URL + (this.scenes[0].background.url || this.scenes[0].background.value)
      } else {
        return process.env.BACKEND_URL + '/storage/backgrounds/default.jpg'
      }
    }
  },
  methods: {
    excerpt (text, maxLength) {
      return excerpt(text, maxLength)
    }
  }
}
</script>
