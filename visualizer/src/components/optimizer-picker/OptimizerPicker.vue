<template>
    <div class="optimizer-picker-wrapper">
        <div class="promo-container">
            <img
                class="promo-logo"
                src="@/assets/logo.png"
                alt="Opt visualizer"
            />
            <div class="promo-app-name">
                <div class="promo-app-name-big">Optimization</div>
                <div class="promo-app-name-normal">visualizer</div>
            </div>
        </div>
        <div class="submenu">
            <div class="submenu-title">Optimizers</div>
            <div
                v-for="(optimizer, idx) in activeOptimizers"
                :key="idx"
                class="optimizer-menu-item underline-container transition-ease-in"
                :class="[optimizer.active ? 'active' : '', optimizer.value.id]"
            >
                <div class="optimizer-color-title">
                    <div
                        :class="[
                            optimizer.active
                                ? `${optimizer.value.id}-circle-color`
                                : '',
                            'optimizer-color',
                        ]"
                    ></div>
                    <div class="optimizer-title">
                        {{ optimizer.value.id }}
                    </div>
                </div>
                <div class="optimizer-activate-more">
                    <div class="tooltip top-left">
                        <span class="tooltiptext">{{
                            optimizer.active ? "Deactivate" : "Activate"
                        }}</span>
                        <input
                            class="optimizer-checkbox"
                            v-model="optimizer.active"
                            type="checkbox"
                            :name="`activate-${optimizer.value.id}`"
                            :id="`activate-${optimizer.value.id}`"
                        />
                    </div>
                    <div class="tooltip top-left">
                        <span class="tooltiptext">More</span>
                        <button
                            @click="optimizer.modal.active = true"
                            class="optimizer-more-button"
                        ></button>
                    </div>
                    <!-- Modal -->
                    <component
                        :key="optimizer.value.id"
                        :is="optimizer.modal.component"
                        v-model:optimizer="optimizer.value"
                        v-model:active="optimizer.modal.active"
                    ></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    sgd,
    momentum,
    nesterov,
    adagrad,
    rmsprop,
    adadelta,
} from "@/optimization/optimizers.js";
import SgdModal from "@/components/optimizer-picker/modals/SgdModal.vue";
import MomentumModal from "@/components/optimizer-picker/modals/MomentumModal.vue";
import NesterovModal from "@/components/optimizer-picker/modals/NesterovModal.vue";
import AdagradModal from "@/components/optimizer-picker/modals/AdagradModal.vue";
import RmspropModal from "@/components/optimizer-picker/modals/RmspropModal.vue";
import AdadeltaModal from "@/components/optimizer-picker/modals/AdadeltaModal.vue";
import { shallowRef } from "vue";

const initOptimizers = [
    sgd(0.05, 100),
    momentum(0.05, 0.5, 100),
    nesterov(0.05, 0.5, 100),
    adagrad(0.8, 100),
    rmsprop(0.1, 0.9, 100),
    adadelta(0.9, 100),
];

const modals = [
    shallowRef(SgdModal),
    shallowRef(MomentumModal),
    shallowRef(NesterovModal),
    shallowRef(AdagradModal),
    shallowRef(RmspropModal),
    shallowRef(AdadeltaModal),
];

export default {
    components: { SgdModal },
    props: {
        optimizers: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            activeOptimizers: [],
        };
    },
    emits: ["update:optimizers"],
    created() {
        this.activeOptimizers = initOptimizers.map((optimizer, idx) => ({
            value: optimizer,
            active: true,
            modal: {
                active: false,
                component: modals[idx],
            },
        }));
    },
    watch: {
        activeOptimizers: {
            handler() {
                const newOptimizers = this.activeOptimizers
                    .filter((opt) => opt.active)
                    .map((opt) => opt.value);
                this.$emit("update:optimizers", newOptimizers);
            },
            deep: true,
            immediate: true,
        },
    },
};
</script>

<style scoped>
.optimizer-picker-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--background);
    color: var(--control-border-color);
}

.promo-container {
    margin: 1.5em auto;
    display: flex;
}

.promo-logo {
    width: 65px;
    height: 65px;
    margin-right: 10px;
}

.promo-app-name {
    margin-top: 5px;
    text-align: left;
}

.promo-app-name-big {
    font-size: 2rem;
}

.promo-app-name-normal {
    font-size: 1.5rem;
    position: relative;
    top: -5px;
    left: 3px;
}

.submenu-title {
    border-bottom: 2px solid var(--background-lighter);
}

.optimizer-menu-item {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 1.1em;
    border-bottom: 2px solid var(--background-lighter);
}

.underline-container.active {
    --underline-active-bg-color: #213349;
}

.sgd.underline-container.active {
    --underline-color: var(--sgd);
}

.sgd-circle-color {
    background: var(--sgd);
}

.momentum.underline-container.active {
    --underline-color: var(--momentum);
}

.momentum-circle-color {
    background: var(--momentum);
}

.nesterov.underline-container.active {
    --underline-color: var(--nesterov);
}

.nesterov-circle-color {
    background: var(--nesterov);
}

.adagrad.underline-container.active {
    --underline-color: var(--adagrad);
}

.adagrad-circle-color {
    background: var(--adagrad);
}

.rmsprop.underline-container.active {
    --underline-color: var(--rmsprop);
}

.rmsprop-circle-color {
    background: var(--rmsprop);
}

.adadelta.underline-container.active {
    --underline-color: var(--adadelta);
}

.adadelta-circle-color {
    background: var(--adadelta);
}

.optimizer-color-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.optimizer-color {
    width: 0.8rem;
    height: 0.8rem;
    border: 3px solid var(--background-lighter);
    border-radius: 50%;
    margin-right: 0.5rem;
}

.optimizer-activate-more {
    display: flex;
    align-items: center;
}

.optimizer-checkbox {
    position: relative;
    width: 1.3rem;
    height: 1.3rem;
    accent-color: var(--light-blue);
    cursor: pointer;
}

.optimizer-checkbox:not(:checked)::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 82%;
    width: 80%;
    border: 2px solid var(--primary);
    border-radius: 0.2em;
    background-color: var(--background);
    transition: all 0.25s;
}

.optimizer-checkbox:hover:not(:checked)::after {
    background-color: var(--background-lighter);
}

.optimizer-more-button {
    margin: 0 1px 2px 4px;
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

.optimizer-more-button:hover,
.optimizer-more-button:focus {
    border-color: #385472;
    background-color: var(--background-lighter);
    background-image: url("@/assets/more-filled-icon.png");
}
</style>
