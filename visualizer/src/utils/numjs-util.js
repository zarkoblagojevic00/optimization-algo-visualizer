import nj from "numjs";

export function meshgrid(xSpan, ySpan) {
    const xGrid = nj.dot(nj.ones([ySpan.shape[0], 1]), xSpan.reshape(1, -1));
    const yGrid = nj.dot(ySpan.reshape(-1, 1), nj.ones([1, xSpan.shape[0]]));
    return [xGrid, yGrid];
}

export function applyToMesh(xRange, yRange, step, f) {
    const xSpan = nj.arange(xRange[0], xRange[1] + step, step);
    const ySpan = nj.arange(yRange[0], yRange[1] + step, step);
    const [X1, X2] = meshgrid(xSpan, ySpan);
    const n = X1.shape[0];

    let z = [];

    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(f(X1.get(i, j), X2.get(i, j)));
        }
        z.push(row);
    }

    return { x: unpack(xSpan), y: unpack(ySpan), z };
}

export function norm(vector) {
    const x = vector.reshape(1, -1);
    return Math.sqrt(nj.dot(x, x.T).get(0, 0));
}

const unpack = (ndarray) => ndarray.selection.data;
