<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToProfessionalCategoryingAreas="goToProfessionalCategoryingAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/ProfessionalCategories/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import ProfessionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedProfessionalCategory = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  // districtService.getAll()
  // healthFacilityService.getAll()
  // professionalCategoryService.getAll()
  // partnerService.getAll()
  // professionalCategoryService.getAll();
  ProfessionalCategoryService.getAll().then((res) => {
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

const goToProfessionalCategoryingAreas = (ProfessionalCategory) => {
  console.log(ProfessionalCategory);
  selectedProfessionalCategory.value = ProfessionalCategory;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedProfessionalCategory', selectedProfessionalCategory);
</script>
