<template>
  <v-list three-line style="height: 88vh" class="overflow-y-auto">
    <template v-for="(item, index) in items">
      <v-subheader v-if="item.header" :key="item.header" v-text="item.header"></v-subheader>
      <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>
      <v-list-item v-else :key="item.title" @click="routing(item.id)">
        <v-list-item-avatar>
          <v-img :src="item.avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="item.title"></v-list-item-title>
          <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import axios from "axios";

export default {
  name: "UserList",
  data: () => ({
    items: []
  }),
  mounted() {
    axios.get('chat').then(res => this.chatConstruct(res.data));
    setInterval(() => {
      axios.get('chat').then(res => {
        this.items =[];
        this.chatConstruct(res.data)
      });
    },30000);
  },
  methods: {
    routing(id) {
      this.$router.push({ name: 'Chat',params:{id:id} });
    },
    chatConstruct(data){
      data.forEach(item=>{
        this.items.push(
            {
              id: item.id,
              title: item.name,
              avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
              subtitle: '',
            });
        this.items.push({divider: true, inset: true});
      });
    },
  }
}
</script>

<style scoped>

</style>