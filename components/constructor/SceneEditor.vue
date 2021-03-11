<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="d-inline-block py-2 big-white-txt-shadow">
          {{ scene.title }}
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    sceneid: { type: [Number, Boolean], default: false }
  },
  computed: {
    scene () {
      return this.$store.getters['constructorStorage/getSceneById'](this.sceneid)
    }
  }
}
</script>
