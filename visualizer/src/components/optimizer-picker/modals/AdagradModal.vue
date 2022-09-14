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
import { adagrad } from "@/optimization/optimizers.js";
import ModalFormMixin from "@/mixins/modal-form-mixin.js";
import toast from "@/toast/toast.js";

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
                alpha: 0.25,
                iterations: 100,
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
            toast.fire({
                text: `${this.optimizer.title} successfully updated`,
                type: "success",
                duration: 3000,
            });
            this.$emit(
                "update:optimizer",
                adagrad(this.savedForm.alpha, this.savedForm.iterations)
            );
        },
    },
};
</script>

<style></style>
