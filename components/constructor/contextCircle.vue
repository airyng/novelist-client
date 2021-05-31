<template>
  <div v-if="position" class="sceneActions" :style="'left: ' + position.x + 'px; top: ' + position.y + 'px'">
    <div class="sceneActions__group">
      <div class="sceneActions__circle" />
      <div class="button zero">
        <slot name="zero" />
      </div>
      <div class="button first">
        <slot name="first" />
      </div>
      <div class="button second">
        <slot name="second" />
      </div>
      <div class="button third">
        <slot name="third" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: [Object, Boolean],
      default: false
    }
  }
}
</script>

<style lang="sass" scoped>
@keyframes opening
  from
    transform: scale(0) rotate(-240deg)
  to
    transform: scale(100%) rotate(0deg)

.sceneActions
  position: absolute
  width: 180px
  height: 180px
  z-index: 10
  transform: translate(-50%, -80%)
  & .sceneActions__group
    position: relative
    width: 100%
    height: 100%
    animation: 0.5s opening
    animation-iteration-count: 1
    & .sceneActions__circle
      position: relative
      width: 100%
      height: 100%
      border: 1px solid white
      border-radius: 50%
    & > .button
      position: absolute
    & .zero
      top: 50%
      left: 50%
      transform: translate(-50%, -50%) scale(1.6)
    & .first
      top: -50%
      left: 50%
      transform: translateX(-50%) translateY(100%)
    & .second
      top: 50%
      left: 0%
      transform: translateX(-50%)
    & .third
      top: 50%
      right: 0%
      transform: translateX(50%)
</style>
