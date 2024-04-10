<template>
  <q-card style="width: 85vw; max-width: 90vw;">
        <div class="page-container">
          <q-banner dense inline-actions class="text-white bg-primary q-px-md">
            Pesquisa de Competências
            <template v-slot:action>
              <q-btn
                flat
                round
                class="q-ml-md"
                color="red"
                icon="close"
                @click="showAddOrRemoveQuestions = false"
                >
                <q-tooltip class="bg-green-5">Pesquisa de Competências</q-tooltip>
                </q-btn>
            </template>
          </q-banner>
                <div class="page-input-container q-pa-md q-mt-lg">
                    <div class="row">
                      <q-input
                          outlined
                          label="Código"
                          dense
                          ref="codeRef"
                          class="col"
                          v-model="searchParams.question.code"
                          @update:model-value="(value) => (filter = value)"
                      >
                          <template
                          v-slot:append
                          >
                          <q-icon
                              name="close"
                              @click="searchParams.question.code = ''"
                              class="cursor-pointer"
                          />
                          </template>
                      </q-input>
      
                      <q-input
                          outlined
                          label="Código na Ficha"
                          dense
                          ref="recordCodeRef"
                          class="col q-ml-md"
                          v-model="searchParams.sequence"
                          @update:model-value="(value) => (filter = value)"
                      >
                          <template
                          v-slot:append
                          >
                          <q-icon
                              name="close"
                              @click="searchParams.sequence = ''"
                              class="cursor-pointer"
                          />
                          </template>
                      </q-input>

                      <q-input
                          outlined
                          label="Descrição"
                          dense
                          ref="descriptionRef"
                          class="col q-ml-md"
                          v-model="searchParams.question.question"
                          @update:model-value="(value) => (filter = value)"
                      >
                          <template
                          v-slot:append
                          >
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
                      dense
                      outlined
                      ref="questionCategoryRef"
                      lazy-rules
                      :options="filterCategories"
                      option-value="id"
                      option-label="category"
                      @filter="filterRedCategories"
                      label="Categoria"
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
                         
                          @click="filterQuestions()"
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
                
                <div class="q-mt-md">
                  <q-table
                      dense
                      flat
                      :rows="searchResults"
                      :columns="columns"
                      row-key="id"
                      :filter="filter">
                    <template #header="props">
                      <q-tr class="text-left bg-grey-3" :props="props">
                        <q-th style="width: 100px;">{{ columns[0].label }}</q-th>
                        <q-th style="width: 160px;">{{ columns[1].label }}</q-th>
                        <q-th style="width: 160px;">{{ columns[2].label }}</q-th>
                        <q-th style="width: 190px;">{{ columns[3].label }}</q-th>
                        <q-th style="width: 190px;">{{ columns[4].label }}</q-th>
                        <q-th style="width: 60px;">{{ columns[5].label }}</q-th>
                        <q-th style="width: 70px;">{{ columns[6].label }}</q-th>
                      </q-tr>
                    </template>
                    <template v-slot:no-data="{ icon, filter }">
                      <div class="full-width row flex-center text-primary q-gutter-sm text-body2"  >
                          <span> Sem resultados para visualizar </span>
                          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                      </div>
                    </template>
                    <template #body="props">
                            <q-tr :props="props">
                                <q-td key="code" :props="props">
                                  {{ props.row.question.code }}
                                </q-td>
                                <q-td key="questionCategory" :props="props">
                                  {{ props.row.question.questionCategory.category }}
                                </q-td>
                                <q-td key="question" :props="props">
                                 {{ props.row.question.question }}
                                </q-td>
                                <q-td key="sequence" :props="props">
                                  <q-input 
                                  outlined
                                  dense
                                  :disable="!props.row.selected"
                                    v-model="props.row.sequence"
                                  ref="recodeCodeRef" 
                                  :rules="[
                                      (val) =>
                                        !!val || 'Por favor indicar o Codigo da Ficha',
                                    ]"
                                  lazy-rules
                                  type="number" 
                                  :min="1">
                                </q-input>
                                </q-td>
                                <q-td key="questionType">
                                  <q-select
                                    use-input
                                    hide-selected
                                    fill-input
                                    :disable="!props.row.selected"
                                    dense
                                    outlined
                                    v-model="props.row.assessmentType"
                                    ref="questionTypeRef"
                                    :rules="[
                                      (val) =>
                                        !!val || 'Por favor indicar o Tipo de Avaliação',
                                    ]"
                                    lazy-rules
                                    :options="accessmentTypes"
                                    option-value="id"
                                    option-label="description"
                                    label="Tipo de Avaliação"
                                  />
                                </q-td>
                        <q-td key="responseType">
                        <q-select
                          use-input
                          hide-selected
                          :disable="!props.row.selected"
                          fill-input
                          input-debounce="0"
                          dense
                          outlined
                          v-model="props.row.anwserType"
                          ref="responseTypeRef"
                          :rules="[
                            (val) =>
                              !!val || 'Por favor indicar o Tipo de Resposta',
                          ]"
                          lazy-rules
                          option-value="id"
                          option-label="name"
                          @filter="responseTypes"
                          label="Tipo de Resposta"
                        >
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                Sem Resultados
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </q-td>
                      <q-td key="options" :props="props">
                        <div class="col">
                          <q-checkbox
                            v-model="props.row.selected"
                            @click="addQuestion(props.row)"
                            >
                          </q-checkbox>
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
                  @click="showAddOrRemoveQuestions = false"
                />
                <q-btn
                  class="float-right q-ml-md"
                  type="submit"
                  label="Adicionar Seleccionadas"
                  color="primary"
                />
              </div>
          </div>
    </div>
  </q-card>
