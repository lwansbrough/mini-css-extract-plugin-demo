<template>
  <div class="a">
    <B/>
  </div>
</template>

<script>
import B from './B.vue'

export default {
  name: 'A',
  components: {
    B
  },
  data() {
    return {
    }
  },
  computed: {
    
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