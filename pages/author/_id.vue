<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4">
          <img class="avatar" :src="avatar">
          <h2>{{ item.name }}</h2>
          <p>
            Дата регистрации:
            <span>
              {{ regDate }}
            </span>
          </p>
          <p>
            Пол:
            <span>
              {{ getGenderTranslation(item.gender.gender) }}
            </span>
          </p>
        </v-col>
        <v-col cols="12" sm="8">
          <h2>Новеллы автора</h2>
          <ItemsGrid :items="item.published_games" :author-name="item.name" :author-avatar="item.avatar" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getGenderTranslation } from '@/plugins/utils'

export default {
  async asyncData ({ $api, params, error }) {
    const item = await $api.call('getUser', params.id)
    if (!item) { return error({ statusCode: 404 }) }
    return { item }
  },
  data () {
    return {
      item: null
    }
  },
  computed: {
    avatar () {
      return process.env.BACKEND_URL + '/storage/' + this.item.avatar
    },
    regDate () {
      const date = new Date(this.item.created_at)
      return date.toLocaleDateString()
    }
  },
  methods: {
    getGenderTranslation (value) {
      return getGenderTranslation(value)
    }
  }
}
</script>

<style lang="sass" scoped>
.avatar
  width: 100%
  border-radius: 12px
</style>
