<template>
  <div class="title">
    {{ msg }}
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      msg: 'Hello world Mariana',
    };
  },
  created() {
    axios.get('/api/name').then((res) => {
      console.log(res.data);
    });
  },
};
</script>

<style scoped>
.title {
  color: red;
  font-size: 30px;
}
</style>
