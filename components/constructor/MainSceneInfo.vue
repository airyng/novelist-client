<template>
    <div>
        <v-row justify="center">
            <v-col class="col-12">
                <v-textarea
                    name="mainInfoTitle"
                    label="Название новеллы"
                    rows="1"
                    :counter="settings.title.maxLength"
                    v-model="mainInfo.title"
                ></v-textarea>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col class="col-12">
                <v-textarea
                    name="mainInfoDescription"
                    label="Описание/Аннотация"
                    rows="6"
                    :counter="settings.description.maxLength"
                    v-model="mainInfo.description"
                ></v-textarea>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="1">
                <v-switch v-model="mainInfo.onTestDrive"></v-switch>
            </v-col>
            <v-col @click="e => mainInfo.onTestDrive = !mainInfo.onTestDrive" cols="11" class="curs-pointer d-flex align-items-center">
                <span v-html="toggleLabel"></span>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        mainInfo: {
            required: true
        },
        settings: {
            required: true
        }
    },
    data() {
        return {
            gameStatusToggler: false,
        }
    },
    mounted() {
        this.gameStatusToggler = (this.mainInfo.status != 'draft')
    },
    computed: {
        toggleLabel(){
            if(this.mainInfo.onTestDrive)
                return 'Черновик / <b>Тест-Драйв</b>'
            else
                return '<b>Черновик</b> / Тест-Драйв'
        }
    },
    methods:{ 
        callToCloseModals () {
            this.$emit('callToCloseModals')
        }
    }
}
</script>