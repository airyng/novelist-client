<template>
  <div>
    <v-container class="fullsize">
      <v-row class="fullsize generatorContainer">
        <v-col
          cols="12"
          md="1"
          class="spriteCategoriesButtons align-center"
          :class="{ disabled: playmode && !userChoose.includes('view'), 'flex-column': windowWidth > 959 }"
        >
          <v-avatar
            v-for="(item, index) in blocks"
            :key="index"
            size="50"
            class="folderIcon"
            :class="{ 'mb-5': windowWidth > 959, 'active': currentSubBlock.folder === item.folder }"
            @click="showItemsSubBlock(item)"
          >
            <span class="caption">{{ item.title }}</span>
          </v-avatar>
          <v-avatar
            color="#ffffffb3"
            size="50"
            :class="{ 'mb-5': windowWidth > 959 }"
            @click="setRandomSubBlocks"
          >
            <span class="caption">Случ.</span>
          </v-avatar>
        </v-col>
        <v-col cols="12" md="5" :class="{ disabled: playmode && !userChoose.includes('view') }">
          <div
            ref="previewsContainer"
            class="previewsContainer pa-3"
          >
            <div
              v-for="(id, index) in currentSubBlock.ids"
              :key="index"
              class="previewItem"
              :class="{ active: activeItems.filter((item) => item.folder === currentSubBlock.folder)[0].imageID === id }"
              @click="setActiveAsset(currentSubBlock.folder, id)"
            >
              <CommonItemCanvasPreview
                :folder="currentSubBlock.folder"
                :name="currentSubBlock.nameBase + id"
                :height="windowWidth > 959 ? 200 : 150"
              />
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col
              cols="12"
              class="d-flex character-settings-block"
              :class="{ 'justify-center': windowWidth > 959, 'flex-column': windowWidth <= 959 }"
            >
              <div v-if="!playmode" class="d-flex flex-column" style="z-index: 8">
                <div class="d-flex">
                  <v-checkbox
                    v-model="isMainCharacter"
                    label="Главный персонаж"
                    color="white"
                    hide-details
                    :class="{ 'mt-0': windowWidth <= 959 }"
                  />
                </div>
                <div class="mt-2 d-flex flex-column">
                  <p class="ma-0" style="color: rgba(0, 0, 0, 0.6)">
                    Игрок может настроить:
                  </p>
                  <div class="d-flex">
                    <v-checkbox
                      v-model="userChoose"
                      class="mt-0 mr-5"
                      label="Внешность"
                      color="white"
                      value="view"
                      hide-details
                    />
                    <v-checkbox
                      v-model="userChoose"
                      class="mt-0 mr-5"
                      label="Имя"
                      color="white"
                      value="name"
                      hide-details
                    />
                  </div>
                </div>
              </div>
              <v-text-field
                v-model="characterName"
                label="Имя"
                clearable
                class="nameInput"
                :class="{ disabled: playmode && !userChoose.includes('name') }"
                :counter="maxNameLength"
              />
            </v-col>
            <v-col cols="12" class="d-flex justify-center" style="z-index: -1">
              <CharacterCanvas
                :updated-at="updatedAt"
                :char-id="generatedImageID"
                :height="characterHeight"
                class="character"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div class="btns-container d-flex flex-column align-center justify-center">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            rounded
            fab
            dark
            depressed
            class="text-center justify-center mb-4"
            @click="save"
            v-on="on"
          >
            <v-icon rounded>
              mdi-content-save-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Сохранить</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            v-if="typeof char === 'object' && !playmode"
            rounded
            fab
            dark
            depressed
            class="text-center justify-center mb-4"
            @click="remove"
            v-on="on"
          >
            <v-icon rounded>
              mdi-trash-can-outline
            </v-icon>
          </v-btn>
        </template>
        <span>Удалить</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { ErrorMessage } from '@/plugins/toast'
