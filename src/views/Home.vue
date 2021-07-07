<template>
  <v-card max-width="600" class="mx-auto" style="height: 100vh">

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


    <v-toolbar color="cyan">
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in menu" :key="i" @click="action(item.action)"
                       v-if="!item.rout || $route.name != item.rout">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-toolbar-title>Encrypted chat</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <div>
      <router-view></router-view>
    </div>

    <v-dialog v-model="dialog_chat" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Create chat</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="Name" v-model="add_chart.name" :rules="nameRules" required></v-text-field>
            <v-text-field label="Secret word" v-model="add_chart.secret" :rules="nameRules" required></v-text-field>
            <v-autocomplete v-model="add_chart.users" :items="users_list" :rules="usersRules"
                            item-text="name"
                            item-value="id"
                            chips small-chips label="Users" multiple></v-autocomplete>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog_chat = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="addChat()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: 'Home',
  data: () => ({
    // system
    error_message: null,
    sucsess_message: null,
    dialog_chat: false,
    dialog_user: false,
    users_list: [],
    users: [],

    add_chart: {
      name: '',
      secret: '',
      users: [],
    },

    nameRules: [
      v => !!v || 'Поле обязательно к заполнению',
      v => (v && v.length >= 6) || 'Длина минимум 6 символов',
    ],

    usersRules: [
      v => !!v || 'Поле обязательно к заполнению',
      v => (v && v.length >= 1) || 'Длина минимум 1 символ',
    ],

    menu: [
      {
        name: 'Add chat',
        action: 'add_chat',
        rout: 'Chat'
      },
      {
        name: 'Exit',
        action: 'logout'
      }
    ],
    items: [],
  }),
  mounted() {
    axios.get('chat/users').then(res => this.users_list = res.data);
    const user = JSON.parse(localStorage.user);
    this.users.push(user.id);
    this.add_chart.users.push(user.id);
  },
  methods: {
    action(action) {
      console.log(action);
      switch (action) {
        case 'logout':
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('two_factor');
          axios.get('auth/logout').then(() => {
          });
          setTimeout(() => {
            this.$router.push({name: 'Auth'})
          }, 1000);
          break;
        case 'add_chat':
          this.dialog_chat = true;
          break;
        case 'add_user':
          this.dialog_user = true;
          break;
      }
    },

    addChat() {
      axios.post('chat/add-chat', this.add_chart)
          .then(res => {
            this.dialog_chat = false;
            this.sucsessMessage(res.data.message);
            this.add_chart = {
              name: '',
              secret: '',
              users: [],
            };
          })
          .catch(err => {
            this.errorMessage(err.response);
          });
    },

    addUser() {
      axios.put('chat/add-user'.concat('/', this.$route.params.id),{users: this.users})
          .then(res => {
            this.dialog_user = false;
            this.sucsessMessage(res.data.message);
            this.users = [];
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
<style>
ul {
  list-style-type: none;
}
</style>