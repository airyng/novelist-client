<template>
  <v-row v-if="latestGames && latestGames.length">
    <v-col
      v-for="(item, index) in latestGames"
      :key="index"
      cols="12"
    >
      <NovellaItem :item="item" :author-name="authorName" :author-avatar="authorAvatar" />
    </v-col>
  </v-row>
  <p v-else class="grey--text">
    {{ alterText }}
  </p>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: null },
    authorName: { type: String, default: null },
    authorAvatar: { type: String, default: null }
  },
  computed: {
    latestGames () {
      return this.items || this.$store.state.latestGames
    },
    propsUsed () {
      return this.items
    },
    alterText () {
      return this.propsUsed ? 'Здесь пусто...' : 'Загрузка...'
    }
  }
}
</script>
