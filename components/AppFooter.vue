<template>
  <div>
    <footer v-if="!hideFooter">
      <v-banner>
        <p class="grey--text ma-0">
          Новелист. Версия сервиса: {{ appVersion }}
        </p>
      </v-banner>
    </footer>

    <CustomDialog
      v-if="user"
      ref="reportForm"
      title="Сообщить о проблеме"
    >
      <template #toggler>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              class="report-btn"
              color="deep-purple"
              fab
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-bug</v-icon>
            </v-btn>
          </template>
          <span>Сообщить о проблеме</span>
        </v-tooltip>
      </template>

      <FormReport @onFormSent="closeReportDialog" />
    </CustomDialog>
  </div>
</template>

<script>
export default {
  computed: {
    appVersion () {
      return process.env.appVersion
    },
    hideFooter () {
      return false // this.$route.meta.hideFooter === true
    },
    user () {
      return false // this.$root.getUserData()
    }
  },
  methods: {
    closeReportDialog () {
      this.$refs.reportForm.close()
    }
  }
}
</script>

<style lang="sass" scoped>
.report-btn
    position: fixed
    bottom: 15px
    right: 15px
</style>
