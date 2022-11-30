<template>
  <div id="nightsky-canvas">
    <canvas id="stars" />
  </div>
</template>

<script>
export default {
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const PI2 = 2 * Math.PI
      // amount is relative to screen size, this is the divider
      // for the result (hight * width)
      const AMOUNT_DIVIDER = 5000
      // the connect star field
      const DIST_MAX = 80
      const CONNECT_RADIUS = 80
      // speed of rotating
      const ROTATION = 0.0001

      const canvas = document.getElementById('stars')
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const ctx = canvas.getContext('2d')
      ctx.lineWidth = 0.4

      const bounds = {
        top: -10,
        left: -10,
        right: canvas.width + 10,
        bottom: canvas.height + 10
      }

      let center = {
        x: Math.floor(canvas.width / 2),
        y: Math.floor(canvas.height / 2)
      }

      const connectArea = {
        destX: 0,
        destY: 0,
        x: center.x,
        y: center.y
      }

      /*
        the dots
      */
      const dots = []

      class Dot {
        constructor () {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.radius = Math.random() * 1.2
        }

        update () {
          if (this.y > bounds.bottom) { this.y = bounds.top } else if (this.y < bounds.top) { this.y = bounds.bottom }

          // http://stackoverflow.com/a/15109215/3137109
          this.x = Math.cos(ROTATION) * (this.x - center.x) - Math.sin(ROTATION) * (this.y - center.y) + center.x
          this.y = Math.sin(ROTATION) * (this.x - center.x) + Math.cos(ROTATION) * (this.y - center.y) + center.y
        }

        draw () {
          ctx.beginPath()
          ctx.fillStyle = '#fff'
          if (Math.random() < 0.99) { ctx.arc(this.x, this.y, this.radius, 0, PI2, false) }
          ctx.fill()
        }
      }
      /*
        and lets start
      */
      function resize () {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        bounds.right = canvas.width - 1
        bounds.bottom = canvas.height - 1

        ctx.lineWidth = 0.4

        center = {
          x: Math.floor(canvas.width / 2),
          y: Math.floor(canvas.height / 2)
        }

        connectArea.destX = center.x
        connectArea.destY = center.y * 0.1

        dots.length = 0

        const amount = Math.floor(canvas.width * canvas.height / AMOUNT_DIVIDER)
        for (let i = 0; i < amount; i++) { dots.push(new Dot()) }
      }

      resize()
      animateDots()

      /*
        funtctions
      */

      function updateConnectArea () {
        const distX = connectArea.destX - connectArea.x
        if (distX > 5 || distX < 5) { connectArea.x += Math.floor(distX / 20) }
        const distY = connectArea.destY - connectArea.y
        if (distX > 5 || distX < 5) { connectArea.y += Math.floor(distY / 20) }
      }

      function connectDots () {
        for (let i = 0; i < dots.length; i++) {
          const dot1 = dots[i]
          for (let j = 0; j < dots.length; j++) {
            const dot2 = dots[j]
            const xDiff = dot1.x - dot2.x
            const yDiff = dot1.y - dot2.y
            const xCoreDiff = dot1.x - connectArea.x
            const yCoreDiff = dot1.y - connectArea.y

            if (xDiff < DIST_MAX && xDiff > -DIST_MAX &&
                yDiff < DIST_MAX && yDiff > -DIST_MAX &&
                xCoreDiff < CONNECT_RADIUS && xCoreDiff > -CONNECT_RADIUS &&
                yCoreDiff < CONNECT_RADIUS && yCoreDiff > -CONNECT_RADIUS
            ) {
              ctx.beginPath()
              ctx.strokeStyle = 'hsla(0,100%,100%,0.2)'
              ctx.moveTo(dot1.x + 0.0, dot1.y + 0.0)
              ctx.lineTo(dot2.x + 0.0, dot2.y + 0.0)
              ctx.stroke()
              ctx.closePath()
            }
          }
        }
      }

      function animateDots () {
        requestAnimationFrame(animateDots)

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        updateConnectArea()

        for (let i = 0; i < dots.length; i++) { dots[i].update() }
        connectDots()
        for (let i = 0; i < dots.length; i++) { dots[i].draw() }
      }

      document.body.addEventListener('mousemove', function (e) {
        connectArea.destX = e.clientX || (e.touches && e.touches[0].pageX)
        connectArea.destY = e.clientY || (e.touches && e.touches[0].pageY)
      })

      document.body.addEventListener('mouseleave', function (e) {
        connectArea.destX = center.x
        connectArea.destY = center.y
      })

      window.addEventListener('resize', resize)
    }
  }
}
</script>

<style lang="sass" scoped>
#nightsky-canvas
  background: linear-gradient(to bottom, #002131 0%, #19629e 60%)
  position: absolute
  left: 0
  top: 0
  margin: 0
  height: 100%
  width: 100%

#stars
  position: absolute
  left: 0
  top: 0
  margin: 0
  height: 100%
  width: 100%

</style>
