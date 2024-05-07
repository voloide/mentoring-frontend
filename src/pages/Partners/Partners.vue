<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToPartneringAreas="goToPartneringAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/Partners/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import PartnerService from 'src/services/api/partner/partnerService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedPartner = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  // districtService.getAll()
  // healthFacilityService.getAll()
  // professionalCategoryService.getAll()
  // partnerService.getAll()
  // partnerService.getAll();
  PartnerService.getAll().then((res) => {
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

const goToPartneringAreas = (Partner) => {
  console.log(Partner);
  selectedPartner.value = Partner;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedPartner', selectedPartner);
</script>
