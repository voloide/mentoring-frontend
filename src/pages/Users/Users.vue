<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToUseringAreas="goToUseringAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/Users/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import userService from 'src/services/api/user/userService';
import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
import partnerService from 'src/services/api/partner/partnerService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedUser = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  professionalCategoryService.getAll()
  partnerService.getAll()
  userService.getAll().then((res) => {
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

const goToUseringAreas = (user) => {
  console.log(user);
  selectedUser.value = user;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedUser', selectedUser);
</script>
