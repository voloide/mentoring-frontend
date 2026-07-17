<template>
  <div class="login-screen row items-center justify-center">
    <div class="login-blob login-blob--one"></div>
    <div class="login-blob login-blob--two"></div>

    <div class="login-wrap">
      <div class="login-brand column items-center">
        <div class="login-brand__logo">
          <q-img src="~assets/mentoring.png" fit="contain" />
        </div>
        <div class="login-brand__title">Mentoria</div>
      </div>

      <q-card flat class="login-card">
        <q-card-section class="login-card__section">
          <div class="login-card__heading">Bem-vindo de volta</div>
          <div class="login-card__subheading">Inicia sessão para continuar</div>

          <q-form class="q-mt-lg" @submit.prevent="authUser">
            <q-input
              outlined
              class="login-input"
              ref="usernameRef"
              v-model="username"
              label="Utilizador"
              :rules="[
                (val) =>
                  val.length >= 3 ||
                  'O nome do utilizador deve ter um minimo de 4 caracteres',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              class="login-input q-mt-md"
              outlined
              v-model="password"
              ref="passwordRef"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              :rules="[
                (val) =>
                  val.length >= 4 ||
                  'A senha deve ter um minimo de 4 caracteres',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock_open" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-btn
              :loading="submitting"
              class="login-submit q-mt-lg"
              unelevated
              rounded
              type="submit"
              label="Entrar"
              no-caps
            />
          </q-form>

          <div class="row justify-center q-mt-sm" v-if="false">
            <q-btn
              flat
              no-caps
              color="primary"
              @click="showForgotPassword = true"
            >
              Esqueceu a Password?
            </q-btn>
          </div>

          <div class="login-version">v{{ appVersion }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-dialog v-model="showForgotPassword">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-center">Recuperar Password</div>
        <div class="q-mt-md">
          <q-input
            v-model="recoveryEmail"
            type="email"
            label="Email"
            outlined
            dense
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          label="Enviar"
          color="light-blue-10"
          :loading="submittingRecovery"
          @click="sendRecoveryEmail"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import { useUserStore } from 'src/stores/user/UserStore';
import { useRouter } from 'vue-router';
import { Loading, QSpinnerRings } from 'quasar';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import { version } from '../../../package.json';

const username = ref('');
const password = ref('');
const usernameRef = ref(null);
const passwordRef = ref(null);
const submitting = ref(false);
const showPassword = ref(false);
const router = useRouter();
const { alertSucess, alertError } = useSwal();
const appVersion = version;

const showForgotPassword = ref(false);
const recoveryEmail = ref('');
const submittingRecovery = ref(false);
const UserStore = useUserStore();

const sendRecoveryEmail = async () => {
  console.log('recoveryEmail.value', recoveryEmail.value);
  if (!recoveryEmail.value) {
    alertError('Por favor insira um email válido.');
    return;
  }

  submittingRecovery.value = true;

  try {
    await UserStore.forgotPassword({
      email: recoveryEmail.value,
      channel: 'WEB', // sempre WEB no login web
      deviceId: null, // sem deviceId para WEB
    });
    submittingRecovery.value = false;
    showForgotPassword.value = false;
    alertSucess('Email enviado com sucesso. Verifique sua caixa de correio.');
    recoveryEmail.value = '';
  } catch (err) {
    submittingRecovery.value = false;
    alertError(
      err.response?.data?.message || 'Erro ao enviar email de recuperação.'
    );
  }
};

const authUser = async () => {
  Loading.show({
    spinner: QSpinnerRings,
  });
  usernameRef.value.validate();
  passwordRef.value.validate();

  if (!passwordRef.value.hasError && !usernameRef.value.hasError) {
    UsersService.login({
      username: username.value,
      password: password.value,
    })
      .then((response) => {
        submitting.value = false;

        if (response !== undefined && response.status === 200) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('refresh_token', response.data.refresh_token);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem(
            'userInfo',
            JSON.stringify(response.data.userInfo)
          );
          localStorage.setItem('tokenExpiration', String(Date.now() + 900000));
          localStorage.setItem('userData', JSON.stringify(response.data));

          UsersService.startTokenSynchronization();
          router.push({ path: '/' });
        } else {
          alertError(response.response.data.message);
        }
        Loading.hide();
      })
      .catch((error) => {
        Loading.hide();
        submitting.value = false;
        alertError(error.response.data.message);
      });
  }
};
</script>

<style lang="scss" scoped>
.login-screen {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 24px;
  background: linear-gradient(
    135deg,
    darken($primary, 18%) 0%,
    $primary 55%,
    lighten($primary, 12%) 100%
  );
}

.login-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(0px);
  opacity: 0.35;
  pointer-events: none;

  &--one {
    width: 420px;
    height: 420px;
    top: -140px;
    left: -120px;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 70%);
  }

  &--two {
    width: 340px;
    height: 340px;
    bottom: -120px;
    right: -100px;
    background: radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.35), transparent 70%);
  }
}

.login-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  animation: login-rise 0.45s ease-out;
}

@keyframes login-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-brand {
  margin-bottom: 20px;

  &__logo {
    width: 96px;
    height: 96px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    :deep(.q-img) {
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    margin-top: 14px;
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }
}

.login-card {
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  &__section {
    padding: 32px 28px 24px;
  }

  &__heading {
    font-size: 20px;
    font-weight: 700;
    color: $dark;
    text-align: center;
  }

  &__subheading {
    font-size: 13px;
    color: #8a8f98;
    text-align: center;
    margin-top: 4px;
  }
}

.login-input {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.login-submit {
  width: 100%;
  height: 46px;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: linear-gradient(135deg, $primary, darken($primary, 10%));
  color: #fff;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 10px 24px rgba(22, 143, 199, 0.4);
    transform: translateY(-1px);
  }
}

.login-version {
  margin-top: 18px;
  text-align: center;
  font-size: 11px;
  color: #b7bcc5;
}
</style>
