<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="custom-function-modal-wrapper">
        <modal-dialog
            v-model:isActive="active"
            :modalTitle="form.title"
            :onOpen="focusInput"
            :onSuccess="updatePlot"
            :onCancel="resetForm"
        >
            <p class="modal-card-section-title">Modify function</p>
            <div class="function-edit-form">
                <div class="control-wrapper">
                    <label id="title-function" class="input-label">
                        Function title
                    </label>
                    <input
                        ref="focusInput"
                        class="control transition-ease"
                        type="text"
                        name="title-function"
                        id="title-function"
                        v-model="form.title"
                    />
                    <small
                        class="control-invalid-hint"
                        :class="{ hidden: form.title }"
                        >*Title is required
                    </small>
                </div>
                <div class="function-input control-wrapper">
                    <label id="title-function" class="input-label">
                        Function definition (use <span class="math">x</span> and
                        <span class="math">y</span> as variable names)
                    </label>
                    <textarea
                        @keydown.enter.exact.prevent="updatePlotWithEnter"
                        class="function-definition control transition-ease"
                        name="title-function"
                        id="title-function"
                        v-model="form.function"
                    />
                    <small
                        class="control-invalid-hint"
                        :class="{ hidden: !functionInvalidMessage }"
                        >Function definition is invalid:
                        <b> {{ functionInvalidMessage }} </b>
                    </small>
                </div>
            </div>

            <div class="toggle-syntax-button-wrapper">
                <button
                    class="toggle-syntax-button clickable primary outline"
                    @click="toggleSyntax = !toggleSyntax"
                >
                    {{ toggleSyntaxText }}
                </button>
            </div>
            <function-syntax-display
                v-show="toggleSyntax"
            ></function-syntax-display>

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
import FunctionSyntaxDisplay from "@/components/function-picker/modals/FunctionSyntaxDisplay.vue";
import ModalFormMixin from "@/mixins/modal-form-mixin.js";
import mexp from "math-expression-evaluator";
import { getGradientApproximator } from "@/optimization/optimization-criteria.js";
import toast from "@/toast/toast.js";

export default {
    components: {
        ModalDialog,
        DomainPicker,
        FunctionSyntaxDisplay,
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
            form: {
                title: "Draft",
                function: "4x^2 + y^2",
                xRange: [-2, 2],
                yRange: [-2, 2],
            },
            toggleSyntax: false,
        };
    },
    created() {
        mexp.addToken([
            { type: 3, token: "x", show: "x", value: "x" },
            { type: 3, token: "y", show: "y", value: "y" },
        ]);
        this.emitPlot();
    },

    computed: {
        functionInvalidMessage() {
            try {
                mexp.eval(this.form.function);
                return "";
            } catch (e) {
                return e.message.substring(0, 100);
            }
        },
        toggleSyntaxText() {
            return this.toggleSyntax ? "Hide syntax help" : "Show syntax help";
        },
    },

    watch: {
        active(newValue) {
            this.$emit("update:active", newValue);
        },
    },
    mounted() {
        this.focusInput();
    },
    methods: {
        focusInput() {
            setTimeout(() => {
                this.$refs.focusInput.focus();
            }, 100);
        },
        updatePlotWithEnter() {
            try {
                this.updatePlot();
            } catch (e) {
                console.log(e.message);
            }
        },
        updatePlot() {
            if (!this.form.title || this.functionInvalidMessage) {
                toast.fire({
                    text: "Please fill out all the required data correctly.",
                    type: "warning",
                    duration: 3500,
                });
                throw new Error("Validation failed.");
            }
            toast.fire({
                text: "You have successfully updated function",
                type: "success",
                duration: 3500,
            });
            this.updateForm();
            this.emitPlot();
        },
        emitPlot() {
            const f = compileFunction(this.savedForm.function);
            const gradF = getGradientApproximator(f);

            this.$emit("update:plot", {
                xRange: this.savedForm.xRange,
                yRange: this.savedForm.yRange,
                optimizationCriterion: {
                    id: this.plot.optimizationCriterion.id,
                    title: this.savedForm.title,
                    f,
                    gradF,
                },
            });
        },
    },
};

const compileFunction = (functionString) => {
    const lexed = mexp.lex(functionString);
    const postfix = lexed.toPostfix();
    const f = (x, y) => postfix.postfixEval({ x, y });
    return f;
};
</script>

<style scoped>
.function-definition {
    max-height: 150px;
    height: 150px;
    max-width: 100%;
    width: 100%;
    resize: none;
    overflow-y: auto;
}
.toggle-syntax-button-wrapper {
    display: flex;
    justify-content: flex-start;
}

.toggle-syntax-button {
    margin: 1.2em 0 0.5em 0;
    font-size: 0.8rem;
}
</style>
