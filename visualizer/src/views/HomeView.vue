<template>
    <div class="whole-page">
        <aside class="optimizer-picker-container">
            <optimizer-picker v-model:activeOptimizers="optimizers" />
        </aside>
        <div class="contour-plot-container">
            <contour-plot
                v-if="plot.zRange && plot.zRange.length"
                v-bind="{ plot, optimizers: optimizersWithGradF }"
            />
        </div>
        <aside class="function-picker-container">
            <function-picker v-model:plot="plot" />
        </aside>
    </div>
</template>

<script>
import OptimizerPicker from "@/components/optimizer-picker/OptimizerPicker.vue";
import ContourPlot from "@/components/contour/ContourPlot.vue";
import FunctionPicker from "@/components/function-picker/FunctionPicker.vue";

export default {
    name: "HomeView",
    components: {
        ContourPlot,
        OptimizerPicker,
        FunctionPicker,
    },
    data() {
        return {
            plot: {},
            optimizers: [],
        };
    },
    computed: {
        optimizersWithGradF() {
            if (!this.plot.xRange) return [];
            const gradF = this.plot.optimizationCriterion.gradF;
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

.optimizer-picker-container {
    flex: 18%;
}

.contour-plot-container {
    flex: 65%;
}

.function-picker-container {
    flex: 22%;
}

@media screen and (min-device-width: 1200px) and (max-device-width: 1600px) and (-webkit-min-device-pixel-ratio: 1) {
    .optimizer-picker-container {
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
