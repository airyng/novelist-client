<template>
  <div>
    <v-fade-transition>
      <div v-if="value">
        <div class="sceneEditor-overlay" @click="close" />
        <div class="sceneEditor-window constructor">
          <v-btn class="closeBtn" fab small depressed @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <slot>...</slot>
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, required: true }
  },
  methods: {
    close () {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="sass" scoped>
.closeBtn
  position: absolute
  right: 10px
  top: 10px
.sceneEditor-overlay
  width: 100%
  height: 100%
  position: absolute
  left: 0
  top: 0
  background-color: rgb(0 0 0 / 60%)
  filter: blur(10px)
  z-index: 100

.sceneEditor-window
  width: 95%
  height: 95%
  max-width: 1600px
  min-width: 300px
  position: absolute
  left: 50%
  border-radius: 10px
  top: 50%
  transform: translate(-50%, -50%)
  background: white
  padding: 10px
  z-index: 101
</style>
