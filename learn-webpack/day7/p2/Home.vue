<template>
  <div class="title">
    {{ msg }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world',
    };
  },
};
</script>

<style scoped>
  .title {
    color: red;
    font-size: 30px;
  }
</style>
