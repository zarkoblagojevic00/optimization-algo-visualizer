<template>
    <div class="home">
        <surface-plot v-bind="plot" v-model="zRange" />
        <contour-plot
            v-if="zRange.length && optimizers.length"
            v-bind="{ ...plot, zRange, optimizers }"
        />
    </div>
</template>

<script>
import { quadratic2mins } from "@/optimization/optimization-problems.js";
import { sgd, momentum } from "@/optimization/optimizers.js";

import SurfacePlot from "@/components/SurfacePlot.vue";
import ContourPlot from "@/components/contour/ContourPlot.vue";

export default {
    name: "HomeView",
    components: {
        SurfacePlot,
        ContourPlot,
    },
    data() {
        return {
            plot: {
                xRange: [-2, 2],
                yRange: [-2, 2],
                optimizationProblem: quadratic2mins,
            },
            zRange: [],
            optimizers: [],
        };
    },
    created() {
        const gradF = this.plot.optimizationProblem.gradF;
        this.optimizers = [
            sgd(gradF, 0.05, 100),
            momentum(gradF, 0.05, 0.5, 100),
        ];
    },
};
</script>
