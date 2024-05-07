import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter(o, from, next) {
      const authUser = localStorage.getItem('userInfo');
      if (authUser === null || String(authUser).includes('null')) {
        next('/Login');
      } else {
        next();
      }
    },
    children: [
      {
        path: '/mentors',
        component: () => import('pages/Mentors/Mentors.vue'),
      },
      { path: '/home', component: () => import('pages/home/Home.vue') },
      {
        path: '/mentees',
        component: () => import('pages/Mentees/Mentees.vue'),
      },
      {
        path: '/tables',
        component: () => import('pages/Forms/Forms.vue'),
      },
      {
        path: '/questions',
        component: () => import('pages/Questions/Questions.vue'),
      },
      {
        path: '/programs',
        component: () => import('pages/Programs/Programs.vue'),
      },
      {
        path: '/partners',
        component: () => import('pages/Partners/Partners.vue'),
      },
      {
        path: '/programmatic-areas',
        component: () => import('pages/ProgrammaticArea/ProgrammaticArea.vue'),
      },
      {
        path: '/professional-categories',
        component: () => import('pages/ProfessionalCategories/ProfessionalCategories.vue'),
      },
      {
        path: '/health-facilities',
        component: () => import('pages/HealthFacilities/HealthFacilities.vue'),
      },
      {
        path: '/users',
        component: () => import('pages/Users/Users.vue'),
      },
    ],
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('pages/Login/Login.vue'),
    meta: { requiresAuth: false },
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
