<template>
  <div :style="style" class="item">
    <component :is="itemComponent" :item="item" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { IItem } from '../types/interfaces';
import CanvasItemImage from './CanvasItemImage.vue';
import CanvasItemText from './CanvasItemText.vue';

export default Vue.extend({
  name: 'CanvasItem',
  props: {
    item: {
      type: Object as () => IItem,
    },
    selected: {
      type: Boolean,
    },
  },
  computed: {
    style() {
      // Typescript sometimes still fails to get the proper type from inside
      // computed methods, maybe with class model instead it would work
      const item = this.item as IItem;
      return {
        transform: `translate(${item.x}px, ${item.y}px)`,
        width: `${item.w}px`,
        height: `${item.h}px`,
        zIndex: this.selected ? 2 : 1,
        border: this.selected ? 'solid 1px black' : 'solid 1px transparent',
      };
    },
    itemComponent() {
      const item = this.item as IItem;
      if (item.type === 'TEXT') {
        return CanvasItemText;
      } else if (item.type === 'IMAGE') {
        return CanvasItemImage;
      }
      return null;
    },
  },
});
</script>
<style scoped>
.item {
  display: block;
  position: absolute;
  box-sizing: content-box;
  cursor: move;
}
.item:hover {
  border: dashed 1px gray !important;
}
</style>
