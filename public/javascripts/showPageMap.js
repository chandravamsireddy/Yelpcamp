const here = Campground.geometry
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: Campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');



new mapboxgl.Marker()
    .setLngLat(Campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ pffset: 25 })
            .setHTML(
                `<h3>${Campground.title}</h3>`
            )
    )
    .addTo(map)

