<template>
  <div>
    变更流程
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const list=ref({
  id:null
})
console.log(list.value?.id)
</script>