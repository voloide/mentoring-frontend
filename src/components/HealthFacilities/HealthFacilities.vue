<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container">
      <div v-if="openForm" class="row">
                <q-input
                    outlined
                    label="Unidade Sanitaria"
                    dense
                    ref="healthFacilityRef"
                    class="col"
                    v-model="data.healthFacility"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="data.healthFacility = ''"
                        class="cursor-pointer"
                    />
                    </template>
                </q-input>

                <q-select
                          class="row "
                          use-input
                          hide-selected
                          fill-input
                          input-debounce="0"
                          dense
                          outlined
                          ref="provinceRef"
                          :rules="[
                            (val) =>
                              !!val || 'Por favor indicar o provincia',
                          ]"
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
                          class="row "
                          use-input
                          hide-selected
                          fill-input
                          input-debounce="0"
                          dense
                          outlined
                          ref="districtRef"
                          :rules="[
                            (val) =>
                              !!val || 'Por favor indicar o distrito',
                          ]"
                          lazy-rules
                          v-model="data.district"
                          :options="districts"
                          option-value="id"
                          option-label="description"
                          label="Distritos"
                        >
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                Sem Resultados
                              </q-item-section>
                            </q-item>
                          </template>
                </q-select>

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
            @click="openForm = true"
            icon="edit_square"
            label="Criar"
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
import districtService from 'src/services/api/district/districtService';
import { computed } from 'vue';
import provinceService from 'src/services/api/province/provinceService';

const { fullName } = useEmployee();
const step = inject('step');
const searchResults = ref([]);
const selectedHealthFacility = ref('');
const data = ref({
  healthFacility:'',
  province:'',
  district:''
})
const openForm = ref(false);
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

const provinces = computed(() => {
  return provinceService.piniaGetAll();
});

const districts = computed(() => {
  const districts = districtService.piniaGetAll();
  districts.filter(item=>item.province_id == data.value.province.id)
  return data.value.province? districts : '';
});

const submitForm = () => {
  const healthFacility ={
    healthFacility: data.value.healthFacility,
    districtDTO: data.value.district
  }
  healthFacilityService.saveHealthFacility(healthFacility).then(closeForm)
}

const closeForm = () =>{
  openForm.value = false;
  data.value.healthFacility='';
  data.value.province = '';
  data.value.district ='';
}

const editHealthFacility = (healthFacility) => {
  selectedHealthFacility.value = healthFacility;
};
</script>
