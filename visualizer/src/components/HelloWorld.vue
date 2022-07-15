<template>
    <div class="hello">
        <h1>{{ "Hello World" }}</h1>
        <button class="button is-primary">Test bulma</button>
        <div ref="plotlyph"></div>
    </div>
</template>

<script>
import plotly from "plotly.js-dist";

export default {
    name: "HelloWorld",
    mounted() {
        const data = [
            { x: [1, 2, 3, 4], y: [10, 15, 13, 17], type: "scatter" },
        ];
        const layout = {
            title: "Test Graph",
            autosize: false,
            width: 500,
            height: 500,
        };

        let myPlot = this.$refs.plotlyph;

        plotly.newPlot(myPlot, data, layout);

        myPlot.on("plotly_click", function (data) {
            console.log(`X = ${data.points[0].x}    Y = ${data.points[0].y}`);
        });
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
