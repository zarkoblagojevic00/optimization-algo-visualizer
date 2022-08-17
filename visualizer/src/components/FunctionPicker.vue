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
                :key="problem.optimizationProblem.id"
                class="function-menu-item underline-container transition-ease-in"
                :class="{
                    'function-menu-item-active':
                        activeId === problem.optimizationProblem.id,
                }"
            >
                <div class="function-title">
                    {{ problem.optimizationProblem.title }}
                </div>
                <div class="function-activate-more">
                    <div class="tooltip top-right">
                        <span class="tooltiptext">{{
                            activeId === problem.optimizationProblem.id
                                ? "Active"
                                : "Pick"
                        }}</span>
                        <input
                            class="function-radio"
                            v-model="activeId"
                            type="radio"
                            :value="problem.optimizationProblem.id"
                            :name="`activate-${problem.optimizationProblem.id}`"
                            :id="`activate-${problem.optimizationProblem.id}`"
                        />
                    </div>
                    <div class="tooltip top-right">
                        <span class="tooltiptext">More</span>
                        <button class="function-more-button"></button>
                    </div>
                    <!-- Modal
                    <keep-alive>
                        <component
                            :is="optimizer.modal.component"
                            v-model:optimizer="optimizer.value"
                            v-model:active="optimizer.modal.active"
                        ></component>
                    </keep-alive> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SurfacePlot from "@/components/SurfacePlot.vue";
import {
    quadratic,
    quadratic2mins,
} from "@/optimization/optimization-problems.js";

const functions = [
    quadratic(1, 0, 4),
    quadratic2mins(
        {
            min1Deepness: 2,
            min1Coord: [1, 0],
            min1Steepness: 5,
        },
        {
            min2Deepness: 3,
            min2Coord: [-1, 0],
            min2Steepness: 5,
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
            problems: functions.map((prob) => ({
                xRange: [-2, 2],
                yRange: [-2, 2],
                // zRange will be calculated by FunctionPicker/SurfacePlot
                // zRange is needed for rendering contour plot correctly
                zRange: [],
                optimizationProblem: prob,
            })),
        };
    },
    created() {
        this.activeId = this.problems[0].optimizationProblem.id;
    },

    watch: {
        activeId: {
            handler(newValue) {
                const problem = this.problems.find(
                    (prob) => prob.optimizationProblem.id === newValue
                );
                this.$emit("update:modelValue", problem);
            },
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
    color: var(--background-lighter);
}

.function-menu-item {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 1.1em;
    border-bottom: 2px solid var(--background-lighter);
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
