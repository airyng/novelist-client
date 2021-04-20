<template>
  <v-row v-if="latestGames && latestGames.length">
    <v-col
      v-for="(item, index) in latestGames"
      :key="index"
      cols="12"
    >
      <NovellaItem :item="item" />
    </v-col>
  </v-row>
  <p v-else class="grey--text">
    Загрузка...
  </p>
</template>

<script>
export default {
  computed: {
    latestGames () {
      return this.$store.state.latestGames
    }
  }
}
</script>
