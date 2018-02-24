<template>
<div class="linearWrap" ref="linearWrap">
    <svg ref="svg" :width="width" :height="height">
        <g class="view" ref="view">
            <g class="paths" ref="paths"></g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
            <g class="focus" ref="focus" opacity="0">
                <rect :x="left" :y="top" :width="innerWidth" :height="innerHeight"></rect>
                <line :x1="focus.focusX" :y1="top" :x2="focus.focusX" :y2="bottom"></line>
                <g v-for="(item, index) in series" :opacity="exclude[index] ? 0 : 1">
                    <line :x1="left" :y1="focus.focusY[index]" :x2="focus.focusX" :y2="focus.focusY[index]"></line>
                    <circle :cx="focus.focusX" :cy="focus.focusY[index]" :fill="colors[index]" r="4" stroke-width="1.5"></circle>
                </g>
            </g>
        </g>
        <g class="legend" ref="legend" :transform="`translate(${legend.x}, ${legend.y})`">
            <g v-for="(d, i) in legend.data" :transform="`translate(${i * legendWidth % clientWidth}, ${((i * legendWidth / width) | 0) * 22})`" @click="updateView(i)">
                <line x1="0" y1="6" x2="16" y2="6" :stroke="colors[i]" stroke-width="1.5"></line>
                <circle cx="8" cy="6" r="4" :stroke="colors[i]" stroke-width="1.5"></circle>
                <text class="legendText" x="20" y="11">{{d}}</text>
            </g>
        </g>
        <defs>
            <clipPath id="clipPath">
                <rect :width="innerWidth + 2" :height="innerHeight" :x="left" :y="top"></rect>
            </clipPath>
        </defs>
    </svg>
    <tool-tip ref="tooltip" :data="tooltip" :exclude="exclude" :colors="colors"></tool-tip>
</div>
</template>

<script>
import ToolTip from '@/components/tooltip';
import * as d3 from 'd3';
import {colors} from '@/components/colors';

