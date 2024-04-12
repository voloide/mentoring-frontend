<template>
    <div style="height: 100%;">
        <search v-if="isSearchStep" @create="changeStep('create')" @goToForms="goToForms" />
        <add-edit v-if="isCreateStep" @goToForms="goToForms" @close="close" />
    </div>
</template>
<script setup>
import { ref, provide, computed, onMounted } from 'vue';
import Search from 'src/components/Forms/Search.vue';
import AddEdit from 'src/components/Forms/ManageForm.vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import programService from 'src/services/api/program/programService';
import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
import questionCategoryService from 'src/services/api/question/questionCategoryService';
import responseTypeService from 'src/services/api/question/responseTypeService';
import evaluationTypeService from 'src/services/api/question/evaluationTypeService';

const { closeLoading, showloading } = useLoading();
const step = ref('');
const selectedForm = ref(null);
const isNewForm = ref(true);

    onMounted(() => {
        showloading();
        changeStep('search');
        init();
    });

    const isSearchStep = computed(() => {
            return step.value === 'search';
        });
    const isCreateStep = computed(() => {
            return step.value === 'create';
        });
    const changeStep = (stepp) => {
        step.value = stepp;
    }

    const goToForms = (form) => {
        selectedForm.value = form;
        isNewForm.value = false;
        changeStep('create');
    }

    const init = () => {
        programService.getAll();
        programmaticAreaService.getAll();
        questionCategoryService.getAll();
        responseTypeService.getAll();
        evaluationTypeService.getAll();
        closeLoading();
    }
    const close = () => {
        changeStep('search');
    }
    provide('step', step);
    provide('selectedForm', selectedForm);
    provide('isNewForm', isNewForm);

</script>