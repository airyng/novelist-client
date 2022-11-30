<template>
  <v-container class="fill-in-height">
    <v-row>
      <v-col cols="12">
        <common-best-games />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col class="col-12 pb-0">
        <h2>
          Новые новеллы
        </h2>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <items-grid :items="latestGames" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  async asyncData ({ store }) {
    await store.dispatch('dictionaries/gamesFetch')
  },
  data () {
    return {}
  },
  head () {
    return {
      title: 'Главная'
    }
  },
  computed: {
    latestGames () {
      return this.$store.state.dictionaries.latestGames
    }
  },
  mounted () {},
  methods: {}
}
</script>
