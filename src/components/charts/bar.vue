<template>
<div class="bar" ref="bar">
    <svg ref="svg" :width="width" :height="height">
        <g class="view" ref="view">
            <g class="paths" ref="paths"></g>
            <g class="xAxis" ref="xAxis"></g>
            <g class="yAxis" ref="yAxis"></g>
        </g>
        <g class="legend" ref="legend" :transform="`translate(${legend.x}, ${legend.y})`">
            <g v-for="(d, i) in legend.data" :transform="`translate(${i * legendTickWidth % legendClientWidth}, ${((i * legendTickWidth / legendClientWidth) | 0) * 22})`" @click="updateView(i)">
                <rect rx="2" ry="2" :fill="series[i].color"></rect>
                <text class="legendText" x="18" y="11" fill="#000">{{d}}</text>
            </g>
        </g>
        <g class="focus" ref="focus" opacity="0">
            <rect class="rect" ref="rect" :x="left" :y="top" :width="innerWidth" :height="innerHeight" @mouseover="opacityFocus(1)" @mouseout="opacityFocus(0)" @mousemove="inventFocus"></rect>
        </g>
        <defs>
            <clipPath id="clipPath1">
                <rect :width="innerWidth" :height="bottom" :x="left" :y="top"></rect>
            </clipPath>
        </defs>
    </svg>
    <tool-tip class="tooltip" ref="tooltip" :data="tooltip" :exclude="exclude" :colors="colors"></tool-tip>
</div>
</template>

<script>
import ToolTip from '@/components/charts/tooltip';
import {colors} from '@/components/charts/colors';
import * as d3 from 'd3';

