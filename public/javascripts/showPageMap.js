//const campground = require("../../models/campground");

mapboxgl.accessToken = mapToken;
const campgroundjs = JSON.parse(campground_map);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campgroundjs.geometry.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
    //projection: 'globe' // display the map as a 3D globe
});
map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(campgroundjs.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campgroundjs.title}</h3><p>${campgroundjs.location}</p>`
            )
    )
    .addTo(map)