<template>
  <v-container class="fullsize">
    <v-row class="fullsize">
      <v-col cols="1" class="d-flex flex-column">
        <v-avatar
          v-for="(item, index) in blocks"
          :key="index"
          :color="currentSubBlock.folder === item.folder ? 'green' : 'indigo'"
          size="50"
          class="mb-5"
          @click="showItemsSubBlock(item)"
        >
          <span class="white--text caption">{{ item.title }}</span>
        </v-avatar>
        <v-avatar
          color="purple"
          size="50"
          class="mb-5"
          @click="setRandomSubBlocks"
        >
          <span class="white--text caption">Random</span>
        </v-avatar>
      </v-col>
      <v-col cols="5" style="overflow: hidden auto; height: 100%">
        <v-avatar
          v-for="(id, index) in currentSubBlock.ids"
          :key="index"
          :color="activeItems.filter((item) => item.folder === currentSubBlock.folder)[0].imageID === id ? 'green' : 'red'"
          size="50"
          class="mb-5 mr-5"
          @click="setActiveAsset(currentSubBlock.folder, id)"
        >
          <span class="white--text caption">{{ id }}</span>
        </v-avatar>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12" class="d-flex justify-center">
            <!-- Нужна валидация -->
            <v-text-field
              v-model="characterName"
              label="Имя"
              clearable
              style="max-width: 200px"
              :counter="18"
            />
          </v-col>
          <v-col cols="12" class="d-flex justify-center">
            <CharacterCanvas :updated-at="updatedAt" :char-id="generatedImageID" />
          </v-col>
          <v-col cols="12" class="d-flex justify-center">
            <v-btn
              depressed
              color="indigo"
              dark
              @click="save"
            >
              Сохранить
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    char: { type: [Object, Boolean], default: false }
  },
  data () {
    return {
      updatedAt: 0,
      activeItems: [],
      currentSubBlock: false,
      characterName: '',
      blocks: [
        {
          title: 'Тело',
          folder: 'Base',
          nameBase: 'base',
          ids: ['1', '2', '3', '4', '5']
        },
        {
          title: 'Волосы',
          folder: 'Hair',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '1_8', '1_9', '1_10', '1_11', '1_12', '1_13', '1_14', '1_15', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7', '2_8', '2_9', '2_10', '2_11', '2_12', '2_13', '2_14', '2_15', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '3_7', '3_8', '3_9', '3_10', '3_11', '3_12', '3_13', '3_14', '3_15', '4_1', '4_2', '4_3', '4_4', '4_5', '4_6', '4_7', '4_8', '4_9', '4_10', '4_11', '4_12', '4_13', '4_14', '4_15', '5_1', '5_2', '5_3', '5_4', '5_5', '5_6', '5_7', '5_8', '5_9', '5_10', '5_11', '5_12', '5_13', '5_14', '5_15']
        },
        {
          title: 'Верх',
          folder: 'Tops',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '4_1', '4_2', '4_3', '4_4', '4_5', '4_6', '5_1', '5_2', '5_3', '5_4', '5_5', '5_6']
        },
        {
          title: 'Низ',
          folder: 'Bottoms',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6']
        },
        {
          title: 'Брови',
          folder: 'Eyebrows',
          ids: ['1_1', '2_1', '3_1', '4_1', '5_1']
        },
        {
          title: 'Глаза',
          folder: 'Eyes',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '1_8', '1_9', '1_10', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7', '2_8', '2_9', '2_10', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '3_7', '3_8', '3_9', '3_10']
        },
        {
          title: 'Рот',
          folder: 'Mouth',
          ids: ['1_1', '2_1', '3_1', '4_1', '5_1']
        }
        // ,
        // {
        //   title: 'Разное',
        //   folder: 'Misc',
        //   ids: ['blush', 'blush_2', 'sweat', 'tears', 'tears1', 'tears1_1', 'tears1_2', 'tears1_3', 'tears1_4', 'tears1_5', 'tears2', 'tears2_1', 'tears2_2', 'tears2_3', 'tears2_4', 'tears2_5']
        // }
      ]
    }
  },
  computed: {
    generatedImageID () {
      let result = ''
      this.activeItems.forEach((item) => {
        result += item.imageID + '.'
      })
      return result.substr(0, result.length - 1)
    },
    charPartsSettings () {
      return this.$store.getters['constructorStorage/getCharPartsSettings']()
    }
  },
  watch: {
    char () {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (typeof this.char === 'object') {
        this.convertIdToItems()
        this.showItemsSubBlock(this.blocks[0])
        this.characterName = this.char.name
      } else if (this.char === true) {
        this.activeItems = [...this.charPartsSettings]
        this.showItemsSubBlock(this.blocks[0])
        this.setInitialAssets()
      } else {
        this.activeItems = []
        this.characterName = ''
      }
    },
    convertIdToItems () {
      const ids = this.char.id.split('.')
      this.activeItems = []

      ids.forEach((item, index) => {
        const part = { ...this.charPartsSettings[index] }
        part.imageID = item
        this.activeItems.push(part)
      })
    },
    setRandomSubBlocks () {
      for (let index = 0; index < this.blocks.length; index++) {
        const element = this.blocks[index]
        this.setActiveAsset(element.folder, element.ids[Math.floor(Math.random() * element.ids.length)])
      }
    },
    setInitialAssets () {
      for (let index = 0; index < this.blocks.length; index++) {
        const element = this.blocks[index]
        this.setActiveAsset(element.folder, element.ids[0])
      }
    },
    setActiveAsset (folder, id) {
      this.activeItems.forEach((item, index) => {
        if (item.folder === folder) {
          this.activeItems[index].imageID = id
        }
      })
      this.updatedAt = new Date().getTime()
    },
    showItemsSubBlock (block) {
      this.currentSubBlock = block
    },
    save () {
      const char = { ...this.$store.getters['constructorStorage/getNewCharacter'] }
      console.log(char)
      if (this.char.uid) {
        char.uid = this.char.uid
      }
      char.name = this.characterName
      char.id = this.generatedImageID
      this.$store.dispatch('constructorStorage/updateCharacterList', char)
    }
  }
}
</script>
