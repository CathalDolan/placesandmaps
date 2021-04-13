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


//---------------------------------Distance------------------------------------//

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


//-------------------------------- Location --------------------------------//

// QUIZ: Questions and answers will need to be loaded dynamically
var question1 = "Q1 - For centuries I ruled the waves, but in 1966 I ruled the world. What country am I?";
var answer1 = "england";
var explanation1 = "Britannia rules the waves, etc. and won the world cup in 1966.";
var question2 = "Q2 - In what town or city would you find \"Paddington Station\"?";
var answer2 = "london";
var explanation2 = "Paddington station is one of London's main, etc. etc.";
var question3 = "Q3 - Towering over the Thames River, I'm the number one attraction, big time!";
var answer3 = "big ben";
var explanation3 = "Big Ben was built in 1234 and is blah blah";
var question4 = "Q4 - What time is shown on the clock face?";
var question4Options = {
    q1o1: 'Seventeen minutes to six',
    q1o2: 'Twenty five past four',
    q1o3: 'Twelve o\'Clock',
    q1o4: 'Ten minutes to two'
}
var answer4 = "Ten minutes to two";

//<option id="q1o1" value="17:43"> Seventeen minutes to six </option>
//<option id="q1o2" value="16:25"> Twenty five past four </option>
//<option id="q1o3" value="12:00"> Twelve o'Clock </option>
//<option id="q1o4" value="13:50"> Ten minutes to two </option>

// Set first Question
document.getElementById("question1").innerHTML += question1;

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

    if (name === answer1) {
        document.getElementById("answer1").style.display = 'block';
        document.getElementById("answerP1").innerHTML += name.toUpperCase();
        document.getElementById("explanation1").innerHTML += "<strong>Did you know?: </strong>" + explanation1 + "<hr>";
        // Display 2nd question
        document.getElementById("second-question").style.display = 'block';
        document.getElementById("question2").innerHTML += question2;
    } else if (name === answer2) {
        document.getElementById("answer2").style.display = 'block';
        document.getElementById("answerP2").innerHTML += name.toUpperCase();
        document.getElementById("explanation2").innerHTML += "<strong>Did you know?: </strong>" + explanation2 + "<hr>";
        // Display 3rd Question
        document.getElementById("third-question").style.display = 'block';
        document.getElementById("question3").innerHTML += question3;
    } else if (name === answer3) {
        document.getElementById("submitIn").style.display = 'none';
        document.getElementById("answer3").style.display = 'block';
        document.getElementById("answerP3").innerHTML += name.toUpperCase();
        document.getElementById("explanation3").innerHTML += "<strong>Did you know?: </strong>" + explanation3 + "<hr>";
        /// Display fourth question
        document.getElementById("fourth-question").style.display = 'block';
        document.getElementById("question4").innerHTML += question4;
        var select = document.getElementById("question4Select");
        for (index in question4Options) {
            select.options[select.options.length] = new Option(question4Options[index], index);
            console.log("index", index)
        }
    } else if ((document.getElementById("question4Select").value) === answer4) {
        output.innerHTML = "<div class='alert-success'>Correct & Right!</div>";
    } else {
        output.innerHTML = "<div class='alert-danger'>Nope! Go on, try again.</div>";
    };

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

var inputSearch = document.getElementById('search');
var autocompleteSearch = new google.maps.places.Autocomplete(inputSearch, options);