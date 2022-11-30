<template>
  <v-container fluid class="fullsize wrapper">
    <v-row class="align-center justify-center fullsize">
      <v-col cols="12" class="d-flex justify-center align-center flex-column">
        <h2 class="white--text text-center">
          "{{ title }}"
        </h2>
        <v-btn
          depressed
          outlined
          color="white"
          class="mt-5"
          @click="startNew"
        >
          Новая игра
        </v-btn>
        <v-btn
          v-if="saveObj"
          depressed
          outlined
          color="white"
          class="mt-5"
          @click="continueLastGame"
        >
          Продолжить последнюю игру
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
        <p class="white--text text-center mt-5" style="max-width: 500px">
          Ваш игровой процесс автоматически сохраняется на текущем устройстве. Вы можете закончить играть в любой момент и продолжить с того же места когда будете снова готовы. Приятной игры!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { InfoMessage } from '@/plugins/toast'
import GameAutoSaveManager from '@/plugins/gameAutoSaveManager'
export default {
  props: {
    game: { type: Object, required: true }
  },
  data () {
    return {
      gameAutoSaveManager: null,
      saveObj: null
    }
  },
  computed: {
    title () {
      return this.game.title
    }
  },
  mounted () {
    this.gameAutoSaveManager = new GameAutoSaveManager()
    this.saveObj = this.gameAutoSaveManager.getSave(this.game._id)
  },
  methods: {
    startNew () {
      this.$emit('callToStart')
    },
    goBackToIntro () {
      this.$router.push('/games/' + this.game._id)
    },
    continueLastGame () {
      if (!this.saveObj) { return }
      this.$emit('loadGame', this.saveObj)
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
  background-color: $mainBackColor
  color: $mainTextColor
  & h2
    font-size: 2em
    color: $mainTextColor
    max-width: 600px
    margin: auto
    overflow: hidden
  & button
    @media (max-width: 500px)
      font-size: 0.7em
</style>
