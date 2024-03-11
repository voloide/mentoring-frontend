<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('edit')"
      @goToMenteesEdit="goToMenteesEdit"
    />
    <edit
      v-if="isEditStep"
      @goToMenteesEdit="goToMenteesEdit"
      @close="cancel"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/Mentees/SearchMentees.vue';
import Edit from 'src/components/Mentees/EditMentees.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import districtService from 'src/services/api/district/districtService';
import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
import partnerService from 'src/services/api/partner/partnerService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedMentee = ref(null);

onMounted(() => {
  showloading();
  changeStep('search');
  init();
});

const isSearchStep = computed(() => {
  return step.value === 'search';
});
const isEditStep = computed(() => {
  return step.value === 'edit';
});
const changeStep = (stepp) => {
  step.value = stepp;
};

const goToMenteesEdit = (mentees) => {
  console.log(mentees);
  selectedMentee.value = mentees;
  changeStep('edit');
};

const init = () => {
  districtService.getAll();
  healthFacilityService.getAll();
  professionalCategoryService.getAll();
  partnerService.getAll();
  closeLoading();
};
const cancel = () => {
  changeStep('search');
};
provide('step', step);
provide('selectedMentee', selectedMentee);
</script>
