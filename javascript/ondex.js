document.body.onload = function() {
  let search = document.getElementById("search");
  let results = document.getElementById("result"),
    res = document.getElementsByClassName("res"),
    p = document.createElement("p");

  var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };

  const state = {
    data: [],
    fuse: null,
    debouncer: null,
  };

  getJSON("javascript/city.json", function(err, result) {
    if (err != null) {
      alert("Something went wrong: " + err);
    } else {
      state.data = result.list;
      let options = {
        shouldSort: true,
        tokenize: true,
        threshold: 0,
        location: 0,
        distance: 500,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: [
          //"iata_code",
          //"name_rus",
          "name_eng",
          //"city_rus",
          "city_eng",
          //"country_rus",
          "country_eng",
        ]

      };
      state.fuse = new Fuse(state.data, options);
    }
  });

  function autocomplete() {
    let searchV = search.value.trim();
    if (searchV.length) {
      let searchResult = state.fuse.search(searchV);
      results.innerHTML = "";
      results.append(document.createElement("ul"));
      for (let i = 0; i < 5; i++) {
        if (!searchResult[i]) continue;

        results.append(document.createElement("li"));
        results.children[i].textContent =
          (searchResult[i].country_rus ?
            searchResult[i].country_rus :
            searchResult[i].country_eng) +
          " " +
          searchResult[i].iata_code +
          " " +
          (searchResult[i].city_rus ?
            searchResult[i].city_rus :
            searchResult[i].city_eng) +
          " " +
          (searchResult[i].name_rus ?
            searchResult[i].name_rus :
            searchResult[i].name_eng);
      }
    }
  }

  search.oninput = function() {
    if (state.debouncer) clearTimeout(state.debouncer);
    state.debouncer = setTimeout(autocomplete, 300);
  };
}