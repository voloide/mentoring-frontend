<template>
    <div class="q-pt-sm" style="height: 100%;">
        <div class="q-ma-md q-pa-md page-container">
            <div class="row">
              <q-select
                class="col"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                @update:model-value="onChangePrograma(val)"
                dense
                outlined
                ref="programRef"
                lazy-rules
                v-model="searchParams.program"
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
              <q-select
                class="col q-ml-md"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                dense
                outlined
                ref="programmaticAreaRef"
                lazy-rules
                v-model="searchParams.programmaticArea"
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

                <q-input
                    outlined
                    label="Código"
                    dense
                    ref="codeRef"
                    class="col q-ml-md"
                    v-model="searchParams.code"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="searchParams.code = ''"
                        class="cursor-pointer"
                    />
                    </template>
                </q-input>

                <q-input
                    outlined
                    label="Nome"
                    dense
                    ref="nameRef"
                    class="col q-ml-md"
                    v-model="searchParams.name"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="searchParams.name = ''"
                        class="cursor-pointer"
                    />
                    </template>
                </q-input>
                <q-space />
                <q-btn
                   
                    @click="search"
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
            <div class=" q-mt-lg q-mb-md">
                <div class="row items-center q-mb-md">
                    <q-icon name="search" size="sm" />
                    <span class="q-pl-sm text-subtitle2">Resultado da Pesquisa</span>
                </div>
             <q-separator color="pink-13" size="1px" />
            </div>
            <div>
                <q-table
                    class="col"
                    dense
                    :rows="searchResults"
                    :columns="columns"
                    row-key="id"
                    :filter="filter"
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
                            <q-td key="code" :props="props">
                                {{ props.row.code }}
                            </q-td>
                            <q-td key="name" :props="props">
                                {{ props.row.name }}
                            </q-td>
                            <q-td key="programmaticArea" :props="props">
                                {{ props.row.programmaticArea.name }}
                            </q-td>
                            <q-td key="options" :props="props">
                            <div class="col">
                                <q-btn
                                flat
                                round
                                class="q-ml-md"
                                :color='isActive(props.row) ? "green" : "red"'
                                icon="circle"
                                @click="confirmFormLifeCycleChange(props.row)"
                                >
                                <q-tooltip class="bg-green-5">{{ isActive(props.row) ? 'Inactivar Tabela de Competências' : 'Activar Tabela de Competências'}}</q-tooltip>
                                </q-btn>

                                <q-btn
                                flat
                                round
                                class="q-ml-md"
                                color="yellow-9"
                                icon="edit"
                                @click="editForm(props.row)"
                                >
                                <q-tooltip class="bg-green-5">Editar Tabela de Competências</q-tooltip>
                                </q-btn>
                            </div>
                            </q-td>
                        </q-tr>
                        </template>
                </q-table>
            </div>

            <q-page-sticky position="bottom-right" :offset="[20, 30]" class="row">
                    <q-btn round color="primary" icon="add" @click="$emit('create', true)">
                      <q-tooltip class="bg-green-5">Adicionar Nova Tabela de Competências</q-tooltip>
                    </q-btn>
            </q-page-sticky>
        </div>
    </div>
</template>
<script setup>
import { inject, ref, computed, onMounted, reactive } from 'vue';
import Form from 'src/stores/model/form/Form';
import ProgrammaticArea from 'src/stores/model/programmaticArea/ProgrammaticArea';
import Program from 'src/stores/model/program/Program';
import User from 'src/stores/model/user/User';
import UsersService from 'src/services/api/user/UsersService';
import programService from 'src/services/api/program/programService';
import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
import formService from 'src/services/api/form/formService';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import useForm from 'src/composables/form/formMethods'

const searchParams = ref({
        code: '',
        name: '',
        program: new Program(),
        programmaticArea: new ProgrammaticArea()
});
const step = inject('step');
const searchResults = ref([]);
const selectedForm = reactive(ref(''));
const isNewForm = ref(false);
const filterRedProgrammaticAreas = ref([]);
const { alertError, alertSucess, alertWarningAction } = useSwal();
const { createDTOFromForm } = useForm();

const columns = [
  {
    name: 'code',
    align: 'left',
    label: 'Código',
    sortable: false,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nome',
    field: (row) => (row.name),
    sortable: false,
  },
  {
    name: 'programmaticArea',
    align: 'left',
    label: 'Área de Mentoria',
    field: (row) => (row.programmaticArea.name),
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const emit = defineEmits(['goToForms']);
const currUser = ref(new User());

onMounted(() => {
    currUser.value = JSON.parse(JSON.stringify((UsersService.getLogedUser())));
});

const programs = computed(() => {
  return programService.piniaGetAll();
});

const programmaticAreas = computed(() => {
  if (
    searchParams.value.program !== null &&
    searchParams.value.program !== undefined
  ) {
    return programmaticAreaService.getProgrammaticAreasByProgramaId(
      searchParams.value.program.id
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

const onChangePrograma = () => {
  searchParams.value.program = '';
};


const isActive =(form)=>{
  return form.lifeCycleStatus === 'ACTIVE';
};

const confirmFormLifeCycleChange =(form)=> {
  var msg = '';
  if (form.lifeCycleStatus === 'ACTIVE') {
    msg = 'Confirma inactivar a tabela de competências?';
  } else {
    msg = 'Confirma activar a tabela de competências?';
  }

  alertWarningAction(
                      msg
                    ).then((result) => {
                    if (result) {
                      changeLifeCycle(form)
                    }
                    });
};
const changeLifeCycle =(form)=> {
  if (form.lifeCycleStatus === 'ACTIVE') {
    form.lifeCycleStatus = 'INACTIVE'
  } else {
    form.lifeCycleStatus = 'ACTIVE'
  }
  formService.changeLifeCycleStatus(createDTOFromForm(form)).then((resp) => {
    alertSucess('Operação efectuada com sucesso');
    formService.update(form);
  })
  .catch((error) => {
    if (form.lifeCycleStatus === 'ACTIVE') {
      form.lifeCycleStatus = 'INACTIVE'
    } else {
      form.lifeCycleStatus = 'ACTIVE'
    }
    console.log('Error', error.message);
    alertError('Ocorreu um erro inesperado nesta operação.');
  });
};

const editForm = (form) => {
  selectedForm.value = form;
  isNewForm.value = false;
  emit('goToForms', selectedForm.value);
}

const search = () => {
  formService.deleteAllFromStorage();
    const params = {
        code: searchParams.value.code,
        name: searchParams.value.name,
        program: searchParams.value.program.uuid,
        programmaticAreaCode: searchParams.value.programmaticArea.code
    }
    Object.keys(params).forEach( (key) => (params[key] === '') && delete params[key]);

    formService.search(params).then((response) => {
        searchResults.value = formService.getFormList();
    }).catch((error) => {
        console.log(error);
      });
};

const clearSearchParams = () => {
  selectedForm= ref('');
  formService.deleteAllFromStorage();
  searchResults.value = [];
};
</script>