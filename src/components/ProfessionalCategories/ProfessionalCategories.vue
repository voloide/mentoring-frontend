<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container">
      <div v-if="openForm" class="row"></div>
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
                <span v-if="props.row.id === null || selectedProfessionalCategory.id === props.row.id">
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
                    </template>
                  </q-input>
                </span>
                <span v-else>
                  {{ props.row.code }}
                </span>
              </q-td>
              <q-td key="description" :props="props">
                <span v-if="props.row.id === null || selectedProfessionalCategory.id === props.row.id">
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
                    <q-btn  v-if="selectedProfessionalCategory.id !== props.row.id" flat round class="q-ml-md" color="green-8" icon="edit" @click="editProfessionalCategory(props.row)">
                      <q-tooltip class="bg-green-5">Detalhar/Editar Program</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="selectedProfessionalCategory.id === props.row.id"
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
                      v-if="selectedProfessionalCategory.id === props.row.id"
                      flat
                      round
                      class="q-ml-md"
                      color="red-8"
                      icon="close"
                      @click="resetFields()"
                    >
                      <q-tooltip class="bg-green-5"
                        >Guardar Alteração</q-tooltip
                      >
                    </q-btn>
                    <q-btn v-if="selectedProfessionalCategory.id !== props.row.id" flat round class="q-ml-md" color="red-8" icon="delete" @click="deleteProfessionalCategory(props.row.id)"></q-btn>
                  </span>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <q-page-sticky position="bottom-right" :offset="[20, 30]" class="row">
        <q-fab
          v-model="fabRight"
          vertical-actions-align="right"
          color="primary"
          glossy
          icon="add"
          direction="left"
        >
          <q-fab-action
            label-position="left"
            color="primary"
            @click="addNewRow()"
            icon="edit_square"
            label="Criar"
          />
        </q-fab>
      </q-page-sticky>
    </div>
  </div>
</template>

<script setup>
import ProfessionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
import User from 'src/stores/model/user/User';
import { onMounted, ref } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import professionalCategoryService from 'src/services/api/professionalcategory/professionalCategoryService';
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess, alertWarningAction } = useSwal();
const searchResults = ref([]);
const selectedProfessionalCategory = ref('');
const openForm = ref(false);
const newRowAdded = ref(false);
const data = ref({
  code: '',
  description: '',
});
const columns = [
  {
    name: 'code',
    align: 'left',
    label: 'code',
    sortable: false,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Descrção',
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = ProfessionalCategoryService.piniaGetAll();
});

const submitForm = () => {
  const professionalCategory = {
    code: data.value.code,
    description: data.value.description,
  };
  professionalCategoryService
    .saveProfessionalCategory(professionalCategory)
    .then(closeForm);
};

const closeForm = () => {
  openForm.value = false;
  data.value.code = '';
  data.value.description = '';
  removeRow();
};

const editProfessionalCategory = (professionalCategory) => {
  closeForm()
  selectedProfessionalCategory.value = professionalCategory;
  data.value = professionalCategory;
};

const saveUpdate = () => {
  const professionalCategory = {
    id: selectedProfessionalCategory.value.id,
    code: data.value.code,
    description: data.value.description,
  };
  professionalCategoryService.updateProfessionalCategory(professionalCategory);
  resetFields()
};

const resetFields = () => {
  selectedProfessionalCategory.value = {};
  data.value = { code: '', description: '' };
};


const deleteProfessionalCategory = (ProfessionalCategory) => {
  alertWarningAction(
    'Tem certeza que deseja apagar a categoria profissional?'
  ).then((result) => {
    if (result) {
      professionalCategoryService.deleteProfessionalCategory(ProfessionalCategory).then((response) => {
        if (response.status === 200 || esponse.status === 201) {
          alertSucess('categoria profissional apagada com sucesso!').then((result) => {
            if (result) {
              emit('close');
            }
          });
        } else {
          alertError('Não foi possivel apagar a categoria profissional.')
        }
      }).catch((error) => {
        console.error(error);
      });
    } else {
      console.info("OK. the Item Has not removed")
    }
  });
}

const addNewRow = () => {
  resetFields();
  openForm.value = true;
  if (!newRowAdded.value) {
    newRowAdded.value = true;
    const newRow = {
      id: null,
      programmaticArea: {
        code: null,
        description: null,
      },
      acao: 'NOVA_LINHA',
    };
    searchResults.value.unshift(newRow);
  } else {
    alertError('Há uma área sendo associado.');
  }
};

const removeRow = (row) => {
  const index = searchResults.value.findIndex((item) => item.id === null);
  searchResults.value.splice(index, 1);
  newRowAdded.value = false;
};

</script>
