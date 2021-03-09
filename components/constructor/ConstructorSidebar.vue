<template>
    <div class="floating-sidebar left">

        <custom-dialog
            title="Выберите фон"
        >
            <template v-slot:toggler>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            rounded fab dark 
                            class="text-center justify-center mb-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon rounded>mdi-tab-unselected</v-icon>
                        </v-btn>
                    </template>
                    <span>Выбрать фон</span>
                </v-tooltip>
            </template>

            <background-picker
                @OnBackChanged="OnBackChanged"
            ></background-picker>
        </custom-dialog>


        <custom-dialog
            v-if="scenes"
            title="Схема сцен"
            :withContainer="false"
            @onDialogStateChanged="onNetworkDialogStateChanged"
            dark="true"
            ref="sceneNetworkDialog"
        >
            <template v-slot:toggler>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            rounded fab dark 
                            class="text-center justify-center mb-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon rounded>mdi-graph-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Схема сцен</span>
                </v-tooltip>
            </template>

            <scene-network
                v-if="sceneNetworkDialogActive"
                :scenes="scenes"
                @selectedSceneID="OnSelectedSceneID"
            ></scene-network>
        </custom-dialog>
        
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    rounded fab dark 
                    class="text-center justify-center mb-4"
                    :class="{disabled: !previousScene}"
                    @click.stop="goToScene( previousScene )"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon rounded>mdi-history</v-icon>
                </v-btn>
            </template>
            <span>Вернуться на предыдущую сцену</span>
        </v-tooltip>
        

        <custom-dialog
            title="Основная информация"
        >
            <template v-slot:toggler>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            rounded fab dark 
                            class="text-center justify-center mb-4"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon rounded>mdi-cog-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Основная информация</span>
                </v-tooltip>
            </template>

            <main-scene-info 
                :settings="settings.mainInfo"
                :mainInfo="mainInfo"
            ></main-scene-info>
        </custom-dialog>

        
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    rounded fab dark 
                    class="text-center justify-center mb-4"
                    v-bind="attrs"
                    v-on="on"
                    @click="$emit('OnSaveStarted')"
                >
                    <v-icon rounded>mdi-content-save-outline</v-icon>
                </v-btn>
            </template>
            <span>Сохранить</span>
        </v-tooltip>
                
    </div>
</template>

<script>
export default {
    props: {
        scenes: {
            default: false
        },
        previousScene: {
            default: false
        },
        mainInfo: {
            required: true
        },
        activeScene: {
            required: true
        },
        settings: {
            required: true
        }
    },
    data (){
        return {
            sceneNetworkDialogActive: false,
        }
    },
    methods: {
        OnSelectedSceneID ( data ){
            this.$emit('OnSelectedSceneID', data)
            this.$refs.sceneNetworkDialog.close()
        },
        goToScene( scene ){
            this.$emit('OnBackToPrevScene', scene)
        },
        OnBackChanged( data ){
            this.$emit('OnBackChanged', data)
        },
        onNetworkDialogStateChanged ( data ){
            this.sceneNetworkDialogActive = data
        },
    }
}
</script>