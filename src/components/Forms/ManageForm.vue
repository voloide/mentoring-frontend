<template>
    <div v-if="isFormDataVisible">
        <div class="q-ma-md page-container">
                <div class="page-input-container q-pa-md">
                    <div class="q-mt-lg">
                      <div class="row items-center q-mb-md title">
                        <span class="q-pl-sm text-subtitle2">Identificação da Tabela de Competências</span>
                      </div>
                    </div>
                    <div class="row">
                    <div class="col q-ml-md">
                      <div class="row">
                        <span class="q-ml-md"
                          >Programa</span
                        >
                      </div>
                        <q-select
                        class="row q-ml-md"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        dense
                        outlined
                        ref="programRef"
                        :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Programa',
                        ]"
                        lazy-rules
                        v-model="form.programmaticArea.program"
                        :options="programs"
                        option-value="id"
                        option-label="name"
                        label="Programa"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Sem Resultados
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                      <div class="col q-ml-md">
                      <div class="row">
                        <span class="q-ml-md"
                          >Área de Mentoria</span
                        >
                      </div>
                      <q-select
                        class="col q-ml-md"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        dense
                        outlined
                        ref="programmaticAreaRef"
                        :rules="[
                          (val) =>
                            !!val || 'Por favor indicar a Área de Mentoria',
                        ]"
                        lazy-rules
                        v-model="form.programmaticArea"
                        :options="filterRedProgrammaticAreas"
                        option-value="id"
                        option-label="name"
                        @filter="filterProgrammaticAreas"
                        label="Área de Mentoria"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Sem Resultados
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                    </div>
                    <div class="row">
                      <div class="col q-ml-md">
                        <div class="row">
                          <span class="q-ml-md"
                            >Código</span
                          >
                        </div>
                    <div class="row q-my-sm">
                      <q-input
                      outlined
                      label="Código"
                      dense
                      ref="codeRef"
                      :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Código',
                        ]"
                      lazy-rules
                      class="col q-ml-md"
                      v-model="form.code"
                      @update:model-value="(value) => (filter = value)"
                      >
                      <template
                      v-slot:append
                      >
                      <q-icon
                          name="close"
                          @click="form.code = ''"
                          class="cursor-pointer"
                      />
                      </template>
                     </q-input>
                    </div>
                    </div>
                      <div class="col q-ml-md">
                        <div class="row">
                          <span class="q-ml-md"
                            >Nome</span
                          >
                        </div>
                    <div class="row q-my-sm">
                      <q-input
                      outlined
                      label="Nome"
                      dense
                      ref="nameRef"
                      :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Nome',
                        ]"
                      lazy-rules
                      class="col q-ml-md"
                      v-model="form.name"
                      @update:model-value="(value) => (filter = value)"
                      >
                      <template
                      v-slot:append
                      >
                      <q-icon
                          name="close"
                          @click="form.name = ''"
                          class="cursor-pointer"
                      />
                      </template>
                     </q-input>
                    </div>
                    </div>
                    </div>

                    <div class="row">
                      <div class="col q-ml-md">
                        <div class="row">
                          <span class="q-ml-md"
                            >Número de Observações de Consulta</span
                          >
                        </div>
                    <div class="row q-my-sm">
                    <q-input 
                      class="col q-ml-md" 
                      ref="targetPatientRef" 
                      :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Número de Observações de Consulta',
                        ]"
                      lazy-rules
                      v-model="form.targetPatient" 
                      type="number" 
                      :min="1">
                    </q-input>
                    </div>
                    </div>
                      <div class="col q-ml-md">
                        <div class="row">
                          <span class="q-ml-md"
                            >Número de Avaliação de Fichas</span
                          >
                        </div>
                    <div class="row q-my-sm">
                    <q-input 
                      class="col q-ml-md" 
                      ref="targetFileRef" 
                      :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Número de Avaliação de Fichas',
                        ]"
                      lazy-rules
                      v-model="form.targetFile" 
                      type="number" 
                      :min="1">
                    </q-input>
                    </div>
                    </div>
                    </div>

                    <div class="row q-my-sm">
                      <q-space />
                      <q-btn
                        label="Cancelar"
                        class="float-right"
                        color="red"
                        @click="cancel"
                      />
                      <q-btn
                        class="float-right q-ml-md"
                        type="submit"
                        label="Avançar"
                        color="primary"
                        @click="goToFormQuestions(form)"
                      />
                    </div>
                </div>
        </div>
    </div>
    <div v-if="isFormQuestionsDataVisible">
      <div class="q-ma-md page-container">
        <form @submit.prevent="submitForm" ref="myForm">
            <div class="page-input-container q-pa-md">
                <div class="q-mt-lg">
                  <div class="row items-center q-mb-md title">
                    <span class="q-pl-sm text-subtitle2">Competências Associadas à Tabela de Competências</span>
                    <div class="col q-my-sm">
                        <q-btn
                        flat
                        round
                        class="q-ml-md"
                        color="white"
                        icon="add_circle"
                        @click="showAddOrRemoveQuestions = true"
                        >
                        <q-tooltip class="bg-green-5">Adicionar Competências</q-tooltip>
                        </q-btn>
                    </div>
                  </div>
                </div>

                <div>
                    <q-table
                        class="col"
                        dense
                        :rows="searchResults"
                        :columns="columns"
                        row-key="id"
                        :filter="filter"
                        :key="tableKey"
                    >
                    <template v-slot:no-data="{ icon, filter }">
                        <div
                            class="full-width row flex-center text-primary q-gutter-sm text-body2"
                        >
                            <span> Sem resultados para visualizar </span>
                            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                        </div>
                        </template>
                        <template #body="props">
                            <q-tr :props="props">
                                <q-td key="sequence" :props="props">
                                   {{ props.row.sequence }}
                                </q-td>
                                <q-td key="code" :props="props">
                                    {{ props.row.question.code }}
                                </q-td>
                                <q-td key="questionType" :props="props">
                                    {{ props.row.question.questionType.description }}
                                </q-td>
                                <q-td key="questionCategory" :props="props">
                                  {{ props.row.question.questionCategory.category }}
                                </q-td>
                                <q-td key="question" :props="props">
                                    {{ props.row.question.question }}
                                </q-td>
                                <q-td key="options" :props="props">
                                <div class="col">
                                    <q-btn
                                    flat
                                    round
                                    class="q-ml-md"
                                    color="red"
                                    icon="close"
                                    @click="removeFormQuestions(props.row)"
                                    >
                                    <q-tooltip class="bg-green-5">Remover a Competência</q-tooltip>
                                    </q-btn>
                                </div>
                                </q-td>
                            </q-tr>
                            </template>
                    </q-table>
                </div>
                
             <div class="row q-my-sm">
                  <q-space />
                  <q-btn
                    label="Cancelar"
                    class="float-right"
                    color="red"
                    @click="cancel"
                  />
                  <q-btn
                    class="float-right q-ml-md"
                    type="submit"
                    :loading="submitLoading"
                    label="Terminar"
                    color="primary"
                    @click="saveOrUpdate(form)"
                  />
                </div>
            </div>
        </form>
    </div>
    </div>
    <q-dialog persistent v-model="showAddOrRemoveQuestions">
      <AddOrRemoveQuestions
        @close="showAddOrRemoveQuestions = false"
      />
    </q-dialog>
