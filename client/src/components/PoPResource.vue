<template>
    <v-container v-if="resource">
        <v-layout row wrap>
            <v-flex xs4 offset-xs4>
                <h1>{{resource.name}}</h1>
            </v-flex>
        </v-layout>
        <div class="stats">
            <v-flex xs10 wrap>
                <p>total votes: {{totalVotes}}</p>
            </v-flex>
            <v-flex xs10 wrap>
                <p>votes remaining: {{remainingVotes}}</p>
            </v-flex>
            <v-flex xs10 wrap>
                <p>started: {{new Date(resource.startDate).toString().split(' GMT')[0]}}</p>
            </v-flex>
            <v-flex xs10 wrap>
                <p>ends: {{new Date(resource.endDate).toString().split(' GMT')[0]}}</p>
            </v-flex>
        </div>
        <div class="resopts">
            <div
                v-if="graphValues.length > 0"
                v-for="(option, index) in resource.options" class="resopt"
            >
                <v-layout row wrap align-center>
                    <v-flex xs6 class="text-xs-right">
                        <span class="subheading font-weight-bold" :style="{color: `rgba(${option.color.join(',')}, 1)`}">{{option.name}}</span>
                    </v-flex>
                    <v-flex xs3>
                        <span class="subheading font-weight-bold">{{option.votes}}</span>
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
                            :disabled="!votingIsOngoing"
                        >
                          vote
                        </v-btn>
                    </v-flex>
                </v-layout>
            </div>
        </div>
        </br></br></br></br></br></br></br></br>
        <div class="graphs">
            <div class="graph" v-for="(option, index) in resource.options">
                <v-flex xs12 wrap class="graph">
                    <v-sparkline
                        v-if="graphValues[index] && graphValues[index].length"
                        :value="graphValues[index]"
                        :height="40"
                        :color="`rgba(${option.color.join(',')}, 0.3)`"
                        smooth="10"
                        padding="8"
                        line-width="1"
                        stroke-linecap="round"
                        gradient-direction="top"
                        auto-draw
                    ></v-sparkline>
                </v-flex>
            </div>
        </div>
        <div  class="errorAlert">
            <v-alert
              v-model="errorAlert"
              dismissible
              type="warning"
              outline
            >
              {{errorMessage}}
            </v-alert>
        </div>
    </v-container>
</template>

<script>
import Vue from 'vue';
import PoP from '../constants';

