<template>
  <GameLoadingScreen v-if="isLoading" />
</template>
<script>
import { SuccessMessage, ErrorMessage } from '@/plugins/toast'
export default {
  data () {
    return {
      gameData: null,
      isLoading: false
    }
  },
  computed: {
    user () {
      return this.$store.state.userData
    }
  },
  mounted () {
    this.boot()
  },
  methods: {
    async loadDataFromServer () {
      const gameID = this.$route.params.id
      if (!gameID) {
        ErrorMessage({
          title: 'Ошибка загрузки данных',
          text: 'Пожалуйста, обновите страницу!'
        })
        return false
      }
      this.isLoading = true
      let gameData = null
      try {
        gameData = await this.$api.getGameByID(gameID)
      } catch (err) {
        throw new Error('Данные не доступны')
      } finally {
        this.isLoading = false
      }
      this.onRestoreState(gameData)
    },
    checkForLastUnpublishedProject () {
    //   axios.post('/api/game/check-for-last-unpublished-project')
    //     .then((response) => {
    //       this.gameData = response.data.game

      //       if (this.gameData && this.gameData.id != this.projectID) {
      //         Swal.fire({
      //           text: 'Хотите продолжить работу над последней новеллой "' + this.gameData.title + '"?',
      //           icon: 'info',
      //           toast: true,
      //           timer: 10000,
      //           position: 'bottom',
      //           timerProgressBar: true,
      //           showConfirmButton: true
      //         })
      //           .then((result) => {
      //             if (result.isConfirmed) {
      //               this.callToRestoreStateFromData(this.gameData)

    //               this.showSuccess()
    //             }
    //           })
    //       }
    //     })
    },
    showSuccess () {
      SuccessMessage({ text: 'Новелла "' + this.gameData.title + '" успешно загружена' })
    },
    callToRestoreStateFromData (gameData) {
      this.$router.push({
        name: 'games-edit',
        params: { id: gameData.id, game: gameData }
      })
      this.boot()
    },
    onRestoreState (gameData) {
      this.validateGameState(gameData)
      this.$emit('onRestoreState', gameData)
    },
    validateGameState (gameData) {
      // Если не автор пытается загрузить редактор
      if (gameData.user_id !== this.user.id && this.$route.name === 'games-edit') { this.$router.push({ name: '404' }) }
      // Если пытаются поиграть в черновик
      if (gameData.status === 'draft' && this.$route.name === 'games-play') { this.$router.push({ name: '404' }) }
      // Если в тестдрайв пытается зайти не автор
      if (gameData.status === 'test_drive' && gameData.user_id !== this.user.id) { this.$router.push({ name: '404' }) }
    },
    // Определяем текущий роут и решаем как загружать данные, если нужно вообще
    boot () {
      if (this.$route.name === 'games-add') {
        // this.checkForLastUnpublishedProject()
      } else if (this.$route.name === 'games-edit' && this.gameData) {
        this.onRestoreState(this.gameData)
      } else if (this.$route.name === 'games-play' || (this.$route.name === 'games-edit' && !this.gameData)) {
        this.loadDataFromServer()
      }
    }
  }
}
</script>
