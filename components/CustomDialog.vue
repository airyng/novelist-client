<template>
  <div>
    <div @click="open">
      <slot name="toggler" />
    </div>

    <v-dialog
      v-model="val"
      max-width="800"
      :content-class="dark ?'dark-back' : ''"
      @click:outside="close"
    >
      <div>
        <v-toolbar
          flat
          color="deep-purple"
          dark
        >
          <v-toolbar-title>{{ title }}</v-toolbar-title>

          <v-spacer />

          <v-icon
            v-if="showCloseBtn"
            class="curs-pointer"
            @click="close"
          >
            Ок
          </v-icon>
        </v-toolbar>

        <v-container v-if="withContainer" fluid>
          <slot />
        </v-container>

        <slot v-else />
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    showCloseBtn: { type: Boolean, default: true },
    withContainer: { type: Boolean, default: true },
    dark: { type: Boolean, default: false },
    // дополнительный тоглер. необходим, когда кнопка активации диалога в труднодоступном месте
    toggler: { type: Boolean, default: false }
  },
  data () {
    return {
      val: false
    }
  },
  watch: {
    toggler (data) {
      if (data) { this.open() } else { this.close() }
    }
  },
  methods: {
    open () {
      this.val = true
      this.onDialogStateChanged()
    },
    close () {
      this.val = false
      this.onDialogStateChanged()
    },
    onDialogStateChanged () {
      this.$emit('onDialogStateChanged', this.val)
    }
  }
}
</script>
