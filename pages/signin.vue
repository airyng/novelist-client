<template>
  <div>
    <v-container>
      <v-row no-gutters justify="center">
        <v-col cols="12" md="5" class="mt-10">
          <h2>Вход в личный кабинет</h2>
          <FormLogin />
        </v-col>

        <v-col cols="12" md="2" class="mt-10">
          <v-divider
            class="mx-auto d-block hidden-sm-and-down"
            vertical
          />
        </v-col>

        <v-col cols="12" md="5" class="mt-10">
          <h2>Регистрация</h2>
          <FormRegister />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
