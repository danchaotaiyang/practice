<template>
<div class="biLineWrap" ref="biLineWrap">
    <svg class="svg" ref="svg">
        <g class="area" ref="area">
            <g class="paths" ref="paths"></g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
        </g>
    </svg>
</div>
</template>

<script>
// timeParse
// let parseTime = timeParse('%d-%b-%y');

// curveCardinal
// lines.curve(curveCardinal);

// import {select, selectAll, scaleLinear, scaleTime, extent, max, line, axisBottom, axisLeft, curveCardinal} from 'd3';
import * as d3 from 'd3';
import {colors} from '@/components/colors';

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
        margin: {
            type: Object, default: () => ({top: 20, right: 24, bottom: 20, left: 30})
        },
        domainType: {
            type: String, default: 'number'
        },
        data: {
            type: Array, default: () => []
        },
        curve: {
            type: String, default: ''
        },
        modeX: {
            type: String, default: 'max'
        },
        refresh: {
            type: Boolean, default: false
        }
    },
    computed: {
        ref(index) {
            return `path${index}`;
        },
        clientWidth() {
            return this.width !== 0 ? this.width : this.$refs.biLineWrap.clientWidth;
        },
        clientHeight() {
            return this.height !== 0 ? this.height : this.$refs.biLineWrap.clientHeight;
        },
        top() {
            return this.margin.top;
        },
        right() {
            return this.clientWidth - this.margin.right;
        },
        bottom() {
            return this.clientHeight - this.margin.bottom;
        },
        left() {
            return this.margin.left;
        },
        scaleX() {
            let scale;
            switch (this.domainType) {
                case 'time':
                    scale = d3.scaleTime().range([this.left, this.right]);
                    break;
                default:
                    scale = d3.scaleLinear().range([this.left, this.right]);
            }
            return scale;
        },
        scaleY() {
            return d3.scaleLinear().range([this.bottom, this.top]);
        },
        line() {
            let lines = d3.line();
            lines.x(d => this.scaleX(d.label)).y(d => this.scaleY(d.value));
            if (this.curve && d3[this.curve]) {
                lines.curve(d3[this.curve]);
            } else if(d3[this.curve] === undefined) {
                console.warn(`curve: ${this.curve} 为无效值`)
            }
            return lines;
        }
    },
    methods: {
        createSvg(data) {
            this.svg = d3.select(this.$refs.svg)
                .attr('width', this.clientWidth)
                .attr('height', this.clientHeight);

            this.scaleX.domain(d3.extent(data, d => d.label));
            this.scaleY.domain([0, d3.max(data, d => d.value)]);
            d3.select(this.$refs.axisX)
                .attr('transform', `translate(0, ${this.bottom})`)
                .call(d3.axisBottom(this.scaleX));
            d3.select(this.$refs.axisY)
                .attr('transform', `translate(${this.left}, 0)`)
                .call(d3.axisLeft(this.scaleY));
        },
        updatePath() {
            let update = d3.select(this.$refs.paths).selectAll('.path')
                .data(this.data);

            let enter = update.enter();
            let exit = update.exit();

            enter
                .append('path')
                .attr('class', 'path')
                .datum(d => d.list)
                .attr('fill', 'none')
                .attr('stroke', (d, i) => colors[i])
                .attr('stroke-width', '2')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .transition()
                .duration(1000)
                .attr('d', this.line);

            exit
                .transition()
                .duration(1000)
                .remove();

        }
    },
    mounted() {
        this.createSvg(this.data[0].list);
        this.updatePath();
    },
    watch: {
        refresh() {
            let that = this;
            let update = d3.select(this.$refs.paths).selectAll('.path');
            update.each(function(d, i, t) {
                d3.select(t[i])
                    .transition()
                    .duration(1000)
                    .attr('d', that.line);
            });
            this.$emit('update:refresh', false);
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

.biLineWrap {
    height: 100%;
}
</style>
