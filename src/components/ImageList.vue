<template>
  <div class="image">
    <h4>Images</h4>
    <ul class="list-unstyled">
      <!-- List of images here -->
      <li v-for="(image, index) in images" :key="index" @click="addImageToCanvas(image)" data-cy="image-list-item">
        <img :src="image" class="img-rounded" />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { imageService, itemService } from '../utils/services';

interface IImageListData {
  images: string[];
}

export default Vue.extend({
  name: 'ImageList',
  data() {
    const data: IImageListData = {
      images: [],
    };
    return data;
  },
  mounted() {
    imageService.subscribe({
      next: (image: string) => this.images.push(image),
      error: (error: any) => {
        // tslint:disable-next-line
        console.error('Error getting next image', error);
      },
    });
  },
  beforeDestroy() {
    imageService.unsubscribe();
  },
  methods: {
    addImageToCanvas(image: string) {
      itemService.addItem('IMAGE', image);
    },
  },
});
</script>