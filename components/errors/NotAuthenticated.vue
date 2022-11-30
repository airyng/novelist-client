<template>
  <div class="d-flex align-center" style="height: 100%;">
    <div style="width:100%;">
      <div>
        <h1>Для доступа к странице вы должны быть авторизованы</h1>
        <p>Вы будете перенаправлены через: {{ secRemain }} сек.</p>
        <div class="d-flex flex-column align-center">
          <NuxtLink to="/signin">
            <v-btn depressed dark color="indigo" class="mb-5">
              Авторизоваться
            </v-btn>
          </NuxtLink>
          <NuxtLink to="/">
            <v-btn depressed dark color="indigo">
              На главную
            </v-btn>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      secRemain: 5
    }
  },
  mounted () {
    this.startCountdown()
  },
  methods: {
    startCountdown () {
      const interval = setInterval(() => {
        this.secRemain--
        if (this.secRemain < 0) {
          clearInterval(interval)
          this.$router.push('/signin')
        }
      }, 1000)
    }
  }
}
</script>
