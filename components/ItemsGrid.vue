<template>
  <v-row>
    <v-col
      v-for="(item, index) in items"
      :key="index"
      cols="12"
    >
      <NovellaItem :item="item" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    items: { required: true, type: Array }
  }
}
</script>
