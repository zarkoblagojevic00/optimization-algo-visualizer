<template>
    <div class="surface-container" ref="plotly"></div>
</template>

<script>
import plotly from "plotly.js-dist";
import { extent } from "d3";
import { rangeValidator } from "@/utils/prop-validators.js";

export default {
    props: {
        optimizationProblem: {
            type: Object,
            required: true,
        },
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
        //only zRange is updated
        zRange: {
            type: Array,
            required: true,
        },
    },
    emits: ["update:zRange"],
    mounted() {
        const { x, y, z } = this.surfaceData;
        const zRange = extent(z.flat());
        this.$emit("update:zRange", zRange);
        const data = [
            {
                x,
                y,
                z,
                type: "surface",
                opacity: 0.8,
                colorscale: "YlGnBu",
                showscale: false,
            },
        ];

        const layout = {
            margin: {
                autoexpand: false,
                t: 40,
                r: 20,
                b: 20,
                l: 20,
            },
            paper_bgcolor: "#c5dbf5",
            plot_bgcolor: "#c5dbf5",
            autosize: false,
            width: 300,
            height: 300,
        };

        plotly.newPlot(this.$refs.plotly, data, layout);
    },
    data() {
        return {
            step: 0.05,
        };
    },
    computed: {
        surfaceData() {
            return this.get3Dspace(
                this.xRange,
                this.yRange,
                this.step,
                this.optimizationProblem.f
            );
        },
    },
    watch: {
        surfaceData: {
            handler({ x, y, z }) {
                const zRange = extent(z.flat());
                this.$emit("update:zRange", zRange);
                plotly.restyle(
                    this.$refs.plotly,
                    { x: [x], y: [y], z: [z] },
                    0
                );
            },
            flush: "post",
        },
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

<style scoped>
.surface-container {
    padding: 0.5em;
}
</style>
