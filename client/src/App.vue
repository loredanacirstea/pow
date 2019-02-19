<template>
  <v-app>
    <v-content>
        <PoPResource
            :title=title
        />
    </v-content>
  </v-app>
</template>

<script>
import PoPResource from './components/PoPResource.vue';

export default {
  name: 'app',
  components: {
    PoPResource,
  },
  data () {
    return {
        title: 'Clap whenever you like the presentation!',
    }
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
