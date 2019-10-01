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
    const item: (x: number, y: number, w: number, h: number, type: string, model: IItemModel) => IItem =
      (x, y, w, h, type, model) => ({ x, y, w, h, type, model });
    const items = [
      item(10, 10, 200, 40, 'TEXT', { text: 'This is a text'}),
      item(30, 60, 120, 100, 'IMAGE', { url: 'http://localhost:8000/images/uploads-1462948453043.png' }),
      item(100, 200, 100, 60, 'TEXT', { text: 'This is another text'}),
      item(400, 50, 120, 180, 'IMAGE', { url: 'http://localhost:8000/images/uploads-1462948491987.png' }),
    ];
    return {
      items,
    };
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