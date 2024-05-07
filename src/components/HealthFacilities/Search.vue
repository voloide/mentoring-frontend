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
              <q-td key="healthFacility" :props="props">
                {{ props.row.healthFacility }}
              </q-td>
              <q-td key="district" :props="props">
                {{ props.row.district.description }}
              </q-td>

              <q-td key="options" :props="props">
                <div class="col">
                  <q-btn
                    flat
                    round
                    class="q-ml-md"
                    color="green-8"
                    icon="edit"
                    @click="editHealthFacility(props.row)"
                  >
                    <q-tooltip class="bg-green-5"
                      >Detalhar/Editar HealthFacility</q-tooltip
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
import healthFacilityService from 'src/services/api/healthfacility/healthFacilityService';
import User from 'src/stores/model/user/User';
import { onMounted, ref, inject } from 'vue';
import UsersService from 'src/services/api/user/userService';

const { fullName } = useEmployee();
const step = inject('step');
const searchResults = ref([]);
const selectedHealthFacility = ref('');
const columns = [
  {
    name: 'healthFacility',
    align: 'left',
    label: 'Unidade sanitária',
    sortable: false,
  },
  {
    name: 'district',
    align: 'left',
    label: 'Distrito',
    sortable: false,
  },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const emit = defineEmits(['goToHealthFacilityingAreas']);
const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = healthFacilityService.piniaGetAll();
  console.log(searchResults.value);
  // console.log('----piniaGetAll-----', healthFacilityService.piniaGetAll());
});

const editHealthFacility = (healthFacility) => {
  selectedHealthFacility.value = healthFacility;
};
</script>
