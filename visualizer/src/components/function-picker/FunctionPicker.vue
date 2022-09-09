<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="function-picker-wrapper">
        <surface-plot
            v-if="plot.xRange"
            :xRange="plot.xRange"
            :yRange="plot.yRange"
            :optimizationCriterion="plot.optimizationCriterion"
            v-model:zRange="plot.zRange"
        />
        <div class="submenu">
            <div class="submenu-title">Functions</div>
            <div
                v-for="plotMod in displayedPlotMods"
                :key="`function-${plotMod.plot.optimizationCriterion.id}`"
                class="function-menu-item underline-container transition-ease-in"
                :class="{
                    active: activeId === plotMod.plot.optimizationCriterion.id,
                }"
            >
                <div class="function-title">
                    {{ plotMod.plot.optimizationCriterion.title }}
                </div>
                <div class="function-activate-more">
                    <div class="tooltip top-right">
                        <span class="tooltiptext">{{
                            activeId === plotMod.plot.optimizationCriterion.id
                                ? "Active"
                                : "Pick"
                        }}</span>
                        <input
                            class="function-radio"
                            v-model="activeId"
                            type="radio"
                            :value="plotMod.plot.optimizationCriterion.id"
                            :name="`activate-${plotMod.plot.optimizationCriterion.id}`"
                            :id="`activate-${plotMod.plot.optimizationCriterion.id}`"
                        />
                    </div>
                    <div class="tooltip top-right">
                        <span class="tooltiptext">More</span>
                        <button
                            class="function-more-button"
                            @click="plotMod.modal.active = true"
                        ></button>
                    </div>
                </div>
            </div>
            <!-- Modals -->
            <component
                v-for="plotMod in plotsWithModals"
                :key="`modal-${plotMod.plot.optimizationCriterion.id}`"
                :is="plotMod.modal.component"
                v-model:plot="plotMod.plot"
                v-model:active="plotMod.modal.active"
            ></component>
        </div>

        <simple-pagination
            v-show="plotsWithModals.length > pageSize"
            :pageSize="pageSize"
            :items="plotsWithModals"
            v-model="displayedPlotMods"
        ></simple-pagination>

        <button
            class="add-function clickable fill primary transition-ease-in"
            @click="addCustomFunction"
        >
            Add function
        </button>
    </div>
</template>

<script>
import SurfacePlot from "@/components/function-picker/SurfacePlot.vue";
import {
    quadratic,
    quadratic2Gaussians,
} from "@/optimization/optimization-criteria.js";

import QuadraticModal from "@/components/function-picker/modals/QuadraticModal.vue";
import Quadratic2GaussiansModal from "@/components/function-picker/modals/Quadratic2GaussiansModal.vue";
import CustomFunctionModal from "@/components/function-picker/modals/CustomFunctionModal.vue";
import SimplePagination from "@/components/function-picker/SimplePagination.vue";

import { shallowRef } from "vue";
import { deepCopy } from "@/utils/deep-copy.js";

const initCriteria = [
    quadratic(1, 0, 2),
    quadratic2Gaussians(
        {
            min1Deepness: 2,
            min1Coord: [1, 0],
            min1Flatness: 0.2,
        },
        {
            min2Deepness: 3,
            min2Coord: [-1, 0],
            min2Flatness: 0.2,
        }
    ),
];

const modals = [
    shallowRef(QuadraticModal),
    shallowRef(Quadratic2GaussiansModal),
];

