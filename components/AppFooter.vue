<template>
  <div>
    <footer v-if="!hideFooter">
      <v-banner>
        <div class="footer-content">
          <span class="grey--text ma-0">
            По всем вопросам: <a href="mailto:hello-novelist@anime-look.ru">hello-novelist@anime-look.ru</a>
          </span>
          <span class="grey--text ma-0">
            Новеллист. v{{ appVersion }}
          </span>
        </div>
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
              depressed
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
footer
  color: $mainTextColor
  background-color: $subBackColor

.footer-content
  display: flex
  justify-content: space-between
  width: 100%
  padding-right: 8px
  @media (max-width: 992px)
    padding: 10px
    flex-direction: column
    align-items: center
    justify-content: center
    text-align: center

.report-btn
    position: fixed
    bottom: 15px
    right: 15px
</style>
