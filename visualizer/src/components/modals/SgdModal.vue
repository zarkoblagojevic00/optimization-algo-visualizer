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
import { sgd } from "@/optimization/optimizers.js";

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
            this.iterations = this.savedIterations;
        },
        updateOptimizer() {
            this.savedAlpha = this.alpha;
            this.savedIterations = this.iterations;
            this.$emit(
                "update:optimizer",
                sgd(this.savedAlpha, this.savedIterations)
            );
        },
    },
};
</script>

<style></style>
