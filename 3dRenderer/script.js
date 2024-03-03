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
        if (t < 0 || t > 1) return false;
        let i = Ray.pointAtParameter(ray, t);
        let t1 = new Triangle(i, triangle.a, triangle.b);
        let t2 = new Triangle(i, triangle.b, triangle.c);
        let t3 = new Triangle(i, triangle.c, triangle.a);
        if (t1.area + t2.area + t3.area == triangle.area) {
            return true;
        }
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
        return new Vector3D(
            m.i.x * v.x + m.j.x * v.y + m.k.x * v.z + m.i.w,
            m.i.y * v.x + m.j.y * v.y + m.k.y * v.z + m.j.w,
            m.i.z * v.x + m.j.z * v.y + m.k.z * v.z + m.k.w
        );
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
        this.pixels = [];
        for (let i = 0; i <= this.width; i = i + this.pixelSize) {
            for (let j = 0; j <= this.height; j = j + this.pixelSize) {
                this.pixels.push(
                    new Vector3D(
                        i - this.halfWidth,
                        this.halfHeight - j,
                        position.z
                    )
                );
            }
        }
        this.originalPixels = [];
        for (let i = 0; i <= this.width; i = i + this.pixelSize) {
            for (let j = 0; j <= this.height; j = j + this.pixelSize) {
                this.originalPixels.push({ x: i, y: j, color: "white" });
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
        this.ctx.fillRect(x, y, this.pixelSize - 1, this.pixelSize - 1);
    }
    drawPixelbyIndex(i, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            this.originalPixels[i].x,
            this.originalPixels[i].y,
            this.pixelSize - 1,
            this.pixelSize - 1
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
        film.pixels.forEach((pixel, i) => {
            film.pixels[i] = Matrix.multiplyVector(matrix, pixel);
        });
    }
    /**
     *
     * @param {number} i
     * @returns {Ray}
     */
    cameraTrace(i) {
        let ray = new Ray(
            this.position,
            Vector3D.multiply(this.film.pixels[i], 10),
            "white"
        );
        return ray;
    }
}

let cameraMatrix = new Matrix(
    new MatrixVector4D(1, 0, 0, 0),
    new MatrixVector4D(0, 1, 0, 0),
    new MatrixVector4D(0, 0, 1, 0)
);
let film = new Film(new Vector3D(0, 0, 50), 300, 300, ctx, 5);
let camera = new Camera(cameraMatrix, film, 1);

let a = new Vector3D(-649, 649, 499);
let b = new Vector3D(-149, 1200, 499);
let c = new Vector3D(1499, -1449, 499);
let triangle = new Triangle(a, b, c, "red");
function animate() {
    // requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    film.originalPixels.forEach((pixel, i) => {
        let ray = camera.cameraTrace(i);
        film.drawPixelbyIndex(i, "white");
        if (Triangle.triangleRayIntersection(ray, triangle)) {
            film.drawPixelbyIndex(i, "red");
        }
        console.log(ray.end);
    });
    console.log(triangle.plane);
}
animate();
