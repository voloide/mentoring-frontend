<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToProgrammaticAreaingAreas="goToProgrammaticAreaingAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/ProgrammaticAreas/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import ProgrammaticAreasService from 'src/services/api/programmaticArea/programmaticAreaService';
import programService from 'src/services/api/program/programService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedProgrammaticArea = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  programService.getAll()
  ProgrammaticAreasService.getAll().then((res) => {
    changeStep('search');
  });
  closeLoading();
};
const isSearchStep = computed(() => {
  return step.value === 'search';
});
const changeStep = (stepp) => {
  step.value = stepp;
};

const goToProgrammaticAreaingAreas = (ProgrammaticArea) => {
  console.log(ProgrammaticArea);
  selectedProgrammaticArea.value = ProgrammaticArea;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedProgrammaticArea', selectedProgrammaticArea);
</script>
