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
        <v-switch v-model="localMainInfo.onTestDrive" class="mt-0" />
      </v-col>
      <v-col cols="11" class="curs-pointer d-flex align-items-center mt-1" @click="toggleMode">
        <span v-if="localMainInfo.onTestDrive">Черновик / <b>Тест-Драйв</b></span>
        <span v-else><b>Черновик</b> / Тест-Драйв</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gameStatusToggler: false,
      localMainInfo: null
    }
  },
  computed: {
    mainInfo () {
      return this.$store.state.constructorStorage.mainInfo
    },
    settings () {
      return this.$store.state.constructorStorage.settings.mainInfo
    }
  },
  watch: {
    // localMainInfo (val) {
    //   this.$emit('input', val)
    // }
  },
  mounted () {
    this.setDataFromProps()
  },
  methods: {
    setDataFromProps () {
      this.localMainInfo = JSON.parse(JSON.stringify(this.mainInfo))
      this.gameStatusToggler = this.localMainInfo ? (this.localMainInfo.status !== 'draft') : false
    },
    toggleMode () {
      this.localMainInfo.onTestDrive = !this.localMainInfo.onTestDrive
    },
    callToCloseModals () {
      this.$emit('callToCloseModals')
    },
    save () { // calling outside
      this.$store.dispatch('constructorStorage/updateMainSettings', this.localMainInfo)
    }
  }
}
</script>
