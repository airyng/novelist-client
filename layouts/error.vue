<template>
  <v-container class="mt-10">
    <v-row>
      <v-col class="text-center">
        <ErrorsNotFound v-if="error.statusCode === 404" />
        <ErrorsNotAuthenticated v-else-if="error.statusCode === 401" />
        <ErrorsAccessDenied v-else-if="error.statusCode === 403" />
        <template v-else>
          <h1>
            {{ error.statusCode || 'X Error' }} - {{ otherError }}
          </h1>
          <v-btn dark @click="reloadPage">
            Перезагрузить страницу
          </v-btn>
        </template>
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
      otherError: 'Неизвестная ошибка'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  methods: {
    reloadPage () {
      window.reload(true)
    }
  }
}
</script>
