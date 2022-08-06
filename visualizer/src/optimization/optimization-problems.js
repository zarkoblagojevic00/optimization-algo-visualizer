const getGradientApproximator = (f) => {
    const h = 1e-7;
    return (x, y) => {
        const gradX = (f(x + h, y) - f(x, y)) / h;
        const gradY = (f(x, y + h) - f(x, y)) / h;
        return [gradX, gradY];
    };
};

// f(x) = x_1^2 + x_2^2
const quadratic = (x, y) => 0.5 * (x ** 2 + y ** 2);

const quadratic2GaussianCurves = (x, y) =>
    -2 * Math.exp(-((x - 1) * (x - 1) + y * y) / 0.2) +
    -3 * Math.exp(-((x + 1) * (x + 1) + y * y) / 0.2) +
    x * x +
    y * y;

const goldsteinPriceTest = (x, y) =>
    Math.log(
        (1 +
            (x + y + 1) ** 2 *
                (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2)) *
            (30 +
                (2 * x - 3 * y) ** 2 *
                    (18 -
                        32 * x +
                        12 * x * x +
                        48 * y -
                        36 * x * y +
                        27 * y ** 2))
    );

export const baseQuadratic = {
    title: "Base Quadratic | z = x^2 + y^2",
    f: quadratic,
    gradF: getGradientApproximator(quadratic),
};

export const quadratic2mins = {
    title: "Quadratic with 2 Gussian curves",
    f: quadratic2GaussianCurves,
    gradF: getGradientApproximator(quadratic2GaussianCurves),
};

export const goldsteinPrice = {
    title: "Natural log Goldstein-Price",
    f: goldsteinPriceTest,
    gradF: getGradientApproximator(goldsteinPriceTest),
};
