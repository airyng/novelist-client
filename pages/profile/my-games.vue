<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col class="col-12">
          <h1>Мои новеллы</h1>
        </v-col>

        <template v-if="loading">
          <p class="grey--text">
            Загрузка...
          </p>
        </template>
        <template v-else-if="!items.length">
          <p class="grey--text">
            Вы еще не создали ни одной новеллы
          </p>
        </template>
        <v-col v-else class="col-12">
          <v-row>
            <v-col class="col-3">
              <span>Название</span>
            </v-col>
            <v-col class="col-2">
              <span>Статус</span>
            </v-col>
            <v-col class="col-1">
              <span>Cцен</span>
            </v-col>
            <v-col class="col-3">
              <span>Обновлено</span>
            </v-col>
          </v-row>

          <v-row
            v-for="(item, i) in items"
            :key="i"
            class="align-items-center"
          >
            <v-col class="col-3">
              <span class="d-block text-substr">{{ item.title }}</span>
            </v-col>
            <v-col class="col-2">
              <v-chip
                v-if="item.status == 'published'"
                color="green"
                text-color="white"
              >
                <span>{{ translateStatus(item.status) }}</span>
              </v-chip>
              <v-chip
                v-if="item.status == 'test_drive'"
                color="pink"
                text-color="white"
              >
                <span>{{ translateStatus(item.status) }}</span>
              </v-chip>
              <v-chip
                v-if="item.status == 'draft'"
                color="orange"
                text-color="white"
              >
                <span>{{ translateStatus(item.status) }}</span>
              </v-chip>
            </v-col>
            <v-col class="col-1">
              <span>{{ getSceneCount(item) }}</span>
            </v-col>
            <v-col class="col-2">
              <span>{{ niceDate( item.updated_at ) }}</span>
            </v-col>

            <v-col class="col-2 table-options">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-list-item-icon
                    class="curs-pointer mr-2"
                    v-bind="attrs"
                    @click="goToPage('/games/'+ item.id +'/edit')"
                    v-on="on"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-list-item-icon>
                </template>
                <span>Редактировать</span>
              </v-tooltip>

              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-list-item-icon
                    class="curs-pointer mr-2"
                    :style=" (item.status == 'draft') ? 'opacity: .5' : ''"
                    v-bind="attrs"
                    @click="goToPlay(item)"
                    v-on="on"
                  >
                    <v-icon>mdi-gamepad-variant-outline</v-icon>
                  </v-list-item-icon>
                </template>
                <span>Играть</span>
              </v-tooltip>

              <v-tooltip v-if="item.status == 'published'" top>
                <template #activator="{ on, attrs }">
                  <v-list-item-icon
                    class="curs-pointer mr-2"
                    v-bind="attrs"
                    @click="unpublish(item)"
                    v-on="on"
                  >
                    <v-icon>mdi-backspace-outline</v-icon>
                  </v-list-item-icon>
                </template>
                <span>Деактивировать</span>
              </v-tooltip>

              <v-tooltip v-else top>
                <template #activator="{ on, attrs }">
                  <v-list-item-icon
                    class="curs-pointer mr-2"
                    :style=" (item.status == 'draft') ? 'opacity: .5' : ''"
                    v-bind="attrs"
                    @click="publish(item)"
                    v-on="on"
                  >
                    <v-icon>mdi-send</v-icon>
                  </v-list-item-icon>
                </template>
                <span>Опубликовать</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ErrorMessage } from '@/plugins/toast'

export default {
  async asyncData ({ $api }) {
    await $api.getMyGamesList()
  },
  data: () => ({
    items: [],
    loading: false
  }),
  methods: {
    unpublish (item) {
      // axios.post('/api/game/unpublish', { id: item.id })
      //   .then((response) => {
      //     if (response.status == 200) {
      //       Swal.fire({
      //         title: 'Готово!',
      //         text: 'Новелла "' + item.title + '" деактивирована!',
      //         icon: 'success',
      //         toast: true,
      //         timer: 5000,
      //         position: 'bottom',
      //         timerProgressBar: true,
      //         showConfirmButton: false
      //       })
      //       item.status = response.data.status
      //     }
      //   })
      //   .catch((e) => {
      //     console.error(e)
      //     Swal.fire({
      //       title: 'Ошибка!',
      //       text: 'Попробуйте позже',
      //       icon: 'error',
      //       toast: true,
      //       timer: 5000,
      //       position: 'bottom',
      //       timerProgressBar: true,
      //       showConfirmButton: false
      //     })
      //   })
    },
    publish (item) {
      if (item.status === 'draft') {
        ErrorMessage(
          'Ошибка',
          'Публикация доступна только для новелл со статусом "Тест-Драйв"'
        )
        // return
      }

      // axios.post('/api/game/publish', { id: item.id })
      //   .then((response) => {
      //     if (response.status == 200) {
      //       Swal.fire({
      //         title: 'Готово!',
      //         text: 'Новелла "' + item.title + '" успешно опубликована!',
      //         icon: 'success',
      //         toast: true,
      //         timer: 5000,
      //         position: 'bottom',
      //         timerProgressBar: true,
      //         showConfirmButton: false
      //       })

      //       item.status = response.data.status
      //     }
      //   })
      //   .catch((e) => {
      //     console.error(e)
      //     Swal.fire({
      //       title: 'Ошибка!',
      //       text: 'Попробуйте позже',
      //       icon: 'error',
      //       toast: true,
      //       timer: 5000,
      //       position: 'bottom',
      //       timerProgressBar: true,
      //       showConfirmButton: false
      //     })
      //   })
    },
    getSceneCount (item) {
      return JSON.parse(item.json).length
    },
    goToPage (routePath) {
      this.$router.push(routePath)
    },
    translateStatus (status) {
      if (status === 'draft') { return 'Черновик' }
      if (status === 'test_drive') { return 'Тест-Драйв' }
      if (status === 'published') { return 'Опубликовано' }
      return status
    },
    goToPlay (item) {
      if (item.status === 'draft') {
        ErrorMessage(
          'Ошибка',
          'Новелла в статусе "Черновик"'
        )
      } else {
        this.goToPage('/games/' + item.id + '/play')
      }
    },
    niceDate (date) {
      const d = new Date(date)
      const ye = new Intl.DateTimeFormat('ru', { year: 'numeric' }).format(d)
      const mo = new Intl.DateTimeFormat('ru', { month: 'long' }).format(d)
      const da = new Intl.DateTimeFormat('ru', { day: '2-digit' }).format(d)
      return `${da} ${this.capitalizeFirstLetter(mo)} ${ye}`
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style lang="css" scoped>
    .v-application--is-ltr .table-options .v-list-item__icon:first-child
    {
        margin-right: 4px;
    }

    .v-application--is-ltr .table-options .v-list-item__icon:last-of-type:not(:only-child)
    {
        margin-left: 0px;
    }
</style>
