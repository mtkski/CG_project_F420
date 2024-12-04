class Circ{
    constructor(posx, posy, rad) {
    this.posx = posx;
    this.posy = posy;
    this.rad = rad;
    }

    getCenter = function () {
        return createVector(this.posx, this.posy);
    }

    getRadius = function () {
        return this.rad;
    }

    display = function () {
      push();
      circle(this.posx, this.posy, this.rad * 2);
      pop();
    };
}

class Line{
    constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    }
    display = function () {
        push();
        line(this.x1, this.y1, this.x2, this.y2);
        pop();
    }
}

class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

class Polygon {
    constructor() {
    this.points = [];
    }

    add_point = function (x, y) {
      this.points.push(createVector(x, y));
    }

    getPoints = function () {
      return this.points;
    }

    display = function () {
      beginShape();
      for (let pt of this.points) {
        vertex(pt.x, pt.y);
      }
      endShape(CLOSE);
    };
  }

class MinkShape {
    constructor(poly, Srad) {
        this.LinePairs = [];
        this.ArcPairs = [];
        this.basePoly = poly;
        this.Srad = Srad;
    }

    update(poly) {
        this.basePoly = poly;
        if (poly.points.length > 2) {
            [this.LinePairs, this.ArcPairs] = this.calcPairs(poly, this.Srad);
            // console.log("LINES = ",this.LinePairs);
            console.log("ARC= ", this.ArcPairs);
            // console.log("POLY.getpoints = ", this.basePoly.getPoints());
            return;
        }
    }
        

    calcPairs(poly, Srad) {
        let pointlist = [];
        let linePairs = [];
        let arcPairs = [];
        let t_point1, t_point2;
        
        for (let i = 0; i < poly.points.length; i++) {  
            let p0 = poly.points[i];
            let p1 = poly.points[(i+1)% poly.points.length] ;

            let l1 = new Line(p0.x, p0.y, p1.x, p1.y, 0);
            let c1 = new Circ(p0.x, p0.y, Srad, 8);
            let c2 = new Circ(p1.x, p1.y, Srad, 6);
            
            let t1, t2, dx, dy;
            [t1, t2, dx, dy] = calcInterLineCircle(c1, l1);

            if (insideOutside(t1, poly) == "outside") {
                t_point1 = t1;
            }
            else {
                t_point1 = t2;
            }
            let t1_2, t2_2, dx_2, dy_2;
            [t1_2, t2_2, dx_2, dy_2] = calcInterLineCircle(c2, l1);

            if (insideOutside(t1_2, poly) == "outside") {
                t_point2 = t1_2;
            }
            else {
                t_point2 = t2_2;
            }

            pointlist.push(t_point1);
            pointlist.push(t_point2);
            linePairs.push([t_point1, t_point2]);

            if (i > 0) {
                let arcpoint1 = pointlist[(2*i)-1];
                let arcpoint2 = pointlist[(2*i)];
                arcPairs.push([arcpoint1, arcpoint2]);

                if (i == poly.points.length - 1) {
                    console.log("LAST POINT= ", arcPairs[0][0]);
                    arcPairs.push([arcpoint2, arcPairs[0][0]]);
                }
            }

        }
        
        return [linePairs, arcPairs];
    }

    display() {
        let basePoints = this.basePoly.getPoints();
        let ArcPairs = this.ArcPairs;
        let Srad = this.Srad;

        beginShape(TRIANGLE_STRIP);

        for (let pair of this.LinePairs) {
          line(pair[0].x, pair[0].y, pair[1].x, pair[1].y);
        //   stroke(0,0,255);
        //   circle(pair[0].x, pair[0].y, 5);
        //   circle(pair[1].x, pair[1].y, 5);
        }

        for(let i = 0; i < basePoints.length; i++) {
            // stroke(255,0,0);
            // circle(ArcPairs[i][0].x, ArcPairs[i][0].y, 5);
            // circle(ArcPairs[i][1].x, ArcPairs[i][1].y, 5);
            // stroke(0,0,255);
            // circle(basePoints[(i+1)%basePoints.length].x, basePoints[(i+1)%basePoints.length].y, 5);
            drawArcCircle(basePoints[(i+1)%basePoints.length].x, basePoints[(i+1)%basePoints.length].y, ArcPairs[i][0].x, ArcPairs[i][0].y, ArcPairs[i][1].x, ArcPairs[i][1].y, Srad);
        }
        endShape();
    }
}

function calcInterLineCircle(circ, line) {
    let cx = circ.getCenter().x;
    let cy = circ.getCenter().y;
    let r = circ.getRadius();
  
    let x1 = line.x1, y1 = line.y1, x2 = line.x2, y2 = line.y2; // Segment
  
    // Calculer le vecteur directeur du segment
    let dx = x2 - x1;
    let dy = y2 - y1;
    let mag = Math.sqrt(dx * dx + dy * dy);
    dx /= mag;
    dy /= mag;
  
    // Normale au vecteur directeur
    let normalX = -dy;
    let normalY = dx;
  
    // Points de départ des lignes tangentes
    let t1 = new Point(cx + r * normalX, cy + r * normalY);
    let t2 = new Point(cx - r * normalX, cy - r * normalY);
  
    return [t1, t2, dx, dy];
}

function drawArcCircle(mx, my, x1, y1, x2, y2, radius) {  
    // Determine angles
    let startAngle = atan2(y1 - my, x1 - mx);
    let endAngle = atan2(y2 - my, x2 - mx);
  
    // Draw the arc
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(mx, my, radius * 2, radius * 2, startAngle, endAngle);
  }

function orientationRL(p1, p2, p3) {
    var orientationVal = calcOrientation(p1, p2, p3);
    var orientation = "0";

    if (orientationVal > 0) {
        orientation = "R";
    } else if (orientationVal == 0) {
        orientation = "0";
    } else {
        orientation = "L";
    }
    return orientation;
}

function orientationRL(p1, p2, p3) {
    var orientationVal = calcOrientation(p1, p2, p3);
    var orientation = "0";

    if (orientationVal > 0) {
        orientation = "R";
    } else if (orientationVal == 0) {
        orientation = "0";
    } else {
        orientation = "L";
    }
    return orientation;
}

function insideOutside(p1, poly) {
    for (let i in poly.points.length) {
        var orientation = orientationRL(p1, poly.points[i], poly.points[i+1]);
        if (orientation == "R") {
        return "outside";
        }
    }
}


let poly = new Polygon();
let minkShape = new MinkShape(poly, 50);

function setup() {
    w = min(1000, 1000);
    
    createCanvas(w, w);
    background(255);
    button = createButton('Finish polygon', 'red');
    button.position(500, 1000);


  }


function mousePressed() {
    poly.add_point(mouseX, mouseY);
    minkShape.update(poly);
    // poly.add_point(250, 500);
    // poly.add_point(500, 250);
    // poly.add_point(750, 500);
    // poly.add_point(500, 750);
}

function draw() {
    background(255);
    noFill();
    stroke(0);
    drawArcCircle(500, 500, 250, 500, 750, 500, 50);
    // poly.display();
    if (poly.points.length > 2) {
        minkShape.display();
    }
  }
