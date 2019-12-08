
document.body.onload = function () {
  let from = document.getElementById("from")
  , fromUl = document.getElementById("from__ul");

  let to = document.getElementById("to")
  , toUl = document.getElementById("to__ul");

  var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
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

  getJSON("javascript/city.json", function (err, result) {
    if (err != null) {
      alert("Something went wrong: " + err);
    } else {
      state.data = result.list;
      let options = {
        shouldSort: true,
        tokenize: true,
        threshold: 0.1,
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

  function autocompleteFrom() {
    let fromV = from.value.trim();
    fromUl.classList.add("hidden");
    if (fromV.length) {
      let fromPlace = state.fuse.search(fromV);
      fromUl.innerHTML = "";
      fromUl.classList.remove("hidden");


      for (let i = 0; i < 5; i++) {

        if (!fromPlace[i]) continue;

        if (i == 0) {
          fromUl.innerHTML = `<span>` +
            (( fromPlace[0].city_rus ? 
              fromPlace[0].city_rus :
                fromPlace[0].city_eng) + `</span>`
                 + `<span style ="display:flex">`+
              (fromPlace[0].country_rus ?
                fromPlace[0].country_rus :
                fromPlace[0].country_eng)
                + `<span>` +
              " Все аэропорты" + '</span>' +'</span>'
            )


        }

        fromUl.append(document.createElement("li"));
        fromUl.lastChild.innerHTML =
        
        `<span>` +
        '<i class="fas fa-plane">'+ " " +(fromPlace[i].name_rus ?
          fromPlace[i].name_rus :
          fromPlace[i].name_eng)  +'</i>' + 
          
           
          fromPlace[i].iata_code +`</span>`+
          `<span>`+
          (fromPlace[i].country_rus ?
            fromPlace[i].country_rus :
            fromPlace[i].country_eng) +
          " " +
          (fromPlace[i].city_rus ?
            fromPlace[i].city_rus :
            fromPlace[i].city_eng) + '</span>'
      }
    }

  }

  

  from.oninput = function () {
    if (state.debouncer) clearTimeout(state.debouncer);
    state.debouncer = setTimeout(autocompleteFrom, 300);
  };

  from.onfocus = function(){
    from.select()   
  }

  fromUl.onclick = function(e){
    let target = e.target.closest("li");
    let textTarget = target.firstChild.firstChild.textContent;
    let textCity = fromUl.firstChild.textContent 
    from.value = fromUl.firstChild.textContent + "   (" + target.firstChild.firstChild.textContent +")";
    fromUl.classList.add("hidden");
  }



  function autocompleteTo() {
    let toV = to.value.trim();
    toUl.classList.add("hidden");
    if (toV.length) {
      let toPlace = state.fuse.search(toV);
      toUl.innerHTML = "";
      toUl.classList.remove("hidden");


      for (let i = 0; i < 5; i++) {

        if (!toPlace[i]) continue;

        if (i == 0) {
          toUl.innerHTML = `<span>` +
            (( toPlace[0].city_rus ? 
              toPlace[0].city_rus :
              toPlace[0].city_eng) + `</span>`
                 + `<span style ="display:flex">`+
              (toPlace[0].country_rus ?
                toPlace[0].country_rus :
                toPlace[0].country_eng)
                + `<span>` +
              " Все аэропорты" + '</span>' +'</span>'
            )


        }

        toUl.append(document.createElement("li"));
        toUl.lastChild.innerHTML =
        
        `<span>` +
        '<i class="fas fa-plane">'+ " " +(toPlace[i].name_rus ?
          toPlace[i].name_rus :
          toPlace[i].name_eng)  +'</i>' +
          
           
          toPlace[i].iata_code +`</span>`+
          `<span>`+
          (toPlace[i].country_rus ?
            toPlace[i].country_rus :
            toPlace[i].country_eng) +
          " " +
          (toPlace[i].city_rus ?
            toPlace[i].city_rus :
            toPlace[i].city_eng) + '</span>'
      }
    }

  }


  toUl.onclick = function(e){
    let target = e.target.closest("li");
    let textTarget = target.firstChild.firstChild.textContent;
    let textCity = toUl.firstChild.textContent 
    to.value = toUl.firstChild.textContent + " (" + target.firstChild.firstChild.textContent +")";
    toUl.classList.add("hidden");
  }

  to.onfocus = function(){
    to.select()   
  }
  to.oninput = function () {
    if (state.debouncer) clearTimeout(state.debouncer);
    state.debouncer = setTimeout(autocompleteTo, 300);
  };
  


  let helpooBTN = document.getElementById("helpBTN"),
    dropMenu = document.getElementById("dropMenu");

  helpooBTN.onclick = function () {
    dropMenu.classList.toggle("hidden")
  };




}


function formatDate(date) {

      var dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      var mm = date.getMonth() + 1;
      if (mm < 10) mm = '0' + mm;

      var yy = date.getFullYear() % 100;
      if (yy < 10) yy = '0' + yy;

      return dd + '/' + mm + '/' + yy;
   
    }
    $(function () {
      $('input[name="daterange"]').daterangepicker({
        "singleDatePicker" : true,
        "showDropdowns": true,
        "minYear": 2019,
        "maxYear": 2021,
        "autoApply": true,
        "locale": {
          "format": "DD/MM/YYYY",
          "separator": " - ",
          "applyLabel": "Apply",
          "cancelLabel": "Cancel",
          "fromLabel": "From",
          "toLabel": "To",
          "customRangeLabel": "Custom",
          "weekLabel": "W",
          "daysOfWeek": [
            "Пн",
            "Вт",
            "Ср",
            "Чт",
            "Пт",
            "Сб",
            "Вс"
          ],
          "monthNames": [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь"
          ],
          "firstDay": 1
        },
        "startDate": formatDate(new Date()),
        "endDate": "12/01/2019",
        "opens": "center"
      }, function (start, end, label) {
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format(
          'YYYY-MM-DD'));
      });
    });