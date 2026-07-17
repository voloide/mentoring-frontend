<template>
 <div>wewerwe</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { UserDTO } from 'src/services/dto/user/UserDTO'
import User from 'src/stores/model/user/User'
import { plainToClass } from 'class-transformer';
onMounted(() => {
  transformTest();
});
const transformTest = () => {
  const userPinia = new User({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    age: 30,
    password: 'secretpass'
  });
  plainToClass(UserDTO, userPinia, { excludeExtraneousValues: true });
}
</script>
