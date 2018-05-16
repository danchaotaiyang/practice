<template>
<div class="line" ref="line">
    <svg ref="svg">
        <g class="area" ref="area">
            <g class="legend" ref="legend"></g>
            <g class="paths" ref="paths" v-show="screen.length"></g>
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
    margin: {top: 45, right: 30, bottom: 24, left: 30},
    domainType: 'number'
};

export default {
    data() {
        return {
            exclude: []
        };
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
            type: String, default: 'curveLinear'
        },
        duration: {
            type: Number, default: 400
        }
    },
    computed: {
        dataFormat() {
            return [...this.data];
        },
        screen() {
            let data = [];
            this.dataFormat.forEach((d, i) => !this.exclude[i] && data.push(d));
            return data;
        },
        datum() {
            return d3.merge(this.screen.map(item => item.list));
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
        margin() {
            return this.option.margin;
        },
        clientWidth() {
            return this.width !== 0 ? this.width : this.$refs.line.clientWidth;
        },
        clientHeight() {
            return this.height !== 0 ? this.height : this.$refs.line.clientHeight;
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
            switch (this.option.domainType) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            scale.range([this.left, this.right]).domain(this.domainX);
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
        lineFrom() {
            return d3.line().x(d => this.scaleX(d.label)).y(this.bottom);
        },
        lineTo() {
            return d3.line()
                .x(d => this.scaleX(d.label))
                .y(d => this.scaleY(d.value))
                .curve(d3[this.curve]);
        },
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
                .attr('width', this.right - this.left + 2)
                .attr('height', this.bottom - this.top + 1)
                .attr('x', this.left)
                .attr('y', this.top - 1);

            if (this.screen.length === 0) return;

            let legend = d3
                .select(this.$refs.legend)
                .attr('transform', `translate(${this.left}, ${this.top - 30})`)
                .selectAll('g')
                .data(this.screen)
                .enter();

            let legendGroup = legend
                .append('g')
                .style('cursor', 'pointer')
                .attr('transform', (d, i) => {
                    return `translate(${i * (d.title.length * 20)}, 0)`;
                })
                .on('click', (d, i, t) => {
                    this.exclude = this.exclude.map((item, index) => {
                        return index === i ? !item : item;
                    });
                    let lg = d3
                        .select(t[i])
                        .transition()
                        .duration(this.duration);
                    lg
                        .select('rect')
                        .attr('fill', () => this.exclude[i] ? '#ddd' : colors[i]);
                    lg
                        .select('text')
                        .attr('fill', () => this.exclude[i] ? '#ddd' : null);
                });

            legendGroup
                .append('rect')
                .attr('width', 14)
                .attr('height', 14)
                .attr('fill', (d, i) => colors[i]);

            legendGroup
                .append('text')
                .text(d => d.title)
                .attr('x', 18)
                .attr('y', 12);

            let paths = d3
                .select(this.$refs.paths)
                .selectAll('path')
                .data(this.screen);

            let enter = paths.enter();
            let exit = paths.exit();

            enter
                .append('path')
                .datum(d => d.list)
                .attr('fill', 'none')
                .attr('stroke', (d, i) => colors[i])
                .attr('stroke-width', '2')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('clip-path', 'url(#clipPath)')
                .attr('d', this.lineFrom)
                .transition()
                .duration(this.duration)
                .attr('d', this.lineTo);

            exit
                .attr('opacity', 1)
                .transition()
                .duration(this.duration)
                .attr('opacity', 0)
                .remove();

            this.axis();
        },
        axis() {
            d3
                .select(this.$refs.axisX)
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(this.duration)
                .call(d3.axisBottom(this.scaleX).ticks(d3.timeDay.every(2)));

            d3
                .select(this.$refs.axisY)
                .attr('transform', `translate(${this.left}, 0)`)
                .transition()
                .duration(this.duration)
                .call(d3.axisLeft(this.scaleY));
        },
        updateLines() {
            this.screen.length > 0 && d3
                .select(this.$refs.paths)
                .selectAll('path')
                .each((d, i, t) => {
                    d3.select(t[i])
                        .transition()
                        .duration(this.duration)
                        .attr('opacity', this.exclude[i] ? 0 : 1)
                        .attr('d', this.lineTo);
                });

            this.axis();
            this.$emit('update:refresh', false);
        }
    },
    created() {
        this.exclude = new Array(this.data.length).fill(false);
    },
    mounted() {
        this.createSvg();
    },
    watch: {
        exclude() {
            this.$nextTick(this.updateLines);
        },
        refresh(state) {
            state && this.$nextTick(this.updateLines);
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

.legend {
    font-size: 14px;
}

.legend g {
    cursor: pointer;
}
</style>
