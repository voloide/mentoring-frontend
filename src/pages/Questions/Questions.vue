<template>
  <div style="height: 100%">
    <search
      v-if="isSearchStep"
      @create="changeStep('create')"
      @goToQuestioningAreas="goToQuestioningAreas"
    />
  </div>
</template>
<script setup>
import Search from 'src/components/Questions/Search.vue';
import { ref, provide, computed, onMounted } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import questionService from 'src/services/api/question/questionService';
import questionCategoryService from 'src/services/api/question/questionCategoryService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedQuestion = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  questionCategoryService.getAll()
  questionService.getAll().then((res) => {
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

const goToQuestioningAreas = (question) => {
  console.log(question);
  selectedQuestion.value = question;
  changeStep('editAreas');
};

provide('step', step);
provide('selectedQuestion', selectedQuestion);
</script>
