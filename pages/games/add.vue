<template>
  <ConstructorAddEditGameConstructor />
</template>

<script>
export default {
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
