class KDNode {
    point: number[];
    name: string;
    left: KDNode | null;
    right: KDNode | null;
  
    constructor(point: number[], name: string) {
      this.point = point;
      this.name = name;
      this.left = null;
      this.right = null;
    }
  }
  
  class KDTree {
    root: KDNode | null;
  
    constructor() {
      this.root = null;
    }
  
    insert(point: number[], name: string): void {
      const newNode = new KDNode(point, name);
  
      if (this.root === null) {
        this.root = newNode;
      } else {
        this.insertNode(this.root, newNode, 0);
      }
    }
  
    private insertNode(currentNode: KDNode, newNode: KDNode, depth: number): void {
      const axis = depth % newNode.point.length;
  
      if (newNode.point[axis] < currentNode.point[axis]) {
        if (currentNode.left === null) {
          currentNode.left = newNode;
        } else {
          this.insertNode(currentNode.left, newNode, depth + 1);
        }
      } else {
        if (currentNode.right === null) {
          currentNode.right = newNode;
        } else {
          this.insertNode(currentNode.right, newNode, depth + 1);
        }
      }
    }
  }
  
  function findLocationsWithinRadius(kdTree: KDTree, specificLocationCoordinates: number[], radius: number): { name: string, coordinates: number[] }[] {
    const locations: { name: string, coordinates: number[] }[] = [];
  
    function search(node: KDNode, depth: number): void {
      if (node === null) {
        return;
      }
  
      const distance = calculateDistance(node.point, specificLocationCoordinates);
  
      if (distance <= radius) {
        locations.push({ name: node.name, coordinates: node.point });
      }
  
      const axis = depth % specificLocationCoordinates.length;
      const target = specificLocationCoordinates[axis];
  
      if (target < node.point[axis]) {
        search(node.left, depth + 1);
        if (target + radius >= node.point[axis]) {
          search(node.right, depth + 1);
        }
      } else {
        search(node.right, depth + 1);
        if (target - radius <= node.point[axis]) {
          search(node.left, depth + 1);
        }
      }
    }
  
    search(kdTree.root, 0);
    return locations;
  }

  function calculateDistance(point1: number[], point2: number[]): number {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  const earthRadius = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

  
  // Example usage
  const kdTree = new KDTree();
  const places = [
    [36.7538, 3.0588],   // Algiers
    [-1.2864, 36.8172],  // Nairobi
    [30.0444, 31.2357],  // Cairo
    [9.0765, 7.3986],    // Abuja
    [9.0084, 38.7575],   // Addis Ababa
    [-25.7461, 28.1881], // Pretoria
    [33.9716, -6.8498],  // Rabat
    [5.6037, -0.1870],   // Accra
    [14.7167, -17.4677], // Dakar
    [32.8872, 13.1913],  // Tripoli
    // [-1.9706, 30.1044],  // Kigali
    [6.5244, 3.3792]     // Lagos
  ];
  
  const placeNames = [
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
  
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const placeName = placeNames[i];
    kdTree.insert(place, placeName);
  }
  
  const specificLocationCoordinates = [-1.9706, 30.1044]; // Example specific location coordinates (kigali city)
  const radius = 1000; // 1000 kilometers
  
  const locationsWithinRadius = findLocationsWithinRadius(kdTree, specificLocationCoordinates, radius);
  
  if (locationsWithinRadius.length > 0) {
    console.log("Locations within the specified radius:");
    for (const location of locationsWithinRadius) {
      console.log(`${location.name}: ${location.coordinates}`); // response  is Nairobi which is 758 kilometers from Kigali
    }
  } else {
    console.log("No locations found within the specified radius.");
  }
  