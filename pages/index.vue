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
          <ItemsGrid />
        </v-col>

        <v-col cols="4" md="4" class="d-none d-md-block">
          <v-card class="mx-auto" :elevation="0">
            <v-list-item-content class="pa-2 d-flex align-center justify-center" style="min-height: 200px">
              Проект находится в разработке
            </v-list-item-content>
          </v-card>
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
  head () {
    return {
      title: 'Главная'
    }
  },
  mounted () {},
  methods: {}
}
</script>
