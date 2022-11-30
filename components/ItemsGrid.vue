<template>
  <v-row>
    <template v-if="items && items.length">
      <v-col
        v-for="(item, index) in items"
        :key="index"
        cols="12"
        md="6"
      >
        <novella-item :item="item" />
      </v-col>
    </template>

    <!-- Sceleton loader start -->
    <template v-else>
      <v-col
        v-for="n in 4"
        :key="n"
        cols="12"
        md="6"
      >
        <v-skeleton-loader type="card-avatar" />
      </v-col>
    </template>
    <!-- Sceleton loader end -->
  </v-row>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: null }
  }
}
</script>
