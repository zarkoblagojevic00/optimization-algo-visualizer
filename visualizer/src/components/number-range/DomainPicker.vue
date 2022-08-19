<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div class="domain-picker-container">
        [
        <num-input-range
            v-model="modelValue[0]"
            :max="modelValue[1]"
        ></num-input-range>
        ,
        <num-input-range
            v-model="modelValue[1]"
            :min="modelValue[0]"
        ></num-input-range>
        ]
    </div>
</template>

<script>
import NumInputRange from "@/components/number-range/NumInputRange.vue";

export default {
    components: {
        NumInputRange,
    },
    props: {
        modelValue: {
            type: Array,
        },
    },
    emits: ["update:modelValue"],
    watch: {
        modelValue(newValue) {
            this.$emit("update:modelValue", newValue);
        },
    },
};
</script>

<style>
.domain-picker-container {
    font-size: 1.5rem;
}

.domain-picker-container input[type="number"].control {
    display: inline;
    width: 58px;
    /* margin-bottom: 10px; */
}
</style>
