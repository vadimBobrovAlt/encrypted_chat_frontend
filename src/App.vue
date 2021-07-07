<template>
  <v-app>
    <v-main class="main">
        <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),

};
</script>
<style>
.main{
  background-color: #eaf1f7;
}
</style>