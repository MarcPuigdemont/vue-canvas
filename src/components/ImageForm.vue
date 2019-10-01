<template>
  <div class="form">
    <h3>Form</h3>
    <input type="file" class="form-control" placeholder="Upload Your Images" name="upload" @change="updateFile">
    <button id="submit" class="btn btn-default" @click="uploadImage">upload</button>
    <!-- Upload Form here -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import axios from 'axios';

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

      const form = new FormData();
      form.append('upload', this.file);

      axios.post(
        'http://localhost:8000/uploads',
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      this.file = null;
    },
  },
});
</script>