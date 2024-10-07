<template>
  <q-card style="width: 85vw; max-width: 90vw;">
    <div class="page-container">
      <div>
        <q-banner dense inline-actions class="text-white bg-primary q-px-md">
          Pesquisa de Competências
          <template v-slot:action>
            <q-btn
              flat
              round
              class="q-ml-md"
              color="red"
              icon="close"
              @click="close"
            >
              <q-tooltip class="bg-green-5">Fechar</q-tooltip>
            </q-btn>
          </template>
        </q-banner>
        <div class="row q-pa-md q-mt-lg">
          <q-input
            outlined
            label="Código da Competência"
            dense
            ref="recordCodeRef"
            class="col"
            v-model="searchParams.question.code"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="searchParams.question.code = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-input
            outlined
            label="Descrição da Competência"
            dense
            ref="descriptionRef"
            class="col-6 q-ml-md"
            v-model="searchParams.question.question"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="searchParams.question.question = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-select
            class="col q-ml-md"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            v-model="searchParams.question.program"
            dense
            disable="true" 
            outlined
            ref="questionCategoryRef"
            :options="[selectedForm.programmaticArea.program]" 
            option-value="id"
            option-label="description"
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

          <q-space />
          <q-btn
            @click="searchQuestions()"
            class="q-ml-md q-mb-xs float-right"
            square
            color="primary"
            icon="search"
          >
            <q-tooltip class="bg-green-5">Pesquisar</q-tooltip>
          </q-btn>
          <q-btn
            @click="clearSearchParams"
            class="q-ml-md q-mb-xs float-right"
            square
            color="amber"
            icon="clear"
          >
            <q-tooltip class="bg-amber-5">Limpar</q-tooltip>
          </q-btn>
        </div>
        <div class="q-mx-md">
          <q-table
            class="col"
            flat
            dense
            wrap-cells
            :rows="searchResults"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :rows-per-page-options="[10, 20, 50, 100]"
            :loading="isLoading"
          >
            <template v-slot:no-data="{ icon, filter }">
              <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                <span> Sem resultados para visualizar </span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              </div>
            </template>

            <template #header="props">
              <q-tr class="text-left bg-grey-3" :props="props">
                <q-th style="width: 110px">{{ columns[0].label }}</q-th>
                <q-th class="col">{{ columns[1].label }}</q-th>
                <q-th style="width: 190px">{{ columns[2].label }}</q-th>
                <q-th style="width: 190px">{{ columns[3].label }}</q-th>
                <q-th style="width: 190px">{{ columns[4].label }}</q-th>
                <q-th style="width: 190px">{{ columns[5].label }}</q-th>
                <q-th style="width: 70px">{{ columns[6].label }}</q-th>
              </q-tr>
            </template>

            <template #body="props">
              <q-tr :props="props">
                <q-td key="code" :props="props">
                  {{ props.row.question.tableCode }}
                </q-td>
                <q-td key="question" :props="props">
                  {{ props.row.question.question }}
                </q-td>
                <q-td key="section">
                  <q-select
                    class="vertical-middle"
                    fill-input
                    input-debounce="0"
                    :disable="!props.row.selected"
                    dense
                    outlined
                    ref="evaluationTypeRef"
                    v-model="props.row.section"
                    :rules="[(val) => !!val || 'Por favor indicar a secção']"
                    lazy-rules
                    option-value="uuid" 
                    option-label="description" 
                    :options="selectedForm.formSections.map(section => section.section)" 
                  />


                </q-td>
                <q-td key="sequence" :props="props">
                  <q-input
                    ref="recodeCodeRef"
                    class="vertical-middle"
                    dense
                    outlined
                    :disable="!props.row.selected"
                    v-model="props.row.sequence"
                    :rules="[
                      (val) => !!val || 'Por favor indicar a Sequência na Ficha',
                    ]"
                    lazy-rules
                    :min="1"
                  />
                </q-td>
                <q-td key="evaluationType">
                  <q-select
                    class="vertical-middle"
                    fill-input
                    input-debounce="0"
                    :disable="!props.row.selected"
                    dense
                    outlined
                    ref="evaluationTypeRef"
                    v-model="props.row.evaluationType"
                    :rules="[
                      (val) => !!val || 'Por favor indicar o Tipo de Avaliação',
                    ]"
                    lazy-rules
                    option-value="id"
                    option-label="description"
                    :options="evaluationTypes"
                  />
                </q-td>
                <q-td key="responseType">
                  <q-select
                    class="vertical-middle"
                    fill-input
                    input-debounce="0"
                    dense
                    outlined
                    :disable="!props.row.selected"
                    ref="responseTypeRef"
                    v-model="props.row.responseType"
                    :rules="[
                      (val) => !!val || 'Por favor indicar o Tipo de Resposta',
                    ]"
                    lazy-rules
                    option-value="id"
                    option-label="description"
                    :options="responseTypes"
                  />
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-checkbox
                      v-model="props.row.selected"
                      @update:model-value="(val) => addQuestion(props.row, val)" 
                    />

                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="row q-ma-md">
          <q-space />
          <q-btn
            label="Fechar"
            class="float-right"
            color="red"
            @click="close"
          />
          <q-btn
            class="float-right q-ml-md"
            type="submit"
            label="Adicionar"
            color="primary"
            @click="addSelectedQuestions()"
          />
        </div>
      </div>
      <pre>{{ selectedForm }}</pre>
    </div>
  </q-card>
