<template>
    <div class="floating-sidebar right">

        <v-tooltip top v-if="activeScene.id > 1">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    rounded fab dark 
                    class="text-center justify-center mb-4"
                    v-bind="attrs"
                    v-on="on"
                    @click="deleteScene"
                >
                    <v-icon rounded>mdi-image-remove</v-icon>
                </v-btn>
            </template>
            <span>Удалить сцену</span>
        </v-tooltip>
                
    </div>
</template>

<script>
export default {
    props: {
        // scenes: {
        //     default: false
        // },
        // previousScene: {
        //     default: false
        // },
        // mainInfo: {
        //     required: true
        // },
        activeScene: {
            required: true
        },
        // settings: {
        //     required: true
        // }
    },
    methods: {
        deleteScene () {

            Swal.fire({
                text: 'Вы уверены, что хотите удалить текущую сцену?',
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'Отмена'
            }).then( event => {
                if(event.isConfirmed)
                    this.$emit('OnCallToRemoveScene', this.activeScene)
            })
        }
        // OnSelectedSceneID ( data ){
        //     this.$emit('OnSelectedSceneID', data)
        //     this.$refs.sceneNetworkDialog.close()
        // },
        // goToScene( scene ){
        //     this.$emit('OnBackToPrevScene', scene)
        // },
        // OnBackChanged( data ){
        //     this.$emit('OnBackChanged', data)
        // },
        // onNetworkDialogStateChanged ( data ){
        //     this.sceneNetworkDialogActive = data
        // },
    }
}
</script>