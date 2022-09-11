// all optimizers first receive hiperparams
// then they recieve gradF and return a generator function
// generator function receives only x0
// this is done because hiperparams, gradF and x0 are changed in different parts
// part of the app and at different frequencies

// iterative step:
// xNew = x - alpha * gradient(x)
const baseSGD = (alpha, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            nextPoint = [x - alpha * gradX, y - alpha * gradY];
        }
    };
};

const sgd = (alpha, iterations) => ({
    id: "sgd",
    title: "Steepest Gradient Descent",
    factory: baseSGD(alpha, iterations),
});

const momentumSGD = (alpha, omega, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        let v = [0, 0];
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            v = [omega * v[0] + alpha * gradX, omega * v[1] + alpha * gradY];
            nextPoint = [x - v[0], y - v[1]];
        }
    };
};

const momentum = (alpha, omega, iterations) => ({
    id: "momentum",
    title: "Momentum Gradient Descent",
    factory: momentumSGD(alpha, omega, iterations),
});

const nesterovSGD = (alpha, omega, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        let v = [0, 0];
        let x, y, gradPredictedX, gradPredictedY, predictedNextPoint;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            predictedNextPoint = [x - omega * v[0], y - omega * v[1]];
            [gradPredictedX, gradPredictedY] = gradF(...predictedNextPoint);
            v = [
                omega * v[0] + alpha * gradPredictedX,
                omega * v[1] + alpha * gradPredictedY,
            ];
            nextPoint = [x - v[0], y - v[1]];
        }
    };
};

const nesterov = (alpha, omega, iterations) => ({
    id: "nesterov",
    title: "Nesterov Gradient Descent",
    factory: nesterovSGD(alpha, omega, iterations),
});

const adaptiveGradient = (alpha, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        const epsilon1 = 1e-8; // for regularization
        let v = [0, 0];
        let G = [0, 0];
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            G = [G[0] + gradX ** 2, G[1] + gradY ** 2];
            v = [
                (alpha * gradX) / Math.sqrt(G[0] + epsilon1),
                (alpha * gradY) / Math.sqrt(G[1] + epsilon1),
            ];
            nextPoint = [x - v[0], y - v[1]];
        }
    };
};

const adagrad = (alpha, iterations) => ({
    id: "adagrad",
    title: "ADAGRAD",
    factory: adaptiveGradient(alpha, iterations),
});

const rmsProp = (alpha, omega, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        const epsilon1 = 1e-8; // for regularization
        let v = [0, 0];
        let G = [0, 0];
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            G = [
                omega * G[0] + (1 - omega) * gradX ** 2,
                omega * G[1] + (1 - omega) * gradY ** 2,
            ];
            v = [
                (alpha * gradX) / Math.sqrt(G[0] + epsilon1),
                (alpha * gradY) / Math.sqrt(G[1] + epsilon1),
            ];
            nextPoint = [x - v[0], y - v[1]];
        }
    };
};

const rmsprop = (alpha, omega, iterations) => ({
    id: "rmsprop",
    title: "RMSProp",
    factory: rmsProp(alpha, omega, iterations),
});

const adaptiveDelta = (omega, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        const epsilon1 = 1e-8; // for regularization
        let v = [1, 1];
        let G = [0, 0];
        let T = [0, 0];
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            G = [
                omega * G[0] + (1 - omega) * gradX ** 2,
                omega * G[1] + (1 - omega) * gradY ** 2,
            ];
            T = [
                omega * T[0] + (1 - omega) * v[0] ** 2,
                omega * T[1] + (1 - omega) * v[1] ** 2,
            ];
            v = [
                (Math.sqrt(T[0] + epsilon1) * gradX) /
                    Math.sqrt(G[0] + epsilon1),
                (Math.sqrt(T[1] + epsilon1) * gradY) /
                    Math.sqrt(G[1] + epsilon1),
            ];
            nextPoint = [x - v[0], y - v[1]];
        }
    };
};

const adadelta = (omega, iterations) => ({
    id: "adadelta",
    title: "ADADELTA",
    factory: adaptiveDelta(omega, iterations),
});

const Adam = (alpha, omega1, omega2, iterations) => (gradF) => {
    return function* (x0) {
        let nextPoint = x0;
        const epsilon1 = 1e-8; // for regularization
        let v = [1, 1],
            vHat;
        let m = [1, 1],
            mHat;
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            m = [
                omega1 * m[0] + (1 - omega1) * gradX,
                omega1 * m[1] + (1 - omega1) * gradY,
            ];
            v = [
                omega2 * v[0] + (1 - omega2) * gradX ** 2,
                omega2 * v[1] + (1 - omega2) * gradY ** 2,
            ];
            mHat = [m[0] / (1 - omega1), m[1] / (1 - omega1)];
            vHat = [
                Math.abs(v[0]) / (1 - omega2),
                Math.abs(v[1]) / (1 - omega2),
            ];
            nextPoint = [
                x - (alpha * mHat[0]) / Math.sqrt(vHat[0] + epsilon1),
                y - (alpha * mHat[1]) / Math.sqrt(vHat[1] + epsilon1),
            ];
        }
    };
};

const adam = (alpha, omega1, omega2, iterations) => ({
    id: "adam",
    title: "Adam",
    factory: Adam(alpha, omega1, omega2, iterations),
});

export { sgd, momentum, nesterov, adagrad, rmsprop, adadelta, adam };
