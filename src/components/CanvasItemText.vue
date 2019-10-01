<template>
  <div class="item-text">{{ item.model.text }}</div>
</template>
<script lang="ts">
import Vue from 'vue';
import { IItem } from '../types/interfaces';

export default Vue.extend({
  name: 'CanvasItemText',
  props: {
    item: {
      type: Object as () => IItem,
    },
  },
});
</script>
<style scoped>
.item-text {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>