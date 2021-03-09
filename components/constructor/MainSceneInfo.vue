<template>
  <div v-if="localMainInfo">
    <v-row justify="center">
      <v-col class="col-12">
        <v-textarea
          v-model="localMainInfo.title"
          name="mainInfoTitle"
          label="Название новеллы"
          rows="1"
          :counter="settings.title.maxLength"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col class="col-12">
        <v-textarea
          v-model="localMainInfo.description"
          name="mainInfoDescription"
          label="Описание/Аннотация"
          rows="6"
          :counter="settings.description.maxLength"
        />
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="1">
        <v-switch v-model="localMainInfo.onTestDrive" />
      </v-col>
      <v-col cols="11" class="curs-pointer d-flex align-items-center" @click="toggleMode">
        <span v-if="localMainInfo.onTestDrive">Черновик / <b>Тест-Драйв</b></span>
        <span v-else><b>Черновик</b> / Тест-Драйв</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    // mainInfo: { type: Object, required: true },
    settings: { type: Object, required: true }
  },
  data () {
    return {
      gameStatusToggler: false,
      localMainInfo: null
    }
  },
  watch: {
    localMainInfo (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.setDataFromProps()
    this.gameStatusToggler = this.localMainInfo ? (this.localMainInfo.status !== 'draft') : false
  },
  methods: {
    setDataFromProps () {
      if (this.localMainInfo !== this.mainInfo) {
        this.localMainInfo = { ...this.mainInfo }
      }
    },
    toggleMode () {
      this.localMainInfo.onTestDrive = !this.localMainInfo.onTestDrive
    },
    callToCloseModals () {
      this.$emit('callToCloseModals')
    }
  }
}
</script>
