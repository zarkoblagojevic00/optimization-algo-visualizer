<template>
    <div class="contour-plot-container">
        <div class="contour-plot-title">Contour plot</div>
        <div :id="svgContainerId"></div>
    </div>
</template>

<script>
import { rangeValidator } from "@/utils/prop-validators.js";
import { render, updateOptimizers } from "@/components/contour/d3-contour.js";

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
    watch: {
        optimizers() {
            updateOptimizers(this.optimizers);
        },
    },
};
</script>

<style scoped>
.contour-plot-container {
    display: flex;
    flex-direction: column;
    margin-top: 1.5rem;
}

.contour-plot-title {
    font-size: 24px;
}

#svg-container {
    padding-top: 1.32rem;
    width: 555px;
    height: 555px;
    cursor: pointer;
}
</style>
