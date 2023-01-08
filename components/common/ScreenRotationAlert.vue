<template>
  <div class="screen-rotation-alert">
    <img src="@/assets/images/hand-with-phone.jpeg">
    <p class="px-2">
      Для корректного отображения переверните экран на <i>портретную</i> ориентацию
    </p>
  </div>
</template>

<style lang="sass" scoped>
.screen-rotation-alert
    position: fixed
    left: 0
    top: 0
    z-index: 9999
    background-color: white
    width: 100%
    height: 100%
    display: none
    align-items: center
    justify-content: center
    flex-direction: column
    @media screen and (max-width: 959px) and (orientation: landscape)
        display: flex
    & img
        height: 50%
    & p
        text-align: center
        color: black

</style>
