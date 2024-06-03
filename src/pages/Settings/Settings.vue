<template>
  <div class="q-mx-md">
    <ul>
      <li>
        <a
          @click="changeStep('programs')"
          :class="{ selected: step === 'programs' }"
          >Programas</a
        >
      </li>
      <li>
        <a
          @click="changeStep('programmaticArea')"
          :class="{ selected: step === 'programmaticArea' }"
          >Áreas de Mentoria</a
        >
      </li>
      <li>
        <a
          @click="changeStep('professionalCategory')"
          :class="{ selected: step === 'professionalCategory' }"
          >Categorias Profissionais</a
        >
      </li>
      <li>
        <a
          @click="changeStep('question')"
          :class="{ selected: step === 'question' }"
          >Competências</a
        >
      </li>
      <li>
        <a
          @click="changeStep('healthFacility')"
          :class="{ selected: step === 'healthFacility' }"
          >Unidades Sanitárias</a
        >
      </li>
      <li>
        <a
          @click="changeStep('partner')"
          :class="{ selected: step === 'partner' }"
          >Instituições</a
        >
      </li>
      <li>
        <a @click="changeStep('user')" :class="{ selected: step === 'user' }"
          >Utilizadores</a
        >
      </li>
    </ul>
  </div>
  <div style="height: 100%">
    <programs v-if="isProgramsStep" />
    <questions v-if="isQuestionStep" />
    <programmatic-areas v-if="isProgrammaticAreaStep" />
    <professional-categories v-if="isProfessionalCategoryStep" />
    <health-facilities v-if="isHealthFacilityStep" />
    <partners v-if="isPartnerStep" />
    <users v-if="isUserStep" @create="changeStep('userForm')" />
    <user-form v-if="isUserFormStep" @cancel="changeStep('user')" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Programs from 'src/components/Programs/Programs.vue';
import Questions from 'src/components/Questions/Questions.vue';
import ProgrammaticAreas from 'src/components/ProgrammaticAreas/ProgrammaticAreas.vue';
import ProfessionalCategories from 'src/components/ProfessionalCategories/ProfessionalCategories.vue';
import HealthFacilities from 'src/components/HealthFacilities/HealthFacilities.vue';
import Partners from 'src/components/Partners/Partners.vue';
import Users from 'src/components/Users/Users.vue';
import UserForm from 'src/components/Users/UserForm.vue';
import { useLoading } from 'src/composables/shared/loading/loading';
import programService from 'src/services/api/program/programService';
import programmaticAreasService from 'src/services/api/programmaticArea/programmaticAreaService';
import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
import questionService from 'src/services/api/question/questionService';
import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
import partnerService from 'src/services/api/partner/partnerService';
import roleService from 'src/services/api/role/roleService';
import userService from 'src/services/api/user/UsersService';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { provide } from 'vue';

const { closeLoading, showloading } = useLoading();
const step = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  programService.getAll().then((res) => {
    changeStep('programs');
  });
  programmaticAreasService.getAll();
  professionalCategoryService.getAll();
  questionService.getAll();
  healthFacilityService.getAll();
  partnerService.getAll();
  roleService.getAll();
  userService.getAll();
  closeLoading();
};

const changeStep = (value) => {
  step.value = value;
};

const isProgramsStep = computed(() => {
  return step.value === 'programs';
});
const isProgrammaticAreaStep = computed(() => {
  return step.value === 'programmaticArea';
});
const isHealthFacilityStep = computed(() => {
  return step.value === 'healthFacility';
});
const isProfessionalCategoryStep = computed(() => {
  return step.value === 'professionalCategory';
});
const isQuestionStep = computed(() => {
  return step.value === 'question';
});
const isPartnerStep = computed(() => {
  return step.value === 'partner';
});
const isUserStep = computed(() => {
  return step.value === 'user';
});
const isUserFormStep = computed(() => {
  return step.value === 'userForm';
});

provide('step', step);
</script>

<style>
body {
  font-family: Arial, sans-serif;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 10px;
  border-bottom: 2px solid orange;
}

li {
  display: inline-block;
  margin-right: 10px;
}

li a {
  text-decoration: none;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  color: #168fc7;
}

li a:hover {
  background-color: #f0f0f0;
  border-top: 2px solid orange;
  border-left: 2px solid orange;
  border-right: 2px solid orange;
}

.selected {
  border-color: #007bff;
  background-color: #cce5ff;
}
</style>
