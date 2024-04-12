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
                      v-model="searchParams.question.questionCategory"
                      dense
                      outlined
                      ref="questionCategoryRef"
                      lazy-rules
                      :options="filterRedCategories"
                      option-value="id"
                      option-label="category"
                      @filter="filterCategories"
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
                
                <div class="q-mt-md">
                  <q-table
                      dense
                      flat
                      :rows="searchResults"
                      :columns="columns"
                      row-key="id">
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
                                class="col q-ml-md" 
                                ref="recodeCodeRef"
                                v-model="props.row.sequence" 
                                :rules="[
                                    (val) =>
                                      !!val || 'Por favor indicar o Codigo da Ficha',
                                  ]"
                                lazy-rules
                                @update:model-value="val => updateSequence(props.row, val)" 
                                type="number" 
                                :min="1">
                              </q-input>
                              </q-td>
                              <q-td key="evaluationType">
                                <q-select
                        class="col q-ml-md"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        dense
                        outlined
                        ref="evaluationTypeRef"
                        v-model="props.row.evaluationType" 
                        :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Tipo de Avaliação',
                        ]"
                        lazy-rules
                        option-value="id"
                        option-label="description"
                        :options="evaluationTypes"
                        @update:model-value="val => updateEvaluationType(props.row, val)" 
                        label="Tipo de Avaliação"
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
                      <q-td key="responseType">
                      <q-select
                        class="col q-ml-md"
                        use-input
                        hide-selected
                        fill-input
                        input-debounce="0"
                        dense
                        outlined
                        ref="responseTypeRef"
                        v-model="props.row.responseType" 
                        :rules="[
                          (val) =>
                            !!val || 'Por favor indicar o Tipo de Resposta',
                        ]"
                        lazy-rules
                        option-value="id"
                        option-label="description"
                        :options="responseTypes"
                        @update:model-value="val => updateResponseType(props.row, val)" 
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
                              <q-checkbox  v-model="props.row.selected"  @click="val => addQuestion(props.row)"/>
                              </div>
                    </q-td>
                    </q-tr>
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
                  @click="addSelectedQuestions()"
                />
              </div>
          </div>
    </div>
  </q-card>
</template>
<script setup>
import { inject, ref, computed, onMounted, provide } from 'vue';
import FormQuestion from 'src/stores/model/form/FormQuestion';
import Question from 'src/stores/model/question/Question';
import QuestionCategory from 'src/stores/model/question/QuestionCategory';
import ResponseType from 'src/stores/model/question/ResponseType';
import EvaluationType from 'src/stores/model/question/EvaluationType';
import questionService from 'src/services/api/question/questionService';
import questionCategoryService from 'src/services/api/question/questionCategoryService';
import responseTypeService from 'src/services/api/question/responseTypeService';
import evaluationTypeService from 'src/services/api/question/evaluationTypeService';
import { useSwal } from 'src/composables/shared/dialog/dialog';

const showAddOrRemoveQuestions = inject('showAddOrRemoveQuestions');

import { v4 as uuid } from 'uuid';

const selectedForm = inject('selectedForm');

const filterRedCategories = ref([]);

const { alertError } = useSwal();

const formQuestion = ref(
  new FormQuestion({
    question: new Question({
      questionCategory: new QuestionCategory(),
    }),
    evaluationType: new EvaluationType(),
    responseType: new ResponseType(),
  })
);

const searchParams = ref(new FormQuestion({
                              question: new Question({
                              questionCategory: new QuestionCategory(),
                         }),
                         evaluationType: new EvaluationType(),
                        }));

const searchResults = ref([]);

const addedFormQuestions = ref([]);

const categories = computed(() => {
  return questionCategoryService.piniaGetAll();
});

const responseTypes = computed(() => {
  return responseTypeService.piniaGetAll();
});

const evaluationTypes = computed(() => {
  return evaluationTypeService.piniaGetAll();
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

const searchQuestions = () => {
  const params = {
        code: searchParams.value.question.code,
        description: searchParams.value.question.question,
        categoryId: searchParams.value.question.questionCategory.id === undefined? undefined: searchParams.value.question.questionCategory.id
    }
    Object.keys(params).forEach( (key) => (params[key] === '') && delete params[key]);
    questionService.search(params).then((response) => {
    composeFormQuestions(response.data);
    }).catch((error) => {
        console.log(error);
      });
}

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
    name: 'evaluationType',
    align: 'left',
    label: 'Tipo de Avaliação',
    field: (row) => (row.evaluationType),
    sortable: false,
  },
  {
    name: 'responseType',
    align: 'left',
    label: 'Tipo de Resposta',
    field: (row) => (row.responseType),
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const composeFormQuestions = (questions) => {
  questions.forEach((question) => {
    let myUUID = uuid();
    const fQuestion = ref(new FormQuestion({
                              question: new Question({
                              questionCategory: new QuestionCategory(),
                                                     }),
                              evaluationType: new EvaluationType(),
                              responseType: new ResponseType(),
                                           })
                         );
       fQuestion.value.uuid = myUUID;
       fQuestion.value.question = question;
       fQuestion.value.question.questionCategory = question.questionCategory;
       searchResults.value.push(fQuestion.value);
  });
};

const updateSequence = (formQuestion, selectedValue) => {
  formQuestion.sequence = selectedValue;
}

const updateEvaluationType = (formQuestion, selectedValue) => {
  formQuestion.evaluationType = selectedValue;
}

const updateResponseType = (formQuestion, selectedValue) => {
  formQuestion.responseType = selectedValue;
}

const addQuestion = (formQuestion) => {
  const exists = addedFormQuestions.value.filter(val => val === formQuestion).length > 0;
  if(exists) {
    addedFormQuestions.value.pop(formQuestion);
    selectedForm.value.formQuestions.pop(formQuestion);
  } else {
    addedFormQuestions.value.push(formQuestion);
    selectedForm.value.formQuestions.push(formQuestion);
  }
}

const addSelectedQuestions = () => {
  addedFormQuestions.value.forEach((formQuestion) => {
    if(formQuestion.sequence===undefined || formQuestion.sequence==='') {
      alertError(
          'Indique a Sequência!'
        );
        return;
  }
  if(formQuestion.evaluationType === undefined || formQuestion.evaluationType === null) {
      alertError(
          'Indique o Tipo de Avaliação!'
        );
        return;
  }
  if(formQuestion.responseType === undefined || formQuestion.responseType === null) {
      alertError(
          'Indique o Tipo de Resposta!'
        );
        return;
  }
  });
  showAddOrRemoveQuestions.value = false;
}

</script>
<style lang="scss">
    .title {
        background-color: $primary;
    }
</style>src/stores/model/question/EvaluationType