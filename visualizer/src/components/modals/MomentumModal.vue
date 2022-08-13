<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div>
        <modal-dialog
            v-model:isActive="active"
            :modalTitle="optimizer.title"
            :onSuccess="updateOptimizer"
            :onClose="resetOptimizer"
        >
            <div class="control-wrapper">
                <label id="alpha" class="input-label">
                    <b>&alpha;</b> - alpha, learning rate
                </label>
                <input
                    ref="alpha"
                    class="control transition-ease"
                    type="number"
                    name="alpha"
                    id="alpha"
                    v-model="alpha"
                />
            </div>
            <div class="control-wrapper">
                <label id="omega" class="input-label">
                    <b>&omega;</b>
                    - omega, percentage of "momentum" kept from last iteration
                </label>
                <input
                    ref="omega"
                    class="control transition-ease"
                    type="number"
                    name="omega"
                    id="omega"
                    v-model="omega"
                />
            </div>
            <div class="control-wrapper">
                <label id="iter" class="input-label"> Iterations number </label>
                <input
                    class="control transition-ease"
                    type="number"
                    name="iter"
                    id="iter"
                    v-model="iterations"
                />
            </div>
        </modal-dialog>
    </div>
</template>

<script>
import ModalDialog from "@/components/modals/ModalDialog.vue";
import { momentum } from "@/optimization/optimizers.js";

export default {
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
    components: {
        ModalDialog,
    },
    data() {
        return {
            alpha: 0.05,
            iterations: 100,
            omega: 0.5,
            savedOmega: 0.5,
            savedAlpha: 0.05,
            savedIterations: 100,
        };
    },
    watch: {
        active(newValue) {
            this.$emit("update:active", newValue);
            if (newValue) {
                setTimeout(() => {
                    this.$refs.alpha.focus();
                }, 50);
            }
        },
    },
    methods: {
        resetOptimizer() {
            this.alpha = this.savedAlpha;
            this.omega = this.savedOmega;
            this.iterations = this.savedIterations;
        },
        updateOptimizer() {
            this.savedAlpha = this.alpha;
            this.savedOmega = this.omega;
            this.savedIterations = this.iterations;
            this.$emit(
                "update:optimizer",
                momentum(this.savedAlpha, this.savedOmega, this.savedIterations)
            );
        },
    },
};
</script>

<style></style>
