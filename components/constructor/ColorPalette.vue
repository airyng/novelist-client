<template>
  <div class="color-palette-picker d-flex flex-column">
    <div
      v-for="(chunk, i) in chunks"
      :key="i"
      class="color-row d-flex"
    >
      <div
        v-for="color in chunk"
        :key="color"
        class="item ma-1 d-flex align-center justify-center"
        :style="'background-color: '+color"
        @click="pickColor(color)"
      >
        <v-icon
          v-if="color === localVal"
          x-small
          dark
          class="item--check"
        >
          mdi-check
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script>
import colors from '@/plugins/colorsList'
import lsm from '@/plugins/localStorageManager'

export default {
  props: {
    value: { type: String, default: null }
  },
  data () {
    return {
      localVal: null
    }
  },
  computed: {
    colors () {
      return colors
    },
    // Ряды цветов объединенные общим оттенком
    chunks () {
      const itemsPerChunk = 10
      const chunks = []
      colors.map((color, i) => {
        // Если первый элемент чанка
        if ((i + 1) % itemsPerChunk === 1) {
          chunks.push([])
        }
        chunks[chunks.length - 1].push(color)

        return color
      })
      return chunks
    }
  },
  watch: {
    value () {
      this.localVal = this.value
    },
    localVal (value) {
      if (value) {
        this.$emit('onValueChanged', value)
      }
    }
  },
  mounted () {
    lsm.init()
    this.localVal = this.value
  },
  methods: {
    pickColor (color) {
      lsm.state.lastSelectedBack = { type: 'color', value: color }
      lsm.save()
      this.localVal = color
    }
  }
}
</script>

<style lang="sass" scoped>
.item
  width: 45px
  height: 18px
  border-radius: 4px
  cursor: pointer
.item--check
  font-size: 12px
  background: #272727
  border-radius: 50%
  padding: 2px
</style>
