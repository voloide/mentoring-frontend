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
                <span v-if="props.row.id === null || selectedPartner.id === props.row.id">
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
                <span v-if="props.row.id === null || selectedPartner.id === props.row.id">
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
                    <q-btn v-if="selectedPartner.id !== props.row.id" flat round class="q-ml-md" color="green-8" icon="edit" @click="editPartner(props.row)">
                      <q-tooltip class="bg-green-5">Detalhar/Editar Program</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="selectedPartner.id === props.row.id"
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
                      v-if="selectedPartner.id === props.row.id"
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
                    <q-btn v-if="selectedPartner.id !== props.row.id" flat round class="q-ml-md" color="red-8" icon="delete" @click="deletePartner(props.row.id)"></q-btn>
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
            @click="addNewRow"
            icon="edit_square"
            label="Criar"
          />
        </q-fab>
      </q-page-sticky>
    </div>
  </div>
</template>

<script setup>
import PartnerService from 'src/services/api/partner/partnerService';
import User from 'src/stores/model/user/User';
import { onMounted, ref } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import partnerService from 'src/services/api/partner/partnerService';
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess, alertWarningAction } = useSwal();
const searchResults = ref([]);
const selectedPartner = ref('');
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
  searchResults.value = PartnerService.piniaGetAll();
});

const submitForm = () => {
  const partner = {
    name: data.value.name,
    description: data.value.description,
  };
  partnerService.savePartner(partner).then(closeForm);
};

const closeForm = () => {
  resetFields();
  removeRow();
  openForm.value = false;
};

const editPartner = (partner) => {
  removeRow();
  openForm.value = false;
  selectedPartner.value = partner;
  data.value = partner;
};

const saveUpdate = () => {
  const partner = {
    id: selectedPartner.value.id,
    name: data.value.name,
    description: data.value.description,
  };
  partnerService.updatePartner(partner);
  resetFields()
};

const resetFields = () => {
  selectedPartner.value = {};
  data.value = { name: '', description: '' };
};

const deletePartner = (partner) => {
  alertWarningAction(
    'Tem certeza que deseja apagar o partnera?'
  ).then((result) => {
    if (result) {
      partnerService.deletePartner(partner).then((response) => {
        if (response.status === 200 || esponse.status === 201) {
          alertSucess('Parceiro apagado com sucesso!').then((result) => {
            if (result) {
              emit('close');
            }
          });
        } else {
          alertError('Não foi possivel apagar o Parceiro.')
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
