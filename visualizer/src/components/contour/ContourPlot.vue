<template>
    <div :id="svgContainerId"></div>
</template>

<script>
import {
    render,
    rerender,
    updateOptimizers,
} from "@/components/contour/d3-contour.js";

export default {
    props: {
        plot: {
            type: Object,
            required: true,
        },

        optimizers: {
            type: Array,
            required: true,
        },
    },
    mounted() {
        render({
            svgContainerId: this.svgContainerId,
            ...this.plot,
            optimizers: this.optimizers,
        });
    },
    data() {
        return {
            svgContainerId: "svg-container",
        };
    },
    watch: {
        plot() {
            rerender(this.plot);
        },
        optimizers() {
            updateOptimizers(this.optimizers);
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
    cursor: pointer;
}

#svg-container svg {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
}
</style>
