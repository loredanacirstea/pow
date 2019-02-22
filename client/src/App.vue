<template>
  <v-app>
    <v-content>
        <v-navigation-drawer
            v-model="drawer"
            :mini-variant.sync="mini"
            permanent
            fixed
        >
            <v-list class="pt-0" dense>
                <v-list-tile
                  v-for="item in resources"
                  :key="item._id"
                >
                    <v-list-tile-action>
                        <router-link :to="'/resource/' + item._id">
                            <v-btn
                              icon
                              @click.stop="mini = true"
                            >
                              <v-icon>fa-play</v-icon>
                            </v-btn>
                        </router-link>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Vue from 'vue';
import PoP from './constants';

export default {
    name: 'app',
    data() {
        return {
            drawer: true,
            mini: true,
            right: null,
            resources: [],
        };
    },
    mounted() {
        PoP.server.setHttpClient(Vue.axios);
        this.setResources();
    },
    methods: {
        setResources: function() {
            PoP.server.getResources().then(result => {
                this.resources = result.data;
            });
        },
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
}

html, body {
    margin: 0;
}

.fullheight, .v-window, .v-window__container {
    height: 100%;
}

.v-list__tile__action > a {
    color: transparent;
}
</style>
