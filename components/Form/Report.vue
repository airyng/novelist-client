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
      color="success"
      class="mr-4"
      @click="submitForm"
    >
      Отправить
    </v-btn>
  </v-form>
</template>

<script>
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
    submitForm () {
      this.ajaxSending = true

      // axios.post('/api/send-report', this.formData)
      //   .then((response) => {
      //     this.ajaxSending = false

      //     Swal.fire({
      //       title: 'Сообщение успешно отправлено!',
      //       icon: 'success',
      //       toast: true,
      //       timer: 3000,
      //       position: 'bottom',
      //       timerProgressBar: true,
      //       showConfirmButton: false
      //     })
      //     this.formData.text = ''
      //     this.$emit('onFormSent')
      //   })
      //   .catch((e) => {
      //     this.formErrors.text = e.response.data.error.text || []
      //   })
      //   .finally(() => {
      //     this.ajaxSending = false
      //   })
    }
  }
}
</script>
