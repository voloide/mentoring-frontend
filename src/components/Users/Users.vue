<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container">
      <div v-if="openForm" class="row">

        <q-select
          class="row"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          dense
          outlined
          ref="provinceRef"
          :rules="[(val) => !!val || 'Por favor indicar o provincia']"
          lazy-rules
          v-model="data.province"
          :options="provinces"
          option-value="id"
          option-label="designation"
          label="Provincias"
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
          class="row"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          dense
          outlined
          ref="healthFacilityRef"
          :rules="[(val) => !!val || 'Por favor indicar a unidade sanitaria']"
          lazy-rules
          v-model="data.healthFacility"
          :options="healthFacilities"
          option-value="id"
          option-label="healthFacility"
          label="Unidade Sanitaria"
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
                    label="Nome"
                    dense
                    ref="nameRef"
                    class="col"
                    v-model="data.name"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="data.name = ''"
                        class="cursor-pointer"
                    />
                    </template>
                </q-input>

                <q-input
                    outlined
                    label="NUIT"
                    dense
                    ref="nuitRef"
                    class="col"
                    v-model="data.nuit"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="data.nuit = ''"
                        class="cursor-pointer"
                    />
                    </template>
                </q-input>

        <q-space />
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
          @click="openForm = true"
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
import userService from 'src/services/api/user/userService';
import User from 'src/stores/model/user/User';
import { onMounted, ref, inject, provide } from 'vue';
import UsersService from 'src/services/api/user/userService';
import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
import provinceService from 'src/services/api/province/provinceService';
import { computed } from 'vue';
import UserForm from './UserForm.vue';

const { fullName } = useEmployee();
const step = inject('step');
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
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = userService.piniaGetAll();
  // console.log("----searchResults----",searchResults.value)
  // console.log('----piniaGetAll-----', userService.piniaGetAll());
});

const provinces =computed(()=>{
  return provinceService.piniaGetAll()
})

const healthFacilities = computed(() => {
  const healthFacilities = healthFacilityService.piniaGetAll();
  healthFacilities.filter((item) => item.district.provinceDTO?.id == data.value.province?.id);
  return data.value.province ? healthFacilities : '';
});

const submitForm = () => {
  const user = {
    name: data.value.name,
    nuit: data.value.nuit,
    employeeDTO: data.value.employee,
    province: data.value.province
  };
  healthFacilityService.saveHealthFacility(user).then(closeForm);
};

const closeForm = () => {
  openForm.value = false;
  data.value.name = '';
  data.value.nuit = '';
  data.value.employee = '';
  data.value.province = '';
};

const editUser = (user) => {
  selectedUser.value = user;
};

provide('openForm', openForm);
</script>
