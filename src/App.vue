<template>
  <div id="app">
    <button @click="load">Load A</button>
    <template v-if="loadA">
      <A/>
    </template>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    A: () => import('./A.vue')
  },
  data() {
    return {
      loadA: false
    }
  },
  methods: {
    load() {
      this.loadA = true
    }
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