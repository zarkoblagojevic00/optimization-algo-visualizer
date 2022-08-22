const types = ["default", "success", "info", "danger", "warning"];

export default {
    fire({ text, type = "default", duration = 2000 }) {
        const toast = document.createElement("div");
        toast.setAttribute("id", "toast");

        const selectedType = types.includes(type) ? type : "default";
        toast.classList.add(`toast-${selectedType}`, "show");
        toast.appendChild(document.createTextNode(text));
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 1000);
        }, duration);
    },
};
