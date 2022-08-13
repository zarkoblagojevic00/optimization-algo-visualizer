<template>
    <div class="hello">
        <div ref="plotly"></div>
    </div>
</template>

<script>
import plotly from "plotly.js-dist";
import { extent } from "d3";
import { rangeValidator } from "@/utils/prop-validators.js";

export default {
    props: {
        xRange: {
            type: Array,
            required: true,
            validator: rangeValidator,
        },
        yRange: {
            type: Array,
            required: true,
            validator: rangeValidator,
        },
        optimizationProblem: {
            type: Object,
            required: true,
        },
        modelValue: {
            type: Array,
        },
    },

    emits: ["update:modelValue"],

    mounted() {
        const step = 0.05;
        const { x, y, z } = this.get3Dspace(
            this.xRange,
            this.yRange,
            step,
            this.optimizationProblem.f
        );

        this.$emit("update:modelValue", extent(z.flat()));

        const data = [
            {
                x,
                y,
                z,
                type: "surface",
                opacity: 0.8,
                colorscale: "YlGnBu",
            },
        ];

        const layout = {
            title: {
                text: "3D surface plot",
                font: {
                    size: 20,
                },
            },
            autosize: false,
            width: 600,
            height: 640,
        };

        plotly.newPlot(this.$refs.plotly, data, layout);
    },

    methods: {
        get3Dspace([xMin, xMax], [yMin, yMax], step, f) {
            const x = [];
            const y = [];
            const z = [];
            const yFinalLength = Math.ceil((yMax - yMin) / step);

            for (let xCoord = xMin; xCoord < xMax; xCoord += step) {
                x.push(xCoord);
                let row = [];
                for (let yCoord = yMin; yCoord < yMax; yCoord += step) {
                    if (y.length < yFinalLength) y.push(yCoord);
                    row.push(f(xCoord, yCoord));
                }
                z.push(row);
            }

            return { x, y, z };
        },
    },
};
</script>
