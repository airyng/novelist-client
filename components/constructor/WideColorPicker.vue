<template>
  <v-row>
    <v-col cols="6">
      <v-color-picker
        v-model="val"
        dot-size="20"
        mode="rgba"
        :show-swatches="false"
        :hide-inputs="true"
        dark
      />
    </v-col>
    <v-col cols="6">
      <v-color-picker
        v-model="val"
        dot-size="20"
        mode="rgba"
        :hide-canvas="true"
        :show-swatches="true"
        :hide-inputs="true"
        swatches-max-height="228px"
        class="color-picker-hide-controls"
        dark
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      val: null
    }
  },
  watch: {
    val (value) {
      this.$emit('onValueChanged', value)
    }
  }
}
</script>