export default {
    props: {
        plot: {
            type: Object,
            required: true,
        },
    },
    emits: ["update:plot"],
    components: {
        SurfacePlot,
        CustomFunctionModal,
        SimplePagination,
    },
    data() {
        return {
            pageSize: 4,
            activeId: "",
            plotsWithModals: initCriteria.map((criterion, idx) => ({
                plot: {
                    xRange: [-2, 2],
                    yRange: [-2, 2],
                    // zRange will be calculated by SurfacePlot
                    // zRange is needed for rendering contour plot correctly
                    zRange: [],
                    optimizationCriterion: criterion,
                },
                modal: {
                    active: false,
                    component: modals[idx],
                },
            })),
            displayedPlotMods: [],
        };
    },
    created() {
        this.activeId = this.plotsWithModals[0].plot.optimizationCriterion.id;
    },

    watch: {
        activeId: {
            handler(newValue) {
                const plotMod = this.plotsWithModals.find(
                    (prob) => prob.plot.optimizationCriterion.id === newValue
                );
                this.$emit("update:plot", plotMod.plot);
            },
        },
        plotsWithModals: {
            handler() {
                const newPlot = this.plotsWithModals.find(
                    (prob) =>
                        prob.plot.optimizationCriterion.id === this.activeId
                ).plot;
                this.$emit("update:plot", newPlot);
            },
            deep: true,
        },
    },

    methods: {
        addCustomFunction() {
            this.plotsWithModals.push({
                plot: {
                    xRange: [-2, 2],
                    yRange: [-2, 2],
                    // zRange will be calculated by FunctionPicker/SurfacePlot
                    // zRange is needed for rendering contour plot correctly
                    zRange: [],
                    optimizationCriterion: {
                        id: `custom-function-${Math.random()}`,
                        title: "Draft",
                        f: null,
                        gradF: null,
                    },
                },
                modal: {
                    active: true,
                    component: shallowRef(CustomFunctionModal),
                },
            });
        },
        resetModal() {
            this.plotsWithModals.push(deepCopy(this.newCustomFunction));
            this.newCustomFunction = {
                plot: {
                    xRange: [-2, 2],
                    yRange: [-2, 2],
                    // zRange will be calculated by FunctionPicker/SurfacePlot
                    // zRange is needed for rendering contour plot correctly
                    zRange: [],
                    optimizationCriterion: null,
                },
                modal: {
                    active: false,
                    component: shallowRef(CustomFunctionModal),
                },
            };
        },
    },
};
</script>

<style scoped>
.function-picker-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #c5dbf5;
    border-left: 3px solid var(--background-lighter);
}

.submenu {
    margin-bottom: 5px;
    max-height: 32%;
    min-height: 32%;
}

.submenu-title {
    color: #0a2249;
    border-bottom: 2px solid #a6c3e4;
    background-color: #c5dbf5;
}

.function-menu-item {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 1.1em;
    border-bottom: 2px solid #a6c3e4;
}

.underline-container {
    --underline-color: var(primary);
}

.underline-container.active {
    --underline-active-bg-color: #aacdf3;
}

.function-activate-more {
    display: flex;
    align-items: center;
}

.function-title {
    font-size: 0.92rem;
    font-weight: 560;
    color: var(--background-lighter);
}

.function-radio {
    position: relative;
    width: 1.6rem;
    height: 1.6rem;
    accent-color: var(--light-blue);
}

.function-radio:not(:checked)::after {
    content: "";
    position: absolute;
    top: 3%;
    left: 3%;
    height: 60%;
    width: 60%;
    border: 0.34em solid var(--primary);
    border-radius: 50%;
    background-color: #c5dbf5;
    transition: all 0.25s;
    cursor: pointer;
}

@media screen and (min-device-width: 1200px) and (max-device-width: 1600px) and (-webkit-min-device-pixel-ratio: 1) {
    .function-radio:not(:checked)::after {
        border-width: 0.3em;
        top: 3.2%;
    }

    .submenu {
        max-height: 41.25%;
        min-height: 41.25%;
    }
}

.function-radio:hover:not(:checked)::after {
    background-color: var(--light-blue);
}

.function-more-button {
    margin: 0 0 2px 4px;
    padding: 0;
    width: 1.8rem;
    height: 1.8rem;

    background-color: transparent;
    background-image: url("@/assets/more-outline-icon.png");
    background-size: 85%;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50%;
    border: 2px transparent solid;

    cursor: pointer;
    transition: all 0.25s;
}

.function-more-button:hover,
.function-more-button:focus {
    border-color: #75b8ff;
    background-color: #c2dfff;
    background-image: url("@/assets/more-filled-icon.png");
}

.add-function {
    margin-top: 12px;
}
</style>
