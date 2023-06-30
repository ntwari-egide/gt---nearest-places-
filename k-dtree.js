var KDNode = /** @class */ (function () {
    function KDNode(point, name) {
        this.point = point;
        this.name = name;
        this.left = null;
        this.right = null;
    }
    return KDNode;
}());
var KDTree = /** @class */ (function () {
    function KDTree() {
        this.root = null;
    }
    KDTree.prototype.insert = function (point, name) {
        var newNode = new KDNode(point, name);
        if (this.root === null) {
            this.root = newNode;
        }
        else {
            this.insertNode(this.root, newNode, 0);
        }
    };
    KDTree.prototype.insertNode = function (currentNode, newNode, depth) {
        var axis = depth % newNode.point.length;
        if (newNode.point[axis] < currentNode.point[axis]) {
            if (currentNode.left === null) {
                currentNode.left = newNode;
            }
            else {
                this.insertNode(currentNode.left, newNode, depth + 1);
            }
        }
        else {
            if (currentNode.right === null) {
                currentNode.right = newNode;
            }
            else {
                this.insertNode(currentNode.right, newNode, depth + 1);
            }
        }
    };
    return KDTree;
}());
function findLocationsWithinRadius(kdTree, specificLocationCoordinates, radius) {
    var locations = [];
    function search(node, depth) {
        if (node === null) {
            return;
        }
        var distance = calculateDistance(node.point, specificLocationCoordinates);
        if (distance <= radius) {
            locations.push({ name: node.name, coordinates: node.point });
        }
        var axis = depth % specificLocationCoordinates.length;
        var target = specificLocationCoordinates[axis];
        if (target < node.point[axis]) {
            search(node.left, depth + 1);
            if (target + radius >= node.point[axis]) {
                search(node.right, depth + 1);
            }
        }
        else {
            search(node.right, depth + 1);
            if (target - radius <= node.point[axis]) {
                search(node.left, depth + 1);
            }
        }
    }
    search(kdTree.root, 0);
    return locations;
}
function calculateDistance(point1, point2) {
    var lat1 = point1[0], lon1 = point1[1];
    var lat2 = point2[0], lon2 = point2[1];
    var earthRadius = 6371; // Earth's radius in kilometers
    var dLat = toRadians(lat2 - lat1);
    var dLon = toRadians(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = earthRadius * c;
    return distance;
}
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
// Example usage
var kdTree = new KDTree();
var places = [
    [36.7538, 3.0588],
    [-1.2864, 36.8172],
    [30.0444, 31.2357],
    [9.0765, 7.3986],
    [9.0084, 38.7575],
    [-25.7461, 28.1881],
    [33.9716, -6.8498],
    [5.6037, -0.1870],
    [14.7167, -17.4677],
    [32.8872, 13.1913],
    // [-1.9706, 30.1044],  // Kigali
    [6.5244, 3.3792] // Lagos
];
var placeNames = [
    "Algiers",
    "Nairobi",
    "Cairo",
    "Abuja",
    "Addis Ababa",
    "Pretoria",
    "Rabat",
    "Accra",
    "Dakar",
    "Tripoli",
    // "Kigali",
    "Lagos"
];
for (var i = 0; i < places.length; i++) {
    var place = places[i];
    var placeName = placeNames[i];
    kdTree.insert(place, placeName);
}
var specificLocationCoordinates = [-1.9706, 30.1044]; // Example specific location coordinates (kigali city)
var radius = 1000; // 1000 kilometers
var locationsWithinRadius = findLocationsWithinRadius(kdTree, specificLocationCoordinates, radius);
if (locationsWithinRadius.length > 0) {
    console.log("Locations within the specified radius:");
    for (var _i = 0, locationsWithinRadius_1 = locationsWithinRadius; _i < locationsWithinRadius_1.length; _i++) {
        var location_1 = locationsWithinRadius_1[_i];
        console.log("".concat(location_1.name, ": ").concat(location_1.coordinates)); // response  is Nairobi which is in range of 758 kilometers
    }
}
else {
    console.log("No locations found within the specified radius.");
}
