<template>
    <div class="whole-page">
        <aside class="aside-container">
            <side-bar
                v-model:optimizers="optimizers"
                :optimizationProblem="plot.optimizationProblem"
            />
        </aside>
        <div class="contour-plot-container">
            <contour-plot
                v-if="zRange.length"
                v-bind="{
                    ...plot,
                    zRange,
                    optimizers: optimizersWithGradF,
                }"
            />
        </div>
        <aside class="function-picker-container">
            <surface-plot v-bind="plot" v-model="zRange" />
        </aside>
    </div>
</template>

<script>
import { goldsteinPrice } from "@/optimization/optimization-problems.js";
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
                optimizationProblem: goldsteinPrice,
            },
            zRange: [],
            optimizers: [],
        };
    },
    created() {
        this.optimizers = [sgd(0.05, 100), momentum(0.05, 0.5, 100)];
    },
    computed: {
        optimizersWithGradF() {
            const gradF = this.plot.optimizationProblem.gradF;
            return this.optimizers.map((opt) => ({
                id: opt.id,
                generatorFactory: opt.factory(gradF),
            }));
        },
    },
    watch() {},
};
</script>

<style scoped>
.whole-page {
    height: 100%;
    display: flex;
}

.aside-container {
    flex: 18%;
}

.contour-plot-container {
    flex: 65%;
}

.function-picker-container {
    flex: 22%;
}

@media screen and (min-device-width: 1200px) and (max-device-width: 1600px) and (-webkit-min-device-pixel-ratio: 1) {
    .aside-container {
        flex: 20%;
    }

    .contour-plot-container {
        flex: 60%;
    }

    .function-picker-container {
        flex: 20%;
    }
}
</style>
