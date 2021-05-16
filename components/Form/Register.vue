<template>
  <v-form
    v-if="formData"
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
      hint="Минимум 8 символов"
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
      dark
      class="mr-4 mainTextColor"
      @click="submitForm"
    >
      Зарегистрироваться
    </v-btn>
  </v-form>
</template>
<script>
import { SuccessMessage, ErrorMessages } from '@/plugins/toast'
export default {
  data: () => ({
    formData: false,
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
  mounted () {
    this.formData = this.getDefaultForm()
  },
  methods: {
    getDefaultForm () {
      return {
        password: '',
        password_confirmation: '',
        email: '',
        gender_id: '2',
        name: ''
      }
    },
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
      try {
        const result = await this.$api.register(this.formData)
        if (result.status === 200) {
          SuccessMessage({ title: 'Регистрация успешна!' })
          this.formData = this.getDefaultForm()
          // console.log('debug success', result)
          this.removeErrors()
        } else {
          for (const key in result.data.errors) {
            if (Object.hasOwnProperty.call(result.data.errors, key)) {
              let element = result.data.errors[key]
              element = element.map((item) => {
                if (item === 'The email has already been taken.') {
                  item = 'Указанный email уже используется'
                }
                if (item === 'The password confirmation does not match.') {
                  item = 'Пароли не совпадают'
                }
                return item
              })
              ErrorMessages(element)
            }
          }
        }
        // this.$router.push('/me')
      } catch (err) {
        ErrorMessages('Что-то пошло не так! Обратитесь к администрации сайта.')
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        this.ajaxSending = false
      }
      // this.formErrors.email = e.response.data.error.email || []
      // this.formErrors.password = e.response.data.error.password || []
      // this.formErrors.password_confirmation = e.response.data.error.password_confirmation || []
      // this.formErrors.name = e.response.data.error.name || []
    }
  }
}
</script>
