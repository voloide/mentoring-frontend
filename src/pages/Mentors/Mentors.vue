<template>
    <div style="height: 100%;">
        <search v-if="isSearchStep" @create="changeStep('create')" @goToMentoringAreas="goToMentoringAreas"/>
        <add-edit v-if="isCreateStep" @goToMentoringAreas="goToMentoringAreas" @close="close"/>
        <manage-mentoring-areas v-if="isEditAreasStep" />
    </div>
</template>
<script setup>
    import Search from 'src/components/Mentors/Search.vue'
    import AddEdit from 'src/components/Mentors/AddEditMentor.vue'
    import { ref, provide, computed, onMounted } from 'vue';
    import { useLoading } from 'src/composables/shared/loading/loading';
    import districtService from 'src/services/api/district/districtService';
    import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
    import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
    import partnerService from 'src/services/api/partner/partnerService';
    import Mentor from 'src/stores/model/mentor/Mentor';
    import ManageMentoringAreas from 'src/components/Mentors/ManageMentoringAreas.vue';

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
    const isEditAreasStep = computed(() => {
        return step.value === 'editAreas';
        });
    const changeStep = (stepp) => {
        step.value = stepp;
    }

    const goToMentoringAreas = (mentor) => {
        console.log(mentor);
        selectedMentor.value = mentor;
        changeStep('editAreas');
    }

    const init = () => {
        districtService.getAll()
        healthFacilityService.getAll()
        professionalCategoryService.getAll()
        partnerService.getAll()
        closeLoading();
    }
    const close = () => {
        changeStep('search');
    }
    provide('step', step);
    provide('selectedMentor', selectedMentor);

</script>