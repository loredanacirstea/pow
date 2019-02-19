<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <div class="subheading">{{title}}</div>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-avatar class="v-btn v-btn--depressed theme--light v-btn--floating"
                    :size="120"
                    v-on:click.stop="clap()"
                >
                    <img src="/clap.svg" alt="avatar">
                </v-avatar>
            </v-flex>
        </v-layout>
        <v-layout row wrap>

        </v-layout>
    </v-container>
</template>

<script>

export default {
    props: ['title'],
    components: {
    },
    methods: {
        clap() {
            console.log('clapped')
        }
    }
}
</script>

<style>
html, body {
    margin: 0;
}
</style>
