<template>
  <q-card style="width: 85vw; max-width: 90vw;">
    <div class="page-container">
      <div>
        <q-banner dense inline-actions class="text-white bg-primary q-px-md">
          Pesquisa de Competências do {{ selectedForm.programmaticArea.program.description }}
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

        <div class="q-ma-md">
          <q-table
            class="col"
            flat
            dense
            wrap-cells
            :rows="searchResults"
            :columns="columns"
            ref="tableRef"
            row-key="id"
            v-model:pagination="pagination"
            :rows-per-page-options="[5, 10, 20, 50, 100]"
            :loading="loading"
            @request="onRequest"
          >
            <template v-slot:no-data="{ icon, filter }">
              <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                <span> Sem resultados para visualizar </span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              </div>
            </template>

            <template #header="props">
              <q-tr class="text-left text-white bg-teal-7" :props="props">
                <q-th style="width: 110px">{{ columns[0].label }}</q-th>
                <q-th class="col">{{ columns[1].label }}</q-th>
                <q-th style="width: 70px">{{ columns[2].label }}</q-th>
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
            <template v-slot:loading>
              <q-inner-loading showing color="primary"></q-inner-loading>
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
    </div>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import FormSectionQuestion from 'stores/model/form/FormSectionQuestion';
import Question from 'src/stores/model/question/Question';
import ResponseType from 'src/stores/model/question/ResponseType';
import EvaluationType from 'src/stores/model/question/EvaluationType';
import questionService from 'src/services/api/question/questionService';
import { Loading, QSpinnerRings } from 'quasar';
import { v4 as uuid } from 'uuid';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import Program from 'src/stores/model/program/Program';


const props = defineProps(['searchParams', 'formSection', 'selectedForm']);
const emit = defineEmits(['close','addSelectedQuestions']);

// Alert utility
const { alertSucess, alertError, alertWarningAction } = useSwal();

const loading = ref(false);
// Pagination state
const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })
const tableRef = ref()
// Create a local copy of searchParams
const localSearchParams = ref({ ...props.searchParams });

// Watch for changes in the prop and update the local copy accordingly
watch(() => props.searchParams, (newSearchParams) => {
  localSearchParams.value = { ...newSearchParams };
});

// Search results (populated from API)
const searchResults = ref([]);

// Added form questions state
const addedFormQuestions = ref([]);
// Flag to control initial search trigger
const isSearchInitialized = ref(false);
// Table columns definition
const columns = [
  { name: 'code', align: 'left', label: 'Código da Competência', field: (row) => row.tableCode },
  { name: 'question', align: 'left', label: 'Competência', field: (row) => row.question.question || '' },
  { name: 'options', align: 'left', label: 'Opções' },
];


onMounted(() => {
  if (props.selectedForm?.programmaticArea?.program) {
    localSearchParams.value.question.program = props.selectedForm.programmaticArea.program;
    if (tableRef.value?.requestServerInteraction) {
      tableRef.value.requestServerInteraction();
    }
  } else {
    console.error('selectedForm or programmaticArea is not defined or empty');
  }
});

// Search function to fetch the list of questions based on search parameters and pagination
const searchQuestions = () => {
  loading.value = true;
  const params = {
    code: localSearchParams.value.question.code || '',
    description: localSearchParams.value.question.question || '',
    programId: localSearchParams.value.question.program?.id,
    page: pagination.value.page - 1, // API uses 0-based page index
    size: pagination.value.rowsPerPage,
  };

  // Remove empty parameters
  Object.keys(params).forEach((key) => !params[key] && delete params[key]);

  questionService
    .search(params)
    .then((response) => {
      composeFormQuestions(response.data.content);
      pagination.value.rowsNumber = response.data.totalSize;
    })
    .catch((error) => {
      console.error(error);
      alertError('Erro ao buscar dados. Por favor, tente novamente.');
    })
    .finally(() => {
      loading.value = false; // Always hide loading spinner
    });
};


// Helper function to map API data to form questions
const composeFormQuestions = (questions) => {
  searchResults.value = [];

  questions.forEach((question) => {
    // Check if the question exists in either selectedForm or addedFormQuestions
    const fQuestion = ref(
        new FormSectionQuestion({
          question: new Question({ program: new Program() }),
          evaluationType: new EvaluationType(),
          responseType: new ResponseType(),
        })
      );
      fQuestion.value.uuid = uuid(); // Assign a unique identifier
      fQuestion.value.question = question; // Set the question data
      searchResults.value.push(fQuestion.value); // Add to searchResults

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

const close =()=> {
  emit('close');
}

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
      formQuestion.selected = false;
      // Reset the fields of the formQuestion
      formQuestion.section = null;
      formQuestion.sequence = null;
      formQuestion.evaluationType = null;
      formQuestion.responseType = null;

      // Remove from the list
      addedFormQuestions.value.splice(index, 1);
    }
  }
};

// Add selected questions to the form
const addSelectedQuestions = () => {
  if (addedFormQuestions.value.length === 0) {
    alertError('Selecione pelo menos uma competência que pretenda adicionar!');
    return;
  }

  emit('addSelectedQuestions', addedFormQuestions)

  // Clear addedFormQuestions and searchResults after successful addition
  addedFormQuestions.value = [];
  searchResults.value = [];

};
const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  // Update pagination state
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  // Fetch data based on the updated pagination
  searchQuestions();
};

</script>



<style lang="scss">
.title {
  background-color: $primary;
}
</style>
