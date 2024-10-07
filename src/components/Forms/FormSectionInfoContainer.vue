<template>
    <div>
        <div class="q-mt-lg">
            <q-banner dense inline-actions class="text-white bg-teal-7 q-px-sm">
              Secção:  <span style="color: amber-10;">{{ formSection.section.description }}</span>
              <template>
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
              </template>
              <template v-slot:action>
                <q-input
                    outlined
                    label="Código da Competência"
                    dense
                    ref="recordCodeRef"
                    class="col"
                    bg-color="white"
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
                    bg-color="white"
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
                <q-btn
                  flat
                  round
                  dense
                  size="md"
                  class="q-ml-md"
                  color="orange-4"
                  icon="add"
                  @click="initNewQuestion"
                />
                <q-btn
                  flat
                  round
                  dense
                  size="md"
                  class="q-ml-md"
                  color="orange-4"
                  icon="keyboard_arrow_up"
                  @click="expandCollapse"
                />
              </template>
            </q-banner>
          </div>

          <div class="q-mt-none" v-if="formSection.formQuestions.length <= 0">
            <q-banner dense inline-actions class="text-white bg-yellow-7 q-px-sm">
              Nenhuma Competência associada a esta Secção.
            </q-banner>
          </div>

          <q-table
              class="col"
              v-if="formSection.formQuestions.length > 0"
              dense
              flat
              wrap-cells
              :rows="formSection.formQuestions"
              :columns="columns"
              row-key="uuid"
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
                    <q-th style="width: 120px">{{ columns[2].label }}</q-th>
                    <q-th style="width: 190px">{{ columns[3].label }}</q-th>
                    <q-th style="width: 190px">{{ columns[4].label }}</q-th>
                    <q-th style="width: 90px">{{ columns[5].label }}</q-th>
                </q-tr>
            </template>
              <!-- Body Template for Competency Questions -->
              <template #body="props">
                  <q-tr :props="props">
                      <q-td key="code" :props="props">
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
                          {{ props.row.question.tableCode }}
                      </q-td>
                      <q-td key="question" :props="props">
                          {{ props.row.question.question }}
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
                          {{ props.row.sequence }}
                      </q-td>
                      <q-td key="evaluationType" :props="props">
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
                          {{ props.row.evaluationType.description }}
                      </q-td>
                      <q-td key="responseType" :props="props">
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
                          {{ props.row.responseType.description }}
                      </q-td>
                      <q-td key="options" :props="props">
                          <q-btn
                              flat
                              round
                              color="red"
                              icon="close"
                              @click="removeFormQuestions(props.row)"
                          >
                              <q-tooltip class="bg-green-5">Remover a Competência</q-tooltip>
                          </q-btn>
                      </q-td>
                  </q-tr>
              </template>
          </q-table>
          <pre>{{ formSection }}</pre>
          <!-- Dialog for Adding or Removing Questions -->
          <q-dialog persistent v-model="showAddOrRemoveQuestions">
              <AddOrRemoveQuestions @close="showAddOrRemoveQuestions = false" :formSection="formSection"/>
          </q-dialog>
    </div>
</template>

<script setup>
import AddOrRemoveQuestions from './AddOrRemoveQuestions.vue';
import FormQuestion from 'src/stores/model/form/FormQuestion';
import Question from 'src/stores/model/question/Question';
import EvaluationType from 'src/stores/model/question/EvaluationType';
import Program from 'src/stores/model/program/Program';
import ResponseType from 'src/stores/model/question/ResponseType';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { reactive, watch, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import QuestionCategory from 'src/stores/model/question/QuestionCategory';


// Props passed to the component
const props = defineProps(['formSection', 'selectedForm']);
const emit = defineEmits(['update-section', 'remove-section']);

const searchParams = ref(
  new FormQuestion({
    question: new Question({
      questionCategory: new QuestionCategory(),
      program: null,
    }),
    evaluationType: new EvaluationType(),
  })
);
// Create a reactive copy of formSection
const localFormSection = reactive({ ...props.formSection });

// Watch for changes in the prop and update the local copy if needed
watch(() => props.formSection, (newValue) => {
  Object.assign(localFormSection, newValue); // Sync the local copy with the updated prop
});

// Question Table Columns
const columns = [
  { name: 'code', align: 'left', label: 'Código da Competência', field: (row) => row.tableCode },
  { name: 'question', align: 'left', label: 'Competência', field: (row) => row.question.question || '' },
  { name: 'sequence', align: 'left', label: 'Sequência' },
  { name: 'evaluationType', align: 'left', label: 'Tipo de Avaliação' },
  { name: 'responseType', align: 'left', label: 'Tipo de Resposta' },
  { name: 'options', label: 'Opções', field: 'options' },
];

// Flag for showing the AddOrRemoveQuestions dialog
const showAddOrRemoveQuestions = ref(false);

// Initialize a new form question
const initNewQuestion = () => {
  const newQuestion = new FormQuestion({
    uuid: uuidv4(),
    question: new Question({ program: new Program() }),
    evaluationType: new EvaluationType(),
    responseType: new ResponseType(),
  });

  localFormSection.formQuestions.unshift(newQuestion);
  emit('update-section', localFormSection); // Emit updated section
};

// Remove a question from the form section
const removeFormQuestions = (question) => {
  localFormSection.formQuestions = localFormSection.formQuestions.filter(
    (q) => q.uuid !== question.uuid
  );
  emit('update-section', localFormSection); // Emit updated section
};


</script>

<style lang="scss">
</style>
