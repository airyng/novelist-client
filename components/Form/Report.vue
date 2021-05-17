<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="submitForm"
  >
    <v-textarea
      v-model="formData.text"
      :rules="textRules"
      name="report_text"
      label="Описание проблемы"
      hint="Минимальная длина сообщения - 20 символов"
      :error-messages="formErrors.text"
      counter
      row="5"
      required
      clearable
      @click="removeErrors()"
      @keyup.enter="submitForm"
    />

    <v-btn
      :disabled="isButtonDisabled"
      depressed
      dark
      class="mr-4 mt-4"
      @click="submitForm"
    >
      Отправить
    </v-btn>
  </v-form>
</template>

<script>
import { SuccessMessage } from '@/plugins/toast'

export default {
  data: () => ({
    formData: {
      text: ''
    },
    valid: false,
    textRules: [
      v => !!v || 'Поле "Описание проблемы" обязательно для заполнение',
      v => (v && v.length >= 20) || 'Минимальное кол-во символов - 20'
    ],
    formErrors: {
      text: []
    },
    ajaxSending: false
  }),
  computed: {
    isButtonDisabled () {
      let hasAnyContent = false

      for (const key in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          const element = this.formData[key]

          if (element && element.length) {
            hasAnyContent = true
            break
          }
        }
      }

      return !this.valid || this.ajaxSending || !hasAnyContent
    }
  },
  methods: {
    removeErrors (type) {
      this.formErrors.text = []
    },
    validate () {
      this.$refs.form.validate()
    },
    async submitForm () {
      this.ajaxSending = true

      const response = await this.$api.sendReport(this.formData)

      if (response.status === 200) {
        this.formData.text = ''
        this.$emit('onFormSent')
        SuccessMessage({
          title: 'Сообщение успешно отправлено!'
        })
      } else {
        this.formErrors.text = response.data.error.text || []
      }
      this.ajaxSending = false
    }
  }
}
</script>
