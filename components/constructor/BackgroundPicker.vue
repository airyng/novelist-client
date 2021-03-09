<template>
    <v-row>
        <v-col class="pb-0" cols="1">
            <v-switch class="pb-0" v-model="isBackImageType"></v-switch>
        </v-col>
        <v-col @click="isBackImageType = !isBackImageType" cols="11" class="pb-0 curs-pointer d-flex align-items-center">
            <span v-html="toggleLabel"></span>
        </v-col>
        <v-col class="pt-0" cols="12">
            <wide-color-picker
                class="pt-0"
                v-show="!isBackImageType"
                @onValueChanged="colorPicked"
            ></wide-color-picker>

            <background-image-picker
                class="pt-0"
                v-show="isBackImageType"
                @OnBackChanged="imagePicked"
            ></background-image-picker>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data() {
        return {
            isBackImageType: false,
            rgbaStyle: null,
            imageStyle: null
        }
    },
    watch: {
        isBackImageType ( val ){
            this.OnBackChanged()
        }
    },
    computed: {
        toggleLabel(){
            if(this.isBackImageType)
                return 'Цвет / <b>Изображение</b>'
            else
                return '<b>Цвет</b> / Изображение'
        }
    },
    methods: {
        colorPicked( value ){
            this.rgbaStyle = value
            this.OnBackChanged()
        },
        imagePicked ( data ){
            this.imageStyle = data
            this.OnBackChanged()
        },
        OnBackChanged (){
            
            var result = ''

            if(this.isBackImageType)
                this.$emit('OnBackChanged', this.imageStyle)
            else
                this.$emit('OnBackChanged', this.rgbaStyle)
        }
    }
}
</script>