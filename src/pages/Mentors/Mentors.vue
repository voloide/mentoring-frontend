<template>
    <div style="height: 100%;">
        <search v-if="isSearchStep" @create="changeStep('create')" @edit="edit" @goToMentoringAreas="goToMentoringAreas" @import="changeStep('import')"/>
        <import-mentor v-if="isImportStep" @close="close" />
        <add-edit v-if="isCreateStep || isEditStep" @goToMentoringAreas="goToMentoringAreas" @close="close"/>
        <manage-mentoring-areas v-if="isEditAreasStep" @close="close"/>
    </div>
</template>
<script setup>
    import Search from 'src/components/Mentors/Search.vue'
    import ImportMentor from 'src/components/Mentors/ImportMentor.vue'
    import AddEdit from 'src/components/Mentors/AddEditMentor.vue'
    import { ref, provide, computed, onMounted } from 'vue';
    import { useLoading } from 'src/composables/shared/loading/loading';
    import districtService from 'src/services/api/district/districtService';
    import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
    import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
    import partnerService from 'src/services/api/partner/partnerService';
    import Mentor from 'src/stores/model/mentor/Mentor';
    import ManageMentoringAreas from 'src/components/Mentors/ManageMentoringAreas.vue';
    import programService from 'src/services/api/program/programService';
    import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
    import mentorService from 'src/services/api/mentor/mentorService';

    const { closeLoading, showloading } = useLoading();
    const step = ref('');
    const selectedMentor = ref(null);

    onMounted(() => {
        showloading()
        changeStep('search');
        init();
    });

    const isSearchStep = computed(() => {
            return step.value === 'search';
        });
    const isCreateStep = computed(() => {
            return step.value === 'create';
        });

    const isImportStep = computed(() => {
        return step.value === 'import';
    });
    const isEditAreasStep = computed(() => {
        return step.value === 'editAreas';
        });
    const isEditStep = computed(() => {
        return step.value === 'edit';
        });
    const changeStep = (stepp) => {
        step.value = stepp;
    }

    const goToMentoringAreas = (mentor) => {
        selectedMentor.value = mentor;
        changeStep('editAreas');
    }

    const edit = (mentor) => {
        selectedMentor.value = mentor;
        changeStep('edit');
    }
    const init = () => {
        districtService.getAll()
        healthFacilityService.getAll()
        professionalCategoryService.getAll()
        partnerService.getAll()
        programService.getAll()
        programmaticAreaService.getAll()
        // mentorService.search('')
        closeLoading();
    }
    const close = () => {
        changeStep('search');
    }
    provide('step', step);
    provide('selectedMentor', selectedMentor);

</script>
