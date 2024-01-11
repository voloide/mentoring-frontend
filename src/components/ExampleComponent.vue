<template>
 <div>wewerwe</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { UserDTO } from 'src/services/dto/user/UserDTO'
import User from 'src/stores/model/user/User'
import { plainToClass, instanceToInstance, instanceToPlain } from 'class-transformer';
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

  const userDTO1 = new UserDTO({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    age: 30,
    password: "secretpass"
  });

  console.log(userDTO1);
  const u = new User({
    id: 10,
    uuid: 'dasdasdasdasdasd',
    firstName: userDTO.firstName,
    lastName: userDTO.lastName,
    email: userDTO.email
  })

  console.log(u);
}
</script>
