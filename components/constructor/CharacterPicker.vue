<template>
  <div>
    <ConstructorCharacterList v-if="characters.length" class="justify-space-around" @onCharacterClick="pickCharacter" />
    <v-alert
      v-else
      outlined
      type="warning"
      icon="mdi-alert"
      dark
      dense
      border="left"
    >
      Вы еще не добавили ни одного персонажа
    </v-alert>
  </div>
</template>

<script>
export default {
  computed: {
    characters () {
      return this.$store.state.constructorStorage.characters
    }
  },
  methods: {
    pickCharacter (char) {
      this.$emit('onCharacterPicked', char)
    }
  }
}
</script>
