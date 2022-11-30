<template>
  <v-container class="fill-in-height d-flex align-center">
    <v-row>
      <v-col class="text-center">
        <ErrorsNotFound v-if="error.statusCode === 404" />
        <ErrorsNotAuthenticated v-else-if="error.statusCode === 401" />
        <ErrorsAccessDenied v-else-if="error.statusCode === 403" />
        <template v-else>
          <h1 class="mb-5">
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
      window.location.reload(true)
    }
  }
}
</script>
