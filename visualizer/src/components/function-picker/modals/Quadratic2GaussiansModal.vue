<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div>
        <modal-dialog
            v-model:isActive="active"
            modalTitle="Quadratic bowl with two Gaussian curves"
            :onOpen="focusInput"
            :onSuccess="updatePlot"
            :onCancel="resetForm"
        >
            <div>
                Inspired by
                <a
                    href="https://emiliendupont.github.io/2018/01/24/optimization-visualization/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >this amazing blogpost.</a
                >
            </div>
            <h3 :key="`function-${plot.optimizationProblem.id}`">
                {{ equation }}
            </h3>

            <p class="modal-card-section-title">Modify parameters</p>
            <section class="modal-card-section">
                <div>Parameter clarification:</div>
                <ul>
                    <li>
                        <span class="math">a</span> and
                        <span class="math">b</span> control the size of minima
                        (i.e. how "deep" Gaussian curves are)
                        <br />
                        (e.g. if
                        <span class="math">a > b</span>
                        Gaussian curve with coefficient
                        <span class="math">a</span>
                        will be deeper)
                    </li>
                    <li>
                        (<span class="math">x</span><sub>1</sub>,
                        <span class="math">y</span><sub>1</sub>) and (<span
                            class="math"
                            >x</span
                        ><sub>2</sub>, <span class="math">y</span><sub>2</sub>)
                        represent minima of Gaussian curves
                    </li>
                    <li>
                        <span class="math">c</span> and
                        <span class="math">d</span>
                        control flatness of Gaussian curves
                    </li>
                </ul>
            </section>

            <div class="form-two-column">
                <div class="form">
                    <label for="Gaussian" class="input-label"
                        >Gaussian curve 1</label
                    >
                    <div class="control-wrapper">
                        <label id="a" class="input-label math"> a </label>
                        <input
                            ref="focusInput"
                            class="control transition-ease"
                            type="number"
                            name="a"
                            id="a"
                            v-model="form.min1.min1Deepness"
                        />
                    </div>
                    <div class="coordinates-container">
                        <div class="control-wrapper">
                            <label id="x1" class="input-label">
                                <span class="math">x</span> <sub>1</sub>
                            </label>
                            <input
                                class="control transition-ease"
                                type="number"
                                name="x1"
                                id="x1"
                                v-model="form.min1.min1Coord[0]"
                            />
                        </div>
                        <div class="control-wrapper">
                            <label id="y1" class="input-label">
                                <span class="math">y</span> <sub>1</sub>
                            </label>
                            <input
                                class="control transition-ease"
                                type="number"
                                name="y1"
                                id="y1"
                                v-model="form.min1.min1Coord[1]"
                            />
                        </div>
                    </div>
                    <div class="control-wrapper">
                        <label id="c" class="input-label math"> c </label>
                        <input
                            class="control transition-ease"
                            type="number"
                            name="c"
                            id="c"
                            v-model="form.min1.min1Flatness"
                        />
                    </div>
                </div>

                <div class="form">
                    <label for="Gaussian" class="input-label"
                        >Gaussian curve 2</label
                    >
                    <div class="control-wrapper">
                        <label id="b" class="input-label math"> b </label>
                        <input
                            class="control transition-ease"
                            type="number"
                            name="b"
                            id="b"
                            v-model="form.min2.min2Deepness"
                        />
                    </div>
                    <div class="coordinates-container">
                        <div class="control-wrapper">
                            <label id="x2" class="input-label">
                                <span class="math">x</span> <sub>2</sub>
                            </label>
                            <input
                                class="control transition-ease"
                                type="number"
                                name="x2"
                                id="x2"
                                v-model="form.min2.min2Coord[0]"
                            />
                        </div>
                        <div class="control-wrapper">
                            <label id="y2" class="input-label">
                                <span class="math">y</span> <sub>2</sub>
                            </label>
                            <input
                                class="control transition-ease"
                                type="number"
                                name="y2"
                                id="y2"
                                v-model="form.min2.min2Coord[1]"
                            />
                        </div>
                    </div>
                    <div class="control-wrapper">
                        <label id="d" class="input-label math"> d </label>
                        <input
                            class="control transition-ease"
                            type="number"
                            name="d"
                            id="d"
                            v-model="form.min2.min2Flatness"
                        />
                    </div>
                </div>
            </div>

            <p class="modal-card-section-title">Modify domain</p>
            <div class="form-horizontal">
                <div class="control-wrapper">
                    <label id="x-domain" class="input-label"> X domain </label>
                    <domain-picker v-model="form.xRange"></domain-picker>
                </div>
                <div class="control-wrapper">
                    <label id="y-domain" class="input-label"> Y domain </label>
                    <domain-picker v-model="form.yRange"></domain-picker>
                </div>
            </div>
        </modal-dialog>
    </div>
</template>

<script>
import ModalDialog from "@/components/modals/ModalDialog.vue";
import DomainPicker from "@/components/number-range/DomainPicker.vue";
import { quadratic2mins } from "@/optimization/optimization-problems.js";
import ModalFormMixin from "@/mixins/modal-form-mixin.js";

export default {
    name: "Quadratic2GaussiansModal",
    components: {
        ModalDialog,
        DomainPicker,
    },
    mixins: [ModalFormMixin],
    props: {
        plot: {
            type: Object,
            required: true,
        },
        active: {
            type: Boolean,
            requred: true,
        },
    },
    emits: ["update:plot", "update:active"],
    data() {
        return {
            equation: `$$f(x, y) =  
            0.5x^2 + 0.5y^2 
            - a e^{-\\frac{(x - x_{1})^2 + (y-y_{1})^2}{c}}
            - b e^{-\\frac{(x - x_{2})^2 + (y-y_{2})^2}{d}}$$`,
            form: {
                min1: {
                    min1Deepness: 2,
                    min1Coord: [1, 0],
                    min1Flatness: 0.2,
                },
                min2: {
                    min2Deepness: 3,
                    min2Coord: [-1, 0],
                    min2Flatness: 0.2,
                },

                xRange: [-2, 2],
                yRange: [-2, 2],
            },
        };
    },
    watch: {
        active(newValue) {
            this.$emit("update:active", newValue);
        },
    },
    methods: {
        focusInput() {
            setTimeout(() => {
                this.$refs.focusInput.focus();
            }, 50);
        },
        updatePlot() {
            this.updateForm();
            this.$emit("update:plot", {
                xRange: this.savedForm.xRange,
                yRange: this.savedForm.yRange,
                optimizationProblem: quadratic2mins(
                    this.savedForm.min1,
                    this.savedForm.min2
                ),
            });
        },
    },
};
</script>

<style scoped>
.form-horizontal .control-wrapper {
    width: 38%;
}

.coordinates-container {
    display: flex;
    justify-content: space-between;
}

.coordinates-container .control-wrapper {
    width: 45%;
}
</style>
