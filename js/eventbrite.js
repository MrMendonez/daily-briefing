$(document).ready(function() { 

  // Allows NYC location to be default for Events
  googleApiSuccessHandler();

  //Updated the Events from inputted location upon hitting ENTER key
  $("#selected-city").keypress(function(e){
    if (e.which == 13) {
      setTimeout(function(){
        $("#tableBody").empty();
        
        googleApiSuccessHandler();
      },500)  
    }
  });


  //Builds the table of events from inputted location
  function buildTable(events) {  
    
    

    var newTr = $("<tr>");
    var newTd = $("<td>")
    //var eventImg = $("<img>").attr("src", events.logo.url);
    var eventLink =$("<a>").attr("href", events.url);
    var eventName = $("<h5>").html(events.name.text);
    var eventDescription = $("<p>").html(events.description.text).addClass("p-events");
    var eventTime = $("<h4>").html(events.start.local);
    

    newTr
      .append(newTd
      //.append(eventImg)
      .append(eventLink.append(eventName))
      .append(eventDescription))
      
      
    
    return newTr;
    
  }


  function googleApiSuccessHandler() {
    var eventBriteUrl = "https://www.eventbriteapi.com/v3/"
    var token = "OO4THRQ4RMB522E4DLLG"

    $.ajax({
      type: "GET",
      url: eventBriteUrl + "events/search/?location.latitude="+geoLocation.lat+"&location.longitude="+geoLocation.lng+"&token="+token,
      success: function(response){
        eventBriteSuccessHandler(response);
      }
      
    });
  }

  function eventBriteSuccessHandler(response) { 
    var locationEvents = response.events;
    for(var i = 0; i < locationEvents.length; i++) {  
      var newTableBody = buildTable(locationEvents[i], i);
      $("#tableBody").append(newTableBody);
      
    }
  };



});