export default {
  methods: {
    transformCoordinatesGlobToSVG (gx, gy, svgRefKey = 'svg') {
      const svg = this.$refs[svgRefKey].$el || this.$refs[svgRefKey]
      const pt = svg.createSVGPoint()
      // pass event coordinates
      pt.x = gx
      pt.y = gy
      // transform to SVG coordinates
      return pt.matrixTransform(svg.getScreenCTM().inverse())
    }
  }
}
