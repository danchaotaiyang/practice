<template>
<div class="line">
    <svg ref="svg">
        <g ref="group"><path ref="path"></path></g>
    </svg>
</div>
</template>
<script>
import {select, scaleLinear, max, extent, line} from 'd3';

export default {
    props: {
        width: {
            type: [Number, String],
            default: 100,
            validator: v => v >= 12
        },
        height: {
            type: [Number, String],
            default: 50,
            validator: v => v >= 12
        },
        fill: {
            type: String,
            default: 'none'
        },
        stroke: String,
        data: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        _scale() {
            const x = scaleLinear().range([0, this.width]);
            const y = scaleLinear().range([0, this.height]);
            x.domain(extent(this.data, (d, i) => i));
            y.domain([0, max(this.data, d => d)]);
            return {x, y};
        },
        _calculateLine() {
            let {x, y} = this._scale();
            let path = line()
                .x((d, i) => x(i))
                .y((d) => y(d));
            return path(this.data);
        },
        _calculatePath() {
            let d = this._calculateLine();
            if (!d) {
                return;
            }
            const $path = select(this.$refs.path);
            ['fill', 'stroke'].forEach(i => {
                this[i] && $path.attr(i, this[i]);
            });
            $path.attr('d', d);
        },
        _calculateSvg() {
            select(this.$refs.svg)
                .attr('width', this.width)
                .attr('height', this.height);
            this._calculatePath();
        }
    },
    render: h => {
        return h('div', {ref: 'line'}, [
            h('svg', {ref: 'svg'}, [
                h('g', {ref: 'g'}, [h('path', {ref: 'path'})])
            ])
        ]);
    },
    mounted() {
        this._calculateSvg();
    },
    watch: {
        data() {
            this._calculatePath();
        }
    }
}

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
path {
    fill: none;
}
</style>
