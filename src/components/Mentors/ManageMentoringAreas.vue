<template>
  <div class="q-pt-sm" style="height: 100%;">
    <div class="q-ma-md q-pa-md page-container">
      <div class="row">
        <q-banner dense inline-actions class="text-white bg-primary col-12  q-px-md d-flex align-items-center">
          <div class="row">
            <div class="col-10">
              <b>Áreas de Mentoria do Mentor {{ selectedMentor.employee.name }}</b>
            </div>
            <q-space></q-space>
            <div class="text-right col-2">
              <q-btn class="btn-associar" size="sm" @click="adicionarNovaLinha" dense round color="secondary" icon="add"></q-btn>                    
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
            :filter="filter"
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
                      label="Área Programática"
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
                        flat
                        round
                        class="q-ml-md"
                        color="red-8"
                        icon="delete"
                        @click="editMentor(props.row)"
                      >
                        <q-tooltip class="bg-red-5">Desassociar</q-tooltip>
                      </q-btn>
                    </div>
                  </span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
// import useSwal from 'src/composables/shared/dialog/dialog'

// const {alertInfo} = useSwal()

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
    label: 'Área Programática',
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
  console.log(newAreaBeingAdded.value)
  if(!newAreaBeingAdded.value){
    newAreaBeingAdded.value = true
    const novaLinha = {
      id: null, 
      programmaticArea: { 
        program: null,
        description: null,
      },
      acao: 'ID_DA_NOVA_LINHA',
    };
    mentorProgrammaticAreas.value.push(novaLinha);
  } else {
    console.log('Há uma área sendo associado.')
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
      // Criar um novo TutorProgrammaticArea (mentor_id, prgrammaticArea_id)
      console.log(selectedMentor.value.id, '-',row.programmaticArea.id)
      const newTutorProgramaticArea = TutorProgrammaticAreaService.createNewTutorProgrammaticArea(selectedMentor.value.id,row.programmaticArea.id)
      
      TutorProgrammaticAreaService.save(newTutorProgramaticArea)
      
      removerLinha(row);
      
      console.log('Selecione uma área diferente.');
    } else {
      console.log('Área já selecionada pelo mentor.');
    }
  } else {
    console.log('Selecione uma area')
  }
};

const updateAreas = (row) => {
  const selectedProgramId = row.programmaticArea.program_id;
  const filteredAreas = programaticAreas.value.filter(area => area.program_id === selectedProgramId);
  row.programmaticArea.id = null; // Limpa a área selecionada ao trocar de programa
  row.programmaticArea.areas = filteredAreas;
};

const getFilteredAreas = (selectedProgramId) => {
  // Retorna as áreas programáticas filtradas com base no programa selecionado
  return programaticAreas.value.filter(area => area.program_id === selectedProgramId);
};

onMounted(() => {  
  programs.value = programService.getProgramList()
  programaticAreas.value = programmaticAreaService.piniaGetAll()
  mentorProgrammaticAreas.value = selectedMentor.value.tutorProgrammaticAreas ? 
    selectedMentor.value.tutorProgrammaticAreas.map((item, index) => ({
      id: index + 1,
      programmaticArea: item.programmaticArea,
      acao: item.id,
    })) : [];
  currUser.value = JSON.parse(JSON.stringify((UsersService.getLogedUser())));
});
</script>