</template>
<script setup>
import { inject, ref, computed, onMounted } from 'vue';
import FormQuestion from 'src/stores/model/form/FormQuestion';
import Question from 'src/stores/model/question/Question';
import QuestionCategory from 'src/stores/model/question/QuestionCategory';
import QuestionType from 'src/stores/model/question/QuestionType';
import questionService from 'src/services/api/question/questionService';
import questionCategoryService from 'src/services/api/question/questionCategoryService';
import responseTypeService from 'src/services/api/question/responseTypeService';
import questionTypeService from 'src/services/api/question/questionTypeService';

const showAddOrRemoveQuestions = inject('showAddOrRemoveQuestions');

const selectedForm = inject('selectedForm');
const addedFormQuestions = inject('addedFormQuestions');
const removedFormQuestions = inject('removedFormQuestions');

const filterRedCategories = ref([]);

const accessmentTypes = ref([{
                              id: 1,
                              description: "Avaliação de Ficha"
                            },
                            {
                              id: 2,
                              description: "Observação de Consulta"
                            },
                            {
                              id: 3,
                              description: "Ambos"
                            }])

const formQuestion = ref(
  new FormQuestion({
    question: new Question({
      questionType: new QuestionType(),
      questionCategory: new QuestionCategory(),
    }),
  })
);

const searchParams = ref(new FormQuestion({
                              question: new Question({
                              questionType: new QuestionType(),
                              questionCategory: new QuestionCategory(),
                         }),
                        }));

const searchResults = ref([]);

const questions = computed(() => {
  return questionService.piniaGetAll();
});

const categories = computed(() => {
  return questionCategoryService.piniaGetAll();
});

const responseTypes = computed(() => {
  return responseTypeService.piniaGetAll();
});

const questionTypes = computed(() => {
  return questionTypeService.piniaGetAll();
});

const filterCategories = (val, update, abort) => {
  const stringOptions = categories;
  if (val === '') {
    update(() => {
      filterRedCategories.value = stringOptions.value.map(
        (questionCategory) => questionCategory
      );
    });
  } else if (stringOptions.value.length === 0) {
    update(() => {
      filterRedCategories.value = [];
    });
  } else {
    update(() => {
      filterRedCategories.value = stringOptions.value
        .map((questionCategory) => questionCategory)
        .filter((questionCategory) => {
          return (
            questionCategory &&
            questionCategory.category.toLowerCase().indexOf(val.toLowerCase()) !== -1
          );
        });
    });
  }
};

const columns = [
  {
    name: 'code',
    align: 'left',
    label: 'Código',
    field: (row) => (row.question.code),
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
  {
    name: 'sequence',
    align: 'left',
    label: 'Sequência/Código da Ficha',
    field: (row) => (row.sequence),
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
    name: 'responseType',
    align: 'left',
    label: 'Tipo de Resposta',
    field: (row) => (row.question.responseType),
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

onMounted(() => {
  initFormData();
});

const initFormData = () => {
   composeFormQuestions();
};

const composeFormQuestions = () => {
  questions.value.forEach((question) => {
    const fQuestion = new FormQuestion({
                              question: new Question({
                              questionType: new QuestionType(),
                              questionCategory: new QuestionCategory(),
                                                     }),
                                           });
       fQuestion.question = question;
       fQuestion.question.questionType = question.questionType;
       fQuestion.question.questionCategory = question.questionCategory;
       searchResults.value.push(fQuestion);
  });
};

const filterQuestions = () => {
  if(!searchParams.value.question.question) {
    console.log(searchParams.value.question.question);
  }
  console.log(``);
}

const addQuestion = (formQuestion) => {
  const {proxy, revoke} = Proxy.revocable(formQuestion, {});
  formQuestion.selected = !formQuestion.selected
  proxy.selected = !proxy.selected;
}

</script>
<style lang="scss">
    .title {
        background-color: $primary;
    }
</style>