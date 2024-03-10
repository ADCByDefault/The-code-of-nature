/** @type {HTMLCanvasElement}*/
const canvas = document.querySelector("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

windowRisized();
window.addEventListener("resize", (e) => {
    windowRisized();
});

function windowRisized() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Vector3D {
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @returns {Vector3D}
     */
    static add(v1, v2) {
        return new Vector3D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @returns {Vector3D}
     */
    static sub(v1, v2) {
        return new Vector3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {number} s
     * @returns {Vector3D}
     */
    static multiply(v1, s) {
        return new Vector3D(v1.x * s, v1.y * s, v1.z * s);
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {number} s
     * @returns {Vector3D}
     */
    static divide(v1, s) {
        return new Vector3D(v1.x / s, v1.y / s, v1.z / s);
    }
    /**
     *
     * @param {Vector3D} v
     * @returns {Vector3D}
     */
    static magnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
    /**
     *
     * @param {Vector3D} v
     * @returns {Vector3D}
     */
    static squaredMagnitude(v) {
        return v.x * v.x + v.y * v.y + v.z * v.z;
    }
    /**
     *
     * @param {Vector3D} v
     * @returns {Vector3D}
     */
    static normalize(v) {
        const mag = Vector3D.magnitude(v);
        return new Vector3D(v.x / mag, v.y / mag, v.z / mag);
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @returns {number}
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @returns {Vector3D}
     */
    static cross(v1, v2) {
        return new Vector3D(
            v1.y * v2.z - v1.z * v2.y,
            -1 * (v1.x * v2.z - v1.z * v2.x),
            v1.x * v2.y - v1.y * v2.x
        );
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @returns {Vector3D}
     */
    static lerp(v1, v2, t) {
        return Vector3D.add(v1, Vector3D.multiply(Vector3D.sub(v2, v1), t));
    }
    /**
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @returns {number}
     * */
    static distance(v1, v2) {
        return Vector3D.magnitude(Vector3D.sub(v1, v2));
    }
}
class Plane {
    /**
     *
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     */
    constructor(ax, by, cz, d) {
        this.ax = ax;
        this.by = by;
        this.cz = cz;
        this.d = d;
    }
    /**
     *
     * @param {Vector3D} v1
     * @param {Vector3D} v2
     * @param {Vector3D} v3
     * @returns {Plane}
     */
    static planeFromVectors(v1, v2, v3) {
        let a = Vector3D.sub(v2, v1);
        let b = Vector3D.sub(v3, v1);
        let n = Vector3D.normalize(Vector3D.cross(a, b));
        let d = -n.x * v1.x - n.y * v1.y - n.z * v1.z;
        return new Plane(n.x, n.y, n.z, d);
    }
    /**
     *
     * @param {Plane} plane
     * @returns {Vector3D}
     */
    static normal(plane) {
        return new Vector3D(plane.ax, plane.by, plane.cz);
    }
    /**
     *
     * @param {Ray} ray
     * @param {Plane} plane
     * @returns {number}
     */
    static planeRayIntersection(ray, plane) {
        let t =
            -(
                plane.ax * ray.start.x +
                plane.by * ray.start.y +
                plane.cz * ray.start.z +
                plane.d
            ) /
            (plane.ax * (ray.end.x - ray.start.x) +
                plane.by * (ray.end.y - ray.start.y) +
                plane.cz * (ray.end.z - ray.start.z));
        return t;
    }
}
class Ray {
    /**
     *
     * @param {Vector3D} origin
     * @param {Vector3D} direction
     * @param {string} color
     */
    constructor(start, end, color) {
        this.start = start;
        this.end = end;
        this.color = color ? color : "white";
    }
    /**
     *
     * @param {Ray} ray
     * @param {number} t
     * @returns {Vector3D}
     */
    static pointAtParameter(ray, t) {
        return Vector3D.lerp(ray.start, ray.end, t);
    }
    /**
     *
     * @param {Ray} ray
     * @param {Plane} plane
     * @returns {number}
     */
    static planeRayIntersection(ray, plane) {
        let t =
            -(
                plane.ax * ray.start.x +
                plane.by * ray.start.y +
                plane.cz * ray.start.z +
                plane.d
            ) /
            (plane.ax * (ray.end.x - ray.start.x) +
                plane.by * (ray.end.y - ray.start.y) +
                plane.cz * (ray.end.z - ray.start.z));
        return t;
    }
}
class Triangle {
    /**
     *
     * @param {Vector3D} a
     * @param {Vector3D} b
     * @param {Vector3D} c
     */
    constructor(a, b, c, color) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.color = color ? color : "white";
        this.plane = Plane.planeFromVectors(a, b, c);
        let la = Vector3D.distance(a, b);
        let lb = Vector3D.distance(b, c);
        let lc = Vector3D.distance(c, a);
        this.perimeter = la + lb + lc;
        let s = this.perimeter / 2;
        this.area = Math.sqrt(s * (s - la) * (s - lb) * (s - lc));
    }
    /**
     *
     * @param {Ray} ray
     * @param {Triangle} triangle
     * @returns {boolean}
     */
    static triangleRayIntersection(ray, triangle) {
        let t = Ray.planeRayIntersection(ray, triangle.plane);
        let i = Ray.pointAtParameter(ray, t);
        let t1 = new Triangle(i, triangle.a, triangle.b);
        let t2 = new Triangle(i, triangle.b, triangle.c);
        let t3 = new Triangle(i, triangle.c, triangle.a);
        if (
            (t1.area + t2.area + t3.area) * 10000000 <=
            triangle.area + triangle.area * 10000000
        ) {
            return t;
        }
        return false;
    }
}
class MatrixVector4D {
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @param {number} w
     */
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     *
     * @param {MatrixVector4D} v
     * @param {number} round
     * @returns {MatrixVector4D}
     */
    static roundMatrixVector4D(v, round) {
        let n = new MatrixVector4D(0, 0, 0, 0);
        n.x = v.x > round ? v.x : 0;
        n.y = v.y > round ? v.y : 0;
        n.z = v.z > round ? v.z : 0;
        n.w = v.w > round ? v.w : 0;
        return n;
    }
}
class Matrix {
    /**
     *
     * @param {MatrixVector4D} i
     * @param {MatrixVector4D} j
     * @param {MatrixVector4D} k
     */
    constructor(i, j, k) {
        this.i = i ? i : new MatrixVector4D(1, 0, 0, 0);
        this.j = j ? j : new MatrixVector4D(0, 1, 0, 0);
        this.k = k ? k : new MatrixVector4D(0, 0, 1, 0);
    }
    /**
     *
     * @param {Matrix} m
     * @param {Vector3D} v
     * @returns {Vector3D}
     */
    static multiplyVector(m, v) {
        let newV = new Vector3D(
            m.i.x * v.x + m.j.x * v.y + m.k.x * v.z + m.i.w,
            m.i.y * v.x + m.j.y * v.y + m.k.y * v.z + m.j.w,
            m.i.z * v.x + m.j.z * v.y + m.k.z * v.z + m.k.w
        );
        return newV;
    }
    /**
     *
     * @param {Matrix} m2
     * @param {Matrix} m1
     * @returns {Matrix}
     */

    static multiplyMatrix(m1, m2) {
        let i = new MatrixVector4D(
            m1.i.x * m2.i.x + m1.j.x * m2.i.y + m1.k.x * m2.i.z,
            m1.i.y * m2.i.x + m1.j.y * m2.i.y + m1.k.y * m2.i.z,
            m1.i.z * m2.i.x + m1.j.z * m2.i.y + m1.k.z * m2.i.z,
            m1.i.w
        );
        let j = new MatrixVector4D(
            m1.i.x * m2.j.x + m1.j.x * m2.j.y + m1.k.x * m2.j.z,
            m1.i.y * m2.j.x + m1.j.y * m2.j.y + m1.k.y * m2.j.z,
            m1.i.z * m2.j.x + m1.j.z * m2.j.y + m1.k.z * m2.j.z,
            m1.j.w
        );
        let k = new MatrixVector4D(
            m1.i.x * m2.k.x + m1.j.x * m2.k.y + m1.k.x * m2.k.z,
            m1.i.y * m2.k.x + m1.j.y * m2.k.y + m1.k.y * m2.k.z,
            m1.i.z * m2.k.x + m1.j.z * m2.k.y + m1.k.z * m2.k.z,
            m1.k.w
        );
        return new Matrix(i, j, k);
    }
    /**
     * @param {Matrix} m
     * @param {number} angle
     * @returns {Matrix}
     * */
    static rotateX(m, angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let i = new MatrixVector4D(1, 0, 0, 0);
        let j = new MatrixVector4D(0, cos, -sin, 0);
        let k = new MatrixVector4D(0, sin, cos, 0);
        return Matrix.multiplyMatrix(m, new Matrix(i, j, k));
    }
    /**
     * @param {Matrix} m
     * @param {number} angle
     * @returns {Matrix}
     * */
    static rotateY(m, angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let i = new MatrixVector4D(cos, 0, sin, 0);
        let j = new MatrixVector4D(0, 1, 0, 0);
        let k = new MatrixVector4D(-sin, 0, cos, 0);
        return Matrix.multiplyMatrix(m, new Matrix(i, j, k));
    }
    /**
     * @param {Matrix} m
     * @param {number} angle
     * @returns {Matrix}
     * */
    static rotateZ(m, angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let i = new MatrixVector4D(cos, -sin, 0, 0);
        let j = new MatrixVector4D(sin, cos, 0, 0);
        let k = new MatrixVector4D(0, 0, 1, 0);
        return Matrix.multiplyMatrix(m, new Matrix(i, j, k));
    }
}

class Film {
    /**
     *
     * @param {number} width
     * @param {number} height
     * @param {CanvasRenderingContext2D} canvas
     * @param {number} pixelSize
     */
    constructor(position, width, height, ctx, pixelSize) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        this.ctx = ctx;
        this.pixelSize = pixelSize;
        this.pixelsOnFilm = [];
        this.pixelsInSpace = [];
        for (
            let i = this.halfHeight;
            i >= -this.halfHeight;
            i = i - pixelSize
        ) {
            for (
                let j = -this.halfWidth;
                j <= this.halfWidth;
                j = j + pixelSize
            ) {
                this.pixelsOnFilm.push({
                    x: j + this.halfWidth,
                    y: -i + this.halfHeight,
                });
                this.pixelsInSpace.push(new Vector3D(j, i, position.z));
            }
        }
    }
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    drawPixel(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
    }
    drawPixelbyIndex(i, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            this.pixelsOnFilm[i].x,
            this.pixelsOnFilm[i].y,
            this.pixelSize,
            this.pixelSize
        );
    }
}
class Camera {
    /**
     * @param {Matrix} position
     * @param {Vector3D} lookAt
     * @param {Film} film
     * @param {number} distance
     * */
    constructor(matrix, film, distance) {
        this.matrix = matrix;
        this.position = new Vector3D(matrix.i.w, matrix.j.w, matrix.k.w);
        this.film = film;
        this.distance = distance;
        this.traceThroughPixels = film.pixelsInSpace.map((p) => {
            return new Vector3D(p.x, p.y, distance);
        });
    }
    /**
     *
     * @param {number} i
     * @returns {Ray}
     */
    trace(i) {
        let start = new Vector3D(
            this.matrix.i.w,
            this.matrix.j.w,
            this.matrix.k.w
        );
        let end = Matrix.multiplyVector(
            this.matrix,
            this.traceThroughPixels[i]
        );
        return new Ray(start, end);
    }
}

let cameraMatrix = new Matrix(
    new MatrixVector4D(1, 0, 0, 0),
    new MatrixVector4D(0, 1, 0, 0),
    new MatrixVector4D(0, 0, 1, 0)
);
cameraMatrix = Matrix.rotateZ(cameraMatrix, 0 * (Math.PI / 180));
cameraMatrix = Matrix.rotateX(cameraMatrix, 0 * (Math.PI / 180));
cameraMatrix = Matrix.rotateY(cameraMatrix, 0 * (Math.PI / 180));
let film = new Film(new Vector3D(0, 0, 0), 600, 400, ctx, 3);
let camera = new Camera(cameraMatrix, film, 600);
let mesh = [
    new Triangle(
        new Vector3D(-150, -150, -150),
        new Vector3D(150, -150, -150),
        new Vector3D(150, 150, -150),
        "rgba(255, 99, 71, 1)"
    ),
    new Triangle(
        new Vector3D(-150, -150, -150),
        new Vector3D(150, 150, -150),
        new Vector3D(-150, 150, -150),
        "rgba(255, 99, 71, 0.5)"
    ),
    new Triangle(
        new Vector3D(-150, 150, 150),
        new Vector3D(-150, 150, -150),
        new Vector3D(150, 150, -150),
        "rgba(238, 130, 238, 1)"
    ),
    new Triangle(
        new Vector3D(-150, 150, 150),
        new Vector3D(150, 150, -150),
        new Vector3D(150, 150, 150),
        "rgba(238, 130, 238, 0.5)"
    ),
    new Triangle(
        new Vector3D(150, 150, 150),
        new Vector3D(150, 150, -150),
        new Vector3D(150, -150, -150),
        "rgba(0, 0, 255, 1)"
    ),
    new Triangle(
        new Vector3D(150, 150, 150),
        new Vector3D(150, -150, -150),
        new Vector3D(150, -150, 150),
        "rgba(0, 0, 255, 0.5)"
    ),
    new Triangle(
        new Vector3D(150, -150, 150),
        new Vector3D(150, -150, -150),
        new Vector3D(-150, -150, -150),
        "rgba(255, 255, 0, 1)"
    ),
    new Triangle(
        new Vector3D(150, -150, 150),
        new Vector3D(-150, -150, -150),
        new Vector3D(-150, -150, 150),
        "rgba(255, 255, 0, 0.5)"
    ),
    new Triangle(
        new Vector3D(-150, -150, 150),
        new Vector3D(-150, -150, -150),
        new Vector3D(-150, 150, -150),
        "rgba(0, 255, 0, 1)"
    ),
    new Triangle(
        new Vector3D(-150, -150, 150),
        new Vector3D(-150, 150, -150),
        new Vector3D(-150, 150, 150),
        "rgba(0, 255, 0, 0.5)"
    ),
    new Triangle(
        new Vector3D(-150, 150, 150),
        new Vector3D(150, 150, 150),
        new Vector3D(150, -150, 150),
        "rgba(0, 255, 255, 1)"
    ),
    new Triangle(
        new Vector3D(-150, 150, 150),
        new Vector3D(150, -150, 150),
        new Vector3D(-150, -150, 150),
        "rgba(0, 255, 127, 0.5)"
    ),
];
let meshMatrix = new Matrix(
    new MatrixVector4D(1, 0, 0, 0),
    new MatrixVector4D(0, 1, 0, 0),
    new MatrixVector4D(0, 0, 1, 1000)
);
meshMatrix = Matrix.rotateX(meshMatrix, 30 * (Math.PI / 180));
meshMatrix = Matrix.rotateY(meshMatrix, 50 * (Math.PI / 180));
meshMatrix = Matrix.rotateZ(meshMatrix, 90 * (Math.PI / 180));

let alpha = 0;
let beta = 0;
let theta = 0;
function animate() {
    console.time("frame");
    requestAnimationFrame(animate);
    alpha = alpha - 0.05;
    beta = beta + -0.01;
    theta = theta + 0.05;
    meshMatrix = Matrix.rotateX(meshMatrix, alpha * (Math.PI / 180));
    meshMatrix = Matrix.rotateY(meshMatrix, beta * (Math.PI / 180));
    meshMatrix = Matrix.rotateZ(meshMatrix, theta * (Math.PI / 180));
    let tmesh = mesh.map((t) => {
        return new Triangle(
            Matrix.multiplyVector(meshMatrix, t.a),
            Matrix.multiplyVector(meshMatrix, t.b),
            Matrix.multiplyVector(meshMatrix, t.c),
            t.color
        );
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < film.pixelsInSpace.length; i++) {
        let ray = camera.trace(i);
        let te = Infinity;
        for (let j = 0; j < tmesh.length; j++) {
            let t = Triangle.triangleRayIntersection(ray, tmesh[j]);
            if (!t) continue;
            if (t < te) {
                te = t;
                ray.color = tmesh[j].color;
            }
        }
        film.drawPixelbyIndex(i, ray.color);
    }
    console.timeEnd("frame");
}
animate();
