<template>
    <div :id="svgContainerId"></div>
</template>

<script>
import { rangeValidator } from "@/utils/prop-validators.js";
import render from "@/components/contour/d3-contour.js";

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
        zRange: {
            type: Array,
            required: true,
            validator: rangeValidator,
        },
        optimizationProblem: {
            type: Object,
            required: true,
        },
        optimizers: {
            type: Array,
            required: true,
        },
    },
    mounted() {
        this.renderContourPlot();
    },
    data() {
        return {
            svgContainerId: "svg-container",
        };
    },
    methods: {
        renderContourPlot() {
            render({ svgContainerId: this.svgContainerId, ...this.$props });
        },
    },
};
</script>

<style scoped>
#svg-container {
    width: 650px;
    height: 650px;
}
</style>
