<template>
  <div class="main">
    <!-- side pane -->
    <div class="sidepane col-sm-2 col-md-2 col-lg-2">
      <ImageForm />
      <hr />
      <div class="assets">
        <h3>Assets</h3>
        <TextAdd />
        <ImageList />  
      </div>
    </div>
    <!-- canvas -->
    <Canvas />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Canvas from './components/Canvas.vue';
import ImageForm from './components/ImageForm.vue';
import ImageList from './components/ImageList.vue';
import TextAdd from './components/TextAdd.vue';

export default Vue.extend({
  name: 'app',
  components: {
    Canvas,
    ImageForm,
    ImageList,
    TextAdd,
  },
});
</script>
<style lang="css">
.main {
  height: 100%;
  width: 100%;
}
</style>
