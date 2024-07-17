<template>
  <div>
    <div class="q-ma-md page-container">
      <form ref="myForm">
        <div class="q-ma-md">
          <q-banner dense inline-actions class="text-white bg-primary q-px-md">
            Dados do User
            <template v-slot:action>
              <q-img src="~assets/mentoring.png" />
            </template>
          </q-banner>
          <div class="page-input-container q-pa-md">
            <div class="q-mt-lg">
              <div class="row items-center q-mb-md">
                <q-icon name="person_outline" size="sm" />
                <span class="q-pl-sm text-subtitle2"
                  >Identificação do User</span
                >
              </div>
              <q-separator color="grey-13" size="1px" />
            </div>
            <div class="row q-my-sm">
              <q-input
                outlined
                disable=""
                label="Nome"
                dense
                ref="nameRef"
                :rules="[(val) => !!val || 'Por favor indicar o nome']"
                lazy-rules
                class="col"
                v-model="user.employee.name"
                @update:model-value="(value) => (filter = value)"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="user.employee.name = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
              <q-input
                outlined
                disable=""
                label="Apelido"
                dense
                :rules="[(val) => !!val || 'Por favor indicar o apelido']"
                lazy-rules
                ref="surnameRef"
                class="col q-ml-md"
                v-model="user.employee.surname"
                @update:model-value="(value) => (filter = value)"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="user.employee.surname = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>

            <div class="q-mt-lg">
              <div class="row items-center q-mb-md">
                <q-icon name="lock_outline" size="sm" />
                <span class="q-pl-sm text-subtitle2">Credenciais</span>
              </div>
              <q-separator color="grey-13" size="1px" />
            </div>

            <div class="row q-my-sm">
              <q-input
                outlined
                label="Password"
                type="password"
                dense
                ref="passwordRef"
                :rules="[(val) => !!val || 'Por favor indicar a password']"
                lazy-rules
                class="col"
                v-model="user.password"
                @update:model-value="(value) => (filter = value)"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="user.password = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>

              <q-input
                outlined
                label="Confirma a Password"
                type="password"
                dense
                :rules="[(val) => !!val || 'Por favor confirma a password']"
                lazy-rules
                ref="confirmPasswordRef"
                class="col q-ml-md"
                v-model="user.confirmPassword"
                @update:model-value="(value) => (filter = value)"
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click="user.confirmPassword = ''"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </div>

            <div class="row q-my-sm">
              <q-checkbox
                class="col"
                v-model="user.shouldResetPassword"
                label="Deve redefinir password no próximo login"
              />
            </div>

            <div class="row q-my-sm">
              <q-space />
              <q-btn
                label="Cancelar"
                class="float-right"
                color="red"
                @click="$emit('cancel')"
              />
              <q-btn
                class="float-right q-ml-md"
                type="submit"
                label="Submeter"
                color="primary"
                @click="submitForm()"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, onMounted } from 'vue';
import User from 'src/stores/model/user/User';
import Employee from 'src/stores/model/employee/Employee';
import Location from 'src/stores/model/location/Location';
import useUser from 'src/composables/user/userMethods';
import userService from 'src/services/api/user/UsersService';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { Loading, QSpinnerRings } from 'quasar';

const user = ref(
  new User({
    employee: new Employee({
      locations: [
        {
          location: new Location(),
        },
      ],
    }),
  })
);

const emit = defineEmits(['cancel', 'close']);

const { createDTOFromUser } = useUser();
const { alertSucess, alertError } = useSwal();
const selectedUserLaborInfo = ref('');

//Ref's
const nameRef = ref(null);
const surnameRef = ref(null);
const passwordRef = ref(null);
const confirmPasswordRef = ref(null);
const selectedUser = inject('selectedUser');

if (!selectedUser) {
  throw new Error('selectedUser not provided');
}

const init = () => {
  user.value = Object.assign({}, selectedUser?.value);
  selectedUserLaborInfo.value =
    user.value.employee.partner.name === 'MISAU' ? 'SNS' : 'ONG';
  user.value.shouldResetPassword = true;
};
onMounted(() => {
  init();
});

const myForm = ref(null);

const submitForm = () => {
  if (user.value.password != user.value.confirmPassword) {
    alertError('As senhas inseridas não coincidem, corrija as senhas!');
    return;
  }
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  if (!passwordRef.value.hasError && !confirmPasswordRef.value.hasError) {
    Loading.show({
      spinner: QSpinnerRings,
    });
    const target_copy = Object.assign({}, user.value);

    userService
      .resetPassword(createDTOFromUser(new User(target_copy)))
      .then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
          alertSucess('Password actualizada.').then(() => {
            emit('cancel');
          });
        } else {
          alertError(resp?.message);
        }
        Loading.hide();
      })
      .catch((error) => {
        Loading.hide();
        console.error('Error', error);
      });
  }
};
</script>
<style></style>
