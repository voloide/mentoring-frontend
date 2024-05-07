<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToHealthFacilityingAreas="goToHealthFacilityingAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/HealthFacilities/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
import districtService from 'src/services/api/district/districtService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedHealthFacility = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  districtService.getAll()
  healthFacilityService.getAll().then((res) => {
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

const goToHealthFacilityingAreas = (healthFacility) => {
  console.log(healthFacility);
  selectedHealthFacility.value = healthFacility;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedHealthFacility', selectedHealthFacility);
</script>
