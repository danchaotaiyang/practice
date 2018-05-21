<template>
<div class="line" ref="line">
    <svg ref="svg">
        <g class="area" ref="area">
            <g class="legend" ref="legend"></g>
            <g class="paths" ref="paths" v-show="screen.length"></g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
        </g>
        <g class="overlay" ref="overlay"></g>
    </svg>
</div>
</template>

<script>
import * as d3 from 'd3';
import { colors } from '@/components/colors';

const parseDate = d3.timeParse('%Y-%m-%d');

let defaultOptions = {
    margin: { top: 45, right: 30, bottom: 24, left: 30 },
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
        innerWidth() {
            return this.right - this.left;
        },
        innerHeight() {
            return this.bottom - this.top;
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
    },
    methods: {
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
            let scaleX = this.scaleX();
            return d3.line()
                .x(d => scaleX(d.label))
                .y(this.bottom);
        },
        lineTo() {
            let scaleX = this.scaleX();
            let scaleY = this.scaleY();
            return d3.line()
                .x(d => scaleX(d.label))
                .y(d => scaleY(d.value))
                .curve(d3[this.curve]);
        },
        inventSVG() {
            d3
                .select(this.$refs.svg)
                .attr('width', this.clientWidth)
                .attr('height', this.clientHeight)
                .append('defs')
                .append('clipPath')
                .attr('id', 'clipPath')
                .append('rect')
                .attr('width', this.innerWidth + 2)
                .attr('height', this.innerHeight + 1)
                .attr('x', this.left)
                .attr('y', this.top - 1);
        },
        inventLegend() {
            let legend = d3
                .select(this.$refs.legend)
                .attr('transform', `translate(${this.left}, ${this.top - 30})`)
                .selectAll('g')
                .data(this.screen);

            let enter = legend.enter();
            let exit = legend.exit();

            let group = enter
                .append('g')
                .style('cursor', 'pointer')
                .attr('transform', (d, i) => {
                    return `translate(${i * (d.title.length * 20)}, 0)`;
                })
                .on('click', this.updateLegend);

            group
                .append('rect')
                .attr('width', 14)
                .attr('height', 14)
                .attr('fill', (d, i) => colors[i]);

            group
                .append('text')
                .text(d => d.title)
                .attr('x', 18)
                .attr('y', 12);

            exit
                .attr('opacity', 1)
                .transition()
                .duration(this.duration)
                .attr('opacity', 0)
                .remove();
        },
        inventPaths() {
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
                .attr('d', this.lineFrom())
                .transition()
                .duration(this.duration)
                .attr('d', this.lineTo());

            exit
                .attr('opacity', 1)
                .transition()
                .duration(this.duration)
                .attr('opacity', 0)
                .remove();
        },
        inventOverlay() {
            let that = this;
            let overlay = d3
                .select(this.$refs.overlay);

            overlay
                .append('rect')
                .attr('fill', 'rgba(0, 0, 0, .05)')
                .style('pointer-events', 'all')
                .attr('x', this.left)
                .attr('y', this.top)
                .attr('width', this.innerWidth)
                .attr('height', this.innerHeight);

            let circle = overlay
                .selectAll('circle')
                .data(this.screen)
                .enter()
                .append('circle')
                .attr('r', 4.5)
                .attr('fill', (d, i) => colors[i])
                .attr('opacity', 0);

            overlay
                .on('mouseover', () => {
                    circle
                        .transition()
                        .duration(this.duration / 3)
                        .attr('opacity', 1);
                })
                .on('mouseout', () => {
                    circle
                        .transition()
                        .duration(this.duration / 3)
                        .attr('opacity', 0);
                })
                .on('mousemove', function () {
                    let scaleX = that.scaleX();
                    let scaleY = that.scaleY();
                    let data = that.screen[0].list;

                    let mouseX = d3.mouse(this)[0] - that.left;

                    let x0 = scaleX.invert(mouseX);

                    let bisect = d3.bisector(d => d.label).left;
                    let index = bisect(data, x0);

                    let x1 = data[index].label;

                    let focusX = scaleX(x1);

                    circle
                        .each((d, i, t) => {
                            console.log(d);
                            let mouseY = d3.mouse(this)[1] - that.top;
                            let y0 = scaleY.invert(mouseY);
                            let y1 = d.list[index].value;
                            let focusY = scaleY(y1);
                            d3
                                .select(t[i])
                                .attr('cx', focusX)
                                .attr('cy', focusY);
                        });
                });
        },
        calculationAxis() {
            let scaleX = this.scaleX();
            let scaleY = this.scaleY();
            d3
                .select(this.$refs.axisX)
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(this.duration)
                .call(d3.axisBottom(scaleX).ticks(d3.timeDay.every(2)));

            d3
                .select(this.$refs.axisY)
                .attr('transform', `translate(${this.left}, 0)`)
                .transition()
                .duration(this.duration)
                .call(d3.axisLeft(scaleY));
        },
        initializeLine() {
            this.inventSVG();
            if (this.screen.length === 0) return;
            this.inventLegend();
            this.inventPaths();
            this.inventOverlay();
            this.calculationAxis();
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
                        .attr('d', this.lineTo());
                });

            this.calculationAxis();
            this.$emit('update:refresh', false);
        },
        updateLegend(d, i) {
            this.exclude = this.exclude.map((item, index) => {
                return index === i ? !item : item;
            });
            d3
                .select(this.$refs.legend)
                .selectAll('g')
                .each((data, index, nodes) => {
                    let lg = d3
                        .select(nodes[index])
                        .transition()
                        .duration(this.duration);
                    lg
                        .select('rect')
                        .attr('fill', () => {
                            return this.exclude[index] ? '#ddd' : colors[index];
                        });
                    lg
                        .select('text')
                        .attr('fill', () => {
                            return this.exclude[index] ? '#ddd' : null;
                        });
                });
        }
    },
    created() {
        this.exclude = new Array(this.data.length).fill(false);
    },
    mounted() {
        this.initializeLine();
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
