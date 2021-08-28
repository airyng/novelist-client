<template>
  <v-row>
    <v-col v-if="!!lastSelectedBack && lastSelectedBack.value" class="pb-0" cols="12">
      <div class="lastBackground d-flex">
        <img v-if="lastSelectedBack && lastSelectedBack.type === 'image'" class="backPreview" :src="lastSelectedBack.value">
        <div
          v-else
          class="backPreview"
          :style="'background: '+lastSelectedBack.value"
        />
        <div class="px-5">
          <h4 class="my-2">
            Последний примененный фон
          </h4>
          <v-btn dark small @click="pickLastSelectedBack">
            Применить повторно
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col class="pb-0 d-flex align-center" cols="1">
      <v-switch v-model="isBackImageType" class="pb-0" />
    </v-col>

    <v-col cols="11" class="pb-0 d-flex align-center">
      <span v-if="isBackImageType" class="curs-pointer" @click="isBackImageType = !isBackImageType">Цвет / <b>Изображение</b></span>
      <span v-else class="curs-pointer" @click="isBackImageType = !isBackImageType"><b>Цвет</b> / Изображение</span>
    </v-col>
    <v-col class="pt-0 d-flex justify-center" cols="12">
      <ConstructorColorPalette
        v-if="!isBackImageType"
        :value="value"
        class="pt-0"
        @onValueChanged="colorPicked"
      />
      <ConstructorBackgroundImagePicker
        v-else
        :value="value"
        class="pt-0"
        @OnBackChanged="imagePicked"
      />
    </v-col>
  </v-row>
</template>

<script>
import lsm from '@/plugins/localStorageManager'

export default {
  props: {
    activeType: { type: String, default: 'image' },
    value: { type: String, default: null }
  },
  data () {
    return {
      isBackImageType: false,
      updateIndex: 0
    }
  },
  computed: {
    lastSelectedBack () {
      // eslint-disable-next-line no-unused-expressions
      this.updateIndex
      return lsm?.state?.lastSelectedBack
    }
  },
  watch: {
    activeType () {
      this.isBackImageType = this.activeType === 'image'
    }
  },
  created () {
    this.isBackImageType = this.activeType === 'image'
    lsm.init()
  },
  methods: {
    pickLastSelectedBack () {
      if (this.lastSelectedBack?.type === 'image') {
        this.imagePicked(this.lastSelectedBack?.value)
      } else {
        this.colorPicked(this.lastSelectedBack?.value)
      }
    },
    colorPicked (value) {
      if (!value.includes('http')) {
        this.OnBackChanged({ type: 'color', value })
      }
    },
    imagePicked (value) {
      this.OnBackChanged({ type: 'image', value })
    },
    OnBackChanged (styleObj) {
      this.updateIndex++
      this.$emit('OnBackChanged', styleObj)
    }
  }
}
</script>

<style lang="sass" scoped>
.lastBackground
  border-radius: 12px
  border: 1px solid rgb(228, 228, 228)
  overflow: hidden
  & .backPreview
    max-width: 138px
    width: 100%
    height: 78px
</style>
