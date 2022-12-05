<template>
  <game-loading-screen v-if="isLoading" />
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
    // TODO: вероятно этот метод нужно как-то оптимизировать.
    // Вынести в storage или отрефакторить...
    async fetchDataFromServer () {
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
        gameData = await this.$api.call('getGameByID', gameID)
      } catch (err) {
        throw new Error('Данные не доступны')
      } finally {
        this.isLoading = false
      }
      return gameData
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
        name: 'games-id-edit',
        params: { id: gameData.id, game: gameData }
      })
      this.boot()
    },
    restoreState (gameData) {
      if (this.validateGameState(gameData)) {
        this.$emit('onRestoreState', gameData)
      } else {
        this.$router.push({ name: '404' })
      }
    },
    validateGameState (gameData) {
      // Если не автор пытается загрузить редактор
      if (gameData?.author?._id !== this.user?._id && this.$route.name.startsWith('games-id-edit')) { return false }
      // Если пытаются поиграть в черновик
      if (gameData.status === 'draft' && this.$route.name.startsWith('games-id-play')) { return false }
      // Если в тестдрайв пытается зайти не автор
      if (gameData.status === 'test_drive' && gameData.author._id !== this.user._id) { return false }
      return true
    },
    // Определяем текущий роут и решаем как загружать данные, если нужно вообще
    async boot () {
      const routeName = this.$route.name
      // if (this.$route.fullPath.indexOf('/edit')) {
      //   routeName = 'games-edit'
      // }
      if (routeName.startsWith('games-add')) {
        // this.checkForLastUnpublishedProject()
      } else if (routeName.startsWith('games-id-play') || routeName.startsWith('games-id-edit')) {
        if (!this.gameData) {
          this.gameData = await this.fetchDataFromServer()
        }
        if (!this.user) {
          await this.$api.waitUntilRequestResolves('getProfile')
        }
        this.restoreState(this.gameData)
      }
    }
  }
}
</script>
