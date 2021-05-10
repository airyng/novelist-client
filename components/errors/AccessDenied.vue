<template>
  <div class="d-flex align-center" style="height: 100%;">
    <div style="width:100%;">
      <div>
        <h1>Доступ к странице запрещен!</h1>
        <p>Вы не имеете прав доступа к этой странице.</p>
        <div class="d-flex flex-column align-center">
          <NuxtLink to="/">
            <v-btn depressed dark color="indigo">
              На главную
            </v-btn>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
