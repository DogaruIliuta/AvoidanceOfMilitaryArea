
//https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

//Initial markers
var markerArr = new google.maps.Marker({
    position:{lat:44.16575322622719, lng:27.174795192031265},
    map:map,
    title: 'Arrival',
    draggable:true,
    label:'Arrival'
})
var markerDep = new google.maps.Marker({
    position:{lat:44.5077312953849, lng:27.361562770156265},
    map:map,
    title: 'Departure',
    draggable:true,
    label:'Departure'
})


var waypoints = [
    {lat: 44.6636167, lng: 27.0432973, title: "point0"},
    {lat: 44.6377119, lng: 27.5981069, title: "point1"},
    {lat: 44.1026874, lng: 27.6078916, title: "point2"},
    {lat: 44.1235162, lng: 27.3223972, title: "point3"},
    {lat: 44.1819578, lng: 27.0433617, title: "point4"},
    {lat: 44.6636167, lng: 27.0432973, title: "point0"}
]

var polygon_Coordinates = [
    {
        lat: 44.62961111,
        lng: 27.09416667
    },
    {
        lat: 44.6300000,
        lng: 27.58361111
    },
    {
        lat: 44.11527778,
        lng: 27.58361111
    },
    {
        lat: 44.13138889,
        lng: 27.31972222
    },
    {
        lat: 44.19250000,
        lng: 27.07250000
    },
    {
        lat: 44.62961111,
        lng: 27.09416667
    }
];
//Plotarea celor 4 markeri
for (let i = 0; i < waypoints.length - 1; i++) {

   new google.maps.Marker({
        position: {lat: waypoints[i].lat, lng: waypoints[i].lng},
        title: waypoints[i].title,
        label: waypoints[i].title,
        map:map
    });


}
//Arrayul de markere
function updateMap() {

    let mapOfPoints = new Map();

    //Array de markere (algoritmul pe optimizare functioneaza pe markere)
    let wayPoints = [markerArr];
    for (let i = 0; i < waypoints.length - 1; i++) {

        wayPoints.push(new google.maps.Marker({
            position: {lat: waypoints[i].lat, lng: waypoints[i].lng},
            title: waypoints[i].title,
            label: waypoints[i].title
        }));
    }
    //Am creat un Map ['nume de punct;: coordonate]
    for(let pnt of waypoints){
        mapOfPoints.set(pnt.title, { lat: pnt.lat, lng: pnt.lng})
    }

    mapOfPoints.set(markerDep.title, {lat:markerDep.position.lat(), lng: markerDep.position.lng()})
    mapOfPoints.set(markerArr.title, {lat:markerArr.position.lat(), lng: markerArr.position.lng()})


///////////////////////////////////////////////
// Mark the intersections before 5 Nautical Miles
    var arrayOfIntersections = []
    for (let i = 0; i < waypoints.length - 1; i++) {
        let inters = getIntersections(waypoints[i].lat, waypoints[i].lng, waypoints[i + 1].lat, waypoints[i + 1].lng);

        if (inters) arrayOfIntersections.push([inters, waypoints[i], waypoints[i + 1]])
    }

// Get teh intersection closest to Departure
    let minDistance = Infinity;
    var neededMarker;

    for (let point of arrayOfIntersections) {
        if (orthodromeDistance(point[0], markerDep) < minDistance) {
            minDistance = orthodromeDistance(point[0], markerDep);
            neededMarker = point;
        }
    }
    if (neededMarker) {
       // neededMarker[0].setMap(map);
        wayPoints.push(neededMarker[0])
        mapOfPoints.set(neededMarker[0].title, {lat:neededMarker[0].position.lat(), lng: neededMarker[0].position.lng()})
    } else {
        return new google.maps.Polyline({
            path: [markerArr.getPosition(), markerDep.getPosition()],
            map: map
    })}

///////////////////////////////////////////
    var adjancencyList = new Map();
    adjancencyList.set('point0', new Set(['point1',  'point4', "Intersection", 'Arrival']));
    adjancencyList.set('point1', new Set(['point0', 'point2',  "Intersection", 'Arrival']));
    adjancencyList.set('point2', new Set([ 'point1', 'point3', 'point4', "Intersection", 'Arrival']));
    adjancencyList.set('point3', new Set([ 'point2', 'point4', "Intersection"]));
    adjancencyList.set('point4', new Set(['point0', 'point2', 'point3', "Intersection", 'Arrival']));
    adjancencyList.set('Intersection', new Set(['point0', 'point1', 'point2', 'point3', 'point4']));
    adjancencyList.set('Departure', new Set(['Intersection']));
    adjancencyList.set('Arrival', new Set(['point0', 'point1', 'point2', 'point3', 'point4', "Intersection", 'Departure']));


//The mapOfPairAndTotalCost should have the following form -> example of mapOfPairAndTotalCost:


    var mapOfPairAndTotalCost = new Map();


//Initialize Adj List


    function orthodromeDistance(mk1, mk2) {
        let R = 3440; // GL
        var rlat1 = mk1.position.lat() * (Math.PI / 180); // Convert degrees to radians
        var rlat2 = mk2.position.lat() * (Math.PI / 180); // Convert degrees to radians
        var difflat = rlat2 - rlat1; // Radian difference (latitudes)
        var difflon = (mk2.position.lng() - mk1.position.lng()) * (Math.PI / 180); // Radian difference (longitudes)

        return 2 * R
            * Math.asin(Math.sqrt(Math.sin(difflat / 2)
                * Math.sin(difflat / 2) + Math.cos(rlat1)
                * Math.cos(rlat2) * Math.sin(difflon / 2)
                * Math.sin(difflon / 2)));

    }

// Gets intersection
    function getIntersections(p2x, p2y, p3x, p3y, p1x = markerArr.position.lat(), p1y = markerArr.position.lng(), p0x = markerDep.position.lat(), p0y = markerDep.position.lng()) {
        let ix;
        let iy;
        let collisionDetected = 0;
        let d, dx1, dx2, dx3, dy1, dy2, dy3, s, t;

        dx1 = p1x - p0x;
        dy1 = p1y - p0y;
        dx2 = p3x - p2x;
        dy2 = p3y - p2y;
        dx3 = p0x - p2x;
        dy3 = p0y - p2y;

        d = dx1 * dy2 - dx2 * dy1;

        if (d !== 0) {
            s = dx1 * dy3 - dx3 * dy1;

            if ((s <= 0 && d < 0 && s >= d) || (s >= 0 && d > 0 && s <= d)) {
                t = dx2 * dy3 - dx3 * dy2;

                if ((t <= 0 && d < 0 && t > d) || (t >= 0 && d > 0 && t < d)) {
                    t = t / d;

                    collisionDetected = 1;
                    ix = p0x + t * dx1;
                    iy = p0y + t * dy1;

                    return new google.maps.Marker({position: {lat: ix - 0.002, lng: iy - 0.002}, title: "Intersection"})


                }
            }

        }
        return false;
    }


//Populate the cost map
    //Salveaza perechile de puncte care intersecteaza polignul
    let arrayOfCrossingLines = []
    for (let i = 0; i < wayPoints.length - 1; i++) {
        for (let j = i + 1; j < wayPoints.length; j++) {
            for (let k = 0; k < polygon_Coordinates.length - 1; k++) {

                if (getIntersections(wayPoints[i].position.lat(), wayPoints[i].position.lng(), wayPoints[j].position.lat(), wayPoints[j].position.lng(), polygon_Coordinates[k + 1].lat, polygon_Coordinates[k + 1].lng, polygon_Coordinates[k].lat, polygon_Coordinates[k].lng)) {
                    arrayOfCrossingLines.push([wayPoints[i].title, wayPoints[j].title])
                    arrayOfCrossingLines.push([wayPoints[j].title, wayPoints[i].title])
                }
            }
        }
    }
    console.log(arrayOfCrossingLines)
    // Setez costuri imense pentr pricar 2 puncte care mi ar intersecta poligonul
    for (let i = 0; i < arrayOfCrossingLines.length; i = i + 4) {
        mapOfPairAndTotalCost.set(arrayOfCrossingLines[i], 2200000);
        mapOfPairAndTotalCost.set([arrayOfCrossingLines[i][1], arrayOfCrossingLines[i][0]], 2200000);
    }
    // Setez costurile de care am nevoie
    for (let i = 0; i < wayPoints.length - 1; i++) {
        for (let j = i + 1; j < wayPoints.length; j++) {
            mapOfPairAndTotalCost.set([wayPoints[i].title, wayPoints[j].title], orthodromeDistance(wayPoints[i], wayPoints[j]));
            mapOfPairAndTotalCost.set([wayPoints[j].title, wayPoints[i].title], orthodromeDistance(wayPoints[i], wayPoints[j]));
        }
    }
    // un for de verificare pentru a sterge punctele care deja exista mapOfPairAndTotalCost
    for (let [key, val] of mapOfPairAndTotalCost) {
        for (let pair of arrayOfCrossingLines) {
            if (arraysEqual(pair, key) && val !== 2200000) {
                mapOfPairAndTotalCost.delete(key);
            }
        }
    }

    mapOfPairAndTotalCost.set([neededMarker[0].title, neededMarker[2].title], orthodromeDistance(neededMarker[0], new google.maps.Marker({
        position: {
            lat: neededMarker[2].lat,
            lng: neededMarker[2].lng
        }
    })));
    mapOfPairAndTotalCost.set([neededMarker[2].title, neededMarker[0].title], orthodromeDistance(neededMarker[0], new google.maps.Marker({
        position: {
            lat: neededMarker[2].lat,
            lng: neededMarker[2].lng
        }
    })));

    mapOfPairAndTotalCost.set([neededMarker[0].title, neededMarker[1].title], orthodromeDistance(neededMarker[0], new google.maps.Marker({
        position: {
            lat: neededMarker[1].lat,
            lng: neededMarker[1].lng
        }
    })));
    mapOfPairAndTotalCost.set([neededMarker[1].title, neededMarker[0].title], orthodromeDistance(neededMarker[0], new google.maps.Marker({
        position: {
            lat: neededMarker[1].lat,
            lng: neededMarker[1].lng
        }
    })));

    mapOfPairAndTotalCost.set([markerDep.title, neededMarker[0].title], orthodromeDistance(neededMarker[0], markerDep))
    mapOfPairAndTotalCost.set([neededMarker[0].title, markerDep.title], orthodromeDistance(neededMarker[0], markerDep))


    /*What we have:
    * mapOfPairAndTotalCost
    * adjancecyList*/

// algorimul al de pe wikipedia

    let finalPath = [];
//Step 1: Mark all the nodes unvisited
    let unvisitedArray = Array.from(adjancencyList.keys());


//Step 2: assign to every node the highest cost possible and 0 to the starting node
    let mapOfTentativeNodes = new Map();

// map to keep track of the following success
    let keepTrackOfNodes = new Map();

//mark start node with 0 distance
    let startNode = 'Departure'
    let currentNode = 'Departure';
    let endNode = 'Arrival';

    for (let i = 0; i < unvisitedArray.length; i++) {
        if (unvisitedArray[i] === currentNode) {
            mapOfTentativeNodes.set(unvisitedArray[i], 0);
        } else {
            mapOfTentativeNodes.set(unvisitedArray[i], Infinity);
        }
    }

    while (unvisitedArray.length !== 0) {

        //console.log(mapOfTentativeNodes)
        // 3) For the current node, consider all of its unvisited neighbours and calculate their tentative distances through the current node.
        //     Compare the newly calculated tentative distance to the current assigned value and assign the smaller one.

        //  adjacencyList -> [name of Node: set of all neighbours]
        //  mapOfPairAndTotalCost // [(start, finish), total_cost]
        //  mapOfTentativeNodes // [name of Node: assigned cost]

        let unvisitedNeighbours_currentNode = adjancencyList.get(currentNode); // Set of the Neighbours


        for (let nextNode of unvisitedNeighbours_currentNode) {


            // get cost from the mapOfPaiAndTotalCost  [currentNode -> nextNode: total cost]
            for (let [key, value] of mapOfPairAndTotalCost) {
                if (arraysEqual(key, [currentNode, nextNode])) {
                    costOfPair = value;
                    break;
                }
            }
            let costOfNode = mapOfTentativeNodes.get(currentNode);
            let totalCostOFNodePair = costOfPair + costOfNode;

            // update mapOfTentativeArray : if the cost is lower than the already existing cost, update it to the lower cost
            if (totalCostOFNodePair < mapOfTentativeNodes.get(nextNode)) {
                mapOfTentativeNodes.set(nextNode, totalCostOFNodePair);
                keepTrackOfNodes.set(nextNode, currentNode)

            }
        }


        //4) mark the current node as visited -> remove the node from the unvisited array
        for (let i = 0; i < unvisitedArray.length; i++) {
            if (unvisitedArray[i] === currentNode) {
                unvisitedArray.splice(i, 1);
            }
        }


        //5) Check if End has been reached, otherwise retain the smallest cost unvisited node and go back to step 3
        if (currentNode === endNode) {
            break
        } else {
            //select the unvisited node that is marked with the smallest tentative distance, set it as the new "current node", and go back to step 3.
            let minValue = Infinity;
            for (let node of new Set(unvisitedArray)) {
                if (new Set(unvisitedArray).has(node) && mapOfTentativeNodes.get(node) < minValue) {
                    minValue = mapOfTentativeNodes.get(node);
                    currentNode = node;

                }
            }
        }

    }
    ////////////////
// Analyze the keepTrackOfNodes map and extract the order of the nodes which forms the path of least cost
    function savePath() {
        let value = endNode;
        finalPath.push(value);
        while (value !== startNode) {
            value = keepTrackOfNodes.get(value);
            finalPath.push(value);
            if (value === startNode) break

        }
        return finalPath.reverse()
    }
    //save order of nodes

    let orderOfNodesForFlight = savePath();

    let arrOrder = []
    // iterez prin Map ul ala [nume -> coordonate]
    for (let i = 0 ; i < orderOfNodesForFlight.length; i++){
        arrOrder.push(mapOfPoints.get(orderOfNodesForFlight[i]))
    }
    // asa scoateti distanta rutei
    console.log(mapOfTentativeNodes.get('Arrival'))
    let pol1 = new google.maps.Polyline({path:arrOrder, map:map});
    return pol1

}

var pol1 = updateMap();
function removeThings(){
    pol1.setMap(null);
}
function draw(){
    pol1 = updateMap();
    pol1.setMap(map)
}
google.maps.event.addListener(markerArr, 'dragstart', removeThings);
google.maps.event.addListener(markerDep, 'dragstart', removeThings);
google.maps.event.addListener(markerArr, 'dragend', draw);
google.maps.event.addListener(markerDep, 'dragend', draw);



//Check if two arrays are equal (have the same elements in the exact same order)
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}