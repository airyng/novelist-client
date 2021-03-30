<template>
  <div>
    <canvas :id="canvasID" :width="948" :height="portrait ? 800 : 1920" :class="{ lowOpacity: loading }" :style="'height:'+height+'px'" />
  </div>
</template>
<script>
export default {
  props: {
    charId: { type: String, required: true },
    updatedAt: { type: Number, default: 0 },
    height: { type: [String, Number], default: 500 },
    portrait: { type: Boolean, default: false }
  },
  data () {
    return {
      canvasID: 0,
      loading: false,
      activeItems: false
    }
  },
  computed: {
    charPartsSettings () {
      return this.$store.getters['constructorStorage/getCharPartsSettings']()
    }
  },
  watch: {
    updatedAt () {
      this.drawCharacter()
    },
    charId () {
      this.convertIdToItems()
      this.drawCharacter()
    }
  },
  mounted () {
    this.canvasID = new Date().getTime() + this.charId
    setTimeout(() => {
      this.convertIdToItems()
      this.drawCharacter()
    }, 0)
  },
  methods: {
    convertIdToItems () {
      const ids = this.charId.split('.')
      this.activeItems = []

      ids.forEach((item, index) => {
        const part = { ...this.charPartsSettings[index] }
        part.imageID = item
        this.activeItems.push(part)
      })
    },
    drawCharacter () {
      if (process.server || !this.activeItems) { return }
      const canvas = document.getElementById(this.canvasID)
      if (!canvas) { return }

      const context = canvas.getContext('2d')
      const that = this
      // Clear canvas from previous result
      context.clearRect(0, 0, canvas.width, canvas.height)

      try {
        this.loading = true
        const images = []
        for (let index = 0; index < that.activeItems.length; index++) {
          images[index] = new Image()
        }
        for (let index = 0; index < that.activeItems.length; index++) {
          images[index].onload = function () {
            context.drawImage(images[index], 0, 0)
            if (index + 1 === that.activeItems.length) {
              that.loading = false
            } else if (that.activeItems[index + 1].imageID) {
              images[index + 1].src = require('@/assets/images/character_parts/' + that.activeItems[index + 1].folder + '/' + that.activeItems[index + 1].nameBase + that.activeItems[index + 1].imageID + '.png')
            }
          }
        }
        // Start loading
        if (that.activeItems[0].imageID) {
          images[0].src = require('@/assets/images/character_parts/' + that.activeItems[0].folder + '/' + that.activeItems[0].nameBase + that.activeItems[0].imageID + '.png')
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.lowOpacity
  opacity: 0.2
</style>
