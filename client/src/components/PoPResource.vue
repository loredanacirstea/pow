<template>
    <v-container v-if="resource">
        <v-layout row wrap>
            <v-flex xs4 offset-xs4>
                <h1>{{resource.name}}</h1>
            </v-flex>
        </v-layout>
        <div class="stats">
            <v-flex xs10 wrap>
                <p>Total Votes: {{totalVotes}}</p>
            </v-flex>
            <v-flex xs10 wrap>
                <p>Votes remaining: {{remainingVotes}}</p>
            </v-flex>
        </div>
        <div class="resopts">
            <div v-for="(option, index) in resource.options" class="resopt">
                <v-layout row wrap>
                    <v-flex xs3 offset-xs3>
                        <div class="subheading">{{option.name}}</div>
                    </v-flex>
                    <v-flex xs3>
                        <v-avatar
                            v-if="option.icon"
                            class="v-btn v-btn--depressed theme--light v-btn--floating"
                            :size="120"
                            v-on:click.stop="vote(index)"
                        >
                            <img :src="`/${option.icon}.svg`" alt="avatar">
                        </v-avatar>
                        <v-btn
                            v-else
                            v-on:click.stop="vote(index)"
                            round depressed
                        >
                          vote
                        </v-btn>
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
            totalVotes: 0,
            votesPerPerson: 0,
            remainingVotes: 0,
            votesPollIntervalId: null,
            resourcePollIntervalId: null,
        };
    },
    mounted() {
        PoP.server.setHttpClient(Vue.axios);
        this.setData();
        this.pollResource();
    },
    destroyed() {
        clearInterval(this.resourcePollIntervalId);
        clearInterval(this.votesPollIntervalId);
    },
    watch:  {
        _id: function(oldid, newid) {
            this.setData();
        },
    },
    methods: {
        pollResource: function() {
            this.resourcePollIntervalId = setInterval(() => {
                this.setResource();
            }, 2000);
        },
        pollVotes: function() {
            this.votesPollIntervalId = setInterval(() => {
                this.setGraphVotes();
            }, 5000);
        },
        setData: function() {
            this.setResource().then(() => {
                this.setOwnVotes();
            });
        },
        setGraphVotes: function() {
            console.log('setGraphVotes');
        },
        setResource: function() {
            return PoP.server.getResource(this._id).then(result => {
                this.resource = result.data;
                this.setTotalVotes(this.resource.options);
                this.votesPerPerson = this.resource.votesPerPerson;
            });
        },
        setTotalVotes: function(options) {
            this.totalVotes = options.map((option) => option.votes || 0)
                .reduce((accumulator, value) => accumulator + value);
        },
        setOwnVotes: function() {
            PoP.server.getOwnVotes(this._id).then(response => {
                this.remainingVotes = this.votesPerPerson - response.data.count;
            });
        },
        vote(index) {
            PoP.server.vote(this.resource._id, index).then(response => {
                this.remainingVotes = response.data.count;
                this.totalVotes += 1;
            });
        },
    },
};
</script>

<style>
.resopts {
    margin-top: 70px;
}
.resopt {
    margin-top: 30px;
}
.stats {
    position: absolute;
    right: 0;
    top: 0;
}
</style>
