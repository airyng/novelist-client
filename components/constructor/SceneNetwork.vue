<template>
  <div :id="containerID" style="height:94vh" />
</template>
<script>
import { EventBus } from '@/plugins/event'
import { excerpt } from '@/plugins/utils'

export default {
  data () {
    return {
      visScriptLoaded: false,
      network: null,
      containerID: 'scene-network',
      lastViewPos: null,
      lastViewScale: null,
      options: {
        autoResize: true,
        locale: 'ru',
        nodes: {
          // size: 25,
          widthConstraint: {
            minimum: 100,
            maximum: 100
          },
          margin: 2
          // opacity: '0.7'
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
            color: '#fff',
            highlight: '#6200ea'
            // color: '#6200ea',
            // highlight: '#6200ea'
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
            enabled: true,
            nodeSpacing: 200,
            sortMethod: 'directed' // hubsize, directed
          }
        },
        physics: false
      }
    }
  },
  computed: {
    // canvasHeight () {
    //   if (process.server) { return 0 }
    //   return window.document.querySelector('#' + this.containerID).height
    // },
    scenes () {
      return this.$store.state.constructorStorage.scenes
    }
    // vis () {
    //   return process.server ? false : window.vis
    // }
  },
  watch: {
    visScriptLoaded (val) {
      if (val) {
        setTimeout(() => this.init(), 0)
      }
    }
  },
  mounted () {
    this.addScript()
    EventBus.$on('callToReinitSceneNetwork', this.reinit)
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

      return new window.vis.DataSet(edges || [])
    },
    getNodes () {
      const nodes = this.scenes.map((scene, index) => {
        const item = {
          id: scene.id,
          // title: scene.title + ' - ' + excerpt(scene.mainText, 30),
          label: excerpt(scene.title, 10),
          shape: 'circle',
          color: index ? '#272727' : '#3c3b3b',
          font: {
            color: '#ffffff'
          }
        }

        // if (scene.background) {
        //   if (scene.background.type === 'image') {
        //     item.image = scene.background.url_small
        //     item.shape = 'circularImage'
        //   } else if (scene.background.type === 'color') {
        //     item.color = scene.background.value
        //     item.shape = 'circle'
        //   }
        // } else {
        // }
        return item
      })
      return new window.vis.DataSet(nodes || [])
    },
    init () {
      // wait and reinit if vis not loaded
      if (!window.vis) {
        setTimeout(() => this.reinit(), 100)
        // eslint-disable-next-line no-console
        console.error('vis object not found. Waiting for it.')
        return false
      }
      // create a network
      const container = document.getElementById(this.containerID)

      const data = {
        nodes: this.getNodes(),
        edges: this.getEdges()
      }

      this.network = new window.vis.Network(container, data, this.options)
      // setTimeout(() => {
      // }, 10)

      this.initEvents()
    },

    initEvents () {
      if (!this.network) { return }

      this.network.on('afterDrawing', () => {
        if (this.lastViewScale !== null && this.lastViewPos?.x && this.lastViewPos?.y) {
          // this.network.canvas.body.view.scale = this.lastViewScale
          // this.network.canvas.body.view.translation = this.lastViewPos
          this.network.moveTo({ scale: this.lastViewScale, position: { ...this.lastViewPos } })
        }
        this.lastViewScale = null
        this.lastViewPos = null
      })

      this.sceneTransitionsEvent()
    },
    sceneTransitionsEvent () {
      this.network.on('click', (params) => {
        if (params.nodes.length) {
          // const pos = this.network.getPosition(params.nodes[0])
          // const scale = this.network.getScale() // get Scale
          // const canvas = document.querySelector('#' + this.containerID)
          // const viewPos = this.network.getViewPosition()
          // const position = {
          //   x: (canvas.clientWidth / 2) + (pos.x * scale) - (viewPos.x),
          //   y: (canvas.clientHeight / 2) + (pos.y * scale) - (viewPos.y)
          // }
          const position = {
            x: params.event.center.x,
            y: params.event.center.y
          }
          this.$emit('clicked', { position, sceneID: params.nodes[0] })
        } else {
          this.$emit('clicked', false)
        }
      })
      this.network.on('zoom', (params) => {
        this.$emit('zoom', params)
      })
      this.network.on('dragStart', (params) => {
        this.$emit('dragStart', params)
      })
      // this.network.on('doubleClick', (params) => {
      //   this.$emit('selectedSceneID', params.nodes[0])
      // })
    },
    reinit () {
      if (!this.network) { return false }
      this.lastViewPos = { ...this.network.getViewPosition() }
      this.lastViewScale = this.network.getScale()
      this.network = null
      this.init()
    }
  }
}
</script>

<style lang="sass">
.vis-network
  outline: none!important
  z-index: 9

.vis-up, .vis-down, .vis-right, .vis-left
  display: none!important

div.vis-network div.vis-navigation div.vis-button
  background-color: white
  filter: hue-rotate(120deg)
</style>
