<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div>
        <modal-dialog
            v-model:isActive="active"
            :modalTitle="optimizer.title"
            :onOpen="focusInput"
            :onSuccess="updateOptimizer"
            :onCancel="resetForm"
        >
            <div class="control-wrapper">
                <label id="alpha" class="input-label">
                    <b>&alpha;</b> - alpha, learning rate
                </label>
                <input
                    ref="firstInput"
                    class="control transition-ease"
                    type="number"
                    name="alpha"
                    id="alpha"
                    v-model="form.alpha"
                />
            </div>
            <div class="control-wrapper">
                <label id="omega1" class="input-label">
                    <b>&omega;<sub>1</sub></b>
                    - omega1
                </label>
                <input
                    class="control transition-ease"
                    type="number"
                    name="omega1"
                    id="omega1"
                    v-model="form.omega1"
                />
            </div>
            <div class="control-wrapper">
                <label id="omega2" class="input-label">
                    <b>&omega;<sub>2</sub></b>
                    - omega2
                </label>
                <input
                    class="control transition-ease"
                    type="number"
                    name="omega2"
                    id="omega2"
                    v-model="form.omega2"
                />
            </div>
            <div class="control-wrapper">
                <label id="iter" class="input-label">
                    Number of Iterations [1, 500]
                </label>
                <num-input-range
                    v-model="form.iterations"
                    :min="0"
                    :max="501"
                ></num-input-range>
            </div>
        </modal-dialog>
    </div>
</template>

<script>
import ModalDialog from "@/components/modals/ModalDialog.vue";
import NumInputRange from "@/components/number-range/NumInputRange.vue";

import { adam } from "@/optimization/optimizers.js";
import ModalFormMixin from "@/mixins/modal-form-mixin.js";

export default {
    components: {
        ModalDialog,
        NumInputRange,
    },
    mixins: [ModalFormMixin],
    props: {
        optimizer: {
            type: Object,
            required: true,
        },
        active: {
            type: Boolean,
            requred: true,
        },
    },
    emits: ["update:optimizer", "update:active"],
    data() {
        return {
            form: {
                alpha: 0.091,
                iterations: 100,
                omega1: 0.9,
                omega2: 0.99,
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
                this.$refs.firstInput.focus();
            }, 50);
        },
        updateOptimizer() {
            this.updateForm();
            this.$emit(
                "update:optimizer",
                adam(
                    this.savedForm.alpha,
                    this.savedForm.omega1,
                    this.savedForm.omega2,
                    this.savedForm.iterations
                )
            );
        },
    },
};
</script>

<style></style>
