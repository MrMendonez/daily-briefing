$(document).ready(function(){

  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      city = $("#selected-city").val().trim(); //get the city inputted
      setTimeout(function(){
        bingNewsAPI();
      }, 500);
    }
  }); 

/*=================================================================
      ON CLICK EVENT FOR NEWS ARTICLE HEADERS
================================================================ */
  $(document).on("click", ".news-header", function(){


    if ($(this).hasClass("active")) {
      $(this).children(".chevron-down").hide();
      $(this).children(".chevron-up").show();
    } else {
      $(this).children(".chevron-down").show();
      $(this).children(".chevron-up").hide();
    }
  });

  $(document).on({
    mouseenter: function(){
      if ($(this).hasClass("active")) {
        $(this).children(".chevron-up").fadeIn("fast");
      } else {
        $(this).children(".chevron-down").fadeIn("fast");
      }
    },
    mouseleave: function(){
      $(this).children(".chevron-down").fadeOut("fast");
      $(this).children(".chevron-up").fadeOut("fast");
    }
  }, ".news-header");


/*================================================================
    BING API AJAX 
  ================================================================ */
  window.bingNewsAPI = function () {
    $("#news").empty();
    
    var requestStr = "https://api.datamarket.azure.com/Data.ashx/Bing/Search/v1/News?Query=%27" + city + "%27&Latitude=" + geoLocation.lat + "&Longitude=" + geoLocation.lng + "&$top=10&$format=json"; //the request URL

    var appId = "xqH9UulnxWvYID2if8wODlrsrvBKXFrlnKE8TmGDdJI"; //bing api key
    var appId = base64_encode(":" + appId); //takes api key and encodes to base64

    function setHeader(xhr) {
      xhr.setRequestHeader('Authorization', "Basic " + appId);
      //'Basic <Your Azure Marketplace Key(Remember add colon character at before the key, then use Base 64 encode it');
    }

    // AJAX to get articles from the guardian
    $.ajax({
      url: requestStr,
      beforeSend: setHeader,
      dataType: "json",
      context: this,
      type: "GET",
      success: function(data){
        bingSuccessHandler(data);
      }
    })
  }

  window.bingSuccessHandler = function (articles) {

    for (var i = 0; i < articles.d.results.length ; i++) {
      var newListItem = $("<li>").addClass("hoverable");
      var newDivHeader = $("<div>").addClass("collapsible-header news-header").append($("<a class='article-title'>").attr("href", articles.d.results[i].Url).attr("target", "_blank").append(articles.d.results[i].Title)).append($("<i class='fa fa-angle-double-down chevron-down'></i>")).append($("<i class='fa fa-angle-double-up chevron-up'></i>"));
      newDivHeader.append($("<h6>").addClass("news-source").html(articles.d.results[i].Source));
      var newDivBody = $("<div>").addClass("collapsible-body");
      var bodyContent = $("<p>").html(articles.d.results[i].Description);

      newListItem.append(newDivHeader).append(newDivBody.append(bodyContent));
      $("#news").append(newListItem);
    };
  }

  window.base64_encode = function (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Rafal Kukawski (http://kukawski.pl)
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {
    //    return btoa(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      enc = "",
      tmp_arr = [];

    if (!data) {
      return data;
    }

    do { // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      bits = o1 << 16 | o2 << 8 | o3;

      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

  }







});

// bing API key: xqH9UulnxWvYID2if8wODlrsrvBKXFrlnKE8TmGDdJI