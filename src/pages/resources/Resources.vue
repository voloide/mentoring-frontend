<template>
  <div style="height: 100%;">
    <EAResources />
  </div>
</template>

<script setup>
  import EAResources from 'components/EAResources/EAResources.vue';
  import {onMounted} from 'vue';

  onMounted(() => {
      // resourceService.getAll()
  })
</script>

<style scoped>

</style>
