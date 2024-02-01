<template>
    <div style="height: 100%;">
        <search v-if="isSearchStep" @create="changeStep('create')"/>
        <add-edit v-if="isCreateStep"/>
    </div>
</template>
<script setup>
    import Search from 'src/components/Mentors/Search.vue'
    import AddEdit from 'src/components/Mentors/AddEdit.vue'
    import { ref, provide, computed, onMounted } from 'vue';
    import { useLoading } from 'src/composables/shared/loading/loading';
    import districtService from 'src/services/api/district/districtService';
    import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
import partnerService from 'src/services/api/partner/partnerService';

    const { closeLoading, showloading } = useLoading();
    const step = ref('');

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

    const changeStep = (stepp) => {
        step.value = stepp;
    }

    const init = () => {
        districtService.getAll()
        healthFacilityService.getAll()
        professionalCategoryService.getAll()
        partnerService.getAll()
        closeLoading();
    }
    provide('step', step);

</script>