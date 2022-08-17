<template>
    <div :id="svgContainerId"></div>
</template>

<script>
import { rangeValidator } from "@/utils/prop-validators.js";
import {
    render,
    rerender,
    updateOptimizers,
} from "@/components/contour/d3-contour.js";

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
        this.renderPlot();
    },
    data() {
        return {
            svgContainerId: "svg-container",
        };
    },
    methods: {
        renderPlot() {
            render({ svgContainerId: this.svgContainerId, ...this.$props });
        },
        rerenderPlot() {
            rerender({ svgContainerId: this.svgContainerId, ...this.$props });
        },
    },
    watch: {
        optimizers() {
            updateOptimizers(this.optimizers);
        },
        xRange() {
            this.rerenderPlot();
        },
        yRange() {
            this.rerenderPlot();
        },
        zRange() {
            this.rerenderPlot();
        },
        optimizationProblem() {
            this.rerenderPlot();
        },
    },
};
</script>

<style scoped>
#svg-container {
    position: relative;
    height: 0;
    width: 100%;
    padding: 0;
    padding-bottom: 5%;
    /* height: 100%;
    margin: 0;
    padding: 0; */
    cursor: pointer;
}

#svg-container svg {
    /* width: 100%;
    height: 100vh; */
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
</style>