</template>
<script setup>
import { inject, ref, computed, onMounted, provide } from 'vue';
import Form from 'src/stores/model/form/Form';
import ProgrammaticArea from 'src/stores/model/programmaticArea/ProgrammaticArea';
import Program from 'src/stores/model/program/Program';
import User from 'src/stores/model/user/User';
import UsersService from 'src/services/api/user/UsersService';
import programService from 'src/services/api/program/programService';
import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
import formService from 'src/services/api/form/formService';
import formQuestionService from 'src/services/api/form/formQuestionService';

import AddOrRemoveQuestions from './AddOrRemoveQuestions.vue';

const form = ref(
  new Form({
    programmaticArea: new ProgrammaticArea({
          program: new Program(),
    }),
  })
);

const step = inject('step');
const filterRedProgrammaticAreas = ref([]);

const emit = defineEmits(['goToFormQuestions', 'close']);
const currUser = ref(new User());

//Ref's
const programRef = ref(null);
const programmaticAreaRef = ref(null);
const codeRef = ref(null);
const nameRef = ref(null);
const targetPatientRef = ref(null);
const targetFileRef = ref(null);
const isFormDataVisible = ref(false);
const isFormQuestionsDataVisible = ref(false);
const showAddOrRemoveQuestions = ref(false);
const tableKey = ref(0);

const searchResults = ref([]);

const existingFormQuestions = ref([]);

const addedFormQuestions = ref([]);

const removedFormQuestions = ref([]);

