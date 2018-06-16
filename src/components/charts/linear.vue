<template>
<div class="linear" ref="linear">
    <svg ref="svg" :width="width" :height="height">
        <g class="view" ref="view">
            <g class="paths" ref="paths"></g>
            <g class="xAxis" ref="xAxis"></g>
            <g class="yAxis" ref="yAxis"></g>
        </g>
        <g class="legend" ref="legend" :transform="`translate(${legend.x}, ${legend.y})`">
            <g v-for="(d, i) in legend.data" :transform="`translate(${i * legendWidth % innerWidth}, ${((i * legendWidth / innerWidth) | 0) * 22})`" @click="updateView(i)">
                <line x1="0" y1="6" x2="20" y2="6" :stroke="series[i].color" stroke-width="1.5"></line>
                <circle cx="10" cy="6" r="4" :stroke="series[i].color" stroke-width="1.5"></circle>
                <text class="legendText" x="25" y="11" fill="#000">{{d}}</text>
            </g>
        </g>
        <g class="focus" ref="focus" opacity="0">
            <rect class="rect" ref="rect" :x="left" :y="top" :width="innerWidth" :height="innerHeight" @mouseover="opacityFocus(1)" @mouseout="opacityFocus(0)" @mousemove="inventFocus"></rect>
            <line :x1="focus.xFocus" :y1="top" :x2="focus.xFocus" :y2="bottom"></line>
            <g v-for="(d, i) in series" v-show="!exclude[i]">
                <line :x1="left" :y1="focus.yFocus[i]" :x2="focus.xFocus" :y2="focus.yFocus[i]"></line>
                <circle :cx="focus.xFocus" :cy="focus.yFocus[i]" :fill="series[i].color" r="4" stroke-width="1"></circle>
            </g>
        </g>
        <defs>
            <clipPath id="clipPath">
                <rect :width="innerWidth + 2" :height="innerHeight + 2" :x="left" :y="top - 2"></rect>
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
                type: 'linear',
                x: 10,
                y: 10,
                data: []
            },
            defaultConfig: {
                padding: {top: 40, right: 30, bottom: 30, left: 30},
                duration: 200,
                curve: 'curveLinear'
            },
            elements: {},
            exclude: [],
            focus: {
                xFocus: 0,
                yFocus: [],
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
            let {padding, curve, colors, duration} = this.data;
            if (padding) {
                config.padding = padding;
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
            return this.width || this.$refs.linear.clientWidth;
        },
        clientHeight() {
            return this.height || this.$refs.linear.clientHeight;
        },
        innerWidth() {
            return this.right - this.left;
        },
        innerHeight() {
            return this.bottom - this.top;
        },
        top() {
            return this.config.padding.top;
        },
        right() {
            return this.clientWidth - this.config.padding.right;
        },
        bottom() {
            return this.clientHeight - this.config.padding.bottom;
        },
        left() {
            return this.config.padding.left;
        },
        merge() {
            return d3.merge(this.screen.map(item => item.data));
        },
        xDomain() {
            return d3.extent(this.merge, d => d.label);
        },
        yDomain() {
            return d3.extent(this.merge, d => d.value);
        },
        xScale() {
            let scale;
            switch (this.data.xAxis.type) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.left, this.right]).domain(this.xDomain);
        },
        yScale() {
            let scale;
            switch (this.data.yAxis.type) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.bottom, this.top]).domain(this.yDomain);
        },
        lineFrom() {
            return d3.line()
                .x(d => this.xScale(d.label))
                .y(this.bottom);
        },
        lineTo() {
            return d3.line()
                .x(d => this.xScale(d.label))
                .y(d => this.yScale(d.value))
                .curve(d3[this.config.curve]);
        },
        legendWidth() {
            let lwp = this.config.legendWidth;
            let max = d3.max(this.legend.data, d => d.length);
            return lwp ? (this.innerWidth * lwp) / 100 : max * 12 + 40;
        },
        dateFormat() {
            return d3.timeFormat(this.data.xAxis.format);
        }
    },
    methods: {
        inventLinear() {
            let {paths} = this.elements;
            paths
                .selectAll('path')
                .remove();

            let lines = paths
                .selectAll('path')
                .data(this.series);

            let enter = lines.enter();
            let exit = lines.exit();

            enter
                .append('path')
                .datum(d => d.data)
                .attr('fill', 'none')
                .attr('stroke', (d, i) => this.series[i].color)
                .attr('stroke-width', 1.5)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('clip-path', 'url(#clipPath)')
                .attr('d', this.lineFrom)
                .transition()
                .duration(this.duration)
                .attr('d', this.lineTo)
                .attr('opacity', (d, i) => this.exclude[i] ? 0 : 1);

            exit
                .attr('opacity', 1)
                .transition()
                .duration(this.duration)
                .attr('opacity', 0)
                .remove();

            this.calculateAxis();
        },
        calculateAxis() {
            let {xAxis, yAxis} = this.elements;
            xAxis
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(this.duration)
                .call(d3.axisBottom(this.xScale).tickFormat(d => this.dateFormat(d)));

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

            let xScale = this.xScale,
                yScale = this.yScale;

            let mouseX = e.layerX - 2,
                x0 = xScale.invert(mouseX);

            let data = this.screen[0].data,
                bisect = d3.bisector(d => d.label).left;

            let index = x0 && bisect(data, x0);

            if (index >= data.length) {
                return;
            }

            let x1 = data[index].label;
            this.focus.xFocus = xScale(x1);

            this.focus.yFocus = this.series.map((d, i) => {
                let y1 = d.data[index].value;
                this.tooltip.desc[i] = {
                    name: this.exclude[i] ? '--' : d.name,
                    value: this.exclude[i] ? '--' : d.data[index].value,
                    color: d.color
                };
                return yScale(y1);
            });

            this.tooltip.tipX = e.layerX + 20;
            this.tooltip.tipY = e.layerY;
            this.tooltip.title = this.dateFormat(new Date(x0).getTime() + 86400000);

        },
        initializeLinear() {

            if (this.screen.length === 0) return;

            // this.inventFocus();
            this.inventLinear();
            this.calculateAxis();
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
                        .select('line')
                        .attr('stroke', () => {
                            return this.exclude[i] ? '#ddd' : this.series[i].color;
                        });
                    lg
                        .select('circle')
                        .attr('stroke', () => {
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
                paths
                    .selectAll('path')
                    .each((d, i, t) => {
                        d3
                            .select(t[i])
                            .transition()
                            .duration(this.duration)
                            .attr('opacity', this.exclude[i] ? 0 : 1)
                            .attr('d', this.lineTo);
                    });
            }

            this.calculateAxis();
        }
    },
    mounted() {
        let wrap = d3.select(this.$refs.linear);
        Object.keys(this.$refs).forEach(d => this.elements[d] = wrap.select(`.${d}`));
    },
    watch: {
        data() {
            this.$nextTick(() => {
                if (!this.init) {
                    this.exclude = new Array(this.series.length).fill(false);
                    this.initializeLinear();
                    this.init = true;
                } else {
                    this.inventLinear();
                }
                this.$emit('update:refresh', false);
            });
        }
    }
};
</script>

<style scoped>
.linear svg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.linear line {
    shape-rendering: crispEdges;
}

.linear {
    position: relative;
    height: 100%;
}

.linear .axis path,
.linear .axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.linear .legend g {
    cursor: pointer;
    font-size: 12px;
}

.linear .legend g circle {
    fill: #fff;
}

.linear .legend g rect {
    width: 12px;
    height: 12px;
}

.linear .focus rect {
    fill: none;
    pointer-events: all;
}

.linear .focus line {
    stroke: #666;
    stroke-dasharray: 2, 1;
    pointer-events: none;
}

.linear .focus circle {
    stroke: #333;
    pointer-events: none;
}
</style>
