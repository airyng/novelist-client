<template>
  <div v-if="isLoading" class="blockWall">
    <h1>Загрузка...</h1>
  </div>
</template>
<script>
import Swal from 'sweetalert'
export default {
  data () {
    return {
      gameData: null,
      isLoading: false
    }
  },
  computed: {
    user () {
      return this.$root.getUserData().user
    }
  },
  mounted () {
    this.boot()
  },
  methods: {
    loadDataFromServer () {
      if (!this.$route.params.id) {
        Swal.fire({
          title: 'Ошибка загрузки данных',
          text: 'Пожалуйста, обновите страницу!',
          icon: 'error',
          toast: true,
          position: 'bottom',
          timerProgressBar: true,
          showConfirmButton: false
        })
        return false
      }

      //   this.isLoading = true

      //   let route = 'get-published-by-id'
      //   if (this.$route.name === 'edit-game') { route = 'get-by-id' }

    //   axios.get('/api/game/' + route + '/' + this.$route.params.id)
    //     .then((response) => {
    //       this.onRestoreState(response.data)
    //     })
    //     .catch((e) => {
    //       if (e.response.status == 404) {
    //         return this.$router.push({ name: '404' })
    //       } else {
    //         return this.$router.push({ name: '423' })
    //         console.log('Error with status ' + e.response.status, e.response)
    //       }
    //     })
    //     .finally(() => {
    //       this.isLoading = false
    //     })
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
      Swal.fire({
        title: 'Готово!',
        text: 'Новелла "' + this.gameData.title + '" успешно загружена',
        icon: 'success',
        toast: true,
        timer: 3000,
        position: 'bottom',
        timerProgressBar: true,
        showConfirmButton: false
      })
    },
    callToRestoreStateFromData (gameData) {
      this.$router.push({
        name: 'edit-game',
        params: { id: gameData.id, game: gameData }
      })
      this.boot()
    },
    onRestoreState (gameData) {
      this.validateGameState(gameData)
      this.$emit('onRestoreState', gameData)
    },
    validateGameState (gameData) {
      // Если не автор пытается загрузкить редактор
      if (gameData.author !== this.user.id && this.$route.name === 'edit-game') { this.$router.push({ name: '423' }) }
      // Если пытаются поиграть в черновик
      if (gameData.status === 'draft' && this.$route.name === 'play-game') { this.$router.push({ name: '404' }) }
      // Если в тестдрайв пытается зайти не автор
      if (gameData.status === 'test_drive' && gameData.author !== this.user.id) { this.$router.push({ name: '404' }) }
    },
    // Определяем текущий роут и решаем как загружать данные, если нужно вообще
    boot () {
      if (this.$route.name === 'add-game') {
        this.checkForLastUnpublishedProject()
      } else if (this.$route.name === 'edit-game' && this.gameData) {
        this.onRestoreState(this.gameData)
      } else if (this.$route.name === 'play-game' || (this.$route.name === 'edit-game' && !this.gameData)) {
        this.loadDataFromServer()
      }
    }
  }
}
</script>

<style lang="sass">
    .blockWall
        position: absolute
        width: 100vw
        height: 100vh
        top: 0
        left: 0
        background-color: white
        & > h1
            width: 100%
            text-align: center
            position: absolute
            top: calc( 50% - 25px)
            height: 50px

</style>