export default {
    components: {ToolTip},
    data() {
        return {
            defaultLegend: {
                type: 'bar',
                x: 10,
                y: 10,
                data: []
            },
            defaultConfig: {
                margin: {top: 40, right: 30, bottom: 30, left: 30},
                duration: 200
            },
            elements: {},
            exclude: [],
            scrollX: 0,
            focus: {
                focusX: 0,
                focusY: [],
            },
            tooltip: {
                title: '',
                desc: [],
                tipX: 0,
                tipY: 0
            },
            init: false,
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
            type: Object, default: () => ({})
        },
        refresh: {
            type: Boolean, default: false
        }
    },
    computed: {
        legend() {
            return Object.assign({}, this.defaultLegend, this.data.legend);
        },
        series() {
            return this.data.series.map((d, i) => {
                d.color = this.colors[i];
                return d;
            });
        },
        screen() {
            let data = [];
            this.series.forEach((d, i) => !this.exclude[i] && data.push(d));
            return data;
        },
        config() {
            let config = {};
            let {margin, curve, colors, duration} = this.data;
            if (margin) {
                config.margin = margin;
            }
            if (curve) {
                config.curve = curve;
            }
            if (colors) {
                config.colors = colors;
            }
            if (duration) {
                config.duration = duration;
            }
            return Object.assign({}, this.defaultConfig, config);
        },
        duration() {
            return this.config.duration;
        },
        colors() {
            let color = this.config.colors || [];
            return [...color, ...colors];
        },
        clientWidth() {
            return this.width || this.$refs.bar.clientWidth;
        },
        clientHeight() {
            return this.height || this.$refs.bar.clientHeight;
        },
        innerWidth() {
            return this.right - this.left;
        },
        innerHeight() {
            return this.bottom - this.top;
        },
        top() {
            return this.config.margin.top;
        },
        right() {
            return this.clientWidth - this.config.margin.right;
        },
        bottom() {
            return this.clientHeight - this.config.margin.bottom;
        },
        left() {
            return this.config.margin.left;
        },
        dataWidth() {
            return this.right + 1000;
        },
        xDomain() {
            return this.screen.map(d => d.name);
        },
        yDomain() {
            return [d3.max(this.screen, d => d.data), 0];
        },
        xScale() {
            let scale;
            switch (this.data.xAxis.type) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                case 'string':
                    scale = d3.scaleBand();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.left, this.dataWidth]).domain(this.xDomain);
        },
        yScale() {
            let scale;
            switch (this.data.yAxis.type) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                case 'string':
                    scale = d3.scaleBand();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.top, this.bottom]).domain(this.yDomain);
        },
        legendTickWidth() {
            let lwp = this.config.legendWidth;
            let tick = d3.max(this.legend.data, d => d.length);
            return lwp ? (this.innerWidth * lwp) / 100 : tick * 12 + 40;
        },
        legendClientWidth() {
            return ((this.innerWidth / this.legendTickWidth) | 0) * this.legendTickWidth;
        },
        drag() {
            return d3
                .drag()
                .on('drag', function () {
                    d3
                        .select(this)
                        .attr('transform', `translateX(${d3.event.x})`);
                });
        }
    },
    methods: {
        inventBar() {
            let {paths} = this.elements;
            paths
                .selectAll('rect')
                .remove();
            paths
                .attr('clip-path', 'url(#clipPath1)');
            let rect = paths
                .selectAll('rect')
                .data(this.screen);

            let enter = rect.enter();
            let exit = rect.exit();

            enter
                .append('rect')
                .attr('fill', d => d.color)
                .attr('x', (d, i) => this.xScale.bandwidth() * i + this.left + (this.xScale.bandwidth() - 40) / 2)
                .attr('y', d => this.yScale(d.data))
                .attr('width', 40)
                .attr('height', d => this.bottom - this.yScale(d.data));

            exit
                .remove();

            let drag = d3.drag();
            this.elements.focus
                .call(drag
                    .on('drag', () => {
                        let {paths, xAxis} = this.elements;
                        let scrollX = this.scrollX + d3.event.dx;
                        this.scrollX = Math.max(-(this.dataWidth - this.innerWidth - this.left), Math.min(0, scrollX));
                        paths
                            .selectAll('rect')
                            .attr('transform', `translate(${this.scrollX}, 0)`);
                        xAxis
                            .attr('transform', `translate(${this.scrollX}, ${this.bottom})`);
                    })
                );

            this.calculateAxis();
        },
        calculateAxis() {
            let {xAxis, yAxis} = this.elements;
            xAxis
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(this.duration)
                .call(d3.axisBottom(this.xScale));

            yAxis
                .attr('transform', `translate(${this.left}, 0)`)
                .transition()
                .duration(this.duration)
                .call(d3.axisLeft(this.yScale));
        },
        opacityFocus(opacity) {
            let {focus, tooltip} = this.elements;
            focus
                .transition()
                .duration(this.duration / 2)
                .attr('opacity', opacity || 0);
            tooltip
                .transition()
                .duration(this.duration / 2)
                .style('opacity', opacity || 0);
        },
        inventFocus(e) {
            if (this.screen.length === 0) return;

            let scaleX = this.xScale;

            let mouseX = e.layerX - this.left,
                index = ((mouseX - this.scrollX) / scaleX.bandwidth());
            let data = this.screen[index | 0];
            this.tooltip = {
                title: data.name,
                desc: [{
                    name: '',
                    value: data.data,
                    color: data.color
                }]
            };

            this.tooltip.tipX = e.layerX + 20;
            this.tooltip.tipY = e.layerY;
        },
        initializeBar() {
            if (this.screen.length === 0) return;
            let wrap = d3.select(this.$refs.bar);
            Object.keys(this.$refs).forEach(d => this.elements[d] = wrap.select(`.${d}`));
            this.inventBar();
        },
        updateView(index) {
            let {paths, legend} = this.elements;
            this.exclude = this.exclude.map((item, i) => {
                return index === i ? !item : item;
            });
            legend
                .selectAll('g')
                .each((d, i, t) => {
                    let lg = d3
                        .select(t[i])
                        .transition()
                        .duration(this.duration);
                    lg
                        .select('rect')
                        .attr('fill', () => {
                            return this.exclude[i] ? '#ddd' : this.series[i].color;
                        });
                    lg
                        .select('text')
                        .attr('fill', () => {
                            return this.exclude[i] ? '#ddd' : '#000';
                        });
                });

            paths
                .transition()
                .duration(this.duration)
                .attr('opacity', this.screen.length === 0 ? 0 : 1);

            if (this.screen.length > 0) {
                this.inventBar();
            }
        }
    },
    watch: {
        data() {
            this.$nextTick(() => {
                if (!this.init) {
                    this.exclude = new Array(this.series.length).fill(false);
                    this.initializeBar();
                    this.init = true;
                } else {
                    this.inventBar();
                }
                this.$emit('update:refresh', false);
            });
        }
    }
};
</script>

<style scoped>
.bar svg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.bar line {
    shape-rendering: crispEdges;
}

.bar {
    position: relative;
    height: 100%;
}

.bar .axis path,
.bar .axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.bar .legend g {
    cursor: pointer;
    font-size: 12px;
}

.bar .legend g circle {
    fill: #fff;
}

.bar .legend g rect {
    width: 13px;
    height: 13px;
}

.bar .focus rect {
    fill: none;
    pointer-events: all;
}

.bar .focus line {
    stroke: #666;
    stroke-dasharray: 2, 1;
    pointer-events: none;
}

.bar .focus circle {
    stroke: #333;
    pointer-events: none;
}
</style>
