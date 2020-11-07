<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="(header, headerIndex) in headers"
          :key="header"
          v-html="header"
          @click="headingClick(headerIndex)"
        ></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in sortedRows"
        :key="index"
        :class="lookupWinningPartyCode(row[0])"
      >
        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
          <span v-if="typeof cell === 'string'">{{ cell }}</span>
          <span v-else-if="cell <= 1">{{ cell | numeral("0.0%") }}</span>
          <span v-else>{{ cell | numeral("0,0") }}</span>
        </td>
      </tr>
      <tr>
        <td v-for="(cell, cellIndex) in footer" :key="cellIndex">
          <span v-if="typeof cell === 'string'">{{ cell }}</span>
          <span v-else-if="cell <= 1">{{ cell | numeral("0.0%") }}</span>
          <span v-else>{{ cell | numeral("0,0") }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
function byIndex(index) {
  return function (a, b) {
    if (a[index] < b[index]) return 1;
    if (a[index] === b[index]) return 0;
    return -1;
  };
}

export default {
  name: "ElectionTable",
  props: {
    tableRows: Array,
    summary: Object,
  },
  data: function () {
    return {
      sortIndex: undefined,
      sortedRows: [],
    };
  },
  watch: {
    tableRows: {
      immediate: true,
      handler: function () {
        this.sortedRows = this.tableRows.map((row) => [
          row.community,
          ...row.candidates.map((c) => c.pctVote),
          row.totalVotes,
          row.precinctCount / row.precinctsReporting,
        ]);
      },
    },
  },
  methods: {
    headingClick(columnIndex) {
      if (columnIndex === this.sortIndex) {
        this.sortedRows.reverse();
      } else {
        this.sortIndex = columnIndex;
        this.sortedRows.sort(byIndex(columnIndex));
      }
    },
    lookupWinningPartyCode(community) {
      return this.tableRows.find((r) => r.community === community).topCandidate
        .party_code;
    },
  },
  computed: {
    headers: function () {
      return !this.summary || !this.summary.candidates
        ? []
        : [
            "Community",
            ...this.summary.candidates.map((c) => c.name),
            "Total votes",
            "Precincts",
          ];
    },
    footer: function () {
      return !this.summary || !this.summary.candidates
        ? []
        : [
            "Totals",
            ...this.summary.candidates.map((c) => c.votes),
            this.summary.totalVotes,
            this.summary.precinctsReporting / this.summary.precinctCount,
          ];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 2px;
}

th {
  cursor: pointer;
  padding: 2px;
  background-color: #015b85;
  color: white;
  cursor: pointer;
}
td,
th {
  text-align: center;
  width: 8%;
  font-size: 12px;
  padding: 0 4px;
}
tr.REP {
  background-color: lightcoral;
}
tr.DEM {
  background-color: lightblue;
}

th:nth-child(1),
td:nth-child(1) {
  text-align: left;
  width: 15%;
}
</style>
