<template>
  <v-row>
    <v-col class="pb-0 d-flex align-center" cols="1">
      <v-switch v-model="isBackImageType" class="pb-0" />
    </v-col>
    <v-col cols="11" class="pb-0 d-flex align-center">
      <span v-if="isBackImageType" class="curs-pointer" @click="isBackImageType = !isBackImageType">Цвет / <b>Изображение</b></span>
      <span v-else class="curs-pointer" @click="isBackImageType = !isBackImageType"><b>Цвет</b> / Изображение</span>
    </v-col>
    <v-col class="pt-0" cols="12">
      <ConstructorWideColorPicker
        v-if="!isBackImageType"
        class="pt-0"
        @onValueChanged="colorPicked"
      />
      <ConstructorBackgroundImagePicker
        v-else
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
      isBackImageType: false
    }
  },
  watch: {
    isBackImageType (val) {
      this.OnBackChanged()
    }
  },
  methods: {
    colorPicked (value) {
      this.OnBackChanged({ type: 'color', value: value.hexa })
    },
    imagePicked (value) {
      this.OnBackChanged({ type: 'image', value })
    },
    OnBackChanged (styleObj) {
      this.$emit('OnBackChanged', styleObj)
    }
  }
}
</script>
