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

        <h2 class="mb-4">Auth</h2>

        <v-text-field v-model="user.phone"
            :rules="phoneRules" label="Телефон" outlined dense required></v-text-field>

        <v-text-field v-model="user.password"
                      :rules="passwordRules"
                      :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show_password = !show_password"
                      :type="show_password ? 'text' : 'password'"
                      outlined dense label="Пароль" required></v-text-field>

        <v-btn :disabled="!valid" color="success"  class="mr-4" @click="login()">Login</v-btn>

        <router-link :to="{name:'Registration'}">REGISTRATION</router-link>

      </v-form>
    </v-card>

    <v-dialog v-model="dialog_auth" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Check code</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="Code" v-model="two_factor" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog_auth = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="twoFactor()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

import axios from "axios";

export default {
  name: "Auth",
  data: () => ({
    // system
    error_message: null,
    sucsess_message: null,
    valid: true,
    loading:false,
    show_password:true,
    dialog_auth:false,

    user:{
      phone:'',
      password:'',
      app_name:'Web'
    },

    two_factor:'',

    phoneRules: [
      v => !!v || 'Поле обязательно к заполнению',
      v => /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(v) || 'Телефон введен неверно',
    ],

    passwordRules: [
      v => !!v || 'Поле обязательно к заполнению',
      v => (v && v.length >= 8) || 'Длина пароля должна быть не короче 8 символов',
    ],
  }),
  methods: {
    login() {
      this.loading = true;
      axios.post('auth/login',this.user)
          .then(res => {
            localStorage.setItem('token', res.data.token)
            axios.defaults.headers.common['Authorization'] ='Bearer ' + localStorage.token;
            this.sucsessMessage(res.data.message);
            this.dialog_auth = true;
          })
          .catch(err => {
            this.errorMessage(err.response);
          });
    },
    twoFactor(){
      axios.post('auth/twoFactor',{ code: this.two_factor})
          .then(res => {
            if(res.data.two_factor_status){
              localStorage.setItem('user', JSON.stringify(res.data.user))
              localStorage.setItem('two_factor', true);
              this.sucsessMessage(res.data.message);
              this.dialog_auth=false;
              setTimeout(() => {
                this.$router.push({ name: 'UserList' })
              }, 1000);
            }
            this.errorMessage('Некорректный код');
          })
          .catch(err => {
            this.errorMessage(err.response);
          });
    },
    sucsessMessage(message) {
      this.loading = false;
      this.sucsess_message = message;
      setTimeout(() => this.sucsess_message = null, 2000);
    },
    errorMessage(err) {
      this.loading = false;
      this.error_message = err.data;
      setTimeout(() => this.error_message = null, 2000);
    },
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
</style>