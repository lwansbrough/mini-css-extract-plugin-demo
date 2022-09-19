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
      showB: process.env.VUE_ENV === 'server' ? true : false
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
  height: 100%;
  width: 100%;
}

::v-deep .b {
  background: green;
}
</style>