<template>
  <v-card
    v-if="user"
    max-width="344"
    outlined
    class="profileCard"
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

      <profile-user-avatar :user-id="user._id" allow-upload />
    </v-list-item>

    <!-- <v-card-actions>
        <v-btn text>Button</v-btn>
        <v-btn text>Button</v-btn>
        </v-card-actions> -->
  </v-card>
</template>

<script>
// TODO: логично чтобы этот компонент отображал данные пользователя по переданному
// через пропс id или полному набору данных. Тогда можно будет применять этот компонент более широко
// Сейчас же в этом компоненте происходит обработка только информации из store

export default {
  data () {
    return {
      avatarUrl: null
    }
  },
  computed: {
    user () {
      return this.$store.state.userData
    }
  }
}
</script>

<style lang="sass" scoped>
#app .profileCard .theme--light.v-list-item
  color: $mainTextColor!important
  background-color: $subBackColor!important
  & a
    color: $mainTextColor
</style>
