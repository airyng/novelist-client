<template>
  <div>
    <v-fade-transition>
      <div v-if="value">
        <div class="editor-overlay" @click="close" />
        <div class="editor-window constructor">
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
  z-index: 1
.editor-overlay
  width: 100%
  height: 100%
  position: fixed
  left: 0
  top: 0
  background-color: rgb(0 0 0 / 60%)
  filter: blur(10px)
  z-index: 100

.editor-window
  width: 95%
  height: 88vh
  max-width: 1600px
  min-width: 300px
  position: fixed
  left: 50%
  border-radius: 10px
  top: 50%
  transform: translate(-50%, -50%)
  z-index: 101
  transition: all .2s ease
  @media (max-width: 959px)
    width: 100vw
    height: 100vh
    border-radius: 0
</style>