export default {
    // props: ['_id'],
    data() {
        return {
            _id: '1',
            resource: null,
            totalVotes: 0,
            votesPerPerson: 0,
            remainingVotes: 0,
            votesPollIntervalId: null,
            resourcePollIntervalId: null,
            startTimestamp: null,
            votingIsOngoing: false,
            graphValues: [],
            graphMaxValues: [],
            errorAlert: false,
            errorMessage: null,
            timeUnit: 0,
            graphEndTimeUnit: 0,
        };
    },
    mounted() {
        PoP.server.setHttpClient(Vue.axios);
        this.setData();
    },
    destroyed() {
        this.stopPolls();
    },
    // watch:  {
    //     _id: function(oldid, newid) {
    //         this.setData();
    //     },
    // },
    methods: {
        pollResource: function() {
            this.resourcePollIntervalId = setInterval(() => {
                console.log('pollResource');
                this.setResource().then(() => {
                    // If voting period ends, we stop polling for data
                    if (!this.votingIsOngoing) {
                        this.stopPolls();
                    }
                });
            }, 5000);
        },
        pollVotes: function() {
            this.votesPollIntervalId = setInterval(() => {
                console.log('pollVotes');
                this.setGraphVotes();
            }, 15000);
        },
        startPolls: function() {
            this.pollResource();
            this.pollVotes();
        },
        stopPolls: function() {
            clearInterval(this.resourcePollIntervalId);
            clearInterval(this.votesPollIntervalId);
            this.resourcePollIntervalId = null;
            this.votesPollIntervalId = null;
            this.graphEndTimeUnit = 0;
        },
        getTimeUnit: function() {
            return (this.resource.endDate - this.resource.startDate) / 80;
        },
        votingOngoing: function() {
            let now = new Date().getTime();
            return this.resource.startDate <= now
                && this.resource.endDate > now;
        },
        setData: function() {
            // We run this when first mounting or when the resource changes
            // Stop existing polls
            this.stopPolls();
            this.setResource().then(() => {
                this.startTimestamp = this.resource.startDate;
                this.graphValues = this.resource.options.map((option) => []);
                this.graphMaxValues = this.resource.options.map((option) => 0);
                this.setOwnVotes();
                this.setGraphVotes();

                // Start polls if resource has ongoing voting
                if (this.votingIsOngoing) {
                    this.startPolls();
                }
            });
        },
        getGraphValues: function(votes, start, end) {
            let values, maxValues, endTime;
            let index = 0;
            console.log('this.timeUnit', this.timeUnit, this.timeUnit / 1000 / 60);
            console.log('getGraphValues DIFF', JSON.stringify(votes));

            endTime = this.graphEndTimeUnit || start;
            values = this.graphValues;
            maxValues = this.graphMaxValues;

            while (index < votes.length) {
                const vote = votes[index];
                console.log('endTime', endTime, new Date(endTime), vote.timestamp <= endTime, new Date(vote.timestamp));
                if (vote.timestamp <= endTime) {
                    values[vote.optionid][values[vote.optionid].length  - 1] += 1;
                    maxValues[vote.optionid] = Math.max(maxValues[vote.optionid], values[vote.optionid][values[vote.optionid].length  - 1]);
                    index += 1;
                } else {
                    endTime += this.timeUnit;
                    // Timestamps are in order, when the graph interval changes,
                    // it changes for all options
                    values.forEach((optionV, ndx) => {
                        values[ndx].push(0);
                    });
                }
            };
            this.graphEndTimeUnit = endTime;
            this.graphMaxValues = maxValues;
            this.graphValues = values;
            console.log('setGraphVotes graphValues TOTAL', JSON.stringify(this.graphValues));
            console.log('setGraphVotes graphMaxValues', JSON.stringify(this.graphMaxValues));
            // return {values, maxValues};
        },
        setGraphVotes: function() {
            let startTimestamp = this.startTimestamp;
            let endTimestamp = Math.min(this.resource.endDate, new Date().getTime());
            this.startTimestamp = endTimestamp;

            let response = PoP.server.getVotes(
                '1',
                startTimestamp,
            ).then((response) => {
                this.getGraphValues(response.data, startTimestamp, endTimestamp);
                // this.graphValues = this.getGraphValues(response.data, startTimestamp, endTimestamp);
                // console.log('setGraphVotes graphValues TOTAL', JSON.stringify(this.graphValues));
            }).catch(console.log);
        },
        setResource: function() {
            return PoP.server.getResource('1').then(result => {
                if (!this.resource || this.resource._id != result.data._id) {
                    result.data.options.forEach((option, index) => {
                        result.data.options[index].color = [
                            this.getRandomInt(255),
                            this.getRandomInt(255),
                            this.getRandomInt(255),
                        ]
                    });
                } else {
                    result.data.options.forEach((option, index) => {
                        result.data.options[index].color = this.resource.options[index].color;
                    });
                }
                this.resource = result.data;
                this.setTotalVotes(this.resource.options);
                this.votesPerPerson = this.resource.votesPerPerson;
                this.votingIsOngoing = this.votingOngoing();
                this.timeUnit = this.getTimeUnit();
            });
        },
        setTotalVotes: function(options) {
            this.totalVotes = options.map((option) => option.votes || 0)
                .reduce((accumulator, value) => accumulator + value);
        },
        setOwnVotes: function() {
            PoP.server.getOwnVotes('1').then(response => {
                this.remainingVotes = this.votesPerPerson - response.data.count;
            });
        },
        vote(index) {
            PoP.server.vote(this.resource._id, index).then(response => {
                this.remainingVotes = response.data.count;
                this.totalVotes += 1;
            }).catch((error) => {
                this.errorMessage = `${error.response.data.error.statusCode}: ${error.response.data.error.message}`;
                this.errorAlert = true;
            });
        },
        getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
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
    position: fixed;
    right: 0;
    top: 0;
}
.graphs {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}
.graph {

}
.errorAlert {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 320px;
}
</style>