</template>

<script setup>
import { inject, ref, computed, watch, onMounted } from 'vue';
import FormQuestion from 'src/stores/model/form/FormQuestion';
import Question from 'src/stores/model/question/Question';
import QuestionCategory from 'src/stores/model/question/QuestionCategory';
import ResponseType from 'src/stores/model/question/ResponseType';
import EvaluationType from 'src/stores/model/question/EvaluationType';
import questionService from 'src/services/api/question/questionService';
import programService from 'src/services/api/program/programService';
import responseTypeService from 'src/services/api/question/responseTypeService';
import evaluationTypeService from 'src/services/api/question/evaluationTypeService';
import { Loading, QSpinnerRings } from 'quasar';
import { v4 as uuid } from 'uuid';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import Program from 'src/stores/model/program/Program';

// Inject dependencies
const selectedForm = inject('selectedForm');

const emit = defineEmits(['close']);

// Alert utility
const { alertSucess, alertError, alertWarningAction } = useSwal();

// Pagination state
const pagination = ref({
  page: 1, // The current page number
  rowsPerPage: 10, // Number of items per page
  totalItems: 0, // Total number of items in the result
});

// Search parameters state
const searchParams = ref(
  new FormQuestion({
    question: new Question({
      questionCategory: new QuestionCategory(),
      program: null,
    }),
    evaluationType: new EvaluationType(),
  })
);

// Search results (populated from API)
const searchResults = ref([]);

// Added form questions state
const addedFormQuestions = ref([]);

// Options for programs, response types, and evaluation types
const programs = computed(() => programService.piniaGetAll());
const responseTypes = computed(() => responseTypeService.piniaGetAll());

const evaluationTypes = computed(() => {
  const allEvaluationTypes = evaluationTypeService.piniaGetAll();

  if (selectedForm.value.targetFile === "0") {
    // Return only the option with code "Consulta"
    return allEvaluationTypes.filter((type) => type.code === "Consulta");
  } else if (selectedForm.value.targetPatient === "0") {
    // Return only the option with code "Ficha"
    return allEvaluationTypes.filter((type) => type.code === "Ficha");
  } else {
    // Return all options if no special conditions
    return allEvaluationTypes;
  }
});


// Flag to control initial search trigger
const isSearchInitialized = ref(false);

// Table columns definition
const columns = [
  { name: 'code', align: 'left', label: 'Código da Competência', field: (row) => row.tableCode },
  { name: 'question', align: 'left', label: 'Competência', field: (row) => row.question.question || '' },
  { name: 'section', align: 'left', label: 'Secção' },
  { name: 'sequence', align: 'left', label: 'Sequência' },
  { name: 'evaluationType', align: 'left', label: 'Tipo de Avaliação' },
  { name: 'responseType', align: 'left', label: 'Tipo de Resposta' },
  { name: 'options', align: 'left', label: 'Opções' },
];

onMounted(() => {
  if (selectedForm.value.programmaticArea && selectedForm.value.programmaticArea.program) {
    searchParams.value.question.program = selectedForm.value.programmaticArea.program;
  }
});

// Search function to fetch the list of questions based on search parameters and pagination
const searchQuestions = () => {
  Loading.show({ spinner: QSpinnerRings });

  const params = {
    code: searchParams.value.question.code,
    description: searchParams.value.question.question,
    programId: searchParams.value.question.program?.id,
    page: pagination.value.page - 1, // Adjust for 0-based pagination
    size: pagination.value.rowsPerPage, // Number of items per page
  };

  // Clean up empty parameters
  Object.keys(params).forEach((key) => params[key] === '' && delete params[key]);

  // Call the search service and handle the result
  questionService
    .search(params)
    .then((response) => {
      composeFormQuestions(response.data.content); // Assign the paginated content
      pagination.value.totalItems = response.data.totalElements; // Update total items for pagination
      Loading.hide();
    })
    .catch((error) => {
      Loading.hide();
      console.error(error);
    });
};

