// all functions first receive arguments other than starting point x0
// they return a generator function that receives x0 as only argument
// this is done because initial arguments are set in a different
// part of the app than x0 argument is

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

export const sgd = (alpha, iterations) => ({
    id: "sgd",
    title: "Steepest Gradient Descent",
    factory: baseSGD(alpha, iterations),
});

export const momentum = (alpha, omega, iterations) => ({
    id: "momentum",
    title: "Gradient Descent with Momentum",
    factory: momentumSGD(alpha, omega, iterations),
});
