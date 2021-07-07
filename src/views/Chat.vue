<template>
  <div style="background-color: #f2f2f2;">
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
    <div class="chat-container" ref="chatContainer" id="scroll-target">
      <div class="message" v-for="(message,index) in messages" v-bind:key="index"
           :class="{own: message.user == username}" id="scrolled-content">
        <div class="username" v-if="index>0 && messages[index-1].user != message.user">{{ message.user }}</div>
        <div class="username" v-if="index == 0">{{ message.user }}</div>
        <div style="margin-top: 5px"></div>
        <div class="content">
          <div v-html="message.content"></div>
        </div>
      </div>
    </div>
    <div class="typer pb-4">
      <v-text-field
          solo
          rounded
          label="Message"
          hide-details
          @keyup.enter="sendMessage()"
          @click:append="sendMessage()"
          append-icon="mdi-send" v-model="content">
      </v-text-field>
    </div>

    <v-dialog v-model="dialog_secret" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Check secret</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="Code" v-model="secret" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="exitDialog()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="checkSecret()">Check</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Chat",
  data() {
    return {
      error_message: null,
      sucsess_message: null,
      secret: '',
      dialog_secret: true,
      content: '',
      messages: [],
      username: '',
      user_id: null,

      winHeight: window.innerHeight * 0.7 + "px",
      container: null,
      elem: null,
      scrollTop: 400
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.user);
    this.username = user.name;
    this.user_id = user.id;
    setInterval(() => {
      this.loadChat();
    }, 25000);
  },
  methods: {
    checkSecret() {
      if (this.secret)
        this.loadChat();
    },
    exitDialog() {
      this.$router.push({name: 'UserList'})
      this.dialog_secret = false;
    },
    scrollToButton() {
      this.elem = document.getElementById("scrolled-content")
      this.container = document.getElementById("scroll-target")
      this.container.scrollTop = Math.floor(this.elem.offsetHeight)
    },
    loadChat() {
      axios.get('chat/chat'.concat('/', this.$route.params.id, '?secret=', this.secret)).then(res => {
        this.messages = [];
        this.messages = res.data;
        if (res.data.status !== false) this.dialog_secret = false;
        this.scrollToButton();
      }).catch(err => {
        this.errorMessage(err.response);
      });
    },
    sendMessage() {
      const body = {
        'chat_id': this.$route.params.id,
        'user_id': this.user_id,
        'secret': this.secret,
        'message': this.content,
      }
      axios.post('chat/add-message', body)
          .then(res => {
            if (res.data.status) {
              this.content = '';
              this.loadChat();
              this.$vuetify.goTo(document.body.scrollHeight);
            }
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
.scrollable {
  overflow-y: auto;
  height: 96vh;
}

.chat-container {
  box-sizing: border-box;
  height: calc(97.3vh - 112px);
  overflow-y: auto;
}

.message {
  margin: 10px;
}

.message.own {
  text-align: right;
}

.message.own .content {
  background-color: lightskyblue;
}

.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}

.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;

  max-width: 50%;
  word-wrap: break-word;
}

@media (max-width: 480px) {
  .chat-container .content {
    max-width: 60%;
  }
}
</style>