export default {
    components: {ToolTip},
    data() {
        return {
            default: {
                margin: {top: 40, right: 30, bottom: 30, left: 30},
                duration: 400,
                curve: 'curveLinear'
            },
            exclude: [],
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
        config() {
            let config = {};
            let {margin, curve, duration, colors} = this.data;
            if (margin) {
                config.margin = margin;
            }
            if (curve) {
                config.curve = curve;
            }
            if (duration) {
                config.duration = duration;
            }
            if (colors) {
                config.colors = colors;
            }
            return Object.assign({}, this.default, config);
        },
        duration() {
            return this.config.duration;
        },
        colors() {
            let color = this.config.colors || [];
            return [...color, ...colors];
        },
        clientWidth() {
            return this.width || this.$refs.linearWrap.clientWidth;
        },
        clientHeight() {
            return this.height || this.$refs.linearWrap.clientHeight;
        },
        innerWidth() {
            return this.right - this.left + 1;
        },
        innerHeight() {
            return this.bottom - this.top + 2;
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
        legend() {
            return this.data.legend;
        },
        series() {
            return this.data.series;
        },
        screen() {
            let data = [];
            this.series.forEach((d, i) => !this.exclude[i] && data.push(d));
            return data;
        },
        datum() {
            return d3.merge(this.screen.map(item => item.data));
        },
        domainX() {
            return d3.extent(this.datum, d => d.label);
        },
        domainY() {
            return d3.extent(this.datum, d => d.value);
        },
        scaleX() {
            let scale;
            switch (this.data.xAxis.type) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.left, this.right]).domain(this.domainX);
        },
        scaleY() {
            let scale;
            switch (this.data.yAxis.type) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.bottom, this.top]).domain(this.domainY);
        },
        lineFrom() {
            return d3.line()
                .x(d => this.scaleX(d.label))
                .y(this.bottom);
        },
        lineTo() {
            return d3.line()
                .x(d => this.scaleX(d.label))
                .y(d => this.scaleY(d.value))
                .curve(d3[this.config.curve]);
        },
        legendWidth() {
            let lwp = this.config.legendWidth;
            let max = d3.max(this.data.legend.data, d => d.length);
            return lwp ? (this.clientWidth * lwp) / 100 : max * 20;
        }
    },
    methods: {
        inventLines() {
            d3
                .select(this.$refs.paths)
                .selectAll('path')
                .remove();

            let lines = d3
                .select(this.$refs.paths)
                .selectAll('path')
                .data(this.series);

            let enter = lines.enter();
            let exit = lines.exit();

            enter
                .append('path')
                .datum(d => d.data)
                .attr('fill', 'none')
                .attr('stroke', (d, i) => this.colors[i])
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
            d3
                .select(this.$refs.axisX)
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(this.duration)
                .call(d3.axisBottom(this.scaleX));

            d3
                .select(this.$refs.axisY)
                .attr('transform', `translate(${this.left}, 0)`)
                .transition()
                .duration(this.duration)
                .call(d3.axisLeft(this.scaleY));
        },
        inventFocus() {
            let that = this;
            let focusGroup = d3.select(this.$refs.focus);

            let tips = d3.select(this.$refs.tips);

            const opacity = (opacity) => {
                focusGroup
                    .transition()
                    .duration(this.duration / 2)
                    .attr('opacity', opacity || 0);
                tips
                    .transition()
                    .duration(this.duration / 2)
                    .style('opacity', opacity || 0);
            };

            let dateFormat = d3.timeFormat(this.data.xAxis.format);

            focusGroup
                .on('mouseover', () => {
                    this.screen.length && opacity(1);
                })
                .on('mouseout', opacity)
                .on('mousemove', function () {

                    if (that.screen.length === 0) return;

                    let scaleX = that.scaleX,
                        scaleY = that.scaleY;

                    let mouseX = d3.mouse(this)[0],
                        x0 = scaleX.invert(mouseX);

                    let data = that.screen[0].data,
                        bisect = d3.bisector(d => d.label).left;

                    let index = bisect(data, x0),
                        x1 = data[index].label;

                    that.focus.focusX = scaleX(x1);

                    that.focus.focusY = that.series.map((d, i) => {
                        let y1 = d.data[index].value;
                        that.tooltip.desc[i] = {
                            name: that.exclude[i] ? '--' : d.name,
                            value: that.exclude[i] ? '--' : d.data[index].value
                        };
                        return scaleY(y1);
                    });

                    that.tooltip.tipX = d3.event.layerX + 20;
                    that.tooltip.tipY = d3.event.layerY;

                    that.tooltip.title = dateFormat(new Date(x0).getTime() + 86400000);
                });
        },
        initializeLine() {
            if (this.screen.length === 0) return;
            this.inventFocus();
            this.inventLines();
            this.calculateAxis();
        },
        updateView(index) {
            this.exclude = this.exclude.map((item, i) => {
                return index === i ? !item : item;
            });

            d3
                .select(this.$refs.paths)
                .transition()
                .duration(this.duration)
                .attr('opacity', this.screen.length === 0 ? 0 : 1);

            d3
                .select(this.$refs.legend)
                .selectAll('g')
                .each((d, i, t) => {
                    let lg = d3
                        .select(t[i]);
                    lg
                        .select('line')
                        .transition()
                        .duration(this.duration)
                        .attr('stroke', () => {
                            return this.exclude[i] ? '#ddd' : this.colors[i];
                        });
                    lg
                        .select('circle')
                        .transition()
                        .duration(this.duration)
                        .attr('stroke', () => {
                            return this.exclude[i] ? '#ddd' : this.colors[i];
                        });
                    lg
                        .select('text')
                        .transition()
                        .duration(this.duration)
                        .attr('fill', () => {
                            return this.exclude[i] ? '#ddd' : null;
                        });
                });

            if (this.screen.length > 0) {
                d3
                    .select(this.$refs.paths)
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
    watch: {
        data() {
            this.$nextTick(() => {
                if (!this.init) {
                    this.exclude = new Array(this.series.length).fill(false);
                    this.initializeLine();
                    this.init = true;
                } else {
                    this.inventLines();
                }
                this.$emit('update:refresh', false);
            });
        }
    }
};
</script>

<style>
.linearWrap svg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.linearWrap line {
    shape-rendering: crispEdges;
}

.linearWrap {
    position: relative;
    height: 100%;
}

.linearWrap .axis path,
.linearWrap .axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.linearWrap .legend g {
    cursor: pointer;
    font-size: 12px;
}

.linearWrap .legend g circle {
    fill: #fff;
}

.linearWrap .legend g rect {
    width: 12px;
    height: 12px;
}

.linearWrap .focus rect {
    fill: none;
    pointer-events: all;
}

.linearWrap .focus line {
    stroke: #666;
    stroke-dasharray: 2, 1;
    pointer-events: all;
}

.linearWrap .focus circle {
    stroke: #333;
}
</style>
