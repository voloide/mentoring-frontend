<template>
  <div>
    <ul>
      <li>
        <a @click="selectOption('programs')" :class="{ selected: selectedOption === 'programs' }">Programas</a>
      </li>
      <li>
        <a @click="selectOption('programmaticArea')" :class="{ selected: selectedOption === 'programmaticArea' }">Áreas
          de Mentoria</a>
      </li>
      <li>
        <a @click="selectOption('professionalCategory')"
          :class="{ selected: selectedOption === 'professionalCategory' }">Categorias Profissionais</a>
      </li>
      <li>
        <a @click="selectOption('question')" :class="{ selected: selectedOption === 'question' }">Questões</a>
      </li>
      <li>
        <a @click="selectOption('healthFacility')" :class="{ selected: selectedOption === 'healthFacility' }">Unidades
          Sanitárias</a>
      </li>
      <li>
        <a @click="selectOption('partner')" :class="{ selected: selectedOption === 'partner' }">Instituições</a>
      </li>
      <li>
        <a @click="selectOption('user')" :class="{ selected: selectedOption === 'user' }">Utilizadoras</a>
      </li>
    </ul>
  </div>
  <div style="height: 100%">
    <programs v-if="isProgramsStep" @create="selectOption('edit')" @goToMenteesEdit="goToMenteesEdit" />
    <questions v-if="isQuestionStep" @goToMenteesEdit="goToMenteesEdit" @close="cancel" />
    <programmatic-areas v-if="isProgrammaticAreaStep" @create="selectOption('edit')"
      @goToMenteesEdit="goToMenteesEdit" />
    <professional-categories v-if="isProfessionalCategoryStep" @create="selectOption('edit')"
      @goToMenteesEdit="goToMenteesEdit" />
    <health-facilities v-if="isHealthFacilityStep" @create="selectOption('edit')" @goToMenteesEdit="goToMenteesEdit" />
    <partners v-if="isPartnerStep" @create="selectOption('edit')" @goToMenteesEdit="goToMenteesEdit" />
    <users v-if="isUserStep" @create="selectOption('edit')" @goToMenteesEdit="goToMenteesEdit" />
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
const selectedOption = ref(null);

onMounted(() => {
  showloading();
  init();
});

const init = () => {
  programService.getAll().then((res) => {
    selectOption('programs');
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

const selectOption = (step) => {
  selectedOption.value = step;
};

const isProgramsStep = computed(() => {
  return selectedOption.value === 'programs';
});
const isProgrammaticAreaStep = computed(() => {
  return selectedOption.value === 'programmaticArea';
});
const isHealthFacilityStep = computed(() => {
  return selectedOption.value === 'healthFacility';
});
const isProfessionalCategoryStep = computed(() => {
  return selectedOption.value === 'professionalCategory';
});
const isQuestionStep = computed(() => {
  return selectedOption.value === 'question';
});
const isPartnerStep = computed(() => {
  return selectedOption.value === 'partner';
});
const isUserStep = computed(() => {
  return selectedOption.value === 'user';
});
provide('selectedOption', selectedOption);
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
