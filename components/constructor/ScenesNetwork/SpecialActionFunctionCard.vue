<template>
  <g>
    <rect
      :x="item.x"
      :y="item.y - height/2"
      :width="width"
      :height="height"
      :rx="radius"
      :ry="radius"
      fill="#673ab7"
      class="curs-default"
    />
    <text
      :x="item.x + 24"
      :y="item.y + 4"
      class="text curs-default"
    >
      {{ text }}
    </text>
    <!-- Card point -->
    <circle
      :cx="item.x"
      :cy="item.y"
      r="4"
      fill="white"
      class="curs-default"
    />
  </g>
</template>

<script>
export default {
  props: {
    item: { type: Object, required: true }
  },
  data () {
    return {
      radius: 12,
      height: 26
    }
  },
  computed: {
    text () {
      const list = {
        quit: 'Выход'
      }
      return list[this.item.type] || '...'
    },
    width () {
      const list = {
        quit: 90
      }
      return list[this.item.type] || 100
    }
  }
}
</script>

<style lang="sass" scoped>
.text
  fill: white
  font-size: 14px
</style>
