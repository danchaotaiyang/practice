<template>
<div class="line" ref="line">
    <svg ref="svg">
        <g class="area" ref="area">
            <g class="paths" ref="paths"></g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
        </g>
    </svg>
</div>
</template>

<script>
import * as d3 from 'd3';
import {colors} from '@/components/colors';

const parseDate = d3.timeParse('%Y-%m-%d');

let defaultOptions = {
    margin: {top: 20, right: 24, bottom: 20, left: 30},
    domainType: 'number'
};

export default {
    data() {
        return {};
    },
    props: {
        width: {
            type: Number, default: 0
        },
        height: {
            type: Number, default: 0
        },
        data: {
            type: Array, default: () => []
        },
        refresh: {
            type: Boolean, default: false
        },
        options: {
            type: Object, default: () => ({})
        },
        curve: {
            type: String, default: ''
        }
    },
    computed: {
        datum() {
            return d3.merge(this.data.map(item => item.list));
        },
        domainX() {
            return d3.extent(this.datum, d => d.label);
        },
        domainY() {
            return d3.extent(this.datum, d => d.value);
        },
        option() {
            return Object.assign({}, defaultOptions, this.options);
        },
        clientWidth() {
            return this.width !== 0 ? this.width : this.$refs.line.clientWidth;
        },
        clientHeight() {
            return this.height !== 0 ? this.height : this.$refs.line.clientHeight;
        },
        top() {
            return this.option.margin.top;
        },
        right() {
            return this.clientWidth - this.option.margin.right;
        },
        bottom() {
            return this.clientHeight - this.option.margin.bottom;
        },
        left() {
            return this.option.margin.left;
        },
        scaleX() {
            let scale;
            switch (this.option.domainType) {
                case 'time':
                    scale = d3
                        .scaleTime();
                    break;
                default:
                    scale = d3
                        .scaleLinear();
            }
            scale
                .range([this.left, this.right])
                .domain(this.domainX);
            return scale;
        },
        scaleY() {
            let scale;
            scale = d3
                .scaleLinear()
                .range([this.bottom, this.top])
                .domain(this.domainY);
            return scale;
        },
        line() {
            let lines = d3
                .line()
                .x(d => this.scaleX(d.label))
                .y(d => this.scaleY(d.value));

            if (this.curve && d3[this.curve]) {
                lines.curve(d3[this.curve]);
            } else if (d3[this.curve] === undefined) {
                console.warn(`curve: ${this.curve} 为无效值`);
            }

            return lines;
        }
    },
    methods: {
        createSvg() {
            d3
                .select(this.$refs.svg)
                .attr('width', this.clientWidth)
                .attr('height', this.clientHeight)
                .append('defs')
                .append('clipPath')
                .attr('id', 'clipPath')
                .append('rect')
                .attr('width', this.right - this.left)
                .attr('height', this.bottom - this.top)
                .attr('x', this.left)
                .attr('y', this.top);

            let paths = d3
                .select(this.$refs.paths)
                .selectAll('.path')
                .data(this.data)
                .enter();

            paths
                .append('path')
                .attr('class', 'path')
                .datum(d => d.list)
                .attr('fill', 'none')
                .attr('stroke', (d, i) => colors[i])
                .attr('stroke-width', '2')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('clip-path', 'url(#clipPath)')
                .attr('d', this.line)
                .transition()
                .duration(1200);

            paths
                .exit()
                .remove();

            this.calculateAxis();
        },
        calculateAxis() {
            d3
                .select(this.$refs.axisX)
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(500)
                .call(d3.axisBottom(this.scaleX).ticks(d3.timeDay.every(2)));

            d3
                .select(this.$refs.axisY)
                .attr('transform', `translate(${this.left}, 0)`)
                .transition()
                .duration(500)
                .call(d3.axisLeft(this.scaleY));
        },
        updatePath() {
            this.calculateAxis();

            let paths = d3
                .select(this.$refs.paths)
                .selectAll('.path');

            paths.each((d, i, t) => {
                d3
                    .select(t[i])
                    .transition()
                    .duration(1200)
                    .attr('d', this.line);
            });

            this.$emit('update:refresh', false);
        }
    },
    mounted() {
        this.createSvg();
    },
    watch: {
        data() {
            this.$nextTick(this.updatePath);
        },
        refresh(state) {
            state && this.$nextTick(this.updatePath);
        }
    }
};
</script>

<style scoped>
.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.line {
    height: 100%;
}
</style>
