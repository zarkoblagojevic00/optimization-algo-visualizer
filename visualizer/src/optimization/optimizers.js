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
        let [vX, vY] = [0, 0];
        let x, y, gradX, gradY;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            vX = omega * vX - alpha * gradX;
            vY = omega * vY - alpha * gradY;
            nextPoint = [x + vX, y + vY];
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
        let [vX, vY] = [0, 0];
        let x, y, gradPredictedX, gradPredictedY, predictedNextPoint;
        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            predictedNextPoint = [x + omega * vX, y + omega * vY];
            [gradPredictedX, gradPredictedY] = gradF(...predictedNextPoint);
            vX = omega * vX - alpha * gradPredictedX;
            vY = omega * vY - alpha * gradPredictedY;
            nextPoint = [x + vX, y + vY];
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
        let [GX, GY] = [0, 0];
        let x, y, gradX, gradY, vX, vY;
        const eps = 1e-8; // for regularization

        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            GX = GX + gradX ** 2;
            GY = GY + gradY ** 2;
            vX = -(alpha / Math.sqrt(GX + eps)) * gradX;
            vY = -(alpha / Math.sqrt(GY + eps)) * gradY;
            nextPoint = [x + vX, y + vY];
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
        let [GX, GY] = [0, 0];
        let x, y, gradX, gradY, vX, vY;
        const eps = 1e-8; // for regularization
        const _omega = 1 - omega;

        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            GX = omega * GX + _omega * gradX ** 2;
            GY = omega * GY + _omega * gradY ** 2;
            vX = -(alpha / Math.sqrt(GX + eps)) * gradX;
            vY = -(alpha / Math.sqrt(GY + eps)) * gradY;
            nextPoint = [x + vX, y + vY];
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
        let [GX, GY] = [0, 0];
        let [EX, EY] = [0, 0];
        let x, y, gradX, gradY, vX, vY;
        const eps = 1e-5; // for regularization
        const _omega = 1 - omega;

        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            GX = omega * GX + _omega * gradX ** 2;
            GY = omega * GY + _omega * gradY ** 2;
            vX = -(Math.sqrt(EX + eps) / Math.sqrt(GX + eps)) * gradX;
            vY = -(Math.sqrt(EY + eps) / Math.sqrt(GY + eps)) * gradY;
            EX = omega * EX + _omega * vX ** 2;
            EY = omega * EY + _omega * vY ** 2;
            nextPoint = [x + vX, y + vY];
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
        let [vX, vY] = [0, 0];
        let [mX, mY] = [0, 0];
        let mHatX, mHatY, vHatX, vHatY;
        let x, y, gradX, gradY;
        const eps = 1e-8; // for regularization
        const _omega1 = 1 - omega1;
        const _omega2 = 1 - omega2;

        for (let i = 0; i < iterations; i++) {
            yield nextPoint;
            [x, y] = nextPoint;
            [gradX, gradY] = gradF(x, y);
            mX = omega1 * mX + _omega1 * gradX;
            mY = omega1 * mY + _omega1 * gradY;
            vX = omega2 * vX + _omega2 * gradX ** 2;
            vY = omega2 * vY + _omega2 * gradY ** 2;
            mHatX = mX / _omega1;
            mHatY = mY / _omega1;
            vHatX = Math.abs(vX / _omega2);
            vHatY = Math.abs(vY / _omega2);
            nextPoint = [
                x - (alpha / Math.sqrt(vHatX + eps)) * mHatX,
                y - (alpha / Math.sqrt(vHatY + eps)) * mHatY,
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
