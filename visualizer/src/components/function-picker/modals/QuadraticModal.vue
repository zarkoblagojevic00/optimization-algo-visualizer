<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div>
        <modal-dialog
            v-model:isActive="active"
            :modalTitle="plot.optimizationCriterion.title"
            :onOpen="focusInput"
            :onSuccess="updatePlot"
            :onCancel="resetForm"
        >
            <h3 :key="`function-${plot.optimizationCriterion.id}`">
                {{ equation }}
            </h3>

            <p class="modal-card-section-title">Modify parameters</p>
            <div class="form-horizontal">
                <div class="control-wrapper">
                    <label id="a" class="input-label math"> a </label>
                    <input
                        ref="focusInput"
                        class="control transition-ease"
                        type="number"
                        name="a"
                        id="a"
                        v-model="form.a"
                    />
                </div>
                <div class="control-wrapper">
                    <label id="b" class="input-label math"> b </label>

                    <input
                        class="control transition-ease"
                        type="number"
                        name="b"
                        id="b"
                        v-model="form.b"
                    />
                </div>
                <div class="control-wrapper">
                    <label id="c" class="input-label math"> c </label>

                    <input
                        class="control transition-ease"
                        type="number"
                        name="c"
                        id="c"
                        v-model="form.c"
                    />
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
import { quadratic } from "@/optimization/optimization-criteria.js";
import ModalFormMixin from "@/mixins/modal-form-mixin.js";

export default {
    name: "QuadraticModal",
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
            equation: "$$f(x, y) = ax^2 + bxy + cy^2$$",
            form: {
                a: 1,
                b: 0,
                c: 2,
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
                optimizationCriterion: quadratic(
                    this.savedForm.a,
                    this.savedForm.b,
                    this.savedForm.c
                ),
            });
        },
    },
};
</script>

<style scoped>
.control-wrapper {
    width: 38%;
}
</style>
