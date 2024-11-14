<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container">
      <div>
        <q-table
          class="col"
          dense
          :rows="searchResults"
          :columns="columns"
          v-model:pagination="pagination"
          :rows-per-page-options="[10, 20, 50, 100]"
          row-key="id"
          :filter="filter"
          @request="onRequest"
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
                <span
                  v-if="
                    props.row.id === null ||
                    selectedPogrammaticArea.id === props.row.id
                  "
                >
                  <q-input
                    outlined
                    label="Code"
                    dense
                    ref="codeRef"
                    class="col"
                    v-model="data.code"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click="data.code = ''"
                        class="cursor-pointer"
                      />
                    </template> </q-input
                ></span>
                <span v-else>
                  {{ props.row.code }}
                </span>
              </q-td>
              <q-td key="name" :props="props">
                <span
                  v-if="
                    props.row.id === null ||
                    selectedPogrammaticArea.id === props.row.id
                  "
                  ><q-input
                    outlined
                    label="Nome"
                    dense
                    ref="nameRef"
                    class="col"
                    v-model="data.name"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click="data.name = ''"
                        class="cursor-pointer"
                      />
                    </template> </q-input
                ></span>
                <span v-else>
                  {{ props.row.name }}
                </span>
              </q-td>
              <q-td key="description" :props="props">
                <span
                  v-if="
                    props.row.id === null ||
                    selectedPogrammaticArea.id === props.row.id
                  "
                >
                  <q-input
                    outlined
                    label="Descrição"
                    dense
                    ref="descriptionRef"
                    class="col q-ml-md"
                    v-model="data.description"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click="data.description = ''"
                        class="cursor-pointer"
                      />
                    </template> </q-input
                ></span>
                <span v-else>
                  {{ props.row.description }}
                </span>
              </q-td>
              <q-td key="program" :props="props">
                <span
                  v-if="
                    props.row.id === null ||
                    selectedPogrammaticArea.id === props.row.id
                  "
                >
                  <q-select
                    class="row"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    dense
                    outlined
                    ref="programRef"
                    lazy-rules
                    v-model="data.program"
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
                </span>
                <span v-else>
                  {{ props.row.program.name }}
                </span>
              </q-td>

              <q-td key="options" :props="props">
                <div class="col">
                  <span v-if="props.row.id === null">
                    <q-btn
                      @click="submitForm"
                      class="q-ml-md q-mb-xs float-right"
                      square
                      color="primary"
                      icon="save"
                    >
                      <q-tooltip class="bg-green-5">Salvar</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="closeForm"
                      class="q-ml-md q-mb-xs float-right"
                      square
                      color="amber"
                      icon="close"
                    >
                      <q-tooltip class="bg-amber-5">Fechar</q-tooltip>
                    </q-btn>
                  </span>
                  <span v-else>
                    <q-btn
                      v-if="selectedPogrammaticArea.id !== props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="green-8"
                      icon="edit"
                      @click="editPogrammaticArea(props.row)"
                    >
                      <q-tooltip class="bg-green-5"
                        >Detalhar/Editar Program</q-tooltip
                      >
                    </q-btn>
                    <q-btn
                      v-if="selectedPogrammaticArea.id === props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="green-8"
                      icon="done"
                      @click="saveUpdate(props.row)"
                    >
                      <q-tooltip class="bg-green-5"
                        >Guardar Alteração</q-tooltip
                      >
                    </q-btn>
                    <q-btn
                      v-if="selectedPogrammaticArea.id === props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="red-8"
                      icon="close"
                      @click="resetFields()"
                    >
                      <q-tooltip class="bg-green-5"
                        >Descartar Alteração</q-tooltip
                      >
                    </q-btn>
                    <q-btn
                      v-if="selectedPogrammaticArea.id !== props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="red-8"
                      icon="delete"
                      @click="deleteProgrammaticArea(props.row.id)"
                    ></q-btn>
                  </span>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <q-page-sticky position="bottom-right" :offset="[20, 30]" class="row">
        <q-fab
            color="primary"
            glossy
            icon="add"
            @click="addNewRow()"
        />
      </q-page-sticky>
    </div>
  </div>
</template>

<script setup>
import User from 'src/stores/model/user/User';
import { onMounted, ref } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
import programService from 'src/services/api/program/programService';
import { computed } from 'vue';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import {Loading} from "quasar";
import useProgrammaticArea from "src/composables/programmaticArea/programmaticAreaMethods";

