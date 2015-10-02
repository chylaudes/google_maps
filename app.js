// function initMap() {
//   var map;
//   var myLatlng1 = new google.maps.LatLng(53.65914, 0.072050);
//   var mapOptions = {
//        zoom: 17,
//        center: myLatlng1,
//        mapTypeId: google.maps.MapTypeId.ROADMAP
//    };

//   map = new google.maps.Map(document.getElementById('map'), mapOptions);
// //geolocation!!!
//     if (navigator.geolocation) {
//            navigator.geolocation.getCurrentPosition(function (position) {
//                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//                map.setCenter(initialLocation);
//               console.log("initialLocation", initialLocation);

//            });
//        }
//   var input = /** @type {!HTMLInputElement} */(
//       document.getElementById('pac-input'));

//   var types = document.getElementById('type-selector');
//   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
//   map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

//   var autocomplete = new google.maps.places.Autocomplete(input);
//   autocomplete.bindTo('bounds', map);

//   var infowindow = new google.maps.InfoWindow();
//   var marker = new google.maps.Marker({
//     map: map,
//     anchorPoint: new google.maps.Point(0, -29)
//   });

//   autocomplete.addListener('place_changed', function() {
//     infowindow.close();
//     marker.setVisible(false);
//     var place = autocomplete.getPlace();
//     console.log("place", place);
//     if (!place.geometry) {
//       window.alert("Autocomplete's returned place contains no geometry");
//       return;
//     }

//     // If the place has a geometry, then present it on a map.
//     if (place.geometry.viewport) {
//       map.fitBounds(place.geometry.viewport);
//     } else {
//       map.setCenter(place.geometry.location);
//       map.setZoom(17);  // Why 17? Because it looks good.
//     }
//     marker.setIcon(/** @type {google.maps.Icon} */({
//       url: place.icon,
//       size: new google.maps.Size(71, 71),
//       origin: new google.maps.Point(0, 0),
//       anchor: new google.maps.Point(17, 34),
//       scaledSize: new google.maps.Size(35, 35)
//     }));
//     marker.setPosition(place.geometry.location);
//     marker.setVisible(true);

//     var address = '';
//     if (place.address_components) {
//       address = [
//         (place.address_components[0] && place.address_components[0].short_name || ''),
//         (place.address_components[1] && place.address_components[1].short_name || ''),
//         (place.address_components[2] && place.address_components[2].short_name || '')
//       ].join(' ');
//       console.log("address", address);
//     }

//     infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
//     infowindow.open(map, marker);
//   });

// }


// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete;
var componentForm = {
  // name: '',
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};


function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['establishments']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
      console.log("place.address_comp::", place.address_components[i].types[0]);
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


