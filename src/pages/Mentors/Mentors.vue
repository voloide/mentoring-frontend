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
                    v-model="name"
                    @update:model-value="(value) => (filter = value)"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="patientId = ''"
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
                    v-model="nuit"
                    @update:model-value="(value) => (filter = value)"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="patientId = ''"
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
                    v-model="phone"
                    @update:model-value="(value) => (filter = value)"
                >
                    <template
                    v-slot:append
                    >
                    <q-icon
                        name="close"
                        @click="patientId = ''"
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
        </div>
    </div>
</template>
<script setup>
import { useEmployee } from 'src/composables/employee/employeeMethods'

const { fullName } = useEmployee();
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
    field: (row) => fullName(row),
    sortable: false,
  },
  { name: 'category', align: 'center', label: 'Categoria Profissional', sortable: false },
  { name: 'contact', align: 'left', label: 'Telefone', sortable: false }
];

const mentorsList = computed(() => {
  return patientService.getPatientSearchList();
});
</script>