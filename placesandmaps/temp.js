// Set map options

// This dictates where the maps focuses. Lat and Lng will need to be dynamic for quiz
var myLatLng = {
    lat: 38.3460,
    lng: -0.4907
};

// Dictates how the maps displays when first viewed
var mapOptions = {
    center: myLatLng,
    zoom: 1,
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

// Function to calc the distance and display from, to, distance and time
function calcRoute() {

    // Create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, // This will neeed to be set dynamically
        unitSystem: google.maps.UnitSystem.IMPERIAL, // This should be dictated by the users location. If multi-player, quiz master sets it and/or have a toggle
    }

    // Pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            // Get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving Distance <i class='fas fa-road'></i> :" + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> :" + result.routes[0].legs[0].duration.text + ".</div>";

            // Display route
            directionsRenderer.setDirections(result);
        } else {
            // Delete the route from the map
            directionsRenderer.setDirections({
                routes: []
            });

            // Center map as per myLatLng
            map.setCenter(myLatLng);

            // Display an error for impossible routes
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retireve driving distance. </div>";
        }
    });
};

// Search for a specific location
var input = document.getElementById('search');
var searchBox = new google.maps.places.SearchBox(input);

// This forces Google to search in the bounds of the existing map first
// The callback sets the bounds of the search box to the bounds of the map
// Required for "Round Q's" but not base clues
map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
});

// "Markers" array will be used to show the places on the map
var markers = [];

// Listener for places changed in the Search Box
// Callback fn fires when user chooses an option from the auto-suggest list
searchBox.addListener('places_changed', function () {

    // Store the places that are found
    var places = searchBox.getPlaces();
    // Extracts Place Name
    var name = (places[0].name).toString().toLowerCase();
    console.log("Name:", name);

    // If the search doesn't return any places
    if (places.length === 0)
        return;

    // QUIZ: Checks if answer is correct
    var answer1 = "england";
    var answer2 = "london";
    var answer3 = "big ben";
    var answer4 = "13:50";
    if (name === answer1) {
        const output = document.querySelector('#output');
        output.innerHTML = "<div class='alert-info'>Correct! You can now answer the mini-questions.</div>";
        document.getElementById("mini-quiz").style.display = 'block';
        document.getElementById("answer").style.display = 'block';
        document.getElementById("answerP").innerHTML += name.toUpperCase();
        document.getElementById("submitIn").style.display = 'none';
    } else {
        output.innerHTML = "<div class='alert-danger'>Nope! Please select another option.</div>";
        document.getElementById("mini-quiz").style.display = 'none';
    }

    // Removes any existing markers from previous searches and resets array to 0
    markers.forEach(function (m) {
        m.setMap(null);
    });
    markers = [];

    // Something...
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function (p) {
        if (!p.geometry)
            return;

        markers.push(new google.maps.Marker({
            map: map,
            title: p.name,
            position: p.geometry.location
        }));

        if (p.geometry.viewport)
            bounds.union(p.geometry.viewport);
        else
            bounds.extend(p.geometry.location);
    });
    map.fitBounds(bounds);
});


// Create autocomplete objects for all inputs
var options = {
    types: ['geocode', 'establishment']
};

var inputFrom = document.getElementById("from");
var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom, options);

var inputTo = document.getElementById("to");
var autocompleteTo = new google.maps.places.Autocomplete(inputTo, options);

var inputSearch = document.getElementById("search");
var autocompleteSearch = new google.maps.places.Autocomplete(inputSearch, options);