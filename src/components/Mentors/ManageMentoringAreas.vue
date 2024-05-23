<template>
  <div class="q-pt-sm" style="height: 100%;">
    <div class="q-ma-md q-pa-md page-container">
      <div class="row">
        <q-banner dense inline-actions class="text-white bg-primary col-12  q-px-md d-flex align-items-center">
          <div class="row vertical-middle">
            <div class="col-10 vertical-middle">
              <b>Áreas de Mentoria do Mentor {{ selectedMentor.employee.name }}</b>
            </div>
            <q-space></q-space>
            <div class="text-right col-2">
              <q-btn class="btn-associar" size="md" @click="adicionarNovaLinha" dense round color="secondary" icon="add"></q-btn>
            </div>
          </div>
        </q-banner>
      </div>

      <div class="page-input-container q-pa-md">
        <div class="q-mt-lg">
          <q-table
            :rows="mentorProgrammaticAreas"
            :columns="columns"
            row-key="id"
          >
            <template v-slot:no-data="{ icon, filter }">
              <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
                <span>Sem resultados para visualizar</span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              </div>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="program" :props="props">
                  <span v-if="props.row.id === null">
                    <q-select
                      v-model="props.row.programmaticArea.program_id"
                      :options="programs"
                      label="Programa"
                      dense
                      outlined
                      emit-value
                      map-options
                      option-value="id"
                      option-label="name"
                      @input="updateAreas(props.row)"
                    />
                  </span>
                  <span v-else>
                    {{ props.row.programmaticArea.program.name }}
                  </span>
                </q-td>
                <q-td key="description" :props="props">
                  <span v-if="props.row.id === null">
                    <q-select
                      v-model="props.row.programmaticArea.id"
                      :options="getFilteredAreas(props.row.programmaticArea.program_id)"
                      label="Área de Mentoria"
                      dense
                      outlined
                      emit-value
                      map-options
                      option-value="id"
                      option-label="description"
                      :key="props.row.programmaticArea.program_id"
                    />
                  </span>
                  <span v-else>
                  {{ props.row.programmaticArea.description }}
                  </span>
                </q-td>
                <q-td key="options" :props="props">
                  <span v-if="props.row.id === null">
                    <div class="col">
                      <q-btn
                        flat
                        round
                        class="q-ml-md"
                        color="green-8"
                        icon="done"
                        @click="salvarNovaLinha(props.row)"
                      >
                        <q-tooltip class="bg-green-5">Gravar</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        class="q-ml-md"
                        color="red-8"
                        icon="cancel"
                        @click="removerLinha(props.row)"
                      >
                        <q-tooltip class="bg-red-5">Cancelar</q-tooltip>
                      </q-btn>
                    </div>
                  </span>
                  <span v-else>
                    <div class="col">
                      <q-btn
                              flats
                              round
                              dense
                              :color='isActive(props.row) ? "green" : "red"'
                              icon="circle"
                              @click="confirmFormLifeCycleChange(props.row)"
                      >
                        <q-tooltip class="bg-green-5">{{ isActive(props.row) ? 'Inactivar Área Programática' : 'Activar Área Programática'}}</q-tooltip>
                      </q-btn>
                    </div>
                  </span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
        <div class="row q-py-md">
          <q-space />
              <q-btn
                label="Fechar"
                class="float-right"
                color="red"
                @click="close"
              />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UsersService from 'src/services/api/user/UsersService';
import programService from 'src/services/api/program/programService';
import TutorProgrammaticAreaService from 'src/services/api/TutorProgrammaticArea/TutorProgrammaticAreaService';
import programmaticAreaService from 'src/services/api/programmaticArea/programmaticAreaService';
import mentorService from 'src/services/api/mentor/mentorService';
import { onMounted, ref, inject } from 'vue'
import User from 'src/stores/model/user/User'
import useTutorProgrammaticArea from 'src/composables/tutorProgrammaticArea/tutorProgrammaticAreaMethods';
import {useSwal} from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess, alertWarningAction } = useSwal();

const { createDTOFromTutorProgrammaticArea } = useTutorProgrammaticArea()

const emit = defineEmits(['close']);

const selectedMentor = inject('selectedMentor');
const currUser = ref(new User())
const mentorProgrammaticAreas = ref([]);
const columns = [
  {
    name: 'program',
    align: 'left',
    label: 'Programa',
    sortable: false,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Área de Mentoria',
    sortable: false,
  },
  {
    name: 'options',
    align: 'left',
    label: 'Opções',
    sortable: false,
  },
];
const programs = ref([])
const programaticAreas = ref([])
const newAreaBeingAdded = ref(false)

