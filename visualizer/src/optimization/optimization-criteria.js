export const getGradientApproximator = (f) => {
    const h = 1e-7;
    return (x, y) => {
        const gradX = (f(x + h, y) - f(x, y)) / h;
        const gradY = (f(x, y + h) - f(x, y)) / h;
        return [gradX, gradY];
    };
};

const quadraticFactory = (a, b, c) => (x, y) =>
    a * x ** 2 + b * x * y + c * y ** 2;

const quadratic = (a, b, c) => {
    const quad = quadraticFactory(a, b, c);
    return {
        id: "quad",
        title: "Quadratic",
        f: quad,
        gradF: getGradientApproximator(quad),
    };
};

const quadratic2GaussiansFactory =
    (
        { min1Deepness, min1Coord: [xmin1, ymin1], min1Flatness },
        { min2Deepness, min2Coord: [xmin2, ymin2], min2Flatness }
    ) =>
    (x, y) =>
        0.5 * x ** 2 +
        0.5 * y ** 2 -
        min1Deepness *
            Math.exp(-((x - xmin1) ** 2 + (y - ymin1) ** 2) / min1Flatness) +
        -min2Deepness *
            Math.exp(-((x - xmin2) ** 2 + (y - ymin2) ** 2) / min2Flatness);

const quadratic2Gaussians = (min1, min2) => {
    const quad2mins = quadratic2GaussiansFactory(min1, min2);
    return {
        id: "quad2mins",
        title: "Quadratic with 2 Gaussians",
        f: quad2mins,
        gradF: getGradientApproximator(quad2mins),
    };
};

export { quadratic, quadratic2Gaussians };
