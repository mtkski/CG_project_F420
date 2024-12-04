class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  
class Points {
constructor() {
    this.list = [];
}
add(x, y) {
    this.list.push(new Point(x, y));

    if (this.list.length > 4) {
    this.list.shift();
    }
}
getPoints() {
    return this.list;
}
reset() {
    this.list = [];
}
}

class Polygon {
    constructor(origin = 0, relativeCoords = [], vertices = []) {
        this.origin = origin;
        this.relativeCoords = []; 
        this.vertices = this.setVertices(); 
    }

    setOrigin(origin) {
        this.origin = origin;
    }
    
    setRelativeCoords(coords) {
        this.relativeCoords = coords;
    }

    setVertices() {
        let ox = this.origin[0];
        let oy = this.origin[1];
        for (let i = 0; i < this.relativeCoords.length; i++) {
          this.vertices[i][0] = this.relativeCoords + ox;
          this.vertices[i][1] = this.relativeCoords + oy;
      this.vertices = vertices;
    }
  }

    getVertices() {
        return this.vertices;
    }

    getRelativeCoords() {
        return this.relativeCoords;
    }
  
    // Method to draw the polygon
    drawPolygon() {
      if (this.vertices.length < 3) {
        console.error("A polygon needs at least 3 vertices.");
        return;
      }
  
      beginShape();
      for (let point of this.vertices) {
        vertex(point[0], point[1]);
      }
      endShape(CLOSE);
    }
}

function minkowskiSum(shapeA, shapeB) {
    let AB_vertices = [];
    var points = new Points();
    for (let vertexA of shapeA.getVertices()) {
      for (let vertexB of shapeB.getRelativeCoords()) {
        let x = vertexA[0] + vertexB[0];
        let y = vertexA[1] + vertexB[1];
        console.log(x, y);
        AB_vertices.push([x, y]);
        points.add(x, y);
      }
    }
    return points;
}

var shapeA = new Polygon(origin = [500,500], relativeCoords = [[0,0], [100,0], [50,-100], [-50, -20]]);
console.log(shapeA.getVertices());
console.log(shapeA.getRelativeCoords());

// var shapeB = new Polygon();
// shapeB.setOrigin([250,250]);
// shapeB.setRelativeCoords([[0,0], [100,0], [50,-100]]);

// var shapeAB = new Polygon();
// shapeAB.setOrigin([500,250]);
// shapeAB.setVertices(minkowskiSum(shapeA.getVertices(), shapeB.getVertices()));
var points = new Points();
// points = minkowskiSum(shapeA, shapeB);

function setup() {
    createCanvas(1000, 1000);
    stroke(0); // Black outline
    strokeWeight(2); // Thicker lines

  }

  function draw() {
    background(220);
    //circle(100, 100, 10);
    fill(100, 150, 255); // Light blue fill
    shapeA.drawPolygon();
    fill(200, 150, 100);
    // shapeB.drawPolygon();
    fill(200, 200, 23);
    // shapeAB.drawPolygon();

    for (let point of points.getPoints()) {
        circle(point.x, point.y, 5);
    }
  }
