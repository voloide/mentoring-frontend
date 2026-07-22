<template>
  <q-layout view="hHh lpR fFf" style="height: 100%">
    <q-header class="app-header" bordered>
      <q-toolbar class="app-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="lt-md"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-avatar size="32px" class="app-toolbar__logo">
          <q-img src="~assets/mentoring.png" fit="contain" />
        </q-avatar>
        <q-toolbar-title class="app-toolbar__title">Mentoria</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="menu"
    >
      <!-- Drawer content -->
      <div class="menu-profile column items-center">
        <q-avatar size="72px" class="menu-profile__avatar">
          <q-icon name="account_circle" color="white" size="72px" />
        </q-avatar>
        <div class="menu-profile__name">
          {{ fullName(currUser?.employee || {}) }}
        </div>
        <div class="menu-profile__email">
          {{ currUser?.employee?.email || 'N/A' }}
        </div>
      </div>

      <q-list padding class="menu-list">
        <q-item
          v-for="menuOption in visibleMenuOptions"
          :key="menuOption.link"
          clickable
          v-ripple
          :active="link === menuOption.link"
          @click="link = menuOption.link"
          active-class="menu-list__item--active"
          class="menu-list__item"
          :to="menuOption.to"
          exact
        >
          <q-item-section avatar>
            <q-icon :name="menuOption.icon" />
          </q-item-section>
          <q-item-section>{{ menuOption.label }}</q-item-section>
        </q-item>
      </q-list>

      <q-list padding class="menu-list menu-list--footer">
        <q-item
          clickable
          v-ripple
          :active="link === 'logout'"
          @click="logout"
          active-class="menu-list__item--active"
          class="menu-list__item"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>Log out</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container style="height: 100%">
      <router-view style="height: 100%" />
    </q-page-container>

    <!-- Warning Dialog -->
    <q-dialog v-model="showWarningDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Aviso de Inatividade</div>
          <p>Você será desconectado devido à inatividade em {{ warningTime / 1000 }} segundos.</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Stay Logged In" color="primary" @click="stayLoggedIn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';
import UsersService from 'src/services/api/user/UsersService';
import { Loading, QSpinnerRings, LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import useEmployee from 'src/composables/employee/employeeMethods';
import useUser from 'src/composables/user/userMethods';

const leftDrawerOpen = ref(false);
const link = ref('home');
const router = useRouter();
const { fullName } = useEmployee();
const { createUserFromDTO } = useUser();

const menuOptions = [
  { label: 'Início', icon: 'home', to: '/home', link: 'home' },
  { label: 'Tabelas de Competências', icon: 'fact_check', to: '/tables', link: 'tables' },
  { label: 'Mentores', icon: 'person', to: '/mentors', link: 'mentores' },
  { label: 'Mentorandos', icon: 'diversity_3', to: '/mentees', link: 'mentorandos' },
  { label: 'Recursos de EA', icon: 'library_books', to: '/resources', link: 'earesources' },
  { label: 'Rondas/Ciclos de Mentoria', icon: 'playlist_add_check_circle', to: '/rondas', link: 'rondas' },
  { label: 'Relatórios', icon: 'legend_toggle', to: '/reports', link: 'reports' },
  { label: 'Configurações', icon: 'settings', to: '/settings', link: 'settings' },
];

let inactivityTimer; // Store the inactivity timer
let warningTimer; // Store the warning timer
const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutes
const WARNING_TIME = 30 * 1000; // Show warning 30 seconds before logout
const warningTime = ref(WARNING_TIME);
const showWarningDialog = ref(false);

const currUser = computed(() => UsersService.getLogedUser());

onBeforeMount(() => {
  initUserInfo();
});

onMounted(() => {
  startInactivityTracking();
  UsersService.startTokenSynchronization();
});

onBeforeUnmount(() => {
  stopInactivityTracking();
});

const initUserInfo = () => {
  const tokenExpiration = Number(localStorage.getItem('tokenExpiration'));

  if (tokenExpiration > Date.now()) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    UsersService.piniaSave(createUserFromDTO(userInfo));
  } else {
    UsersService.logout();
    router.push('/login');
  }
};

const visibleMenuOptions = computed(() =>
  menuOptions.filter(option => isMenuOptionVisible(option.to))
);

const isMenuOptionVisible = menuOption => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const roles = userData.roles || [];

  const rolePermissions = {
    NATIONAL_ADMINISTRATOR: ['/home', '/tables', '/mentors', '/mentees', '/resources', '/rondas', '/settings'],
    PROVINCIAL_ADMINISTRATOR: ['/home', '/tables', '/mentors', '/mentees', '/rondas', '/settings'],
    DISTRICT_ADMINISTRATOR: ['/home', '/mentees', '/rondas', '/settings'],
    NATIONAL_MENTOR: ['/home', '/reports', '/mentees'],
    PROVINCIAL_MENTOR: ['/home', '/reports', '/mentees'],
    DISTRICT_MENTOR: ['/home', '/reports', '/mentees'],
    HEALTH_FACILITY_MENTOR: ['/home', '/mentees', '/resources', '/reports'],
    MENTEE: ['/home', '/resources'],
  };

  const allowedPaths = roles.reduce((paths, role) => {
    const rolePaths = rolePermissions[role] || [];
    return [...new Set([...paths, ...rolePaths])]; // Merge paths without duplicates
  }, []);

  return allowedPaths.includes(menuOption);
};

const logout = () => {
  Loading.show({ spinner: QSpinnerRings });
  UsersService.logout();
  Loading.hide();
  router.push('/login');
};

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
  showWarningDialog.value = false;

  const tokenExpiration = Number(LocalStorage.getItem('tokenExpiration'));
  const currentTime = Date.now();

  if (tokenExpiration <= currentTime) {
    logout();
  } else {
    warningTimer = setTimeout(() => {
      showWarningDialog.value = true;
      warningTime.value = WARNING_TIME;
      const countdown = setInterval(() => {
        warningTime.value -= 1000;
        if (warningTime.value <= 0) clearInterval(countdown);
      }, 1000);
    }, INACTIVITY_TIME - WARNING_TIME);

    inactivityTimer = setTimeout(logout, INACTIVITY_TIME);
  }
};

const startInactivityTracking = () => {
  const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.addEventListener(event, resetInactivityTimer);
  });

  resetInactivityTimer();
};

const stopInactivityTracking = () => {
  const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.removeEventListener(event, resetInactivityTimer);
  });

  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
};

const stayLoggedIn = () => {
  showWarningDialog.value = false;
  resetInactivityTimer();
};
</script>

<style lang="scss">
.app-header {
  background: #fff;
  color: $dark;
}

.app-toolbar {
  min-height: 56px;

  &__logo {
    margin-left: 4px;
  }

  &__title {
    margin-left: 10px;
    font-weight: 700;
    color: $primary;
  }
}

.menu {
  background: linear-gradient(180deg, $primary 0%, darken($primary, 12%) 100%);
}

.menu-profile {
  padding: 28px 16px 20px;

  &__avatar {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
  }

  &__name {
    margin-top: 12px;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    text-align: center;
  }

  &__email {
    margin-top: 2px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 12px;
    text-align: center;
  }
}

.menu-list {
  &--footer {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  &__item {
    color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    margin: 2px 10px;

    &--active {
      color: $primary;
      background: #fff;
      font-weight: 600;
    }
  }
}
</style>
