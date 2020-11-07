<template>
  <div id="app">
    <ElectionTable :tableRows="tableRows" :summary="summary" />
  </div>
</template>

<script>
import ElectionTable from "./components/ElectionTable";
import formatData from "./utils/formatData";

export default {
  name: "App",
  components: {
    ElectionTable,
  },
  data() {
    return {
      tableRows: [],
      summary: {},
    };
  },
  mounted: function () {
    fetch("/us-pres-by-town.json", {
      method: "get",
    })
      .then((res) => res.json())
      .then((jsonData) => {
        var { tableRows, summary } = formatData(jsonData);
        this.tableRows = tableRows;
        this.summary = summary;
      });
  },
};
</script>
{



}
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}
</style>
