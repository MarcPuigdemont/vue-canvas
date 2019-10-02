<template>
  <div class="text">
    <h4>Text</h4>
    <button id="addText" class="btn btn-default" @click="addText">Add Text</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import * as services from '@/utils/services';
// WARNING jest seems to have problems destructuring directly a mocked instance
const { itemService } = services;

export default Vue.extend({
  name: 'TextAdd',
  methods: {
    addText() {
      itemService.addItem('TEXT', 'new added text');
    },
  },
});
</script>