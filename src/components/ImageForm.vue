<template>
  <div class="form">
    <h3>Form</h3>
    <input type="file" class="form-control" placeholder="Upload Your Images" name="upload" @change="updateFile" data-cy="form-control">
    <button id="submit" class="btn btn-default" @click="uploadImage" data-cy="upload-button">upload</button>
    <!-- Upload Form here -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

import { imageService } from '../utils/services';

interface IImageFormData {
  file: Blob | null;
}

export default Vue.extend({
  name: 'ImageForm',
  data() {
    const data: IImageFormData = {
      file: null,
    };
    return data;
  },
  methods: {
    updateFile(event: any) {
      const files = event.target.files || event.dataTransfer.files;
      if (files && files.length > 0) {
        this.file = files[0];
      }
    },
    uploadImage() {
      if (this.file === null) {
        return;
      }
      imageService.uploadImage(this.file);
      this.file = null;
    },
  },
});
</script>