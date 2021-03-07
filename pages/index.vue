<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col class="col-12">
          <h2>Последние новеллы</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <ItemsGrid v-if="latestGames && latestGames.length" :items="latestGames" />
          <p v-else class="grey--text">
            Загрузка...
          </p>
        </v-col>
        <v-col cols="4" md="4" class="d-none d-md-block">
          Sidebar
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  async asyncData ({ store }) {
    await store.dispatch('getLatestGames')
  },
  data () {
    return {}
  },
  computed: {
    latestGames () {
      return this.$store.state.latestGames
    }
  },
  mounted () {},
  methods: {}
}
</script>