const adicionarNovaLinha = () => {
  if(!newAreaBeingAdded.value){
    newAreaBeingAdded.value = true
    const novaLinha = {
      id: null,
      programmaticArea: {
        program: null,
        description: null,
      },
      acao: 'NOVA_LINHA',
    };
    mentorProgrammaticAreas.value.unshift(novaLinha);
  } else {
    alertError('Há uma área sendo associado.')
  }
};

const removerLinha = (row) => {
  const index = mentorProgrammaticAreas.value.findIndex(item => item.id === null);
  mentorProgrammaticAreas.value.splice(index, 1);
  newAreaBeingAdded.value = false;
};

const salvarNovaLinha = (row) => {
  if(row.programmaticArea.id) {
    const programmaticArea_id = row.programmaticArea.id
    const alreadyExists = selectedMentor.value.tutorProgrammaticAreas.some(
      area => area.programmaticArea.id === programmaticArea_id
    );

    if (!alreadyExists) {
      const newTutorProgramaticArea = TutorProgrammaticAreaService.createNewTutorProgrammaticArea(selectedMentor.value.id,row.programmaticArea.id)

      TutorProgrammaticAreaService.save(newTutorProgramaticArea, selectedMentor.value).then((resp) => {
        selectedMentor.value = mentorService.getById(selectedMentor.value.id)
        mentorProgrammaticAreas.value = selectedMentor.value.tutorProgrammaticAreas.map((item, index) => ({
          id: item.id,
          programmaticArea: item.programmaticArea,
          acao: item.id,
          lifeCycleStatus: item.lifeCycleStatus
        }));
      })

      removerLinha(row);

      alertSucess('Área associada ao Mentor.');
    } else {
      alertError('Área já associada ao mentor.');
    }
  } else {
      alertError('Selecione uma Área a ser associada ao mentor.');
  }
};

const isActive =(tpa)=>{
    return tpa.lifeCycleStatus === 'ACTIVE';
};

const updateAreas = (row) => {
  const selectedProgramId = row.programmaticArea.program_id;
  const filteredAreas = programaticAreas.value.filter(area => area.program_id === selectedProgramId);
  row.programmaticArea.id = null;
  row.programmaticArea.areas = filteredAreas;
};

const getFilteredAreas = (selectedProgramId) => {
  return programaticAreas.value.filter(area => area.program_id === selectedProgramId);
};

const confirmFormLifeCycleChange = (tutorProgrammaticArea) => {
    var msg = '';
    if (tutorProgrammaticArea.lifeCycleStatus === 'ACTIVE') {
        msg = 'Confirma inactivar a área programática?';
    } else {
        msg = 'Confirma activar a área programática?';
    }

    alertWarningAction(
        msg
    ).then((result) => {
        if (result) {
            const tpa = selectedMentor.value.tutorProgrammaticAreas.find(item => item.id === tutorProgrammaticArea.id);

            if (tpa.lifeCycleStatus === 'ACTIVE') {
                tpa.lifeCycleStatus = 'INACTIVE'
            } else {
                tpa.lifeCycleStatus = 'ACTIVE'
            }

            TutorProgrammaticAreaService.changeLifeCycleStatus(createDTOFromTutorProgrammaticArea(tpa), selectedMentor.value).then((resp) => {
                selectedMentor.value = mentorService.getById(selectedMentor.value.id)
                mentorProgrammaticAreas.value = selectedMentor.value.tutorProgrammaticAreas.map((item, index) => ({
                    id: item.id,
                    programmaticArea: item.programmaticArea,
                    acao: item.id,
                    lifeCycleStatus: item.lifeCycleStatus
                }));
            })
        }
    });
}

const close = () => {
  emit('close');
};

onMounted(() => {
  programs.value = programService.getProgramList()
  programaticAreas.value = programmaticAreaService.piniaGetAll()
  mentorProgrammaticAreas.value = selectedMentor.value.tutorProgrammaticAreas ?
    selectedMentor.value.tutorProgrammaticAreas.map((item, index) => ({
      id: item.id,
      programmaticArea: item.programmaticArea,
      acao: item.id,
      lifeCycleStatus: item.lifeCycleStatus
    })) : [];
  currUser.value = JSON.parse(JSON.stringify((UsersService.getLogedUser())));
});
</script>
