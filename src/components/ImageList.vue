<template>
  <div class="image">
    <h4>Images</h4>
    <ul class="list-unstyled">
      <!-- List of images here -->
      <li v-for="(image, index) in images" :key="index">
        <img :src="image" class="img-rounded" />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

export default Vue.extend({
  name: 'ImageList',
  data() {
    return {
      images: [],
    };
  },
  mounted() {
    axios.get('http://localhost:8000/images').then((result) => {
      this.images = result.data;
    });
  },
});
</script>