<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="function-picker-wrapper">
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
                v-for="problem in displayedProblems"
                :key="`function-${problem.plot.optimizationProblem.id}`"
                class="function-menu-item underline-container transition-ease-in"
                :class="{
                    active: activeId === problem.plot.optimizationProblem.id,
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
                </div>
            </div>
            <!-- Modals -->
            <component
                v-for="problem in problems"
                :key="`modal-${problem.plot.optimizationProblem.id}`"
                :is="problem.modal.component"
                v-model:plot="problem.plot"
                v-model:active="problem.modal.active"
            ></component>
        </div>
        <div
            v-if="this.problems.length > pageSize"
            class="pagination-container"
        >
            <button
                class="pagination-button clickable fill primary transition-ease-in"
                :class="{ disabled: isLastPageToLeft }"
                @click="--activePage"
                :disabled="isLastPageToLeft"
            >
                &lt;
            </button>
            <div class="page-counter">
                <!-- +1 because first activePage is 0 -->
                {{ activePage + 1 }} / {{ numberOfPages + 1 }}
            </div>
            <button
                class="pagination-button clickable fill primary transition-ease-in"
                :class="{ disabled: isLastPageToRight }"
                @click="++activePage"
                :disabled="isLastPageToRight"
            >
                &gt;
            </button>
        </div>
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
    quadratic2mins,
} from "@/optimization/optimization-problems.js";

import QuadraticModal from "@/components/function-picker/modals/QuadraticModal.vue";
import Quadratic2GaussiansModal from "@/components/function-picker/modals/Quadratic2GaussiansModal.vue";
import CustomFunctionModal from "@/components/function-picker/modals/CustomFunctionModal.vue";
import { shallowRef } from "vue";
import { deepCopy } from "@/utils/deep-copy.js";

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
        CustomFunctionModal,
    },
    data() {
        return {
            activePage: 0,
            pageSize: 4,
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
    computed: {
        displayedProblems() {
            const offset = this.activePage * this.pageSize;
            return this.problems.slice(offset, offset + this.pageSize);
        },
        numberOfPages() {
            return Math.ceil(this.problems.length / this.pageSize) - 1;
        },
        isLastPageToLeft() {
            return this.activePage === 0;
        },
        isLastPageToRight() {
            return this.activePage === this.numberOfPages;
        },
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

    methods: {
        addCustomFunction() {
            this.problems.push({
                plot: {
                    xRange: [-2, 2],
                    yRange: [-2, 2],
                    // zRange will be calculated by FunctionPicker/SurfacePlot
                    // zRange is needed for rendering contour plot correctly
                    zRange: [],
                    optimizationProblem: {
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
            this.problems.push(deepCopy(this.newCustomFunction));
            this.newCustomFunction = {
                plot: {
                    xRange: [-2, 2],
                    yRange: [-2, 2],
                    // zRange will be calculated by FunctionPicker/SurfacePlot
                    // zRange is needed for rendering contour plot correctly
                    zRange: [],
                    optimizationProblem: null,
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

.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 110px;
}

.pagination-button:first-child {
    padding-top: 0.05rem;
    padding-right: 0.2rem;
}

.pagination-button:last-child {
    padding-top: 0.05rem;
    padding-left: 0.2rem;
}

.pagination-button {
    border-radius: 50%;
    padding: 0;
    width: 28px;
    height: 28px;
    font-size: 1.25rem;
}

.pagination-button.disabled {
    --fill-color: var(--default);
    --fill-color-active: var(--default);
    cursor: default;
}

.page-counter {
    font-size: 0.95rem;
    font-weight: bold;
}

.add-function {
    margin-top: 12px;
}
</style>
