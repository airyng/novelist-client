<template>
  <v-row>
    <v-col class="pb-0 d-flex align-center" cols="1">
      <v-switch v-model="isBackImageType" class="pb-0" />
    </v-col>
    <v-col cols="11" class="pb-0 curs-pointer d-flex align-center" @click="isBackImageType = !isBackImageType">
      <span v-if="isBackImageType">Цвет / <b>Изображение</b></span>
      <span v-else><b>Цвет</b> / Изображение</span>
    </v-col>
    <v-col class="pt-0" cols="12">
      <ConstructorWideColorPicker
        v-show="!isBackImageType"
        class="pt-0"
        @onValueChanged="colorPicked"
      />

      <ConstructorBackgroundImagePicker
        v-show="isBackImageType"
        class="pt-0"
        @OnBackChanged="imagePicked"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      isBackImageType: false,
      rgbaStyle: null,
      imageStyle: null
    }
  },
  watch: {
    isBackImageType (val) {
      this.OnBackChanged()
    }
  },
  methods: {
    colorPicked (value) {
      this.rgbaStyle = value
      this.OnBackChanged()
    },
    imagePicked (data) {
      this.imageStyle = data
      this.OnBackChanged()
    },
    OnBackChanged () {
      if (this.isBackImageType) {
        this.$emit('OnBackChanged', this.imageStyle)
      } else {
        this.$emit('OnBackChanged', this.rgbaStyle)
      }
    }
  }
}
</script>
