<template>
  <div class="characterList-container" :style="`max-width: ${maxWidth}px`">
    <div
      v-for="char in characters"
      :key="char.uid"
      class="charPreview mr-2"
      @click.stop="openCharacterEditor(char)"
    >
      <CharacterCanvas
        :updated-at="updatedAt"
        :char-id="char.id"
        portrait
        height="150"
      />
      <span>{{ char.name }}</span>
    </div>

    <div v-if="withAddBtn" class="charPreview d-block" @click="openCharacterEditor()">
      <div class="charPreview" style="border: none">
        <v-icon dark x-large>
          mdi-account-multiple-plus-outline
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    withAddBtn: { type: Boolean, default: false },
    maxWidth: { type: [String, Number], default: '500' }
  },
  data () {
    return {
      updatedAt: 0
    }
  },
  computed: {
    characters () {
      return this.$store.state.constructorStorage.characters
    }
  },
  mounted () {
    this.updatedAt = new Date().getTime()
  },
  methods: {
    openCharacterEditor (char) {
      this.$emit('onCharacterClick', char)
    }
  }
}
</script>

<style lang="sass" scoped>
.characterList-container
  padding: 10px
  display: flex
  align-items: center
  overflow-x: scroll
  overflow-y: hidden
  height: 200px

.charPreview
  display: flex
  width: 150px
  justify-content: center
  align-items: center
  cursor: pointer
  flex-direction: column
  border-radius: 12px
  border: 1px solid transparent
  height: 190px
  &:hover
    border: 1px solid white

.add-char-btn
  display: flex
  width: 50px
  height: 50px
  transition: all .2s ease

</style>
