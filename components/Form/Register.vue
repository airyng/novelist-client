<template>
  <v-skeleton-loader
    v-if="!ready"
    type="image"
  />
  <v-form
    v-else
    ref="form"
    v-model="valid"
    lazy-validation
    @submit.prevent="submitForm"
  >
    <v-radio-group v-model="formData.gender_id" row>
      <template #label>
        <div>Ваш пол</div>
      </template>
      <v-radio
        v-for="sexType in sexTypes"
        :key="sexType._id"
        :label="$t('sex_type__' + sexType.title)"
        :value="sexType._id"
        class="text-capitalize"
      />
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
      class="mr-4 mt-3 mainTextColor"
      @click="submitForm"
    >
      Зарегистрироваться
    </v-btn>
  </v-form>
</template>
<script>
import { SuccessMessage, ErrorMessage } from '@/plugins/toast'
export default {
  data: () => ({
    ready: false,
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
    sexTypes () {
      return this.$store.state.dictionaries.sexTypes
    },
    isButtonDisabled () {
      let hasAnyContent = true

      for (const key in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
          const element = this.formData[key]

          if (!element?.length) {
            hasAnyContent = false
            break
          }
        }
      }

      return !this.valid || this.ajaxSending || !hasAnyContent
    }
  },
  async created () {
    if (!this.$store.state.dictionaries.sexTypes?.length) {
      await this.$store.dispatch('dictionaries/sexFetch')
    }
  },
  mounted () {
    this.formData = this.getDefaultForm()
    this.ready = true
  },
  methods: {
    getDefaultForm () {
      return {
        password: '',
        password_confirmation: '',
        email: '',
        gender_id: null,
        name: ''
      }
    },
    removeErrors (type) {
      // TODO: можно попробовать зарефакторить этот кусок Object.keys
      this.formErrors.email = []
      this.formErrors.password = []
      this.formErrors.password_confirmation = []
      this.formErrors.name = []
    },
    validate () {
      // TODO: перепроверить необходимость этой функции
      this.$refs.form.validate()
    },
    async submitForm () {
      if (this.ajaxSending) { return }

      this.ajaxSending = true
      try {
        const result = await this.$api.call('register', null, this.formData)
        if (result.status === 200) {
          SuccessMessage({ title: 'Регистрация успешна!' })
          this.formData = this.getDefaultForm()

          this.removeErrors()
          this.$store.dispatch('authorize', result.data)
        } else {
          // Учитываем поле модели passwordHash в инпуте password
          if (result.data.errors.passwordHash) {
            result.data.errors.password = result.data.errors.passwordHash
          }
          for (const key in result.data.errors) {
            if (
              Object.hasOwnProperty.call(result.data.errors, key) &&
              Object.hasOwnProperty.call(this.formErrors, key)
            ) {
              const element = result.data.errors[key]

              if (element.kind === 'required') {
                this.formErrors[key] = 'Поле обязательно для заполнения'
              }
              if (key === 'email' && element.kind === 'unique') {
                this.formErrors[key] = 'Пользователь с таким Email уже зарегистрирован'
              }
              if (key === 'password' && element.kind === 'mismatch') {
                this.formErrors[key] = 'Введенные пароли не совпадают'
              }
            }
          }
        }
      } catch (err) {
        ErrorMessage({ text: 'Что-то пошло не так! Обратитесь к администрации сайта.' })
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        this.ajaxSending = false
      }
    }
  }
}
</script>