// Helper function to map API data to form questions
const composeFormQuestions = (questions) => {
  searchResults.value = [];
  
  questions.forEach((question) => {
    // Check if the question exists in either selectedForm or addedFormQuestions
    let existingFormQuestion = addedFormQuestions.value.find(
      (fq) => fq.question.uuid === question.uuid
    );

    // If the question already exists, use the existing data
    if (existingFormQuestion) {
      searchResults.value.push(existingFormQuestion);
    } else {
      // Otherwise, create a new FormQuestion object
      const fQuestion = ref(
        new FormQuestion({
          question: new Question({ program: new Program() }),
          evaluationType: new EvaluationType(),
          responseType: new ResponseType(),
        })
      );
      fQuestion.value.uuid = uuid(); // Assign a unique identifier
      fQuestion.value.question = question; // Set the question data
      searchResults.value.push(fQuestion.value); // Add to searchResults
    }
  });
};


// Watch for changes in pagination and trigger search only after the user initiates the first search
watch(pagination, () => {
  if (isSearchInitialized.value) {
    searchQuestions();
  }
});

// Function to initiate the search (from the user clicking a button)
const initiateSearch = () => {
  isSearchInitialized.value = true; // Mark that the user has initiated a search
  searchQuestions();
};

// Add selected questions to the form
const addSelectedQuestions = () => {
  if (addedFormQuestions.value.length === 0) {
    alertError('Selecione pelo menos uma competência que pretenda adicionar!');
    return;
  }

  const existingCombination = new Set();

  // First, iterate over all formSections in the selected form and populate the combination set
  selectedForm.value.formSections.forEach((formSection) => {
    formSection.formQuestions.forEach((formQuestion) => {
      const sectionId = formSection.section?.uuid || '';
      const sequence = formQuestion.sequence || '';
      const combinationKey = `${sectionId}-${sequence}`;
      existingCombination.add(combinationKey);
    });
  });

  // Now process the addedFormQuestions
  for (let formQuestion of addedFormQuestions.value) {
    if (!formQuestion.evaluationType?.uuid || !formQuestion.responseType?.uuid) {
      alertError('Preencha os campos obrigatórios antes de adicionar a competência!');
      return;
    }

    const sectionId = formQuestion.section?.uuid || '';
    const sequence = formQuestion.sequence || '';
    const combinationKey = `${sectionId}-${sequence}`;

    // Check if the combination of section and sequence already exists
    if (existingCombination.has(combinationKey)) {
      alertError(`A combinação da secção "${formQuestion.section?.description}" e sequência "${formQuestion.sequence}" já está em uso. Por favor, insira uma combinação única.`);
      return;
    }

    // Add combination to the set
    existingCombination.add(combinationKey);

    // Find the appropriate formSection in selectedForm to add the question
    const formSection = selectedForm.value.formSections.find(
      (section) => section.section?.uuid === formQuestion.section?.uuid
    );

    if (formSection) {
      formSection.formQuestions.push(formQuestion); // Add to the formSection's question list
    }
  }

  // Clear addedFormQuestions and searchResults after successful addition
  addedFormQuestions.value = [];
  searchResults.value = [];

  alertSucess('Competências adicionadas com sucesso!');
};





// Add a question to the list of selected questions
const addQuestion = (formQuestion, isSelected) => {
  const index = addedFormQuestions.value.findIndex(
    (fq) => fq.question.uuid === formQuestion.question.uuid
  );

  if (isSelected) {
    // If the formQuestion is selected and not already in the list, add it
    if (index === -1) {
      formQuestion.selected = true;
      addedFormQuestions.value.push(formQuestion);
    }
  } else {
    // If the formQuestion is unselected, show warning before removing it
    if (index !== -1) {
      alertWarningAction('Tem certeza de que deseja remover esta competência?')
        .then(async (result) => {
          if (result) {
            // Remove formQuestion if the user confirms
            formQuestion.selected = false;

            // Reset the fields of the formQuestion
            formQuestion.section = null;
            formQuestion.sequence = null;
            formQuestion.evaluationType = null;
            formQuestion.responseType = null;

            // Remove from the list
            addedFormQuestions.value.splice(index, 1);
          } else {
            // Keep the checkbox selected if the user cancels
            formQuestion.selected = true;
          }
        })
        .catch((error) => {
          // Show error message if something goes wrong
          alertError('Ocorreu um erro ao tentar remover a competência');
          console.error(error);
        });
    }
  }
};

const close =()=> {
  emit('close');
}


// Clear search parameters
const clearSearchParams = () => {
  searchResults.value.length = 0;
};

</script>



<style lang="scss">
.title {
  background-color: $primary;
}
</style>
