<template>
  <GameLoadingScreen v-if="isLoading" />
</template>
<script>
import { SuccessMessage, ErrorMessage } from '@/plugins/toast'
import { sleep } from '@/plugins/utils'
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
        name: 'games-id-edit',
        params: { id: gameData.id, game: gameData }
      })
      this.boot()
    },
    async onRestoreState (gameData) {
      if (await this.validateGameState(gameData)) {
        this.$emit('onRestoreState', gameData)
      } else {
        this.$router.push({ name: '404' })
      }
    },
    async validateGameState (gameData) {
      while (!this.user.id) {
        // Ждем получения данных пользователя
        await sleep(100)
      }
      // Если не автор пытается загрузить редактор
      if (gameData.user_id !== this.user.id && this.$route.name === 'games-id-edit') { return false }
      // Если пытаются поиграть в черновик
      if (gameData.status === 'draft' && this.$route.name === 'games-id-play') { return false }
      // Если в тестдрайв пытается зайти не автор
      if (gameData.status === 'test_drive' && gameData.user_id !== this.user.id) { return false }
      return true
    },
    // Определяем текущий роут и решаем как загружать данные, если нужно вообще
    boot () {
      const routeName = this.$route.name
      // if (this.$route.fullPath.indexOf('/edit')) {
      //   routeName = 'games-edit'
      // }
      if (routeName === 'games-add') {
        // this.checkForLastUnpublishedProject()
      } else if (routeName === 'games-id-edit' && this.gameData) {
        this.onRestoreState(this.gameData)
      } else if (routeName === 'games-id-play' || (routeName === 'games-id-edit' && !this.gameData)) {
        this.loadDataFromServer()
      }
    }
  }
}
</script>
