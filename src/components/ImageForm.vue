<template>
  <div class="form">
    <h3>Form</h3>
    <input type="file" class="form-control" placeholder="Upload Your Images" name="upload">
    <button id="submit" class="btn btn-default">upload</button>
    <!-- Upload Form here -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'ImageForm',
});
</script>