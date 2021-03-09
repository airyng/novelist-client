<template>
    <div>
        <div :id="containerID"></div>
    </div>
</template>
<script>

import { DataSet } from "vis-data/peer";
import { Network } from "vis-network/peer";
import "vis-network/styles/vis-network.css";

export default {
    props: {
        scenes: { require: true }
    },
    data(){
        return {
            network: false,
            containerID: "scene-network",
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
                    color: {
                        color: '#6200ea',
                        highlight:'#6200ea'
                    },
                    arrows: {
                        from: {
                            type: 'inv_triangle',
                            enabled: true
                        }
                    }
                }
            }
        }
    },
    mounted(){
        this.init()
    },
    watch: {
     //
    },
    methods: {
        getEdges(){
            var edges = []

            for (var index = 0; index < this.scenes.length; index++) {
                const scene = this.scenes[index]

                for (let actionIndex = 0; actionIndex < scene.actions.length; actionIndex++) {
                    const action = scene.actions[actionIndex]

                    if(action.to)
                        edges.push({ from: scene.id, to: action.to} )
                }
            }
            
            return new DataSet(edges)
        },
        getNodes(){
            var nodes = this.scenes.map( scene => {

                var title = '...'
                if(scene.mainText) title = scene.mainText.substring(0, 30) + title

                var item = {
                    id: scene.id,
                    label: scene.title,
                    title: title
                }

                if(scene.background){
                    if(scene.background.url_small) {
                        item.image = scene.background.url_small
                        item.shape = "circularImage"
                    }
                    else if(scene.background.hexa){
                        item.color = scene.background.hexa
                        item.shape = "circle"
                    }
                }
                else{
                    item.color = '#ffffff'
                    item.shape = "circle"
                }
                

                return item
            })

            return new DataSet(nodes)
        },
        init(){

            // create a network
            var container = document.getElementById(this.containerID)

            var data = {
                nodes: this.getNodes(),
                edges: this.getEdges(),
            }

            this.network = new Network(container, data, this.options)

            this.initEvents()
        },

        initEvents(){
            if(!this.network) return

            this.sceneTransitionsEvent()
        },

        sceneTransitionsEvent(){
            this.network.on("doubleClick",  params => {
                this.$emit('selectedSceneID', params.nodes[0])
            })
        }
    }
}
</script>