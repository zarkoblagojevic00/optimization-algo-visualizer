// import { select } from "d3";

import {
    select,
    scaleLinear,
    axisRight,
    axisTop,
    geoPath,
    contours,
    range,
    scaleSequential,
    interpolateGreens,
    pointer,
    line,
    curveCardinal,
    // easeCubicInOut,
} from "d3";

const render = (options) => {
    const svg = createSvg(options);
    setupScales(options);
    const contoursGroup = addContours(svg, options);
    const gradientPathGroup = svg.append("g");
    addMouseClickEvent(contoursGroup, gradientPathGroup, options.optimizers);
    addAxes(svg, options);
};

export { render as default };

const q = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
const nContours = 30;
const drawingTime = 40;

const createSvg = ({ svgContainerId, width, height }) =>
    select(`#${svgContainerId}`)
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
        .style("display", "block")
        .style("padding", "20");

let xScale, yScale;
const setupScales = ({ xRange, yRange, width, height }) => {
    xScale = scaleLinear(xRange, [0, width]);
    yScale = scaleLinear(yRange, [height, 0]);
};

const addContours = (svg, options) => {
    const contours = createContours(options);
    const colorScale = createColorScale(options.zRange);
    return svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.4)
        .selectAll("path")
        .data(contours)
        .join("path")
        .attr("fill", (d) => colorScale(d.value))
        .attr("d", geoPath());
};

const createContours = ({
    width,
    height,
    optimizationProblem: { f },
    zRange,
}) => {
    const grid = createGrid(width, height, f);
    const thresholds = createThresholds(zRange);
    return contours()
        .size([grid.n, grid.m])
        .thresholds(thresholds)(grid.values)
        .map(transform(grid));
};

const createGrid = (width, height, f) => {
    const x0 = -q / 2;
    const x1 = width + q;
    const y0 = -q / 2;
    const y1 = height + q;
    const n = Math.ceil((x1 - x0) / q);
    const m = Math.ceil((y1 - y0) / q);
    const values = new Array(n * m);
    for (let j = 0; j < m; ++j) {
        for (let i = 0; i < n; ++i) {
            values[j * n + i] = f(
                xScale.invert(i * q + x0),
                yScale.invert(j * q + y0)
            );
        }
    }
    return {
        x: -q,
        y: -q,
        k: q,
        n: n,
        m: m,
        values,
    };
};

const transform =
    (grid) =>
    ({ type, value, coordinates }) => {
        return {
            type,
            value,
            coordinates: coordinates.map((rings) => {
                return rings.map((points) => {
                    return points.map(([x, y]) => [
                        +grid.k * x,
                        grid.y + grid.k * y,
                    ]);
                });
            }),
        };
    };

const createThresholds = (zRange) => {
    const [start, stop] = zRange;
    const step = (stop - start) / nContours;
    return range(start, stop + step, step);
};

const createColorScale = (zRange) => {
    const scale = scaleSequential(zRange, interpolateGreens);
    const interpolator = scale.interpolator(); // read its interpolator;
    const mirror = (t) => interpolator(1 - t); // creates a mirror image of the interpolator;
    scale.interpolator(mirror); // updates the scale’s interpolator;
    return scale;
};

const addAxes = (svg, { width, height }) => {
    svg.append("g").call(xAxis, width, height);
    svg.append("g").call(yAxis);
};

const xAxis = (g, width, height) => {
    return g
        .attr("transform", `translate(0,${height})`)
        .call(axisTop(xScale).ticks((width / height) * 10))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
            g
                .selectAll(".tick")
                .filter((d) => xScale.domain().includes(d))
                .remove()
        );
};

const yAxis = (g) => {
    return g
        .attr("transform", "translate(-1, 0)")
        .call(axisRight(yScale))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
            g
                .selectAll(".tick")
                .filter((d) => yScale.domain().includes(d))
                .remove()
        );
};

const addMouseClickEvent = (contoursGroup, gradientPathGroup, optimizers) => {
    contoursGroup.on("mousedown", (event) => {
        const startPoint = pointer(event);
        const x0 = [xScale.invert(startPoint[0]), yScale.invert(startPoint[1])];
        startOptimization(gradientPathGroup, x0, optimizers);
    });
};

const startOptimization = (gradientPathGroup, x0, optimizers) => {
    console.log(x0);
    const paths = optimize(x0, optimizers);
    drawAllPaths(gradientPathGroup, paths);
};

// creates the object with the following form:
// {
//     sgd: [[x0, y0], [x1, y1], ... [xn, yn]],    ---->  list of coordinates - steps that optimizer took
//     rmsprop: [[x0, y0], [x1, y1], ... [xm, ym]],
//     ...
// }
const optimize = (x0, optimizers) =>
    optimizers.reduce((prev, curr) => {
        const { id, generatorFactory } = curr;
        prev[id] = [...cartesianToPixselPathTransformer(generatorFactory(x0))];
        return prev;
    }, {});

// optimizerPath is a generator that returns path in scope of domain (cartesian coordinates)
// to render path properly cartesian coordianates must by transformed to pixel coordinates
function* cartesianToPixselPathTransformer(optimizerPath) {
    for (const point of optimizerPath) {
        yield [xScale(point[0]), yScale(point[1])];
    }
}

const drawAllPaths = (gradientPathGroup, paths) => {
    gradientPathGroup.selectAll("path").remove();
    gradientPathGroup.selectAll("circle").remove();
    Object.entries(paths).forEach((entry) =>
        drawSinglePath(entry, gradientPathGroup)
    );
};

const delay =
    (coef = 1) =>
    (d, i) =>
        coef * drawingTime * i;
const getX = (d) => d[0];
const getY = (d) => d[1];

const lineGenerator = line().x(getX).y(getY).curve(curveCardinal);

// TODO: refine animation
function drawSinglePath([id, path], gradientPathGroup) {
    // const pathLength = 100;

    // gradientPathGroup
    //     .selectAll()
    //     .data(path)
    //     .join("path")
    //     .attr("d", lineGenerator(path))
    //     .attr("class", "optimization-path")
    //     .attr("pathLength", `${pathLength}`)
    //     .attr("stroke-dasharray", `${pathLength} ${pathLength}`)
    //     .attr("stroke-dashoffset", `${pathLength}`)
    //     .transition()
    //     .duration(2500)
    //     .ease(easeCubicInOut)
    //     .attr("stroke-dashoffset", 0);

    gradientPathGroup
        .selectAll()
        .data(path)
        .join("path")
        .attr("d", lineGenerator(path.slice(0, 1)))
        .attr("class", "optimization-path")
        .transition()
        .duration(drawingTime * 0.7)
        .delay(delay(0.7))
        .attr("d", (d, i) => lineGenerator(path.slice(0, i)));

    gradientPathGroup
        .selectAll()
        .data(path)
        .join("circle")
        .attr("cx", getX)
        .attr("cy", getY)
        .attr("opacity", 0)
        .attr("class", `circle ${id}-circle`)
        .transition()
        .duration(drawingTime)
        .delay(delay())
        .attr("opacity", 0.8);
}
