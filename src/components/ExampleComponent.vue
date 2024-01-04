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
    password: "secretpass"
  });
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    age: 30,
    password: "secretpass", 
    confirmPassword: "secretpass"
  };
  const userDTO = plainToClass(UserDTO, userPinia, { excludeExtraneousValues: true });
  console.log(userDTO);
}
</script>
