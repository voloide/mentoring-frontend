<template>
  <div style="height: 100%;">
    <search v-if="isSearchStep" @create="changeStep('create')" @edit="edit" @goToMentoringAreas="goToMentoringAreas" @import="changeStep('import')"/>
  </div>
</template>

<script setup>
  import Search from 'components/rondas/SearchRondas.vue';
  import {onMounted, ref} from 'vue';
  import districtService from 'src/services/api/district/districtService';
  import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
  import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
  import partnerService from 'src/services/api/partner/partnerService';
  import programService from 'src/services/api/program/programService';
  import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
  import {useLoading} from 'src/composables/shared/loading/loading';

  const isSearchStep = ref(true)
  const { closeLoading, showloading } = useLoading();


  const init = () => {
    districtService.getAll()
    closeLoading();
  }

  onMounted(() => {
    showloading()
    // changeStep('search');
    init();
  });
</script>

<style scoped lang="scss">

</style>
