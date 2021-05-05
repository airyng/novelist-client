<template>
  <div class="loadingContainer">
    <h1>
      Загрузка...
    </h1>
  </div>
</template>

<style lang="sass" scoped>
.loadingContainer
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  background-color: rgb(68,68,68)
  z-index: 999
  & h1
    font-size: 5em
    color: white
    @media (max-width: 500px)
      font-size: 3em
</style>
