<template>
  <div>
    <A/>
  </div>
</template>

<script>
import A from './A.vue'

export default {
  name: 'App',
  components: {
    A
  }
}
</script>

<style lang="scss">
  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
  }

  div {
    height: 100%;
    width: 100%;
  }
</style>