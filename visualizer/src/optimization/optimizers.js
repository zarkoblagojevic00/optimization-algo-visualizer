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
    title: "Gradient Descent with Momentum",
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
    title: "ADAGRAD (adaptive gradient)",
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

export { sgd, momentum, nesterov, adagrad, rmsprop };
