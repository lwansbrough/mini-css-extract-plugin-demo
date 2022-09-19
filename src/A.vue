<template>
  <div class="a">
    <template v-if="showB">
      <B/>
    </template>
  </div>
</template>

<script>
export default {
  name: 'A',
  components: {
    B: () => import('./B.vue')
  },
  data() {
    return {
      showB: false
    }
  },
  computed: {
    
  },
  mounted() {
    setTimeout(() => {
      this.showB = true
    }, 3000)
  }
}
</script>

<style lang="scss" scoped>
.a {
  background: blue;
  height: 100%;
  width: 100%;
}

::v-deep .b {
  background: red;
}
</style>