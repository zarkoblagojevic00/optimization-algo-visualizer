<template>
    <div class="pagination-container">
        <button
            class="pagination-button clickable fill primary transition-ease-in"
            :class="{ disabled: isLastPageToLeft }"
            @click="--activePage"
            :disabled="isLastPageToLeft"
        >
            &lt;
        </button>
        <div class="page-counter">
            <!-- +1 because first activePage is 0 -->
            {{ activePage + 1 }} / {{ numberOfPages + 1 }}
        </div>
        <button
            class="pagination-button clickable fill primary transition-ease-in"
            :class="{ disabled: isLastPageToRight }"
            @click="++activePage"
            :disabled="isLastPageToRight"
        >
            &gt;
        </button>
    </div>
</template>

<script>
export default {
    props: {
        pageSize: {
            type: Number,
            default: 5,
        },
        items: {
            type: Array,
            required: true,
        },
        // displayedItems
        modelValue: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            activePage: 0,
        };
    },
    computed: {
        numberOfPages() {
            return Math.ceil(this.items.length / this.pageSize) - 1;
        },
        isLastPageToLeft() {
            return this.activePage === 0;
        },
        isLastPageToRight() {
            return this.activePage === this.numberOfPages;
        },
    },
    watch: {
        activePage: {
            handler() {
                console.log("Active page updated");
                this.updateDisplayedItems();
            },
            immediate: true,
        },
        items: {
            handler() {
                console.log("Items updated");
                this.updateDisplayedItems();
            },
            deep: true,
        },
    },
    methods: {
        updateDisplayedItems() {
            const offset = this.activePage * this.pageSize;
            console.log(this.items.length);
            const newDisplayedItems = this.items.slice(
                offset,
                offset + this.pageSize
            );
            this.$emit("update:modelValue", newDisplayedItems);
        },
    },
};
</script>

<style scoped>
.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 110px;
}

.pagination-button:first-child {
    padding-top: 0.05rem;
    padding-right: 0.2rem;
}

.pagination-button:last-child {
    padding-top: 0.05rem;
    padding-left: 0.2rem;
}

.pagination-button {
    border-radius: 50%;
    padding: 0;
    width: 28px;
    height: 28px;
    font-size: 1.25rem;
}

.pagination-button.disabled {
    --fill-color: var(--default);
    --fill-color-active: var(--default);
    cursor: default;
}

.page-counter {
    font-size: 0.95rem;
    font-weight: bold;
}
</style>
