export const screen = {
  data () {
    return {
      windowWidth: 1000
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.windowWidth = document.body.clientWidth
    })
    this.windowWidth = document.body.clientWidth
  },
  methods: {
    getScreenBreakpoint () {
      return this.$vuetify.breakpoint.name // xl, lg, md, sm, xs
    }
  },
  computed: {
    screenName () {
      let name = ''

      switch (this.getScreenBreakpoint()) {
        case 'xl':
          name = '4k-and-ultra-wides'
          break
        case 'lg':
          name = 'desktop'
          break
        case 'md':
          name = 'large-tablet-to-laptop'
          break
        case 'sm':
          name = 'small-to-medium-tablet'
          break
        case 'xs':
          name = 'mobile'
          break
      }

      return 'screen-' + name
    },
    isMobileScreen () {
      if (process.server) { return true }
      return this.screenName === 'screen-small-to-medium-tablet' || this.screenName === 'screen-mobile'
    },
    isSmallMobileScreen () {
      if (process.server) { return true }
      return this.screenName === 'screen-mobile'
    }
  }
}
