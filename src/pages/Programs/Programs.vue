<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToProgramingAreas="goToProgramingAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/Programs/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import ProgramService from 'src/services/api/program/programService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedProgram = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  // districtService.getAll()
  // healthFacilityService.getAll()
  // professionalCategoryService.getAll()
  // partnerService.getAll()
  // programService.getAll();
  ProgramService.getAll().then((res) => {
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

const goToProgramingAreas = (Program) => {
  console.log(Program);
  selectedProgram.value = Program;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedProgram', selectedProgram);
</script>
