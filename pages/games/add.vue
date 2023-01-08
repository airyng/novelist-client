<template>
  <ConstructorAddEditGameConstructor />
</template>

<script>
export default {
  beforeRouteLeave (to, from, next) {
    let canRedirect = true

    if (this.$store.state.constructorStorage.hasUnsavedChanges) {
      canRedirect = confirm('Внимание! Все несохраненные изменения будут потеряны. Все равно перейти?')
    }
    if (canRedirect) { next() }
  },
  middleware: ['authenticated'],
  head: {
    title: 'Конструктор Новелл',
    meta: [
      { 'http-equiv': 'pragma', content: 'no-cache' },
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { 'http-equiv': 'expires', content: '0' }
    ]
  }
}
</script>
