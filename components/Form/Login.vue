<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="submitForm"
  >
    <v-text-field
      v-model="formData.email"
      :rules="emailRules"
      label="E-mail"
      required
      :error-count="formErrors.email.length"
      :error-messages="formErrors.email"
      @keyup.enter="submitForm"
      @click="removeErrors()"
    />

    <v-text-field
      v-model="formData.password"
      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="passRules"
      :type="showPass ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 5 characters"
      :error-count="formErrors.password.length"
      :error-messages="formErrors.password"
      counter
      required
      @click="removeErrors()"
      @keyup.enter="submitForm"
      @click:append="showPass = !showPass"
    />

    <v-btn
      :disabled="isButtonDisabled"
      color="success"
      class="mr-4"
      @click="submitForm"
    >
      Войти
    </v-btn>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    formData: {
      password: '',
      email: ''
    },
    valid: false,
    showPass: false,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    passRules: [
      v => !!v || 'Password is required',
      v => v.length >= 5 || 'Min 5 characters'
    ],
    formErrors: {
      password: [],
      email: []
    },
    ajaxSending: false
  }),
  computed: {
    isButtonDisabled () {
      let hasAnyContent = false

      for (const key in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          const element = this.formData[key]

          if (element.length) {
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
      this.formErrors.email = []
      this.formErrors.password = []
    },
    validate () {
      this.$refs.form.validate()
    },
    submitForm () {
      this.ajaxSending = true

      // axios.get('/sanctum/csrf-cookie').then((response) => {
      //   axios.post('/api/addToken', this.formData)
      //     .then((response) => {
      //       this.ajaxSending = false

      //       this.$root.setUserData(response.data)

      //       Swal.fire({
      //         title: 'Вход выполнен!',
      //         icon: 'success',
      //         toast: true,
      //         timer: 3000,
      //         position: 'bottom',
      //         timerProgressBar: true,
      //         showConfirmButton: false
      //       })

      //       this.$router.push({ name: 'profile' })
      //     })
      //     .catch((e) => {
      //       this.formErrors.email = e.response.data.error.email || []
      //       this.formErrors.password = e.response.data.error.password || []

      //       this.ajaxSending = false
      //     })
      // })
    }
  }
}
</script>