import { screen } from '@/mixins/screen'
export default {
  mixins: [screen],
  props: {
    char: { type: [Object, Boolean], default: false },
    playmode: { type: Boolean, default: false }
  },
  data () {
    return {
      updatedAt: 0,
      activeItems: [],
      currentSubBlock: false,
      characterName: '',
      characterHeight: 0,
      maxNameLength: 18,
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
          nameBase: 'hair',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '1_8', '1_9', '1_10', '1_11', '1_12', '1_13', '1_14', '1_15', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7', '2_8', '2_9', '2_10', '2_11', '2_12', '2_13', '2_14', '2_15', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '3_7', '3_8', '3_9', '3_10', '3_11', '3_12', '3_13', '3_14', '3_15', '4_1', '4_2', '4_3', '4_4', '4_5', '4_6', '4_7', '4_8', '4_9', '4_10', '4_11', '4_12', '4_13', '4_14', '4_15', '5_1', '5_2', '5_3', '5_4', '5_5', '5_6', '5_7', '5_8', '5_9', '5_10', '5_11', '5_12', '5_13', '5_14', '5_15']
        },
        {
          title: 'Верх',
          folder: 'Tops',
          nameBase: 'top',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '4_1', '4_2', '4_3', '4_4', '4_5', '4_6', '5_1', '5_2', '5_3', '5_4', '5_5', '5_6']
        },
        {
          title: 'Низ',
          folder: 'Bottoms',
          nameBase: 'bottom',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6']
        },
        {
          title: 'Брови',
          folder: 'Eyebrows',
          nameBase: 'eyebrows',
          ids: ['1_1', '2_1', '3_1', '4_1', '5_1']
        },
        {
          title: 'Глаза',
          folder: 'Eyes',
          nameBase: 'eyes',
          ids: ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '1_7', '1_8', '1_9', '1_10', '2_1', '2_2', '2_3', '2_4', '2_5', '2_6', '2_7', '2_8', '2_9', '2_10', '3_1', '3_2', '3_3', '3_4', '3_5', '3_6', '3_7', '3_8', '3_9', '3_10']
        },
        {
          title: 'Рот',
          folder: 'Mouth',
          nameBase: 'mouth',
          ids: ['1_1', '2_1', '3_1', '4_1', '5_1']
        }
        // ,
        // {
        //   title: 'Разное',
        //   folder: 'Misc',
        //   ids: ['blush', 'blush_2', 'sweat', 'tears', 'tears1', 'tears1_1', 'tears1_2', 'tears1_3', 'tears1_4', 'tears1_5', 'tears2', 'tears2_1', 'tears2_2', 'tears2_3', 'tears2_4', 'tears2_5']
        // }
      ],
      userChoose: [],
      isMainCharacter: false
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
    },
    windowWidth () {
      this.setCharacterSettings()
    }
  },
  mounted () {
    this.init()
    this.setCharacterSettings()
    window.addEventListener('resize', () => {
      this.setCharacterSettings()
    })
  },
  methods: {
    setCharacterSettings () {
      let scaleRate = 1.4
      if (this.windowWidth <= 959) { scaleRate = 2.5 }
      this.characterHeight = Math.ceil(window.innerHeight / scaleRate)
      this.charUpdatedAt = new Date().getTime()
    },
    init () {
      if (typeof this.char === 'object') {
        this.convertIdToItems()
        this.showItemsSubBlock(this.blocks[0])
        this.characterName = this.char.name
        this.userChoose = this.char.userChoose
        this.isMainCharacter = this.char.isMainCharacter
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
      this.scrollCurrentSubBlockToTop()
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
      this.scrollCurrentSubBlockToTop()
    },
    scrollCurrentSubBlockToTop () {
      setTimeout(() => {
        this.$refs.previewsContainer.scrollTop = 0
      }, 0)
    },
    save () {
      if (this.playmode) {
        this.playModeSave()
      } else {
        this.editModeSave()
      }
    },
    playModeSave () {
      if (this.userChoose.includes('name')) {
        if (!this.characterName || this.characterName.length < 3) {
          ErrorMessage({ text: 'Имя персонажа не может быть меньше 3х символов' })
          return
        }
        if (this.characterName.length > this.maxNameLength) {
          ErrorMessage({ text: 'Имя персонажа не может быть больше ' + this.maxNameLength + ' символов' })
          return
        }
      }
      const char = { ...this.$store.getters['constructorStorage/getNewCharacter']() }
      char.userChoose = [...this.userChoose]

      if (this.char.uid) {
        char.uid = this.char.uid
      }
      char.isMainCharacter = this.isMainCharacter
      char.name = this.characterName
      char.id = this.generatedImageID
      this.$emit('onCharSaved', char)
    },
    editModeSave () {
      if (!this.userChoose.includes('name')) {
        if (!this.characterName || this.characterName.length < 3) {
          ErrorMessage({ text: 'Имя персонажа не может быть меньше 3х символов' })
          return
        }
        if (this.characterName.length > this.maxNameLength) {
          ErrorMessage({ text: 'Имя персонажа не может быть больше ' + this.maxNameLength + ' символов' })
          return
        }
      } else {
        this.characterName = 'Персонаж'
      }

      const char = { ...this.$store.getters['constructorStorage/getNewCharacter']() }
      char.userChoose = [...this.userChoose]

      if (this.char.uid) {
        char.uid = this.char.uid
      }
      char.name = this.characterName
      char.id = this.generatedImageID
      char.isMainCharacter = this.isMainCharacter
      this.$store.dispatch('constructorStorage/updateCharacterList', char)
      this.$emit('onCharSaved', char)
    },
    remove () {
      if (this.playmode) { return }
      this.$store.dispatch('constructorStorage/removeCharacterFromList', this.char)
      this.$emit('onCharSaved', false)
    }
  }
}
</script>

