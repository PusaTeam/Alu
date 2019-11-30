document.body.onload = function() {
  let from = document.getElementById("from");
  let fromResults = document.getElementById("result");
  let fromUl=document.getElementById("from__ul");

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
          //"name_eng",
          "city_rus",
          "city_eng",
          //"country_rus",
          //"country_eng",
        ]

      };
      state.fuse = new Fuse(state.data, options);
    }
  });

  function autocomplete() {
    let fromV = from.value.trim();
    if ( fromV.length) {
      let fromPlace = state.fuse.search( fromV);
      fromUl.innerHTML = "";
      
      for (let i = 0; i < 5; i++) {
        if (!fromPlace[i]) continue;

        fromUl.append(document.createElement("li"));
        fromUl.children[i].textContent =
          (fromPlace[i].country_rus ?
            fromPlace[i].country_rus :
            fromPlace[i].country_eng) +
          " " +
          fromPlace[i].iata_code +
          " " +
          (fromPlace[i].city_rus ?
            fromPlace[i].city_rus :
            fromPlace[i].city_eng) +
          " " +
          (fromPlace[i].name_rus ?
            fromPlace[i].name_rus :
            fromPlace[i].name_eng);
      }
    }
  }

  from.oninput = function() {
    if (state.debouncer) clearTimeout(state.debouncer);
    state.debouncer = setTimeout(autocomplete, 300);
  };
}

