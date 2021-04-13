<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="submitForm"
  >
    <v-radio-group v-model="formData.gender_id" row>
      <template #label>
        <div>Ваш пол</div>
      </template>
      <v-radio label="Женский" value="2" />
      <v-radio label="Мужской" value="1" />
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
      hint="Минимум 8 символов"
      :error-count="formErrors.password.length"
      :error-messages="formErrors.password"
      counter
      required
      @click="removeErrors()"
      @keyup.enter="submitForm"
      @click:append="showPass = !showPass"
    />

    <v-text-field
      v-model="formData.password_confirmation"
      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="confirmPassRules"
      :type="showPass ? 'text' : 'password'"
      name="input-10-1"
      label="Повторите пароль"
      hint="Минимум 5 символов"
      :error-count="formErrors.password_confirmation.length"
      :error-messages="formErrors.password_confirmation"
      counter
      required
      @click="removeErrors"
      @keyup.enter="submitForm"
      @click:append="showPass = !showPass"
    />

    <v-btn
      :disabled="isButtonDisabled"
      depressed
      color="success"
      class="mr-4"
      @click="submitForm"
    >
      Зарегистрироваться
    </v-btn>
  </v-form>
</template>
<script>
// import { SuccessMessage } from '@/plugins/utils'
export default {
  data: () => ({
    formData: {
      password: '',
      password_confirmation: '',
      email: '',
      gender_id: '2',
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
      v => v.length >= 8 || 'Минимум 8 символов'
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
      password_confirmation: [],
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
      this.formErrors.password_confirmation = []
      this.formErrors.name = []
    },
    validate () {
      this.$refs.form.validate()
    },
    async submitForm () {
      this.ajaxSending = true
      const result = await this.$api.register(this.formData)
      console.log('debug', result)
      // SuccessMessage({ title: 'Успешная регистрация!' })
      // this.$router.push('/me')
      // this.formErrors.email = e.response.data.error.email || []
      // this.formErrors.password = e.response.data.error.password || []
      // this.formErrors.password_confirmation = e.response.data.error.password_confirmation || []
      // this.formErrors.name = e.response.data.error.name || []
      this.ajaxSending = false
    }
  }
}
</script>
