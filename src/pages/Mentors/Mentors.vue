<template>
    <div class="q-pt-sm" style="height: 100%;">
    
        <div class="q-ma-md q-pa-md page-container">
            <div class="row">
                <q-input
                    outlined
                    label="Nome"
                    dense
                    ref="nameRef"
                    class="col"
                    v-model="searchParams.employee.name"
                    @update:model-value="(value) => (filter = value)"
                >
                    <template
                    v-slot:append
                    >
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
                    @update:model-value="(value) => (filter = value)"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="searchParams.employee.nuit = ''"
                        class="cursor-pointer"
                    />
                    </template>
                </q-input>

                <q-input
                    outlined
                    label="Telefone"
                    dense
                    ref="phoneRef"
                    class="col q-ml-md"
                    v-model="searchParams.employee.phoneNumber"
                    @update:model-value="(value) => (filter = value)"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="searchParams.employee.phoneNumber = ''"
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
                                {{ props.row.employee.name }}
                            </q-td>
                            <q-td key="category" :props="props">
                                {{ props.row.employee.professionalCategory.description }}
                            </q-td>
                            <q-td key="gender" :props="props">
                                {{ props.row.employee.professionalCategory.phoneNumber }}
                            </q-td>
                            <q-td key="options" :props="props">
                            <div class="col">
                                <q-btn
                                flat
                                round
                                class="q-ml-md"
                                color="green-8"
                                icon="person_search"
                                @click="manageMentoringAreas(props.row)"
                                >
                                <q-tooltip class="bg-green-5">Gerir áreas de mentoria</q-tooltip>
                                </q-btn>

                                <q-btn
                                flat
                                round
                                class="q-ml-md"
                                color="green-8"
                                icon="file_download"
                                @click="editMentor(props.row)"
                                >
                                <q-tooltip class="bg-green-5">Detalhar/Editar</q-tooltip>
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
                    <q-fab-action label-position="left" color="primary" @click="onClick" icon="edit_square" label="Criar" />
                    <q-fab-action label-position="left" color="secondary" @click="onClick" icon="cloud_upload" label="Importar" />
                </q-fab>
            </q-page-sticky>
        </div>
    </div>
</template>
<script setup>
import { useEmployee } from 'src/composables/employee/employeeMethods'
import mentorService from 'src/services/api/mentor/mentorService'
import Mentor from 'src/stores/model/mentor/Mentor'
import Employee from 'src/stores/model/employee/Employee'
import { ref } from 'vue'


const searchParams = ref(new Mentor({
                            employee: new Employee()
                        }));
const { fullName } = useEmployee;
const searchResults = ref([]);
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
  { name: 'contact', align: 'left', label: 'Telefone', sortable: false }
];

const search = () => {
    const params = {
        userId: 4,
        name: searchParams.value.employee.name,
        surname: searchParams.value.employee.surname,
        nuit: searchParams.value.employee.phoneNumber,
    }
    Object.keys(params).forEach( (key) => (params[key] === '') && delete params[key]);

    console.log(params);
    mentorService.search(params).then((response) => {
        console.log(response);
        searchResults.value = mentorService.getMentorList();
        console.log(searchResults.value);
    }).catch((error) => {
        console.log(error);
      });
};

</script>