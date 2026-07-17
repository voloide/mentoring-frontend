<template>
  <div style="height: 100%">
    <mentoring-session-report />
  </div>
</template>

<script setup>
import { onMounted, inject } from 'vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import sessionService from 'src/services/api/session/sessionService'; // Crie este se ainda não tiver
import MentoringSessionReport from 'components/reports/MentoringSessionReport.vue';

const { closeLoading } = useLoading();
const reportMode = inject('reportMode');

const init = async () => {
  // showloading();
  try {
    await sessionService.getSessionReport(); // ajuste esse método conforme a lógica da API
    closeLoading();
  } catch (error) {
    console.error('Erro ao buscar relatório de sessões:', error);
    closeLoading();
  } finally {
    closeLoading();
  }
};

onMounted(() => {
  reportMode.value = true;
  init();
});
</script>

<style scoped lang="scss"></style>
