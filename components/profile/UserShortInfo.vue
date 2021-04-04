<template>
  <v-card
    v-if="user"
    class="mx-auto"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">
          Инфо
        </div>
        <v-list-item-title class="headline mb-1">
          {{ user.name }}
        </v-list-item-title>
        <v-list-item-subtitle><a :href="'mailto:'+user.email">{{ user.email }}</a></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar v-if="user.avatar" size="62">
        <img :src="'/storage/'+user.avatar">
      </v-list-item-avatar>
      <v-list-item-avatar v-else size="62" color="grey" />
    </v-list-item>

    <!-- <v-card-actions>
        <v-btn text>Button</v-btn>
        <v-btn text>Button</v-btn>
        </v-card-actions> -->
  </v-card>
</template>
<script>
export default {
  computed: {
    user () {
      return this.$store.state.userData
    }
  },
  mounted () {
    //
  }
}
</script>