const { createProgrammaticAreaFromDTO } = useProgrammaticArea();

const { alertError, alertSucess, alertWarningAction } = useSwal();
const searchResults = ref([]);
const selectedPogrammaticArea = ref('');
const newRowAdded = ref(false);
const data = ref({
  code: '',
  name: '',
  description: '',
  program: '',
});
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const openForm = ref(false);
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
    sortable: false,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Descrição',
    sortable: false,
  },
  {
    name: 'program',
    align: 'left',
    label: 'Programa',
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = programmaticAreaService.piniaGetAll();
});

const programs = computed(() => {
  return programService.piniaGetAll();
});

const submitForm = () => {
  const pogrammaticArea = {
    code: data.value.code,
    name: data.value.name,
    description: data.value.description,
    program: data.value.program,
  };
  programmaticAreaService.saveProgrammaticArea(pogrammaticArea).then((res) => {
    closeForm
    searchResults.value = programmaticAreaService.piniaGetAll();
    newRowAdded.value = false
  });
};

const closeForm = () => {
  resetFields();
  removeRow();
  openForm.value = false;
};

const editPogrammaticArea = (programmaticArea) => {
  removeRow();
  openForm.value = false;
  selectedPogrammaticArea.value = programmaticArea;
  data.value = programmaticArea;
};

const saveUpdate = () => {
  const programmaticArea = {
    id: selectedPogrammaticArea.value.id,
    code: data.value.code,
    name: data.value.name,
    description: data.value.description,
    program: data.value.program,
  };
  programmaticAreaService.updateProgrammaticArea(programmaticArea).then((res) => {
    searchResults.value = programmaticAreaService.piniaGetAll();
    resetFields();
  });
};

const resetFields = () => {
  selectedPogrammaticArea.value = {};
  data.value = { code: '', name: '', description: '', program: '' };
};

const deleteProgrammaticArea = (ProgrammaticArea) => {
  alertWarningAction('Tem certeza que deseja apagar o ProgrammaticAreaa?').then(
    (result) => {
      if (result) {
        programmaticAreaService
          .deleteProgrammaticArea(ProgrammaticArea)
          .then((response) => {
            if (response.status === 200 || esponse.status === 201) {
              alertSucess('ProgrammaticArea apagado com sucesso!').then(
                (result) => {
                  programmaticAreaService.getAll().then((res) => {
                    searchResults.value = programmaticAreaService.piniaGetAll();
                  })
                  // if (result) {
                  //   emit('close');
                  // }
                }
              );
            } else {
              alertError('Não foi possivel apagar o ProgrammaticAreaa.');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.info('OK. the Item Has not removed');
      }
    }
  );
};

const addNewRow = () => {
  resetFields();
  openForm.value = true;
  if (!newRowAdded.value) {
    newRowAdded.value = true;
    const newRow = {
      id: null,
      programmaticArea: {
        code: null,
        name: null,
        description: null,
        program: null,
      },
      acao: 'NOVA_LINHA',
    };
    searchResults.value.unshift(newRow);
  } else {
    alertError('Há uma área sendo associado.');
  }
};

const removeRow = () => {
  if (openForm.value == true) {
    const index = searchResults.value.findIndex((item) => item.id === null);
    searchResults.value.splice(index, 1);
    newRowAdded.value = false;
  }
};

const composeProgrammaticAreas = (programmaticAreas) => {
  searchResults.value = [];

  programmaticAreas.forEach((programmaticArea) => {
    const programmaticArea1 = createProgrammaticAreaFromDTO(programmaticArea)
    searchResults.value.push(programmaticArea1)
  });
};

const getAllProgrammaticAreas = () => {
  const params = {
    page: pagination.value.page - 1,
    size: pagination.value.rowsPerPage,
  };
  Object.keys(params).forEach(
    (key) => params[key] === '' && delete params[key]
  );
  programmaticAreaService.getAll(params)
    .then((response) => {
      searchResults.value = [];
      if (response.status === 200 || (response.status === 201)) {
        composeProgrammaticAreas(response.data.content)
        pagination.value.rowsNumber = response.data.totalSize; // Update rows count
      }
      Loading.hide();
    });
}

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  // Atualiza o estado de paginação
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;

  getAllProgrammaticAreas();
};
</script>
