<template>
  <v-container fluid class="fullsize wrapper">
    <v-row class="align-center justify-center fullsize">
      <v-col cols="12" class="d-flex justify-center align-center flex-column">
        <h2 class="white--text text-center">
          Конец игры
        </h2>
        <v-btn
          depressed
          outlined
          color="white"
          class="mt-5"
          @click="restart"
        >
          Начать игру заново
        </v-btn>
        <v-btn
          depressed
          outlined
          color="white"
          class="mt-5"
          @click="goBackToIntro"
        >
          Вернуться на страницу новеллы
        </v-btn>
        <v-btn
          depressed
          dark
          class="mt-5"
          @click="goHome"
        >
          Перейти к списку новелл
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { InfoMessage } from '@/plugins/toast'
export default {
  props: {
    game: { type: Object, required: true }
  },
  methods: {
    restart () {
      this.$emit('callToRestart')
    },
    goBackToIntro () {
      //
      this.$router.push('/games/' + this.game.id)
    },
    goHome () {
      // InfoMessage('Игра окончена')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="sass" scoped>
.wrapper
  width: 100%
  height: 100%
  position: absolute
  top: 0
  left: 0
  background-color: rgb(68,68,68)
  color: white
  & h2
    font-size: 2em
    color: white
</style>
