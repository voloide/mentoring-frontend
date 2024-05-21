<template>
  <q-card style="width: 85vw; max-width: 90vw">
    <div class="page-container">
      <div class="">
        <q-banner dense inline-actions class="text-white bg-primary q-px-md">
          Utilizadores
        </q-banner>

        <div class="row q-pa-md q-mt-lg">
          <q-input
            outlined
            label="Nome"
            dense
            ref="nameRef"
            class="col q-ml-md"
            v-model="data.name"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.name = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <q-input
            outlined
            label="Apelido"
            dense
            ref="surnameRef"
            class="col q-ml-md"
            v-model="data.surname"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.surname = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>

        <div class="row q-pa-md q-mt-lg">
          <q-input
            outlined
            label="NUIT"
            dense
            ref="nuitRef"
            class="col"
            v-model="data.nuit"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.nuit = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>

        <div class="row q-pa-md q-mt-lg">
          <q-input
            outlined
            label="Numero de Telefone"
            dense
            ref="telephoneRef"
            class="col q-ml-md"
            v-model="data.sequence"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.sequence = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-input
            outlined
            label="E-mail"
            dense
            ref="emailRef"
            class="col q-ml-md"
            v-model="data.email"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.email = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>

        <div class="row q-pa-md q-mt-lg">
          <q-input
            outlined
            label="Nome do Utilizador"
            dense
            ref="usernameRef"
            class="col q-ml-md"
            v-model="data.username"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.username = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-select
            class="row"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            dense
            outlined
            ref="roleRef"
            :rules="[(val) => !!val || 'Por favor indicar o Perfil']"
            lazy-rules
            v-model="data.role"
            :options="roles"
            option-value="id"
            option-label="level"
            label="Perfil de Acesso"
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
        </div>
        <div class="q-mx-md"></div>

        <div class="row q-pa-md q-mt-lg">
          <q-input
            outlined
            label="Password"
            dense
            ref="descriptionRef"
            class="col q-ml-md"
            v-model="data.password"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.password = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <q-input
            outlined
            label="Confirmar Password"
            dense
            ref="confirmarPasswordRef"
            class="col q-ml-md"
            v-model="data.confirmarPassword"
            @update:model-value="(value) => (filter = value)"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="data.confirmarPassword = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>

        <div class="row q-ma-md">
          <q-space />
          <q-btn
            label="Cancelar"
            class="float-right"
            color="red"
            @click="openForm = false"
          />
          <q-btn
            class="float-right q-ml-md"
            type="submit"
            label="Adicionar Seleccionadas"
            color="primary"
            @click="addUser()"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>
<script setup>
import { inject, ref, computed } from 'vue';
import roleService from 'src/services/api/role/roleService';
import userService from 'src/services/api/user/UsersService';

const openForm = inject('openForm');

const data = ref({
  username: '',
  role: '',
  password: '',
  confirmarPassword: '',
  employeeDTO:{
    name: '',
    surname: '',
    nuit: '',
    phoneNumber:'',
    email:'',
    trainingYear:'',
    professionalCategoryDTO: {},
    partnerDTO:{}
  }
});

const roles = computed(() => {
  return roleService.piniaGetAll();
});

const addUser = () => {
  openForm.value = false;
  userService.saveProgram(data)
};
</script>
<style lang="scss">
.title {
  background-color: $primary;
}
</style>
