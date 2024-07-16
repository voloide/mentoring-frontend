<template>
  <q-layout view="hHh lpR fFf" style="height: 100%">
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" class="menu">
      <!-- drawer content -->
      <div class="row q-mb-lg">
        <div class="col text-center" style="margin-top: 20%">
          <q-icon name="account_circle" color="white" size="7.4em" />
          <div class="text-grey-1 text-subtitle1 q-mt-md">
            {{ fullName(currUser.employee) }}
          </div>
          <div class="text-grey-1 text-subtitle1 q-mt-sm">
            {{ currUser.employee.email }}
          </div>
        </div>
      </div>

      <q-separator spaced color="white" />
      <div class="row q-mt-md">
        <q-list padding class="text-white col">
          <q-item
            clickable
            v-ripple
            :active="link === 'home'"
            @click="link = 'home'"
            active-class="my-menu-link"
            to="/home"
            exact
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Início</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'tables'"
            @click="link = 'tables'"
            active-class="my-menu-link"
            to="/tables"
            v-if="defineVisibleMenuOptions('/tables')"
          >
            <q-item-section avatar>
              <q-icon name="fact_check" />
            </q-item-section>
            <q-item-section>Tabelas de Competências</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'mentores'"
            @click="link = 'mentores'"
            active-class="my-menu-link"
            to="/mentors"
            v-if="defineVisibleMenuOptions('/mentors')"
            exact
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>

            <q-item-section>Mentores</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'mentorandos'"
            @click="link = 'mentorandos'"
            active-class="my-menu-link"
            to="/mentees"
            v-if="defineVisibleMenuOptions('/mentees')"
            exact
          >
            <q-item-section avatar>
              <q-icon name="diversity_3" />
            </q-item-section>

            <q-item-section>Mentorandos</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'earesources'"
            @click="link = 'earesources'"
            active-class="my-menu-link"
            to="/resources"
            v-if="defineVisibleMenuOptions('/resources')"
            exact
          >
            <q-item-section avatar>
              <q-icon name="library_books" />
            </q-item-section>

            <q-item-section>Recursos de EA</q-item-section>
          </q-item>

          <q-item
              clickable
              v-ripple
              :active="link === 'rondas'"
              @click="link = 'rondas'"
              active-class="my-menu-link"
              to="/rondas"
              v-if="defineVisibleMenuOptions('/rondas')"
              exact
          >
            <q-item-section avatar>
              <q-icon name="playlist_add_check_circle" />
            </q-item-section>

            <q-item-section>Rondas/Ciclos de Mentoria</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'reports'"
            @click="link = 'reports'"
            active-class="my-menu-link"
            style="margin-bottom: 50%"
            v-if="defineVisibleMenuOptions('/reports')"
          >
            <q-item-section avatar>
              <q-icon name="legend_toggle" />
            </q-item-section>

            <q-item-section>Relatórios</q-item-section>
          </q-item>

          <q-separator spaced color="white" />

          <q-item
            clickable
            v-ripple
            :active="link === 'settings'"
            @click="link = 'settings'"
            active-class="my-menu-link"
            to="/settings"
            v-if="defineVisibleMenuOptions('/settings')"
            exact
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Configurações</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'logout'"
            @click="logout"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>Log out</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
    <q-page-container style="padding-top: 10px; height: 100%">
      <q-banner
        dense
        inline-actions
        class="text-white bg-primary q-mx-md q-px-md text-center"
      >
        Mentoria
        <template v-slot:action>
          <q-img src="~assets/mentoring.png" />
        </template>
      </q-banner>
      <router-view style="height: 100%" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onBeforeMount} from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import { Loading, QSpinnerRings } from 'quasar';
import { useRouter } from 'vue-router';
import useEmployee from 'src/composables/employee/employeeMethods';
import useUser from "src/composables/user/userMethods";

const leftDrawerOpen = ref(false);
const link = ref('home');
const router = useRouter();
const { fullName } = useEmployee();
const { createUserFromDTO } = useUser();

const menuOptions = ["/tables", "/mentors", "/mentees", "/resources", "/rondas", "/settings", "/reports"];

const currUser = computed(() => {
  return UsersService.getLogedUser();
});

onBeforeMount(() => {
      initUserInfo();
    });


const initUserInfo =()=> {
  const currentTimestamp = Date.now();
  const tokenExpiration = localStorage.getItem('tokenExpiration');

  if (tokenExpiration > currentTimestamp) {
    const userInfo = localStorage.getItem('userInfo');
    const user = createUserFromDTO(JSON.parse(userInfo));
    UsersService.piniaSave(user);
  } else {
    UsersService.logout();
  }
};

const logout = () => {
  Loading.show({
    spinner: QSpinnerRings,
  });
  UsersService.logout();
  Loading.hide();
  router.push({ path: '/login' });
};

const defineVisibleMenuOptions = (menuOptionValue: any) => {

  const userData = localStorage.getItem('userData');
  const roles = userData.roles;
  roles.forEach(role => {

    if(role === "NATIONAL_ADMINISTRATOR") {

      if (menuOptions[0]===menuOptionValue || menuOptions[1]===menuOptionValue 
          || menuOptions[2]===menuOptionValue || menuOptions[3]===menuOptionValue 
          || menuOptions[4]===menuOptionValue || menuOptions[5]===menuOptionValue) {
        return true;
      }

    }
    if(role === "PROVINCIAL_ADMINISTRATOR") {

      if (menuOptions[0]===menuOptionValue || menuOptions[1]===menuOptionValue 
          || menuOptions[2]===menuOptionValue || menuOptions[4]===menuOptionValue 
          || menuOptions[5]===menuOptionValue) {
        return true;
      }

    }
    if(role === "DISTRICT_ADMINISTRATOR") {

      if (menuOptions[2]===menuOptionValue || menuOptions[4]===menuOptionValue 
          || menuOptions[5]===menuOptionValue
      ) {
        return true;
      }

    }
    if(role === "NATIONAL_MENTOR" || role === "PROVINCIAL_MENTOR" || role === "DISTRICT_MENTOR") {

      if (menuOptions[6]===menuOptionValue) {
        return true;
      }

    }
    if(role === "HEALTH_FACILITY_MENTOR") {

      if (menuOptions[1]===menuOptionValue || menuOptions[4]===menuOptionValue 
          || menuOptions[3]===menuOptionValue || menuOptions[6]===menuOptionValue) {
        return true;
      }

    }
    if(role === "MENTEE") {

      if (menuOptions[5]===menuOptionValue || menuOptions[6]===menuOptionValue) {
        return true;
      }
      
    }

    return false;
    
  });

}

</script>
<style lang="scss">
.menu {
  background-color: $primary;
}
.my-menu-link {
  color: black;
  background: white;
}
</style>