<style lang="sass" scoped>
.generatorContainer
  @media (max-width: 959px)
    flex-direction: column-reverse

.btns-container
  position: absolute
  top: 65px
  right: 10px

.character
  position: absolute
  right: 230px
  bottom: -10px
  left: auto
  @media (max-width: 1200px)
    right: 150px
  @media (max-width: 959px)
    bottom: 275px
    right: 50%
    transform: translateX(50%)

.character-settings-block
    background: rgba(255, 255, 255, 0.15)
    border-radius: 5px
    z-index: 0

.disabled .previewsContainer
  opacity: 0

.previewsContainer
  overflow: hidden auto
  height: 650px
  background: rgb(255 255 255 / 15%)
  display: flex
  justify-content: center
  flex-wrap: wrap
  border-radius: 5px
  @media (max-width: 959px)
    display: -webkit-inline-box
    height: 200px
    position: absolute
    left: 0
    bottom: 75px
    width: 100%
    border-radius: 0
    overflow: auto hidden
    flex-wrap: nowrap

.previewItem
  width: 100%
  max-width: 200px
  border: 1px solid white
  border-radius: 5px
  margin-right: 10px
  margin-bottom: 10px
  background: rgb(255 255 255 / 30%)
  cursor: pointer
  transition: .3s all ease
  @media (max-width: 959px)
    max-width: 150px
  &:hover
    background: rgb(255 255 255 / 50%)
  &.active
    background: rgb(255 255 255 / 70%)

.nameInput
  max-width: 200px
  @media (max-width: 959px)
    max-width: 80%

.spriteCategoriesButtons
  display: flex
  &.disabled
    opacity: 0
  @media (max-width: 959px)
    position: absolute
    bottom: 0
    left: 0
    width: 100%
    justify-content: space-evenly
    align-items: center
    background: rgba(255, 255, 255, 0.15)
  @media (max-width: 600px)
    justify-content: flex-start
    overflow: auto hidden
    & > *
      margin: 0 10px
  & .v-avatar
    color: $mainBackColor!important
    background-color: rgba(255, 255, 255, 0.5)
    &.active
      background-color: rgba(255, 255, 255, 0.8)
</style>
