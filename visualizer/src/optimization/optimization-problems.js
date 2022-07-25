const getGradientApproximator = (f) => {
    const h = 1e-7;
    return (x, y) => {
        const gradX = (f(x + h, y) - f(x, y)) / h;
        const gradY = (f(x, y + h) - f(x, y)) / h;
        return [gradX, gradY];
    };
};

// f(x) = x_1^2 + x_2^2
function quadratic(x, y) {
    return 0.5 * (x ** 2 + y ** 2);
}

function quadratic2GaussianCurves(x, y) {
    return (
        -2 * Math.exp(-((x - 1) * (x - 1) + y * y) / 0.2) +
        -3 * Math.exp(-((x + 1) * (x + 1) + y * y) / 0.2) +
        x * x +
        y * y
    );
}

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
