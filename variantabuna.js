var map;

function toggleLayer(toggleLayer, id) {
    if ($('#' + id).is(':checked')) {
        toggleLayer.setMap(map);
    } else {
        toggleLayer.setMap(null);
    }
}


    var mapOptions = {
        zoom: 9,
        center: new google.maps.LatLng(44.58000000, 27.52361111),
        //  mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    // Set map    
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    var markerArray = [];
    var marker;
    var marker1;
    var marker2;
    var static_marker_id = 0

    poly = new google.maps.Polyline({
        strokeColor: '#00008B',
        strokeOpacity: 0.65,
        strokeWeight: 3.5,
        geodesic:true,
        draggable: true,
        map : map,
        icons: [{
            icon: aeroplane,
            offset:'100%'
        }]
    });
    poly.setMap(map);
    animateRoute(poly);

    var waypoints = [{
        lat: 44.6636167, lng: 27.0432973,
        lat: 44.6377119, lng: 27.5981069,
        lat: 44.1026874, lng: 27.6078916,
        lat: 44.1235162, lng: 27.3223972,
        lat: 44.1819578, lng: 27.0433617
    }]








    var polygonCoordinates = [{
            lat: 44.60361111,
            lng: 27.12416667
        },
        {
            lat: 44.58000000,
            lng: 27.52361111
        },
        {
            lat: 44.15527778,
            lng: 27.52361111
        },
        {
            lat: 44.20138889,
            lng: 27.31972222
        },
        {
            lat: 44.22250000,
            lng: 27.14250000
        },
        {
            lat: 44.60361111,
            lng: 27.12416667
        }
    ];

    militaryArea = new google.maps.Polygon({
        path: polygonCoordinates,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillOpacity: 0.1,
        fillColor: '#ff987b',
        fillOpacity: 0.35,
        map: map
    });





var aeroplane = {
    path: "m 0,3.93375" +
        "c -0.44355,0 -0.84275,0.18332 -1.17933,0.51592" +
        "c -0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377" +
        "c -0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085" +
        "c -0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118" +
        "c -5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223" +
        "c -1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549" +
        "c 0.38616,4.88048 0.94192,9.7138 1.42461,13.50099" +
        "c -1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255" +
        "c -0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316" +
        "c 0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557" +
        "c 0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316" +
        "c 0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516" +
        "c 0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115" +
        "c 0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902" +
        "c -0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352" +
        "c 0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476" +
        "c -0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561" +
        "c -0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377" +
        "c -0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0l0.00002,0.00001" +
        "z",
    scale: 0.5,
    strokeColor: 'black',
    fillColor: 'yellow',
    fillOpacity: 1.0,
    strokeOpacity: 1.0

};

//animation
function animateRoute(poly) {
    //var infowindow = new google.maps.InfoWindow();
    var count = 0;

    window.setInterval(function () {
        count = (count + 1) % 1000;

        var icons = poly.get('icons');
        //console.log(icons[0]);
        icons[0].offset = (count / 10) + '%';
        poly.set('icons', icons);

    }, 20);
}

// trajectory intersecting polygon
