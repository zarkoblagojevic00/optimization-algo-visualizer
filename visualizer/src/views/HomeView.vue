<template>
    <div class="whole-page">
        <aside class="aside-container">
            <side-bar
                v-model:optimizers="optimizers"
                :optimizationProblem="plot.optimizationProblem"
            />
        </aside>

        <div class="content-container">
            <div class="plot-title">{{ plot.optimizationProblem.title }}</div>
            <div class="plot-container">
                <contour-plot
                    v-if="zRange.length"
                    v-bind="{ ...plot, zRange, optimizers }"
                />
                <surface-plot v-bind="plot" v-model="zRange" />
            </div>
        </div>
    </div>
</template>

<script>
import { quadratic2mins } from "@/optimization/optimization-problems.js";
import { sgd, momentum } from "@/optimization/optimizers.js";

import SideBar from "@/components/SideBar.vue";
import SurfacePlot from "@/components/SurfacePlot.vue";
import ContourPlot from "@/components/contour/ContourPlot.vue";

export default {
    name: "HomeView",
    components: {
        SurfacePlot,
        ContourPlot,
        SideBar,
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

<style scoped>
.whole-page {
    height: 100%;
    display: flex;
}

.aside-container {
    flex: 20%;
}

.content-container {
    flex: 80%;
    padding-top: 1.5em;
    display: flex;
    flex-direction: column;
}

.plot-title {
    font-size: 2em;
}

.plot-container {
    display: flex;
    justify-content: space-around;
}
</style>
