<template>
  <div class="fullsize">
    <v-container fluid class="fullsize" style="z-index: 1; position: relative;">
      <v-row>
        <v-col cols="12">
          <h2 class="white--text text-center">
            Перед началом игры<br>вам необходимо настроить следующих персонажей
          </h2>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="charactersList">
          <div
            v-for="(notConfiguredChar, index) in notConfiguredCharacters"
            :key="index"
            @click="pickCharacter(notConfiguredChar)"
          >
            <div class="d-flex white--text ml-5 mb-2">
              <span class="mr-2">Настроить:</span>
              <span v-if="notConfiguredChar.userChoose.includes('name')">Имя</span>
              <span v-if="notConfiguredChar.userChoose.length === 2" class="mr-2">,&nbsp;</span>
              <span v-if="notConfiguredChar.userChoose.includes('view')">Внешность</span>
            </div>
            <CharacterCanvas
              :updated-at="charUpdatedAt"
              :char-id="notConfiguredChar.id"
              :height="charHeight"
              class="characterSlot"
            />
            <p class="mb-0 mt-2 white--text text-center">
              {{ notConfiguredChar.name }}
            </p>
            <p v-if="notConfiguredChar.isMainCharacter" class="mb-0 mt-2 white--text text-center" style="font-weight: bold">
              Главный персонаж
            </p>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            depressed
            outlined
            color="white"
            class="mt-5"
            @click="goNextStage"
          >
            Сохранить и начать игру
          </v-btn>
        </v-col>
      </v-row>

      <ConstructorPopup
        v-model="isCharacterPopupShow"
        class="char-generator__popup"
        @onClose="updateCharacter"
      >
        <CommonCharacterGenerator
          :char="selectedCharacter"
          playmode
          @onCharSaved="updateCharacter"
        />
      </ConstructorPopup>
    </v-container>
    <CommonNightSkyCanvas />
  </div>
</template>

<script>
import { screen } from '@/mixins/screen'
export default {
  mixins: [screen],
  props: {
    characters: { type: Array, required: true }
  },
  data () {
    return {
      selectedCharacter: false,
      charUpdatedAt: 0
    }
  },
  computed: {
    isCharacterPopupShow () { return !!this.selectedCharacter },
    notConfiguredCharacters () {
      return this.characters.filter(char => char.userChoose.length)
    },
    charHeight () {
      // eslint-disable-next-line no-unused-expressions
      if (!process.server) {
        if (this.windowWidth >= 1024) {
          return 450
        } else if (this.windowWidth >= 400) {
          return 300
        } else {
          return 250
        }
      }
      return 500
    }
  },
  mounted () {},
  methods: {
    updateCharacter (char) {
      this.selectedCharacter = false
      if (!char) { return }
      this.charUpdatedAt = new Date().getTime()
      this.$emit('characterUpdated', char)
    },
    pickCharacter (char) {
      this.selectedCharacter = char
    },
    goNextStage () {
      this.$emit('setupFinished')
    }
  }
}
</script>

<style lang="sass" scoped>
.charactersList
  width: 100%
  overflow-x: auto
  display: flex
  justify-content: center
  @media (max-width: 959px)
    justify-content: start

.characterSlot
  border: 1px solid white
  border-radius: 5px
  background: rgba(255,255,255,30%)
  cursor: pointer
  transition: .3s all ease
  margin: 0 20px
  width: 230px
  &:hover
    background: rgba(255,255,255,50%)
</style>
