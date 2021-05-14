<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      dark
      style="z-index: 9;"
      class="m-show"
    >
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <template v-for="(item, index) in items">
            <nuxt-link
              v-if="user || !item.onlyAuth && !user"
              :key="index"
              :to="item.path"
            >
              <v-list-item>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </nuxt-link>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      class="appBar"
      dense
      dark
      :elevation="0"
    >
      <v-container>
        <v-row>
          <v-col class="d-flex align-center">
            <v-app-bar-nav-icon
              class="m-show"
              @click="drawer = true"
            />

            <div class="d-show">
              <template v-for="(item, index) in items">
                <nuxt-link
                  v-if="user || !item.onlyAuth && !user"
                  :key="index"
                  :to="item.path"
                  :class="item.classes || 'px-3'"
                  class="align-self-center"
                >
                  {{ item.title }}
                </nuxt-link>
              </template>
            </div>

            <v-spacer />

            <template v-if="user">
              <div class="d-show">
                <nuxt-link
                  class="px-2"
                  to="/games/add"
                >
                  <v-btn dark :elevation="0">
                    + Новелла
                  </v-btn>
                </nuxt-link>

                <nuxt-link
                  class="px-2 align-self-center"
                  to="/me/games"
                >
                  Мои новеллы
                </nuxt-link>
              </div>

              <nuxt-link class="px-2 align-self-center" to="/me">
                {{ user.name }}
              </nuxt-link>

              <v-btn x-small fab dark :elevation="0" @click="logout">
                <v-icon small>
                  mdi-home-export-outline
                </v-icon>
              </v-btn>
            </template>

            <template v-else>
              <nuxt-link class="align-self-center" to="/signin">
                Войти
              </nuxt-link>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { screen } from '@/mixins/screen'
export default {
  mixins: [screen],
  data () {
    return {
      drawer: false,
      items: [
        {
          classes: 'main-label mr-10',
          title: 'Новеллист',
          path: '/'
        },
        {
          title: 'О сайте',
          path: '/about'
        }
        // {
        //     title: 'Мои новеллы',
        //     path: '/my-games',
        //     onlyAuth: true,
        // },
      ]
    }
  },
  computed: {
    user () {
      return this.$store.state.userData
    }
  },
  mounted () {},
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style lang="sass" scoped>
.appBar
  background-color: $subBackColor!important
a
  color: $mainTextColor
  text-decoration: none
  text-transform: uppercase
  font-weight: bold
.main-label
  font-size: 1.2em
</style>
