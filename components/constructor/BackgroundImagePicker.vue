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
            v-for="back in filteredBacksChunks[page-1]"
            :key="back.id"
            cols="12"
            md="4"
          >
            <v-item>
              <v-card
                :color="back == activeBack ? 'primary' : ''"
                class="d-flex align-end back-item"
                dark
                height="200"
                :style="'background-image: url('+BACKEND_URL + back.url_medium+');'"
                @click="changeBack(back)"
              >
                <div
                  class="flex-grow-1 text-center"
                >
                  <span v-if="back != activeBack">
                    {{ back.name }}
                  </span>

                  <span v-else>
                    {{ back.name }} - <strong>Активно</strong>
                  </span>
                </div>
              </v-card>
            </v-item>
          </v-col>
        </template>

        <v-col v-else>
          <p>Изображения не найдены...</p>
        </v-col>
      </v-row>
      <v-row v-if="filteredBacks.length">
        <v-col cols="12" class="text-center">
          <v-pagination
            v-model="page"
            :length="pages"
            circle
            :total-visible="7"
            color="#673ab7"
            dark
          />
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
  name: 'BackgroundImagePicker',
  props: {
    value: { type: String, default: null }
  },
  data () {
    return {
      page: 1,
      nameSearchKey: '',
      activeBack: null,
      activeCategory: false
    }
  },
  computed: {
    pages () {
      return this.filteredBacksChunks.length
    },
    BACKEND_URL () {
      return process.env.BACKEND_URL
    },
    // Результаты поиска разбитые на массивы страниц
    filteredBacksChunks () {
      const itemsPerPage = 6
      const result = []

      if (!this.filteredBacks) { return result }

      this.filteredBacks.map((item, i) => {
        // Если первый элемент на странице
        if ((i + 1) % itemsPerPage === 1) {
          result.push([item])
        } else {
          result[result.length - 1].push(item)
        }
        return item
      })

      return result
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
  watch: {
    nameSearchKey () {
      this.page = 1
    },
    activeCategory () {
      this.page = 1
    },
    value () {
      this.setActiveBackground()
    }
  },
  async mounted () {
    await Promise.all([
      this.loadBacks(),
      this.loadBackCats()
    ])
    this.setActiveBackground()
  },
  methods: {
    setActiveBackground () {
      if (this.value) {
        this.activeBack = this.backs.find(back => this.value.includes(back.url))
      }
    },
    changeBack (back) {
      this.$emit('OnBackChanged', this.BACKEND_URL + back.url)
    },
    async loadBacks () {
      if (!this.backs.length) {
        await this.$store.dispatch('constructorStorage/loadBackgrounds')
        if (!this.value) {
          this.changeBack(this.backs[0])
        }
      }
    },
    loadBackCats () {
      if (!this.categories.length) {
        this.$store.dispatch('constructorStorage/loadBackgroundCategories')
      }
    }
  }
}
</script>
