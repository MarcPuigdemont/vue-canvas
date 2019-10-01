<template>
  <div :style="style" class="item-image"></div>
</template>
<script lang="ts">
import Vue from 'vue';
import { IItem } from '../types/interfaces';

export default Vue.extend({
  name: 'CanvasItemImage',
  props: {
    item: {
      type: Object as () => IItem,
    },
  },
  computed: {
    style() {
      const item = this.item as IItem;
      return {
        backgroundImage: `url(${item.model.url})`,
      };
    },
  },
});
</script>
<style scoped>
.item-image {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>