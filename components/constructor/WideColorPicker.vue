<template>
  <v-row>
    <v-col cols="6">
      <v-color-picker
        v-model="localVal"
        dot-size="20"
        mode="rgba"
        :show-swatches="false"
        :hide-inputs="true"
        dark
      />
    </v-col>
    <v-col cols="6">
      <v-color-picker
        v-model="localVal"
        dot-size="20"
        mode="rgba"
        :hide-canvas="true"
        :show-swatches="true"
        :hide-inputs="true"
        swatches-max-height="228px"
        class="color-picker-hide-controls"
        dark
        width="100%"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: { type: String, default: null }
  },
  data () {
    return {
      localVal: null
    }
  },
  watch: {
    value () {
      this.localVal = this.value
    },
    localVal (value) {
      if (typeof value === 'string') {
        this.$emit('onValueChanged', { hexa: value })
      } else {
        this.$emit('onValueChanged', value)
      }
    }
  },
  mounted () {
    if (typeof this.value !== 'string') {
      this.localVal = this.value
    }
  }
}
</script>
