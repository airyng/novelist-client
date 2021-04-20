<template>
  <v-container class="mt-10">
    <v-row>
      <v-col class="text-center">
        <h1 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <NuxtLink to="/">
          <v-btn depressed dark color="indigo">
            На главную
          </v-btn>
        </NuxtLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Страница не найдена',
      otherError: 'Неизвестная ошибка'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="sass" scoped>
h1
  font-size: 20px
</style>
