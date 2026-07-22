<template>
  <q-page class="home-page column items-center justify-center">
    <q-icon name="waving_hand" size="48px" color="primary" />
    <div class="home-page__title">Olá, {{ firstName }}</div>
    <div class="home-page__subtitle">
      Bem-vindo(a) de volta ao Mentoria
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import useEmployee from 'src/composables/employee/employeeMethods';

const { fullName } = useEmployee();

const currUser = computed(() => UsersService.getLogedUser());
const firstName = computed(() => {
  const name = fullName(currUser.value?.employee || {});
  return name ? name.split(' ')[0] : 'Utilizador';
});
</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  text-align: center;

  &__title {
    margin-top: 12px;
    font-size: 22px;
    font-weight: 700;
    color: $dark;
  }

  &__subtitle {
    margin-top: 4px;
    font-size: 14px;
    color: #8a8f98;
  }
}
</style>
