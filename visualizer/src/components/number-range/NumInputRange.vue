<!-- eslint-disable vue/no-mutating-props -->
<template>
    <input
        ref="input"
        class="control transition-ease"
        :class="{ 'control-invalid': isInvalid }"
        type="number"
        v-model.number.lazy="realNumber"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        @keydown.enter="unfocus"
        @keydown.esc="unfocus"
    />
    <small v-if="isInvalid" class="control-invalid-hint"
        >number must be between {{ min }} and {{ max }}</small
    >
</template>

<script>
export default {
    props: {
        modelValue: {
            type: Number,
            required: true,
        },
        min: {
            type: Number,
            default: Number.NEGATIVE_INFINITY,
        },
        max: {
            type: Number,
            default: Number.POSITIVE_INFINITY,
        },
        step: {
            type: Number,
            default: 1,
        },
        placeholder: {
            type: String,
            default: "",
        },
        required: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            realNumber: this.modelValue,
        };
    },

    computed: {
        isInvalid() {
            return this.required && !this.modelValue;
        },
    },

    methods: {
        unfocus() {
            this.$refs.input.blur();
        },
    },
    emits: ["update:modelValue"],

    watch: {
        modelValue(newValue) {
            this.realNumber = newValue;
        },
        realNumber(newValue, oldValue) {
            const updated =
                this.min < newValue && newValue < this.max
                    ? newValue
                    : oldValue;

            this.realNumber = updated;
            this.$emit("update:modelValue", updated);
        },
    },
};
</script>
