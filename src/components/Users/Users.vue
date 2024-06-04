<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container" v-if="!openForm">
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
                {{
                  `${props.row?.employee.name} ${props.row?.employee.surname}`
                }}
              </q-td>
              <q-td key="nuit" :props="props">
                {{ props.row?.employee.nuit }}
              </q-td>
              <q-td key="healthFacility" :props="props">
                {{ props.row?.employee.partner.name }}
              </q-td>
              <q-td key="username" :props="props">
                {{ props.row.username }}
              </q-td>
              <q-td key="options" :props="props">
                <div class="col">
                  <q-btn flat round class="q-ml-md" color="grey-7" icon="lock" @click="resetPassword(props.row.id)">
                    <q-tooltip class="bg-grey-7">Redefinição de senha</q-tooltip>
                  </q-btn>
                  <q-btn v-if="props.row.lifeCycleStatus=='INACTIVE'||props.row.lifeCycleStatus=='DELETED'" round class="q-ml-md" color="red-5" @click="activateUser(props.row.id)">
                    <q-tooltip class="grey-8">Inactivo</q-tooltip>
                  </q-btn>
                  <q-btn v-if="props.row.lifeCycleStatus=='ACTIVE'" round class="q-ml-md" color="green-5"  @click="activateUser(props.row.id)" >
                    <q-tooltip class="bg-green-5">Activo</q-tooltip>
                  </q-btn>
                  <q-btn flat round class="q-ml-md" color="yellow-8" icon="edit" @click="editUser(props.row)">
                      <q-tooltip class="bg-green-5">Detalhar/Editar Program</q-tooltip>
                    </q-btn>
                    <q-btn flat round class="q-ml-md" color="red-8" icon="delete" @click="deleteUser(props.row.id)">
                      <q-tooltip class="bg-red-5">Exluir</q-tooltip>
                    </q-btn>
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
          @click="$emit('create')"
        />
      </q-page-sticky>
    </div>
  </div>
  <q-dialog persistent v-model="openForm">
      <UserForm
        @close="openForm = false"
      />
  </q-dialog>
</template>

<script setup>
import useEmployee from 'src/composables/employee/employeeMethods';
import userService from 'src/services/api/user/UsersService';
import User from 'src/stores/model/user/User';
import { onMounted, ref, provide } from 'vue';
import UserForm from './UserForm.vue';
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess, alertWarningAction } = useSwal();
const searchResults = ref([]);
const selectedUser = ref('');
const data = ref({
  name: '',
  nuit: '',
  employee: '',
  province: '',
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
    name: 'nuit',
    align: 'left',
    label: 'NUIT',
    sortable: false,
  },
  {
    name: 'healthFacility',
    align: 'left',
    label: 'Unidade Sanitária',
    sortable: false,
  },
  {
    name: 'username',
    align: 'left',
    label: 'Utilizador',
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const emit = defineEmits(['goToUseringAreas']);
const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(userService.getLogedUser()));
  searchResults.value = userService.piniaGetAll();

});


const editUser = (user) => {
  selectedUser.value = user;
};

const resetPassword = (user) =>{
  selectedUser.value = user;
  emit('resetPassword');
}

const activateUser = (user) =>{
  selectedUser.value = user;
}

const deleteUser = (user) => {
  alertWarningAction(
    'Tem certeza que deseja apagar o user?'
  ).then((result) => {
    if (result) {
      userService.deleteUser(user).then((response) => {
        if (response.status === 200 || esponse.status === 201) {
          alertSucess('User apagado com sucesso!').then((result) => {
            if (result) {
              emit('close');
            }
          });
        } else {
          alertError('Não foi possivel apagar o usera.')
        }
      }).catch((error) => {
        console.error(error);
      });
    } else {
      console.info("OK. the Item Has not removed")
    }
  });
}

provide('openForm', openForm);
provide('selectedUser', selectedUser);
</script>
