<template>
  <div class="fill-in-height">
    <v-container>
      <v-row justify="center">
        <v-col class="col-12">
          <h1>Профиль</h1>
        </v-col>
        <v-col class="col-12">
          <ProfileUserShortInfo />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated']
}
</script>
