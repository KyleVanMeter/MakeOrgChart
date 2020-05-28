<template>
  <div id="app">
    <Chart/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from './components/HelloWorld.vue'
import Chart from './components/Chart.vue'

@Component({
  components: {
    Chart
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
