<template>
  <div id="app">
    <IO/>
    <Chart/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Chart from './components/Chart.vue'
import IO from './components/IO.vue'

@Component({
  components: {
    Chart,
    IO
  }
})
export default class App extends Vue {}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: bisque;
  width: 100vw;
  height: 100vh;
}
</style>
