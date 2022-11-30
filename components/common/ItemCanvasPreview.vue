<template>
  <div>
    <canvas
      :id="canvasID"
      :width="300"
      :height="300"
      :style="'height:'+height+'px; width: 100%'"
    />
  </div>
</template>
<script>
export default {
  props: {
    folder: { type: String, required: true },
    name: { type: String, required: true },
    height: { type: [String, Number], default: 200 }
  },
  data () {
    return {
      canvasID: 0
    }
  },
  watch: {
    name () {
      this.drawItem()
    },
    folder () {
      this.drawItem()
    }
  },
  mounted () {
    this.canvasID = btoa(this.folder + this.name)
    setTimeout(() => {
      this.drawItem()
    }, 0)
  },
  methods: {
    drawItem () {
      if (process.server) { return }
      const canvas = document.getElementById(this.canvasID)
      if (!canvas) { return }

      const context = canvas.getContext('2d')
      // Clear canvas from previous result
      context.clearRect(0, 0, canvas.width, canvas.height)

      const image = new Image()
      image.onload = function () {
        context.drawImage(image, 0, 0)
      }
      image.src = require('@/assets/images/character_parts_previews/' + this.folder + '/' + this.name + '.png')
    }
  }
}
</script>
