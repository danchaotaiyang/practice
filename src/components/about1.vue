<template>
<div>
    关于
    <div class="svg">
        <svg ref="svg" :width="width" :height="height">
            <path :d="line"></path>
        </svg>
    </div>
</div>
</template>

<script>
import * as d3 from 'd3';
export default {
    data() {
        return {
            width: 600,
            height: 30,
            data: [18, 26, 21, 35, 99, 15, 54, 13, 48, 78, 18, 99],
            line: ''
        }
    },
    methods: {
        _scale() {
            const x = d3.scaleLinear().range([0, 600]);
            const y = d3.scaleLinear().range([0, 30]);
            x.domain([0, this.data.length]);
            y.domain([0, d3.max(this.data, d => d)]);
            return {x, y};
        },
        _calculatePath() {
            let {x, y} = this._scale();
            let path = d3.line()
                .x((d, i) => x(i))
                .y((d) => y(d));
            this.line = path(this.data);
        }
    },
    mounted() {
        this._calculatePath();
    }
}
</script>

<style scoped>
path {
    fill: none;
    stroke: #76BF8A;
}

</style>
