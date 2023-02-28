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
            v-model="activeTag"
            :items="tags"
            class="pt-0"
            label="Поиск по категории"
            item-text="title"
            item-value="_id"
            :disabled="!tags.length"
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
                :style="'background-image: url(' + back.url + ');'"
                @click="changeBack(back)"
              >
                <div class="flex-grow-1 text-center">
                  <span>
                    {{ back.title }}
                    <template v-if="back === activeBack">
                      - <strong>Активно</strong>
                    </template>
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
        <v-col cols="12" class="text-center pa-0">
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
import lsm from '@/plugins/localStorageManager'

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
      activeTag: false
    }
  },
  computed: {
    pages () {
      return this.filteredBacksChunks.length
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
      if (!this.nameSearchKey && !this.activeTag) { return this.backs }

      let backs = [...this.backs]

      if (this.nameSearchKey) {
        backs = this.backs.filter((item) => {
          if (item.title && this.nameSearchKey) {
            return item.title.toLowerCase().includes(this.nameSearchKey.toLowerCase())
          } else {
            return false
          }
        })
      }

      if (this.activeTag) {
        backs = backs.filter((item) => {
          return item.tags.find(tag => tag === this.activeTag)
        })
      }

      return backs
    },
    backs () {
      return this.$store.state.constructorStorage.backgrounds
    },
    tags () {
      return this.$store.state.constructorStorage.backgroundCategories
    }
  },
  watch: {
    nameSearchKey () {
      this.page = 1
    },
    activeTag () {
      this.page = 1
    },
    value () {
      this.setActiveBackground()
    }
  },
  async mounted () {
    lsm.init()
    await Promise.all([
      this.loadBacks(),
      this.loadBackCats()
    ])
    this.setActiveBackground()
  },
  methods: {
    setActiveBackground () {
      if (this.value) {
        this.activeBack = this.backs.find(back => this.value === back.image_id)
      }
    },
    changeBack (back) {
      const value = back.image_id
      lsm.state.lastSelectedBack = { type: 'image', value }
      lsm.save()
      this.$emit('changeBack', value)
    },
    async loadBacks () {
      if (!this.backs.length) {
        await this.$store.dispatch('constructorStorage/loadBackgrounds')
        // if (!this.value) {
        //   this.changeBack(this.backs[0])
        // }
      }
    },
    loadBackCats () {
      if (!this.tags.length) {
        this.$store.dispatch('constructorStorage/loadBackgroundCategories')
      }
    }
  }
}
</script>
