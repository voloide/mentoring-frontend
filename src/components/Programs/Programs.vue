<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container">
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
              <q-td key="name" :props="props">
                <span
                  v-if="
                    props.row.id === null || selectedProgram.id === props.row.id
                  "
                >
                  <q-input
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
                    </template>
                  </q-input>
                </span>
                <span v-else>
                  {{ props.row.name }}
                </span>
              </q-td>
              <q-td key="description" :props="props">
                <span
                  v-if="
                    props.row.id === null || selectedProgram.id === props.row.id
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
                    </template>
                  </q-input>
                </span>
                <span v-else>
                  {{ props.row.description }}
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
                      v-if="selectedProgram.id !== props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="green-8"
                      icon="edit"
                      @click="editProgram(props.row)"
                    >
                      <q-tooltip class="bg-green-5"
                        >Detalhar/Editar Program</q-tooltip
                      >
                    </q-btn>
                    <q-btn
                      v-if="selectedProgram.id === props.row.id"
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
                      v-if="selectedProgram.id === props.row.id"
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
                      v-if="selectedProgram.id !== props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="red-8"
                      icon="delete"
                      @click="deleteProgram(props.row.id)"
                    >
                      <q-tooltip class="bg-green-5">Apagar Program</q-tooltip>
                    </q-btn>
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
import programService from 'src/services/api/program/programService';
import User from 'src/stores/model/user/User';
import { onMounted, ref } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess, alertWarningAction } = useSwal();

const searchResults = ref([]);
const selectedProgram = ref('');
const newRowAdded = ref(false);

const data = ref({
  name: '',
  description: '',
});
const openForm = ref(false);
const columns = [
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
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = programService.piniaGetAll();
});

const submitForm = () => {
  const program = {
    name: data.value.name,
    description: data.value.description,
  };
  programService.saveProgram(program).then((res) => {
    closeForm;
    newRowAdded.value = false
    searchResults.value = programService.piniaGetAll();
  });
};

const closeForm = () => {
  resetFields();
  removeRow();
  openForm.value = false;
};

const editProgram = (program) => {
  removeRow();
  openForm.value = false;
  selectedProgram.value = program;
  data.value = program;
};

const saveUpdate = () => {
  const program = {
    id: selectedProgram.value.id,
    name: data.value.name,
    description: data.value.description,
  };
  programService.updateProgram(program).then((res) => {
    searchResults.value = programService.piniaGetAll();
    resetFields();
  });

};

const resetFields = () => {
  selectedProgram.value = {};
  data.value = { name: '', description: '' };
};

const deleteProgram = (program) => {
  selectedProgram.value = program;
  alertWarningAction('Tem certeza que deseja apagar o programa?').then(
    (result) => {
      if (result) {
        programService
          .deleteProgram(selectedProgram.value)
          .then((response) => {
            if (response.status === 200 || esponse.status === 201) {
              alertSucess('Programa apagado com sucesso!').then(
                (result) => {
                  programService.getAll().then((res) => {
                    searchResults.value = programService.piniaGetAll();
                  })
                  // if (result) {
                  //   emit('close');
                  // }
                }
              );
            } else {
              alertError('Não foi possivel apagar o programa.');
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
      program: {
        name: null,
        description: null,
      },
      acao: 'NOVA_LINHA',
    };
    searchResults.value.unshift(newRow);
  } else {
    alertError('Há uma área sendo associado.');
  }
};

const removeRow = () => {
  if (openForm.value==true) {
    const index = searchResults.value.findIndex((item) => item.id === null);
    searchResults.value.splice(index, 1);
    newRowAdded.value = false;
  }
};
</script>
