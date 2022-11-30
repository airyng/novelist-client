<template>
  <div class="d-flex align-center" style="height: 100%;">
    <div style="width:100%;">
      <div>
        <h1>Уупс... Страница не найдена!</h1>
        <p>Возможно ссылка сильно устарела или никогда не существовала.</p>
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
