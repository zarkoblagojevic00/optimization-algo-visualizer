<template>
    <div class="sidebar-container">
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
                :class="[
                    optimizer.active ? 'optimizer-menu-item-active' : '',
                    optimizer.value.id,
                ]"
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
import { sgd, momentum } from "@/optimization/optimizers.js";
import SgdModal from "@/components/optimizer-picker/modals/SgdModal.vue";
import MomentumModal from "@/components/optimizer-picker/modals/MomentumModal.vue";
import { shallowRef } from "vue";

const initOptimizers = [sgd(0.05, 100), momentum(0.05, 0.5, 100)];
const modals = [shallowRef(SgdModal), shallowRef(MomentumModal)];

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
.sidebar-container {
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

.optimizer-menu-item {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5em 1.1em;
    border-bottom: 2px solid var(--background-lighter);
}

.optimizer-menu-item-active {
    background-color: #213349;
    background-size: 100% 3px, auto;
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
    border: 2px solid var(--light-blue-dimmer);
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

.sgd.underline-container {
    background-image: -webkit-linear-gradient(var(--sgd), var(--sgd)),
        -webkit-linear-gradient(transparent, transparent);
    background-image: -moz-linear-gradient(var(--sgd), var(--sgd)),
        -moz-linear-gradient(transparent, transparent);
    background-image: -ms-linear-gradient(var(--sgd), var(--sgd)),
        -ms-linear-gradient(transparent, transparent);
    background-image: -o-linear-gradient(var(--sgd), var(--sgd)),
        -o-linear-gradient(transparent, transparent);
    background-image: linear-gradient(var(--sgd), var(--sgd)),
        linear-gradient(transparent, transparent);
}

.sgd-circle-color {
    background: var(--sgd);
}

.momentum.underline-container {
    background-image: -webkit-linear-gradient(var(--momentum), var(--momentum)),
        -webkit-linear-gradient(transparent, transparent);
    background-image: -moz-linear-gradient(var(--momentum), var(--momentum)),
        -moz-linear-gradient(transparent, transparent);
    background-image: -ms-linear-gradient(var(--momentum), var(--momentum)),
        -ms-linear-gradient(transparent, transparent);
    background-image: -o-linear-gradient(var(--momentum), var(--momentum)),
        -o-linear-gradient(transparent, transparent);
    background-image: linear-gradient(var(--momentum), var(--momentum)),
        linear-gradient(transparent, transparent);
}

.momentum-circle-color {
    background: var(--momentum);
}
</style>
