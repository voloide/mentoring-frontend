<template>
    <div class="q-pt-sm" style="height: 100%;">

        <div class="q-ma-md q-pa-md page-container">
            <div class="row">
                <q-file
                    v-model="file"
                    outlined
                    label="Seleccione o Ficheiro"
                    accept=".xls,.xlsx"
                    counter
                    dense
                    class="col-3 q-ml-md"
                    ref="fileRef"
                    :rules="[(val) => !!val || 'Por favor indicar o ficheiro.']"
                    @update:model-value="excelExport"
                    :disable="submitSend"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                  <template v-if="file" v-slot:append>
                    <q-icon
                        name="cancel"
                        @click.stop.prevent="file = null"
                        class="cursor-pointer"
                    />
                  </template>
                </q-file>
              <q-select
                  class="col q-ml-md"
                  dense
                  outlined
                  ref="selectedSheetRef"
                  :rules="[(val) => !!val || 'Por favor indicar a planilha.']"
                  v-model="selectedSheet"
                  :options="sheets"
                  label="Planilha"
                  :disable="submitSend"
              >
                <template v-if="selectedSheet" v-slot:append>
                  <q-icon
                      name="cancel"
                      @click.stop.prevent="selectedSheet = null"
                      class="cursor-pointer"
                  />
                </template>
              </q-select>
<!--                <q-space />-->
                <q-btn
                    class="q-ml-md q-mb-xs float-right"
                    square
                    @click="cleanForm"
                    color="amber"
                    icon="clear"
                >
                    <q-tooltip class="bg-amber-5">Limpar</q-tooltip>
                </q-btn>

                <q-btn
                    unelevated
                    color="primary"
                    dense
                    label="Carregar"
                    class="all-pointer-events q-ml-md q-mb-xs float-right"
                    :loading="submitLoading"
                    :disable="submitSend"
                    @click="loadList()"
                >
                  <q-tooltip class="bg-primary-5">Carregar</q-tooltip>
                </q-btn>
            </div>
            <div class=" q-mt-lg q-mb-md">
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
                            <q-td key="nuit" :props="props">
                                {{ props.row.employee.nuit }}
                            </q-td>
                            <q-td key="name" :props="props">
                                {{ fullName(props.row.employee) }}
                            </q-td>
                            <q-td key="category" :props="props">
                                {{ props.row.employee.professionalCategory.description }}
                            </q-td>
                            <q-td key="phoneNumber" :props="props">
                                {{ props.row.employee.phoneNumber }}
                            </q-td>
                            <q-td key="options" :props="props">
                            <div class="col">
                                <q-btn
                                flat
                                round
                                class="q-ml-md"
                                color="yellow-10"
                                icon="edit_note"
                                @click="manageMentoringAreas(props.row)"
                                >
                                <q-tooltip class="bg-green-5">Gerir áreas de mentoria</q-tooltip>
                                </q-btn>

                                <q-btn
                                flat
                                round
                                class="q-ml-md"
                                color="green-8"
                                icon="edit"
                                @click="editMentor(props.row)"
                                >
                                <q-tooltip class="bg-green-5">Detalhar/Editar Mentor</q-tooltip>
                                </q-btn>
                            </div>
                            </q-td>
                        </q-tr>
                        </template>
                </q-table>
            </div>
        </div>
    </div>
</template>
<script setup>
import * as XLSX from 'xlsx';
import useEmployee from 'src/composables/employee/employeeMethods'
import Mentor from 'src/stores/model/mentor/Mentor'
import Employee from 'src/stores/model/employee/Employee'
import User from 'src/stores/model/user/User'
import { onMounted, ref, toRaw, inject } from 'vue'
import UsersService from 'src/services/api/user/UsersService'
import programService from 'src/services/api/program/programService';
import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
import {useSwal} from 'src/composables/shared/dialog/dialog';
import districtService from 'src/services/api/district/districtService';