const columns = [
  {
    name: 'sequence',
    align: 'left',
    label: 'Seq',
    field: (row) => (row.sequence),
    sortable: false,
  },
  {
    name: 'code',
    align: 'left',
    label: 'Código',
    field: (row) => (row.question.code),
    sortable: false,
  },
  {
    name: 'questionType',
    align: 'left',
    label: 'Tipo de Avaliação',
    field: (row) => (row.question.questionType),
    sortable: false,
  },
  {
    name: 'questionCategory',
    align: 'left',
    label: 'Categoria',
    field: (row) => (row.question.questionCategory),
    sortable: false,
  },
  {
    name: 'question',
    align: 'left',
    label: 'Descrição',
    field: (row) => (row.question),
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

// Selected Form - edition step
const selectedForm = inject('selectedForm');
const isNewForm = inject('isNewForm');

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify((UsersService.getLogedUser())));
  initFormData();
});

const initFormData = () => {
   if(!isNewForm.value) {
    form.value = formService.getById(selectedForm.value.id);
   }
   selectedForm.value = null;
   removedFormQuestions.value = [];
   removedFormQuestions.value = [];
   isFormDataVisible.value = true;
   isFormQuestionsDataVisible.value = false;
};

const programs = computed(() => {
  return programService.piniaGetAll();
});

const programmaticAreas = computed(() => {
  if (
    form.value.programmaticArea.program !== null &&
    form.value.programmaticArea.program !== undefined
  ) {
    return programmaticAreaService.getProgrammaticAreasByProgramaId(
      form.value.programmaticArea.program.id
    );
  } else {
    return null;
  }
});

const filterProgrammaticAreas = (val, update, abort) => {
  const stringOptions = programmaticAreas;
  if (val === '') {
    update(() => {
      filterRedProgrammaticAreas.value = stringOptions.value.map(
        (programmaticArea) => programmaticArea
      );
    });
  } else if (stringOptions.value.length === 0) {
    update(() => {
        filterRedProgrammaticAreas.value = [];
    });
  } else {
    update(() => {
        filterRedProgrammaticAreas.value = stringOptions.value
        .map((programmaticArea) => programmaticArea)
        .filter((programmaticArea) => {
          return (
            programmaticArea &&
            programmaticArea.name.toLowerCase().indexOf(val.toLowerCase()) !== -1
          );
        });
    });
  }
};

const cancel = () => {
  selectedForm.value = null;
  isNewForm.value = true;
  emit('close');
};

const goToFormQuestions = (form) => {
  programRef.value.validate();
  programmaticAreaRef.value.validate();
  codeRef.value.validate();
  nameRef.value.validate();
  targetPatientRef.value.validate();
  targetFileRef.value.validate();

  if (
    !programRef.value.hasError &&
    !programmaticAreaRef.value.hasError &&
    !codeRef.value.hasError &&
    !nameRef.value.hasError &&
    !targetPatientRef.value.hasError &&
    !targetFileRef.value.hasError
  ) {
    const target_copy = Object.assign({}, form);
    if(!isNewForm.value) {
        searchFormQuestions(form);
    }
    addedFormQuestions.value = searchResults.value; 
    isFormDataVisible.value = false;
    isFormQuestionsDataVisible.value = true;
  }
};

const searchFormQuestions = (form) => {
    const params = {
        formId: form.id,
    }
    Object.keys(params).forEach( (key) => (params[key] === '') && delete params[key]);
    formQuestionService.search(params).then((response) => {
    searchResults.value = response.data;
    form.formQuestions = searchResults.value;
    }).catch((error) => {
        console.log(error);
      });
};

const removeFormQuestions = (formQuestion) => {
  const results = searchResults.value.filter((fQ) => {
    if(fQ.id === formQuestion.id) {
      removedFormQuestions.value.push(formQuestion);
    }
    return fQ.id !== formQuestion.id;
  });
  console.log(removedFormQuestions.value);
  searchResults.value = results;
};

const saveOrUpdate = (form) => {
  const params = {
        userId: currUser.value.id
    }
    Object.keys(params).forEach( (key) => (params[key] === '') && delete params[key]);
    form.addedFormQuestionDTOs = addedFormQuestions;
    form.removedFormQuestionDTOs = removedFormQuestions;
    formService.saveOrUpdate(params, form).then((response) => {
            //form.value = response.data;
            searchResults.value = form.formQuestions;
            }).catch((error) => {
                 console.log(error);
             });
}

provide('showAddOrRemoveQuestions', showAddOrRemoveQuestions);
provide('addedFormQuestions', addedFormQuestions);
provide('removedFormQuestions', removedFormQuestions);
provide('selectedForm', form);

</script>
<style lang="scss">
    .title {
        background-color: $primary;
    }
</style>