<template>
    <div class="q-ma-md page-container">
      <form @submit.prevent="submitForm" ref="myForm">
        <div class="page-input-container q-pa-md">
          <!-- Banner for Competencies -->
          <div class="q-mt-lg">
            <q-banner dense inline-actions class="text-white bg-primary q-px-sm">
              Competências Associadas à <span style="color: amber-10;">[{{ selectedForm.name }}]</span>
            </q-banner>
          </div>
  
          <!-- Loop through formSections and pass to FormSectionInfoContainer -->
          <div>
            <span v-for="formSection in selectedForm.formSections" :key="formSection.uuid">
              <form-section-info-container
                :formSection="formSection"
                :selectedForm="selectedForm"
                @update-section="updateFormSection"
                @remove-section="removeFormSection"
              />
            </span>
          </div>
  
          <!-- Action Buttons -->
          <div class="row q-my-sm q-mt-lg">
            <q-space />
            <q-btn label="Cancelar" class="float-right" color="red" @click="cancel" />
            <q-btn label="Voltar" class="float-right q-ml-md" color="amber-4" @click="goBack" />
            <q-btn
              class="float-right q-ml-md"
              type="submit"
              :loading="submitLoading"
              label="Terminar"
              color="primary"
              @click="saveOrUpdate(selectedForm)"
            />
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { inject, ref, provide } from 'vue';
  import { useSwal } from 'src/composables/shared/dialog/dialog';
  import FormSectionInfoContainer from './FormSectionInfoContainer.vue';
  import formQuestionService from 'src/services/api/form/formQuestionService';
  import { v4 as uuidv4 } from 'uuid';
  
  // Inject selectedForm
  const selectedForm = inject('selectedForm');
  
  // Swal dialog methods
  const { alertError, alertSucess, alertWarningAction } = useSwal();
  
  // Method to handle section updates
  const updateFormSection = (updatedSection) => {
    const index = selectedForm.value.formSections.findIndex(
      (section) => section.uuid === updatedSection.uuid
    );
    if (index !== -1) {
      selectedForm.value.formSections[index] = updatedSection; // Update the section
    }
  };
  
  // Method to remove a section
  const removeFormSection = (sectionUuid) => {
    alertWarningAction('Tem certeza que deseja remover esta secção?').then((result) => {
      if (result) {
        selectedForm.value.formSections = selectedForm.value.formSections.filter(
          (section) => section.uuid !== sectionUuid
        );
        alertSucess('Secção removida com sucesso!');
      }
    });
  };
  
  // Cancel and navigation methods
  const cancel = () => {
    emit('close');
  };
  
  const goBack = () => {
    // Implement navigation back logic
  };
  
  </script>
  
  <style lang="scss">
  .title {
    background-color: $primary;
  }
  </style>
  