const { alertError, alertSucess, alertWarningAction } = useSwal();


const searchParams = ref(new Mentor({
                            employee: new Employee()
                        }));
const { fullName } = useEmployee();
const fileRef = ref(null);
const searchResults = ref([]);
const selectedMentor = ref('');
const selectedSheet = ref('');
const selectedSheetRef = ref(null);
const columns = [
  {
    name: 'nuit',
    align: 'left',
    label: 'NUIT',
    sortable: false,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nome',
    field: (row) => fullName(row.employee),
    sortable: false,
  },
  { name: 'category', align: 'center', label: 'Categoria Profissional', sortable: false },
  { name: 'phoneNumber', align: 'left', label: 'Telefone', sortable: false },
  { name: 'options', align: 'left', label: 'Opções', sortable: false },
];

const emit = defineEmits(['goToMentoringAreas']);
const currUser = ref(new User())
const submitSend = ref(false);
const file = ref(null);
const selectedFile = ref('');
const sheets = ref([]);
const submitLoading = ref(false);
const selectedList = ref([]);
const loadedList = ref([]);

onMounted(() => {
    programService.getAll()
    programmaticAreaService.getAll()
    currUser.value = JSON.parse(JSON.stringify((UsersService.getLogedUser())));
});

const editMentor = (mentor) => {
    selectedMentor.value = mentor;
}
const cleanForm = () => {
  submitLoading.value = false;
  submitSend.value = false;
  file.value = null;
  selectedFile.value = null;
  selectedSheet.value = null;
  sheets.value = [];
};

const loadList = () => {
  submitLoading.value = true;
  fileRef.value.validate();
  selectedSheetRef.value.validate();

  if (
      !fileRef.value.hasError &&
      !selectedSheetRef.value.hasError
  ) {
    selectedList.value = [];
    loadedList.value = [];
    const worksheet = selectedFile.value.Sheets[selectedSheet.value];
    let range = XLSX.utils.decode_range(worksheet['!ref']);

    range.s.r = 0;
    worksheet['!ref'] = XLSX.utils.encode_range(range);
    console.log(worksheet['!ref'])
    const rowsFromFile = XLSX.utils.sheet_to_json(worksheet, {
      range: range,
      raw: false,
      defval: '',
    });

    rowsFromFile.forEach(async (element) => {
      console.log(element)
      // pegar Distrito (JA vem com Provincia)
      // const district = districtService.get
      // Pegar HealthFacility




      // showloading();
      // let objectListed = {};
      // patientServiceIdentifier.value = element.NID;
      // currPatient.identifiers.push(patientServiceIdentifier);
      // objectListed.identifier = element.NID;
      // objectListed.name = element.Nome;
      // objectListed.gender = element.Sexo;
      // objectListed.age = element.Idade;
      // objectListed.lastPickup = element['Último Levant'];
      // objectListed.type = element.Tipo;
      // objectListed.destinationId = selectedClinicSector.value.id;
      // objectListed.existInIDMED = await patientService.apiSearchExist(
      //     currPatient
      // );
      // objectListed.status = objectListed.existInIDMED
      //     ? 'Encontrado'
      //     : 'Não Encontrado';
      // objectListed.processed = false;
      //
      // if (element.Tipo !== 'Activo') {
      //   selectedList.value.push(objectListed);
      //   if (objectListed.existInIDMED) {
      //     loadedList.value.push(objectListed);
      //   }
      // }
    });

    submitLoading.value = false;
  } else {
    alertError('Todos os campos à vemelho devem ser preenchidos');
    submitLoading.value = false;
  }
};

const excelExport = (event) => {
  let input = event;
  let reader = new FileReader();
  reader.onload = () => {
    let fileData = reader.result;
    selectedFile.value = XLSX.read(fileData, { type: 'binary' });
    sheets.value = selectedFile.value.SheetNames;
  };
  reader.readAsBinaryString(input);
};

</script>
