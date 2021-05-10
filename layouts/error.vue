<template>
  <v-container class="mt-10">
    <v-row>
      <v-col class="text-center">
        <ErrorsNotFound v-if="error.statusCode === 404" />
        <ErrorsNotAuthenticated v-else-if="error.statusCode === 401" />
        <ErrorsAccessDenied v-else-if="error.statusCode === 403" />
        <h1 v-else>
          {{ error.statusCode || 'X Error' }} - {{ otherError }}
        </h1>
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
  }
}
</script>
