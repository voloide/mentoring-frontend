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
                  <q-btn
                    flat
                    round
                    class="q-ml-md"
                    color="green-8"
                    icon="edit"
                    @click="editUser(props.row)"
                  >
                    <q-tooltip class="bg-green-5"
                      >Detalhar/Editar User</q-tooltip
                    >
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
        >
          <q-fab-action
            label-position="left"
            color="primary"
            @click="$emit('create')"
            icon="edit_square"
            label="Criar"
          />
          <q-fab-action
            label-position="left"
            color="secondary"
            @click="$emit('import')"
            icon="cloud_upload"
            label="Importar"
          />
        </q-fab>
      </q-page-sticky>
    </div>
  </div>
</template>

<script setup>
import useEmployee from 'src/composables/employee/employeeMethods';
import userService from 'src/services/api/user/userService';
import User from 'src/stores/model/user/User';
import { onMounted, ref, inject } from 'vue';
import UsersService from 'src/services/api/user/userService';

const { fullName } = useEmployee();
const step = inject('step');
const searchResults = ref([]);
const selectedUser = ref('');
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
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = userService.piniaGetAll();
  // console.log("----searchResults----",searchResults.value)
  // console.log('----piniaGetAll-----', userService.piniaGetAll());
});

const editUser = (user) => {
  selectedUser.value = user;
};
</script>
