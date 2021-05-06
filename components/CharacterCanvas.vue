<template>
  <div>
    <div class="d-flex justify-center" style="position: relative">
      <canvas
        :id="canvasID"
        :width="948"
        :height="portrait ? 800 : 1920"
        class="characterCanvas"
        :class="{ loaded: !loading, transition }"
        :style="'height:'+height+'px'"
      />
      <div v-if="!transition && loading" class="fullsize d-flex align-center justify-center" style="position: absolute; left: 0; top: 0;">
        <img
          src="@/assets/images/loading.gif"
          :width="(portrait ? 50 : 100)+'px'"
          :height="(portrait ? 50 : 100)+'px'"
        >
      </div>
    </div>
  </div>
</template>
<script>
import { sleep } from '@/plugins/utils'
export default {
  props: {
    charId: { type: String, required: true },
    updatedAt: { type: Number, default: 0 },
    height: { type: [String, Number], default: 500 },
    portrait: { type: Boolean, default: false },
    transition: { type: Boolean, default: false }
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
      this.convertIdToItems()
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
    async drawCharacter () {
      if (process.server || !this.activeItems || this.loading) { return }
      const canvas = document.getElementById(this.canvasID)
      if (!canvas) { return }

      const context = canvas.getContext('2d')
      const that = this
      try {
        this.loading = true
        // Данная задержка необходима для более гладкой анимации ухода персонажа со сцены
        // и своевременной загрузки нового персонажа
        if (this.transition) { await sleep(300) }

        // Clear canvas from previous result
        context.clearRect(0, 0, canvas.width, canvas.height)
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
.characterCanvas
  opacity: 0
  &.transition
    transform: translateX(-150vw)
    transition: 0.5s all ease
  &.loaded
    transform: translateX(0)
    opacity: 1
</style>
