<template>
    <div class="hello">
        <div ref="plotly"></div>
    </div>
</template>

<script>
import plotly from "plotly.js-dist";
import { extent } from "d3";
import { applyToMesh } from "@/utils/numjs-util.js";
import { rangeValidator } from "@/utils/validators.js";

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

    created() {
        const { x, y, z } = applyToMesh(
            this.xRange,
            this.yRange,
            this.step,
            this.optimizationProblem.f
        );
        this.x = x;
        this.y = y;
        this.z = z;

        this.$emit("update:modelValue", extent(z.flat()));
    },

    mounted() {
        const data = [
            {
                x: this.x,
                y: this.y,
                z: this.z,
                type: "surface",
                opacity: 0.8,
                colorscale: "Greens",
            },
        ];

        const layout = {
            title: this.optimizationProblem.title,
            autosize: false,
            width: 450,
            height: 450,
        };

        plotly.newPlot(this.$refs.plotly, data, layout);
    },

    data() {
        return {
            x: [],
            y: [],
            z: [],
            step: 0.05,
        };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
