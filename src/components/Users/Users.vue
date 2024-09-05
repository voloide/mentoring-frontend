<template>
  <q-page>
    <div class="q-pt-sm" style="height: 100%">
      <div class="q-ma-md q-pa-md page-container" v-if="!openForm">
        <div class="row">
          <q-input
            outlined
            label="Nome"
            dense
            ref="nameRef"
            class="col"
            v-model="searchParams.employee.name"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="searchParams.employee.name = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-input
            outlined
            label="NUIT"
            dense
            ref="nuitRef"
            class="col q-ml-md"
            v-model="searchParams.employee.nuit"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="searchParams.employee.nuit = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-input
            outlined
            label="Utilizador"
            dense
            ref="nuitRef"
            class="col q-ml-md"
            v-model="searchParams.username"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="searchParams.username = ''"
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
        <div class="q-mt-lg q-mb-md">
          <div class="row items-center q-mb-md">
            <q-icon name="search" size="sm" />
            <span class="q-pl-sm text-subtitle2">Resultado da Pesquisa</span>
          </div>
          <q-separator color="grey-13" size="1px" />
        </div>
        <div>
          <q-table
            class="col"
            dense
            :rows="searchResults"
            :columns="columns"
            row-key="id"
            v-model:pagination="pagination"
            :loading="loading"
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

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.employee.name }}
                </q-td>
                <q-td key="nuit" :props="props">
                  {{ props.row.employee.nuit }}
                </q-td>
                <q-td key="healthFacility" :props="props">
                  {{ props.row.employee.partner.name }}
                </q-td>
                <q-td key="username" :props="props">
                  {{ props.row.username }}
                </q-td>
                <q-td key="options" :props="props">
                  <div class="col">
                    <q-btn
                      flat
                      round
                      class="q-ml-md"
                      color="grey-7"
                      icon="lock"
                      @click="resetPassword(props.row)"
                    >
                      <q-tooltip class="bg-grey-7"
                        >Redefinição de senha</q-tooltip
                      >
                    </q-btn>
                    <q-btn
                      v-if="
                        props.row.lifeCycleStatus == 'INACTIVE' ||
                        props.row.lifeCycleStatus == 'DELETED'
                      "
                      round
                      dense
                      size="sm"
                      class="q-ml-md"
                      color="red-5"
                      @click="activateUser(props.row.id)"
                    >
                      <q-tooltip class="grey-8">Inactivo</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="props.row.lifeCycleStatus == 'ACTIVE'"
                      round
                      dense
                      size="sm"
                      class="q-ml-md"
                      color="green-5"
                      @click="activateUser(props.row.id)"
                    >
                      <q-tooltip class="bg-green-5">Activo</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      size="sm"
                      class="q-ml-md"
                      color="yellow-8"
                      icon="edit"
                      @click="editUser(props.row)"
                    >
                      <q-tooltip class="bg-green-5">Detalhar/Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      class="q-ml-md"
                      color="red-8"
                      icon="delete"
                      @click="deleteUser(props.row.id)"
                    >
                      <q-tooltip class="bg-red-5">Exluir</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div style="float: right" class="q-mt-md">
          <q-pagination
            v-model="pagination.page"
            :max="pagination.rowsNumber"
            boundary-numbers
            direction-links
            color="primary"
          />
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
      <UserForm @close="openForm = false" />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, provide, defineEmits, watch } from 'vue';
import userService from 'src/services/api/user/UsersService';
import User from 'src/stores/model/user/User';
import UserForm from './UserForm.vue';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import Employee from 'src/stores/model/employee/Employee';
import useUser from 'src/composables/user/userMethods';

const { createUserFromDTO } = useUser();
const searchParams = ref(
  new User({
    employee: new Employee(),
  })
);
const { alertError, alertSucess, alertWarningAction } = useSwal();
const searchResults = ref([]);
const selectedUser = ref('');

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const loading = ref(true);

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

const emit = defineEmits(['reset-password', 'select-user', 'edit-user']);
const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(userService.getLogedUser()));
  loadData();
});

const editUser = (user) => {
  selectedUser.value = user;
  emit('edit-user', 'userForm');
  emit('select-user', user);
};

const resetPassword = (user) => {
  selectedUser.value = user;
  emit('reset-password');
  emit('select-user', user);
};

const activateUser = (user) => {
  selectedUser.value = user;
};

const deleteUser = (user) => {
  alertWarningAction('Tem certeza que deseja apagar o user?').then((result) => {
    if (result) {
      userService
        .deleteUser(user)
        .then((response) => {
          if (response.status === 200 || esponse.status === 201) {
            alertSucess('User apagado com sucesso!').then((result) => {
              if (result) {
                emit('close');
              }
            });
          } else {
            alertError('Não foi possivel apagar o usera.');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.info('OK. the Item Has not removed');
    }
  });
};

const clearSearchParams = () => {
  searchParams.value = new User({
    employee: new Employee(),
  });
};

provide('openForm', openForm);

const onRequest = (props) => {
  pagination.value.page = props.pagination.page;
  pagination.value.rowsPerPage = props.pagination.rowsPerPage;
  loadData();
};

const loadData = () => {
  loading.value = true;
  search();
};

const search = async () => {
  const params = {
    userId: currUser.value.id,
    name: searchParams.value.employee.name,
    nuit: searchParams.value.employee.nuit,
    username: searchParams.value.username,
    page: pagination.value.page - 1,
    size: pagination.value.rowsPerPage,
  };
  Object.keys(params).forEach(
    (key) => params[key] === '' && delete params[key]
  );

  userService
    .search(params)
    .then((response) => {
      searchResults.value = [];
      response.data.content.forEach((dto) => {
        searchResults.value.push(createUserFromDTO(dto));
      });
      pagination.value.rowsNumber = response.data.totalPages;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(
  () => pagination.value.page,
  (newPage) => {
    loadData();
  }
);
</script>
