<template>
  <v-row>
    <v-col cols="6">
      <v-color-picker
        v-model="val"
        dot-size="20"
        mode="rgba"
        :show-swatches="false"
        :hide-inputs="true"
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
        class="color-picker-hide-controls"
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
