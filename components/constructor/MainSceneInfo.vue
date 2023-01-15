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
        <v-switch
          :input-value="isOnTestDrive"
          class="mt-0"
          @click="toggleMode(false)"
        />
      </v-col>
      <v-col
        cols="11"
        class="curs-pointer d-flex align-items-center mt-1"
        @click="toggleMode"
      >
        <span v-if="isOnTestDrive">Черновик / <b>Тест-Драйв</b></span>
        <span v-else><b>Черновик</b> / Тест-Драйв</span>
      </v-col>
      <v-col cols="12" class="d-flex align-items-center mt-0 pt-0">
        <v-label v-if="!isOnTestDrive" x-small>
          В этом режиме: включено автосохранение.
        </v-label>
        <v-label v-else x-small>
          В этом режиме: ручное сохранение, автопроверка работоспособности новеллы, возможность протестировать и опубликовать игру.
        </v-label>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      localMainInfo: null,
      isOnTestDrive: false
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
  mounted () {
    this.setDataFromProps()
  },
  methods: {
    setDataFromProps () {
      this.localMainInfo = JSON.parse(JSON.stringify(this.mainInfo))
      this.isOnTestDrive = this.localMainInfo.status !== 'draft'
    },
    toggleMode (updateFlag = true) {
      if (updateFlag) {
        this.isOnTestDrive = !this.isOnTestDrive
      }
      this.localMainInfo = { ...this.localMainInfo, status: this.isOnTestDrive ? 'test_drive' : 'draft' }
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
