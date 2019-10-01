<template>
  <div class="canvas col-sm-8 col-md-8 col-lg-8">
    <div class="block">
      <!-- Add images and texts to here -->
      <div v-for="(item, index) in items" :key="index" :style="style(item)" class="item">
        <div v-if="item.type === 'IMAGE'"
          :style="{ backgroundImage: `url(${item.model.url})` }"
          class="item-image">
        </div>
        <div v-else class="item-text">{{ item.model.text }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

interface IItemModel {
  text?: string;
  url?: string;
}

interface IItem {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  model: IItemModel;
}

export default Vue.extend({
  name: 'Canvas',
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
  methods: {
    style(item: IItem) {
      return {
        transform: `translate(${item.x}px, ${item.y}px)`,
        width: `${item.w}px`,
        height: `${item.h}px`,
      };
    },
  },
});
</script>
<style scoped>
.item {
  display: block;
  position: absolute;
  box-sizing: content-box;
  background-color: #ddd;
}
.item-image {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.item-text {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>