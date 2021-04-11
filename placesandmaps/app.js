// Set map options

// This dictates where the maps focuses. Lat and Lng will need to be dynamic for quiz
var myLatLng = {
    lat: 38.3460,
    lng: -0.4907
};

// Dictates how the maps displays when first viewed
var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// Create the map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

// Create a Directions service object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

// Create a DirectionsRenderer object which we will use to display the route
var directionsRenderer = new google.maps.DirectionsRenderer();

// Bind the DirectionsRenderer to the map
directionsRenderer.setMap(map);

// Fn to calc the distance and display from, to, distance and time
function calcRoute() {
    console.log("Calc Route Function fires");

    // Create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, // This will neeed to be set dynamically
        unitSystem: google.maps.UnitSystem.IMPERIAL, // This should be dictated by the users location. If multi-player, quiz master sets it and/or have a toggle
    }
    console.log("request", request);

    // Pass the request to the route method
    directionsService.route(request, function (result, status) {
        console.log("Result", result);
        console.log("Status", status);
        if (status == google.maps.DirectionsStatus.OK) {
            // Get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving Distance <i class='fas fa-road'></i> :" + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> :" + result.routes[0].legs[0].duration.text + ".</div>";

            // Display route
            directionsRenderer.setDirections(result);
            console.log("If fires");
        } else {
            // Delete the route from the map
            directionsDisplay.setDirections({
                routes: []
            });

            // Center map as per myLatLng
            map.setCenter(myLatLng);

            // Display an error for impossible routes
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retireve driving distance. </div>";
            console.log("Else fires");
        }
    });
};

// Create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
};

var inputFrom = document.getElementById("from");
var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);

var inputTo = document.getElementById("to");
var autocompleteTo = new google.maps.places.Autocomplete(inputTo, options);