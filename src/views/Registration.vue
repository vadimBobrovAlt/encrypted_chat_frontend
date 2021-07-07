<template>
  <v-container>
    <v-alert border="right" colored-border type="error" class="mt-5" elevation="2" v-if="error_message">
      <ul v-if="typeof error_message === 'object'">
        <li v-for="value in error_message">
          <ul v-if="typeof value === 'object'">
            <li v-for="val in value">
              <ul v-if="typeof val === 'object'">
                <li v-for="v in val">
                  {{ v }}
                </li>
              </ul>
              <span v-else>{{ val }}</span>
            </li>
          </ul>
          <span v-else>{{ value }}</span>
        </li>
      </ul>
      <span v-else>{{ error_message }}</span>
    </v-alert>
    <v-alert border="right" colored-border
             color="deep-purple accent-4" type="info" class="mt-5" elevation="2" v-if="sucsess_message">
      {{ sucsess_message }}
    </v-alert>

    <v-card elevation="1" max-width="400" :loading='loading' class="pt-0 ml-auto mr-auto mt-16 text-center">
      <v-form ref="form" v-model="valid" class="pa-3 mt-4">

        <h2 class="mb-4">Registration</h2>

        <v-text-field v-model="user.phone"
                      :rules="phoneRules" label="Телефон" outlined dense required></v-text-field>

        <v-text-field v-model="user.name"
                      :rules="nameRules" label="Никнэйм" outlined dense required></v-text-field>

        <v-text-field v-model="user.password"
                      :rules="passwordRules"
                      :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show_password = !show_password"
                      :type="show_password ? 'text' : 'password'"
                      outlined dense label="Пароль" required></v-text-field>

        <v-btn :disabled="!valid" color="success" class="mr-4" @click="register()">Регистрация</v-btn>

      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Registration",
  data: () => ({
    // system
    error_message: null,
    sucsess_message: null,
    valid: true,
    loading:false,
    show_password:true,

    user:{
      phone:'',
      name:'',
      password:'',
      avatar_url:'',
      app_name:'Web'
    },

    phoneRules: [
      v => !!v || 'Поле обязательно к заполнению',
      v => /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(v) || 'Телефон введен неверно',
    ],

    nameRules: [
      v => !!v || 'Поле обязательно к заполнению',
    ],

    passwordRules: [
      v => !!v || 'Name is required',
      v => (v && v.length >= 8) || 'Длина пароля должна быть не короче 8 символов',
    ],

  }),
  methods: {
    register() {
      this.loading = true;
      axios.post('auth/register',this.user)
          .then(res => {
            this.sucsessMessage(res.data.message);
            setTimeout(() => {
              this.$router.push({ name: 'Auth' })
            }, 1000);
          })
          .catch(err => {
            this.errorMessage(err.response);
          });
    },
    sucsessMessage(message) {
      this.loading = false;
      this.sucsess_message = message;
      setTimeout(() => this.sucsess_message = null, 3000);
    },
    errorMessage(err) {
      this.loading = false;
      this.error_message = err.data;
      setTimeout(() => this.error_message = null, 3000);
    },
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
</style>