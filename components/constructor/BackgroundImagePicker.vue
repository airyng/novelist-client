<template>
  <div>
    <v-item-group v-if="backs.length" mandatory>
      <v-row>
        <v-col cols="12" md="6" class="pt-0">
          <v-text-field
            v-model="nameSearchKey"
            class="pt-0"
            :clearable="true"
            label="Поиск по названию"
          />
        </v-col>
        <!-- TODO: скорее всего, что бы избежать чрезмерного кол-ва узлов в дом дереве, нужно показывать только изображения в категории -->
        <!-- Предварительно устанавливать дефолтную категорию и убедиться, что все изображения имеют хотя бы одну категорию -->
        <v-col cols="12" md="6" class="pt-0">
          <v-select
            v-model="activeCategory"
            :items="categories"
            class="pt-0"
            label="Поиск по категории"
            item-text="name"
            item-value="id"
            :disabled="!categories.length"
            :clearable="true"
          />
        </v-col>

        <template v-if="filteredBacks.length">
          <v-col
            v-for="back in filteredBacks"
            :key="back.id"
            cols="12"
            md="4"
          >
            <v-item>
              <v-card
                :color="back == activeBack ? 'primary' : ''"
                class="d-flex align-center back-item"
                dark
                height="200"
                :style="'background-image: url('+BACKEND_URL + back.url_medium+');'"
                @click="changeBack(back)"
              >
                <v-scroll-y-transition>
                  <div
                    class="flex-grow-1 text-center"
                  >
                    <span v-if="back != activeBack">
                      {{ back.name }}
                    </span>

                    <span v-else>
                      {{ back.name }} - Активно
                    </span>
                  </div>
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </template>

        <v-col v-else>
          <p>Изображения не найдены...</p>
        </v-col>
      </v-row>
    </v-item-group>

    <p v-else>
      Загрузка...
    </p>
  </div>
</template>

<script>
export default {
  name: 'BackgroundPicker',
  data () {
    return {
      nameSearchKey: '',
      activeBack: null,
      activeCategory: false
    }
  },
  computed: {
    BACKEND_URL () {
      return process.env.BACKEND_URL
    },
    filteredBacks () {
      if (!this.nameSearchKey && !this.activeCategory) { return this.backs }

      let backs = [...this.backs]

      if (this.nameSearchKey) {
        backs = this.backs.filter((item) => {
          if (item.name && this.nameSearchKey) {
            return item.name.toLowerCase().includes(this.nameSearchKey.toLowerCase())
          } else {
            return false
          }
        })
      }

      if (this.activeCategory) {
        backs = backs.filter((item) => {
          let result = false

          for (let index = 0; index < item.categories.length; index++) {
            const category = item.categories[index]

            if (category.id === this.activeCategory) {
              result = true
              break
            }
          }
          return result
        })
      }

      return backs
    },
    backs () {
      return this.$store.state.constructorStorage.backgrounds
    },
    categories () {
      return this.$store.state.constructorStorage.backgroundCategories
    }
  },
  mounted () {
    this.loadBacks()
    this.loadBackCats()
  },
  methods: {
    changeBack (back) {
      this.activeBack = back
      this.$emit('OnBackChanged', this.BACKEND_URL + this.activeBack.url)
    },
    async loadBacks () {
      if (!this.backs.length) {
        await this.$store.dispatch('constructorStorage/loadBackgrounds')
        this.changeBack(this.backs[0])
      }
    },
    loadBackCats () {
      if (!this.categories.length) {
        this.$store.dispatch('constructorStorage/loadBackgroundCategories')
      }
    //   axios.get('/api/game/get-background-categories').then((res) => {
    //     this.categories = res.data.map((item) => {
    //       item.value = item.text = item.name
    //       return item
    //     })
    //   })
    }
  }
}
</script>
