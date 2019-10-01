<template>
  <div class="canvas col-sm-8 col-md-8 col-lg-8">
    <div ref="canvasRef" class="block" @mousedown="startDrag">
      <!-- Add images and texts to here -->
      <CanvasItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :selected="selectedItem === item"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { IItem, IMouseEvent, IPoint, MouseButton } from '../types/interfaces';
import CanvasItem from './CanvasItem.vue';

import { itemService } from '../utils/services';

interface ICanvasData {
  items: IItem[];
  selectedItem: IItem | null;
  dragging: boolean;
  dragAnchorPoint: IPoint;
  canvasOrigin: IPoint;
}

const canvasBorderWidth = 1;
const canvasSize = 600;

export default Vue.extend({
  name: 'Canvas',
  components: {
    CanvasItem,
  },
  data() {
    const data: ICanvasData = {
      items: [],
      selectedItem: null,
      dragging: false,
      dragAnchorPoint: { x: 0, y: 0 },
      canvasOrigin: { x: 0, y: 0 },
    };
    return data;
  },
  mounted() {
    itemService.subscribe({
      next: (item: IItem) => this.items.push(item),
      error: (error: any) => {
        // tslint:disable-next-line
        console.error('Error getting next image', error);
      },
    });
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('mousemove', this.doDrag);
  },
  beforeDestroy() {
    itemService.unsubscribe();
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('mousemove', this.doDrag);
  },
  methods: {
    recomputeCanvasOrigin() {
      const canvasRef: any = this.$refs.canvasRef;
      this.canvasOrigin = {
        x: canvasRef.offsetLeft + canvasBorderWidth,
        y: canvasRef.offsetTop + canvasBorderWidth,
      };
    },
    /**
     * Since we are using the Event delegation pattern, we need a way to know
     * which item we are referring when clocking the canvas this can be done by getting
     * the event target.
     * Since the event target will be the top element, and there may be many elements between
     * that and the canvas item, it won't be event.target but closest('.item') to this (canvas)
     */
    getCanvasItemFromEvent(event: IMouseEvent) {
      const domItem = event.target.closest('.item');
      if (domItem === null) {
        return null;
      }
      const children = Array.from(event.currentTarget.childNodes);
      const index = children.indexOf(domItem);
      return this.items[index];
    },
    startDrag(event: IMouseEvent) {
      // only left click
      if (event.button === MouseButton.LEFT) {
        this.selectedItem = this.getCanvasItemFromEvent(event);
        if (this.selectedItem !== null) {
          // just in case, another component updated dom and changed canvas position,
          // I'll compute it's origin on every start drag
          this.recomputeCanvasOrigin();
          this.dragging = true;
          this.dragAnchorPoint.x = event.pageX - (this.canvasOrigin.x + this.selectedItem.x);
          this.dragAnchorPoint.y = event.pageY - (this.canvasOrigin.y + this.selectedItem.y);
          event.preventDefault();
        }
      }
    },
    stopDrag() {
      this.dragging = false;
      // Update item position on server
      if (this.selectedItem !== null) {
        const index = this.items.indexOf(this.selectedItem);
        itemService.updateItem(index, this.selectedItem);
      }
    },
    doDrag(event: MouseEvent) {
      if (this.selectedItem && this.dragging) {
        const newValidPosition = this.validatePosition(this.selectedItem, {
          x: event.pageX - this.canvasOrigin.x - this.dragAnchorPoint.x,
          y: event.pageY - this.canvasOrigin.y - this.dragAnchorPoint.y,
        });
        this.selectedItem.x = newValidPosition.x;
        this.selectedItem.y = newValidPosition.y;
        event.preventDefault();
      }
    },
    validatePosition(item: IItem, newPosition: IPoint) {
      return {
        x: Math.max(0, Math.min(newPosition.x, canvasSize - 2 * canvasBorderWidth - item.w)),
        y: Math.max(0, Math.min(newPosition.y, canvasSize - 2 * canvasBorderWidth - item.h)),
      };
    },
  },
});
</script>
