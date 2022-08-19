<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="function-picker-container">
        <surface-plot
            v-if="modelValue.xRange"
            :xRange="modelValue.xRange"
            :yRange="modelValue.yRange"
            :optimizationProblem="modelValue.optimizationProblem"
            v-model:zRange="modelValue.zRange"
        />
        <div class="submenu">
            <div class="submenu-title">Functions</div>
            <div
                v-for="problem in problems"
                :key="problem.plot.optimizationProblem.id"
                class="function-menu-item underline-container transition-ease-in"
                :class="{
                    'function-menu-item-active':
                        activeId === problem.plot.optimizationProblem.id,
                }"
            >
                <div class="function-title">
                    {{ problem.plot.optimizationProblem.title }}
                </div>
                <div class="function-activate-more">
                    <div class="tooltip top-right">
                        <span class="tooltiptext">{{
                            activeId === problem.plot.optimizationProblem.id
                                ? "Active"
                                : "Pick"
                        }}</span>
                        <input
                            class="function-radio"
                            v-model="activeId"
                            type="radio"
                            :value="problem.plot.optimizationProblem.id"
                            :name="`activate-${problem.plot.optimizationProblem.id}`"
                            :id="`activate-${problem.plot.optimizationProblem.id}`"
                        />
                    </div>
                    <div class="tooltip top-right">
                        <span class="tooltiptext">More</span>
                        <button
                            class="function-more-button"
                            @click="problem.modal.active = true"
                        ></button>
                    </div>
                    <!-- Modal -->
                    <component
                        :key="problem.plot.optimizationProblem.id"
                        :is="problem.modal.component"
                        v-model:plot="problem.plot"
                        v-model:active="problem.modal.active"
                    ></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SurfacePlot from "@/components/function-picker/SurfacePlot.vue";
import {
    quadratic,
    quadratic2mins,
} from "@/optimization/optimization-problems.js";

import QuadraticModal from "@/components/function-picker/modals/QuadraticModal.vue";
import Quadratic2GaussiansModal from "@/components/function-picker/modals/Quadratic2GaussiansModal.vue";
import { shallowRef } from "vue";
const modals = [
    shallowRef(QuadraticModal),
    shallowRef(Quadratic2GaussiansModal),
];

const functions = [
    quadratic(1, 0, 2),
    quadratic2mins(
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

export default {
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },
    emits: ["update:modelValue"],
    components: {
        SurfacePlot,
    },
    data() {
        return {
            activeId: "",
            problems: functions.map((prob, idx) => ({
                plot: {
                    xRange: [-2, 2],
                    yRange: [-2, 2],
                    // zRange will be calculated by FunctionPicker/SurfacePlot
                    // zRange is needed for rendering contour plot correctly
                    zRange: [],
                    optimizationProblem: prob,
                },
                modal: {
                    active: false,
                    component: modals[idx],
                },
            })),
        };
    },
    created() {
        this.activeId = this.problems[0].plot.optimizationProblem.id;
    },

    watch: {
        activeId: {
            handler(newValue) {
                const problem = this.problems.find(
                    (prob) => prob.plot.optimizationProblem.id === newValue
                );
                this.$emit("update:modelValue", problem.plot);
            },
        },
        problems: {
            handler() {
                const newPlot = this.problems.find(
                    (prob) => prob.plot.optimizationProblem.id === this.activeId
                ).plot;
                this.$emit("update:modelValue", newPlot);
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
.function-picker-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #c5dbf5;
    border-left: 3px solid var(--background-lighter);
}

.submenu-title {
    color: #0a2249;
    border-bottom-color: #a6c3e4;
}

.function-menu-item {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 1.1em;
    border-bottom: 2px solid #a6c3e4;
}

.function-menu-item-active {
    background-color: #aacdf3;
    background-size: 100% 3px, auto;
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
    border: 0.34em solid var(--light-blue-dimmer);
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

.function-menu-item.underline-container {
    background-image: -webkit-linear-gradient(
            var(--light-blue-dimmer),
            var(--light-blue-dimmer)
        ),
        -webkit-linear-gradient(transparent, transparent);
    background-image: -moz-linear-gradient(
            var(--light-blue-dimmer),
            var(--light-blue-dimmer)
        ),
        -moz-linear-gradient(transparent, transparent);
    background-image: -ms-linear-gradient(
            var(--light-blue-dimmer),
            var(--light-blue-dimmer)
        ),
        -ms-linear-gradient(transparent, transparent);
    background-image: -o-linear-gradient(
            var(--light-blue-dimmer),
            var(--light-blue-dimmer)
        ),
        -o-linear-gradient(transparent, transparent);
    background-image: linear-gradient(
            var(--light-blue-dimmer),
            var(--light-blue-dimmer)
        ),
        linear-gradient(transparent, transparent);
}
</style>
