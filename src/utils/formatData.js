function keyToCity(key) {
  return key.split('_')
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
}

function byVotes(a, b) {
  var aVotes = parseInt(a.votes);
  var bVotes = parseInt(b.votes);
  if (aVotes < bVotes) {
    return 1;
  }
  if (aVotes === bVotes) {
    return 0;
  }
  return -1;
}

function byOverallVotes(candidates) {
  return function (a, b) {
    var indexA = candidates.findIndex((c) => c.name === a.name);
    var indexB = candidates.findIndex((c) => c.name === b.name);
    if (indexA > indexB) {
      return 1;
    }
    if (indexA === indexB) {
      return 0;
    }
    return -1;
  }
}

export default function formatData(data) {
  var keys = Object.keys(data);
  var cityResults = Object.values(data);

  // get overall stats
  var { precinctCount, precinctsReporting, totalVotes, lastUpdated } = cityResults.reduce((acc, curr) => {
    var count = parseInt(curr.precinct_count);
    var reporting = parseInt(curr.precincts_reporting);
    var totalVotes = parseInt(curr.contests[0].total_votes);
    var updated = Date.parse(curr.last_updated);
    return {
      precinctCount: count + acc.precinctCount,
      precinctsReporting: reporting + acc.precinctsReporting,
      totalVotes: totalVotes + acc.totalVotes,
      lastUpdated: updated > acc.lastUpdated ? updated : acc.lastUpdated
    };
  }, { precinctCount: 0, precinctsReporting: 0, totalVotes: 0, lastUpdated: 0 });

  // get all candidates from first community
  // for each candidate, add up all votes for each community
  // return array of candidates, sorted by total votes, descending
  var candidates = data[keys[0]].contests[0].candidates.map((c) => {
    var totalVotesThisCandidate = cityResults.reduce((acc, curr) => {
      var thisCandidate = curr.contests[0].candidates.find((tc) => tc.name === c.name);
      return acc + parseInt(thisCandidate.votes);
    }, 0);
    return {
      name: c.name,
      partyCode: c.party_code,
      votes: totalVotesThisCandidate,
      totalVotes: totalVotes,
      pctTotalVotes: (totalVotesThisCandidate / totalVotes)
    };
  }).sort(byVotes);

  // get results for each community
  // candidates sorted by overall votes rather than votes in this community
  var tableRows = keys.map((key) => {
    var theseCandidates = data[key].contests[0].candidates.map((c) => {
      return {
        ...c,
        pctVote: parseInt(c.votes) / parseInt(data[key].contests[0].total_votes)
      }
    }).sort(byOverallVotes(candidates));
    return {
      community: keyToCity(key),
      candidates: theseCandidates,
      precinctsReporting: parseInt(data[key].precincts_reporting),
      precinctCount: parseInt(data[key].precinct_count),
      pctPrecinctsReporting: parseInt(data[key].precincts_reporting) / parseInt(data[key].precinct_count),
      totalVotes: parseInt(data[key].contests[0].total_votes),
      topCandidate: [...theseCandidates].sort(byVotes)[0]
    };
  });

  var summary = {
    precinctCount,
    precinctsReporting,
    totalVotes,
    lastUpdated,
    candidates
  }
  return { tableRows, summary };
}