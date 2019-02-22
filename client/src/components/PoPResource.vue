<template>
    <v-container v-if="resource">
        <v-layout row wrap>
            <v-flex xs12>
                <h1>{{resource.name}}</h1>
            </v-flex>
        </v-layout>
        <div class="resopt">
            <div v-for="option in resource.options">
                <v-layout row wrap>
                    <v-flex xs6>
                        <p class="subheading">{{option.name}}</p>
                    </v-flex>
                    <v-flex xs6>
                        <v-avatar class="v-btn v-btn--depressed theme--light v-btn--floating"
                            :size="120"
                            v-on:click.stop="clap()"
                        >
                            <img src="/clap.svg" alt="avatar">
                        </v-avatar>
                    </v-flex>
                </v-layout>
            </div>
        </div>
    </v-container>
</template>

<script>
import Vue from 'vue';
import PoP from '../constants';

export default {
    props: ['_id'],
    data() {
        return {
            resource: null,
        };
    },
    methods: {
        clap() {
            console.log('clapped');
        },
    },
    mounted() {
        PoP.server.setHttpClient(Vue.axios);
        this.setResource();
    },
    watch:  {
        _id: function(oldid, newid) {
            this.setResource();
        },
    },
    methods: {
        setResource: function() {
            PoP.server.getResource(this._id).then(result => {
                this.resource = result.data;
            });
        },
    },
};
</script>

<style>
.resopt {
    margin-top: 70px;
}
</style>
