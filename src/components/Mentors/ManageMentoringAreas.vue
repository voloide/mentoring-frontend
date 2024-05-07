<template>
    <div class="q-pt-sm" style="height: 100%;">
        <div class="q-ma-md q-pa-md page-container">
            <q-banner dense inline-actions class="text-white bg-primary  q-px-md">
                    Dados do Mentor
                    <template v-slot:action>
                        <q-img src="~assets/mentoring.png" />
                    </template>
                </q-banner>
        </div>
    </div>
</template>
<script setup>
import useEmployee from 'src/composables/employee/employeeMethods'
import UsersService from 'src/services/api/user/userService';
import { onMounted, ref, inject, provide } from 'vue'
import User from 'src/stores/model/user/User'

const { fullName } = useEmployee();
const step = inject('step');
const selectedMentor = inject('selectedMentor');

const currUser = ref(new User())

onMounted(() => {
    currUser.value = JSON.parse(JSON.stringify((UsersService.getLogedUser())));
});

</script>
