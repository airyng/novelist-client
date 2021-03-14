<template>
  <div :id="containerID" style="height:88vh" />
</template>
<script>
export default {
  data () {
    return {
      visScriptLoaded: false,
      network: null,
      containerID: 'scene-network',
      options: {
        autoResize: true,
        locale: 'ru',
        nodes: {
          // color: {
          //     border: '#6200ea',
          //     background: '#ffffff',
          //     highlight: {
          //         border: '#6200ea',
          //         background: '#ffffff',
          //     }
          // },
          // font: { color: "#eeeeee" },
        },
        edges: {
          // forceDirection: 'horizontal',
          // roundness: 0.4,
          color: {
            color: '#6200ea',
            highlight: '#6200ea'
          },
          arrows: {
            from: {
              type: 'inv_triangle',
              enabled: true
            }
          }
        },
        interaction: {
          dragNodes: false,
          navigationButtons: true
        },
        layout: {
          hierarchical: {
            direction: 'LR'
          }
        },
        physics: false
      }
    }
  },
  computed: {
    canvasHeight () {
      if (process.server) { return 0 }
      return window.document.querySelector('#' + this.containerID).height
    },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    },
    vis () {
      return process.server ? false : window.vis
    }
  },
  watch: {
    visScriptLoaded (val) {
      if (val) {
        this.init()
      }
    }
  },
  mounted () {
    this.addScript()
  },
  methods: {
    addScript () {
      if (document.getElementById('vis_network')) {
        this.visScriptLoaded = true
        return
      }

      const script = document.createElement('script')
      script.setAttribute('src', 'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js')
      document.head.appendChild(script)
      script.setAttribute('id', 'vis_network')
      script.onload = () => {
        this.visScriptLoaded = true
      }
    },
    getEdges () {
      const edges = []

      for (let index = 0; index < this.scenes.length; index++) {
        const scene = this.scenes[index]

        for (let actionIndex = 0; actionIndex < scene.actions.length; actionIndex++) {
          const action = scene.actions[actionIndex]

          if (action.to) { edges.push({ from: scene.id, to: action.to }) }
        }
      }

      return new this.vis.DataSet(edges)
    },
    getNodes () {
      const nodes = this.scenes.map((scene) => {
        let title = '...'
        if (scene.mainText) { title = scene.mainText.substring(0, 30) + title }

        const item = {
          id: scene.id,
          label: scene.title,
          title
        }

        if (scene.background) {
          if (scene.background.url_small) {
            item.image = scene.background.url_small
            item.shape = 'circularImage'
          } else if (scene.background.hexa) {
            item.color = scene.background.hexa
            item.shape = 'circle'
          }
        } else {
          item.color = '#ffffff'
          item.shape = 'circle'
        }
        return item
      })

      return new this.vis.DataSet(nodes)
    },
    init () {
      // create a network
      const container = document.getElementById(this.containerID)

      const data = {
        nodes: this.getNodes(),
        edges: this.getEdges()
      }

      this.network = new this.vis.Network(container, data, this.options)

      this.initEvents()
    },

    initEvents () {
      if (!this.network) { return }

      this.sceneTransitionsEvent()
    },
    sceneTransitionsEvent () {
      this.network.on('doubleClick', (params) => {
        this.$emit('selectedSceneID', params.nodes[0])
      })
    }
  }
}
</script>

<style lang="sass">
.vis-network
  outline: none!important
.vis-up, .vis-down, .vis-right, .vis-left
  display: none!important
</style>
