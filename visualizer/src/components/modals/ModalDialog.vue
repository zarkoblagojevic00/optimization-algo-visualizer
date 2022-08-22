<template>
    <div
        class="modal"
        :class="{ 'modal-active': isActive }"
        @mousedown.self="cancel"
        @keydown.enter="saveChanges"
    >
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ modalTitle }}
                </p>
                <button @click="cancel" class="modal-close"></button>
            </header>

            <section class="modal-card-body">
                <slot></slot>
            </section>
            <footer class="modal-card-foot">
                <button
                    class="clickable fill primary transition-ease-in"
                    @click="saveChanges"
                >
                    Save changes
                </button>
                <button
                    class="clickable outline transition-ease-in"
                    @click="cancel"
                >
                    Cancel
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modalTitle: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        onSuccess: {
            type: Function,
            default: () => null,
        },
        onCancel: {
            type: Function,
            default: () => null,
        },
        onOpen: {
            type: Function,
            default: () => null,
        },
        onClose: {
            type: Function,
            default: () => null,
        },
    },
    emits: ["update:isActive"],
    mounted() {
        window.addEventListener("keydown", this.cancelOnEscape);
    },
    unmounted() {
        window.removeEventListener("keydown", this.cancelOnEscape);
    },

    watch: {
        isActive(newValue) {
            if (newValue) {
                this.onOpen();
            } else {
                this.onClose();
            }
        },
    },

    methods: {
        closeModal() {
            this.$emit("update:isActive", false);
        },
        cancelOnEscape(event) {
            if (event.key === "Escape" && this.isActive) {
                this.cancel();
            }
        },
        saveChanges() {
            try {
                this.onSuccess();
                this.closeModal();
            } catch (e) {
                console.log(e.message);
            }
        },
        cancel() {
            try {
                this.onCancel();
                this.closeModal();
            } catch (e) {
                console.log(e.message);
            }
        },
    },
};
</script>

<style>
.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;

    background-color: rgba(0, 0, 0, 0.5);

    visibility: hidden;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;

    color: #000;
}

.modal-active {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
}

.modal-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;

    background: white;
    border-radius: 0.4rem;

    margin: 0 20px;
    max-height: calc(100vh - 160px);
    overflow: auto;
    width: 100%;
}

@media screen and (min-width: 769px) {
    .modal-card {
        margin: 0 auto;
        max-height: calc(100vh - 40px);
        width: 640px;
    }
}

.modal-card {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 40px);
    overflow: hidden;
    overflow-y: visible;
    -ms-overflow-y: visible;
}

.modal-card-head,
.modal-card-foot {
    min-height: 25px;
    align-items: center;
    background-color: whitesmoke;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-start;
    padding: 1.2rem;
    position: relative;
}

.modal-card-head {
    border-bottom: 1px solid #dbdbdb;
    border-top-left-radius: 0.4rem;
    border-top-right-radius: 0.4rem;
}

.modal-card-title {
    color: #363636;
    flex-grow: 1;
    flex-shrink: 0;
    font-size: 1.5rem;
    line-height: 1;
    text-align: left;
    margin: 0;
}

.modal-card-foot {
    border-bottom-left-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
    border-top: 1px solid #dbdbdb;
}

.modal-card-foot .clickable:not(:last-child) {
    margin-right: 0.5em;
}

.modal-card-body {
    -webkit-overflow-scrolling: touch;
    background-color: white;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
    padding: 1.2rem;
}

.modal-card-section-title {
    text-align: left;
    font-size: 1.3rem;
    padding: 0.2em 0em;
    border-bottom: 1px solid #ddd;
    color: #363636;
}

.modal-card-section {
    text-align: justify;
    padding: 0em 0.5em;
}

.modal-close {
    position: absolute;
    top: 0.91rem;
    right: 1.2rem;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 2rem;
    height: 2rem;
}

.modal-close::before,
.modal-close::after {
    position: absolute;
    content: "";
    width: 60%;
    height: 4px; /* cross thickness */
    background-color: #999;
}

.modal-close:hover::before,
.modal-close:hover::after {
    background-color: var(--light-red);
}

.modal-close::before {
    transform: rotate(45deg);
}

.modal-close::after {
    transform: rotate(-45deg);
}
</style>
