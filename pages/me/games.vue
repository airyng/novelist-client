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
            <v-col class="col-1" />
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
            <v-col class="col-1" />
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

            <v-col class="col-2 table-options d-flex align-start justify-start">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-list-item-icon
                    class="curs-pointer mr-2 mt-0"
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
                    class="curs-pointer mr-2 mt-0"
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
                    class="curs-pointer mr-2 mt-0"
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
                    class="curs-pointer mr-2 mt-0"
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
import { SuccessMessage, ErrorMessage } from '@/plugins/toast'

export default {
  middleware: ['authenticated'],
  async asyncData ({ store }) {
    await store.dispatch('profile/getMyGames')
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    items () {
      const games = this.$store.state.profile.myGames.map((item) => {
        item.updated_at_timestamp = new Date(item.updated_at).getTime()
        return item
      })
      // сортировка по дате обновления
      return games.sort((a, b) => b.updated_at_timestamp - a.updated_at_timestamp)
    }
  },
  methods: {
    async unpublish (item) {
      const responseStatus = await this.$api.unpublishGame(item.id)
      if (responseStatus === 200) {
        SuccessMessage({
          text: 'Новелла "' + item.title + '" деактивирована!'
        })

        this.$store.dispatch('profile/updateMyGames', this.items.map((gameItem) => {
          if (gameItem.id === item.id) {
            gameItem.status = 'test_drive'
          }
          return gameItem
        }))
      } else {
        ErrorMessage({
          text: 'Попробуйте позже'
        })
      }
    },
    async publish (item) {
      if (item.status === 'draft') {
        ErrorMessage({ text: 'Публикация доступна только для новелл со статусом "Тест-Драйв"' })
        return
      }
      const responseStatus = await this.$api.publishGame(item.id)
      if (responseStatus === 200) {
        SuccessMessage({
          text: 'Новелла "' + item.title + '" успешно опубликована!'
        })

        this.$store.dispatch('profile/updateMyGames', this.items.map((gameItem) => {
          if (gameItem.id === item.id) {
            gameItem.status = 'published'
          }
          return gameItem
        }))
      } else {
        ErrorMessage({
          text: 'Попробуйте позже'
        })
      }
    },
    getSceneCount (item) {
      const game = JSON.parse(item.json)
      return game.scenes.length
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
        ErrorMessage({ text: 'Новелла в статусе "Черновик"' })
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

<style lang="scss" scoped>
.v-application--is-ltr .table-options .v-list-item__icon:first-child {
  margin-right: 4px;
}

.v-application--is-ltr .table-options .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0px;
}
</style>
