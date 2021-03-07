<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="submitForm"
  >
    <v-radio-group v-model="formData.sex" row>
      <template #label>
        <div>Ваш пол</div>
      </template>
      <v-radio label="Женский" value="female" />
      <v-radio label="Мужской" value="male" />
    </v-radio-group>

    <v-text-field
      v-model="formData.name"
      :rules="nameRules"
      label="Псевдоним"
      hint="Минимум 4 символа"
      required
      :error-count="formErrors.name.length"
      :error-messages="formErrors.name"
      @keyup.enter="submitForm"
      @click="removeErrors()"
    />

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
      label="Пароль"
      hint="Минимум 5 символов"
      :error-count="formErrors.password.length"
      :error-messages="formErrors.password"
      counter
      required
      @click="removeErrors()"
      @keyup.enter="submitForm"
      @click:append="showPass = !showPass"
    />

    <v-text-field
      v-model="formData.confirm_password"
      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="confirmPassRules"
      :type="showPass ? 'text' : 'password'"
      name="input-10-1"
      label="Повторите пароль"
      hint="Минимум 5 символов"
      :error-count="formErrors.confirm_password.length"
      :error-messages="formErrors.confirm_password"
      counter
      required
      @click="removeErrors"
      @keyup.enter="submitForm"
      @click:append="showPass = !showPass"
    />

    <v-btn
      :disabled="isButtonDisabled"
      color="success"
      class="mr-4"
      @click="submitForm"
    >
      Зарегистрироваться
    </v-btn>
  </v-form>
</template>
<script>
export default {
  data: () => ({
    formData: {
      password: '',
      confirm_password: '',
      email: '',
      sex: 'female',
      name: ''
    },
    valid: false,
    showPass: false,
    emailRules: [
      v => !!v || 'E-mail - обязательное поле',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    passRules: [
      v => !!v || 'Пароль - обязательное поле',
      v => v.length >= 5 || 'Минимум 5 символов'
    ],
    nameRules: [
      v => !!v || 'Псевдоним - обязательное поле',
      v => (v && v.length >= 4) || 'Минимум 4 символа'
    ],
    confirmPassRules: [
      v => !!v || 'Повторить пароль - обязательное поле'
    ],
    formErrors: {
      password: [],
      confirm_password: [],
      email: [],
      name: []
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
      this.formErrors.confirm_password = []
      this.formErrors.name = []
    },
    validate () {
      this.$refs.form.validate()
    },
    submitForm () {
      this.ajaxSending = true

      // axios.get('/sanctum/csrf-cookie').then((response) => {
      //   axios.post('/api/register', this.formData)
      //     .then((response) => {
      //       this.$root.setUserData(response.data)

      //       Swal.fire({
      //         title: 'Успешная регистрация!',
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
      //       this.formErrors.confirm_password = e.response.data.error.confirm_password || []
      //       this.formErrors.name = e.response.data.error.name || []
      //     })
      //     .finally(() => {
      //       this.ajaxSending = false
      //     })
      // })
    }
  }
}
</script>
