import { deepCopy } from "@/utils/deep-copy.js";

export default {
    data() {
        return {
            savedForm: {},
        };
    },
    created() {
        this.savedForm = deepCopy(this.form);
    },
    methods: {
        updateForm() {
            this.savedForm = deepCopy(this.form);
        },
        resetForm() {
            this.form = deepCopy(this.savedForm);
        },
    },
};
