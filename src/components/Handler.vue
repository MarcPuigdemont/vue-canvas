<template>
  <div class="handler" :style="style">
    <div class="handler-delete" @mousedown="deleteItem" data-cy="handler-delete"></div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { IItem, IMouseEvent } from '../types/interfaces';

export default Vue.extend({
  name: 'Handler',
  props: {
    item: {
      type: Object as () => IItem,
    },
  },
  computed: {
    style() {
      const { x, y, w, h } = this.item;
      return {
        transform: `translate(${x + 1}px, ${y + 1}px)`,
        width: `${w}px`,
        height: `${h}px`,
      };
    },
  },
  methods: {
    deleteItem(event: MouseEvent) {
      this.$emit('deleteItem');
      event.stopPropagation();
    },
  },
});
</script>
<style scoped>
.handler {
  position: absolute;
  border: solid 2px black;
  pointer-events: none;
  z-index: 10;
}
.handler-delete {
  position: absolute;
  top: 0;
  right: -40px;
  width: 32px;
  height: 32px;
  background-image: url('/delete-32.png');
  pointer-events: all;
  cursor: pointer;
}
</style>