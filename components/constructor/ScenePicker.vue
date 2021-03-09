<template>
    <div>
        <v-item-group mandatory>
            <v-row>
                <v-col cols="12">
                    <v-text-field 
                        :clearable="true" 
                        v-model="searchKeyword"
                        label="Поиск по названию" 
                    ></v-text-field>
                </v-col>

                <template v-if="scenes.length > 1">
                    <v-col cols="12">
                        <v-btn color="purple" rounded dark @click="callToAddingScene">Добавить сцену</v-btn>
                    </v-col>

                    <v-col cols="12">
                        <v-list flat>
                            <v-list-item-group color="indigo">
                                <v-list-item
                                    v-for="(scene, i) in filteredScenes"
                                    :key="i"
                                >
                                    <v-list-item-icon>
                                        <v-avatar v-if="scene.background && scene.background.url_small">
                                            <img
                                                :src="scene.background.url_small"
                                                :alt="scene.title"
                                            >
                                        </v-avatar>
                                        <v-avatar 
                                            v-else-if="scene.background && scene.background.hexa" 
                                            :color="scene.background.hexa"
                                        ></v-avatar>
                                        <v-avatar v-else color="grey"></v-avatar>
                                    </v-list-item-icon>

                                    <v-list-item-content @click="setScene(scene)">
                                        <v-list-item-title>{{ scene.title }} - {{ scene.mainText.substring(0, excerptLimit) + '...' }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-col>
                </template>
                
                <template v-else>
                    <v-col cols="12">
                        <p>Сцены еще не были добавлены.</p>
                    </v-col>
                    <v-col cols="12">
                        <v-btn color="purple" rounded dark @click="callToAddingScene">Добавить сцену</v-btn>
                    </v-col>
                </template>

            </v-row>
        </v-item-group>
    </div>
</template>

<script>
export default {
    name: 'ScenePicker',
    props: {
        action: {
            required: true
        },
        currentScene: {
            required: true
        },
        scenes: {
            required: true
        },
    },
    data(){
        return {
            searchKeyword: '',
            excerptLimit: 30,
        }
    },
    computed: {
        filteredScenes(){

            var scenesWithoutCurrent = this.scenes.filter( scene => scene != this.currentScene )

            if(!this.searchKeyword) return scenesWithoutCurrent

            return scenesWithoutCurrent.filter( scene => {
                    
                    if(scene.title.indexOf( this.searchKeyword ) !== -1)
                        return true
                    else
                        return scene.mainText.substring(0, this.excerptLimit).indexOf( this.searchKeyword ) !== -1
                } )
        }
    },
    methods: {
        callToAddingScene(){
            this.$emit('callToAddingScene', {action: this.action})
        },
        setScene(scene){
            this.$emit('OnScenePicked', {type: 'scene', scene: scene, action: this.action})
        }
    }
}
</script>