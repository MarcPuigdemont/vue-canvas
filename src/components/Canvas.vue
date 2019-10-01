<template>
  <div class="canvas col-sm-8 col-md-8 col-lg-8">
    <div class="block">
      <!-- Add images and texts to here -->
      <CanvasItem v-for="(item, index) in items" :key="index" :item="item" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

import { IItem } from '../types/interfaces';
import CanvasItem from './CanvasItem.vue';

export default Vue.extend({
  name: 'Canvas',
  components: {
    CanvasItem,
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    axios.get('http://localhost:8000/items').then((result) => {
      this.items = result.data;
    });
  },
});
</script>
