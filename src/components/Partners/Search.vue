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
                {{ props.row.name }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>

              <q-td key="options" :props="props">
                <div class="col">
                  <q-btn
                    flat
                    round
                    class="q-ml-md"
                    color="green-8"
                    icon="edit"
                    @click="editPartner(props.row)"
                  >
                    <q-tooltip class="bg-green-5"
                      >Detalhar/Editar Partner</q-tooltip
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
import PartnerService from 'src/services/api/partner/partnerService';
import User from 'src/stores/model/user/User';
import { onMounted, ref, inject } from 'vue';
import UsersService from 'src/services/api/user/userService';

const { fullName } = useEmployee();
const step = inject('step');
const searchResults = ref([]);
const selectedPartner = ref('');
const columns = [
  {
    name: 'name',
    align: 'left',
    label: 'name',
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

const emit = defineEmits(['goToPartneringAreas']);
const currUser = ref(new User());

onMounted(() => {
  currUser.value = JSON.parse(JSON.stringify(UsersService.getLogedUser()));
  searchResults.value = PartnerService.piniaGetAll();
  // console.log("----searchResults----",searchResults.value)
  // console.log('----piniaGetAll-----', PartnerService.piniaGetAll());
});

const editPartner = (Partner) => {
  selectedPartner.value = Partner;
};
</script>
