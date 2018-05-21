<template>
<div class="pie" ref="pie">
    <svg ref="svg" :width="width" :height="height">
        <g class="view" ref="view">
            <g class="paths" ref="paths"></g>
            <g class="focus" ref="focus" opacity="0">
<!--
                <circle v-for="(item, index) in series"
                        :cx="pie.piePorintX + pie.pieWidth * index"
                        :cy="pie.piePorintY" :r="pie.pieOR" @mouseover="opacityFocus(1)" @mouseout="opacityFocus(0)"></circle>
                <circle v-if="childData.length"
                        :cx="pie.piePorintX + pie.pieWidth"
                        :cy="pie.piePorintY" :r="pie.pieOR" @mouseover="opacityFocus(1)" @mouseout="opacityFocus(0)"></circle>
-->
            </g>
        </g>
        <g class="legend" ref="legend" :transform="`translate(${legend.x}, ${legend.y})`">
            <g v-for="(d, i) in legend.data" :transform="`translate(${i * legendTickWidth % legendClientWidth}, ${((i * legendTickWidth / legendClientWidth) | 0) * 22})`" @click="updateView(i)">
                <rect rx="2" ry="2" :fill="colors[i]"></rect>
                <text class="legendText" x="18" y="11" fill="#000">{{d}}</text>
            </g>
        </g>
        <defs>
            <clipPath id="clipPath">
                <rect :width="innerWidth" :height="innerHeight" :x="left" :y="top"></rect>
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
            return this.data.series;
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
            return this.width || this.$refs.pie.clientWidth;
        },
        clientHeight() {
            return this.height || this.$refs.pie.clientHeight;
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
        legendTickWidth() {
            let lwp = this.config.legendWidth;
            let max = d3.max(this.legend.data, d => d.length);
            return lwp ? (this.clientWidth * lwp) / 100 : max * 12 + 40;
        },
        legendClientWidth() {
            return ((this.innerWidth / this.legendTickWidth) | 0) * this.legendTickWidth;
        }
    },
    methods: {
        inventPie() {
            let arc = d3.arc();
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
        inventFocus() {
            let that = this;
            this.elements.focus
                .on('mousemove', function () {

                    if (that.screen.length === 0) return;

                    let scaleX = that.scaleX,
                        scaleY = that.scaleY;

                    let mouseX = d3.mouse(this)[0] - 2 | 0,
                        x0 = scaleX.invert(mouseX);

                    let data = that.screen[0].data,
                        bisect = d3.bisector(d => d.label).left;

                    let index = bisect(data, x0),
                        x1 = data[index].label;

                    that.focus.focusX = scaleX(x1);

                    that.focus.focusY = that.series.map((d, i) => {
                        let y1 = d.data[index].value;
                        that.tooltip.desc[i] = {
                            title: that.exclude[i] ? '--' : d.name,
                            value: that.exclude[i] ? '--' : d.data[index].value
                        };
                        return scaleY(y1);
                    });

                    that.tooltip.tipX = d3.event.layerX + 20;
                    that.tooltip.tipY = d3.event.layerY;

                    that.tooltip.title = dateFormat(new Date(x0).getTime() + 86400000);
                });
        },
        initializePie() {
            if (this.screen.length === 0) return;
            // this.inventFocus();
            this.inventPie();
        },
        updateView(index) {
            let {legend} = this.elements;
            console.log(legend);
            this.exclude = this.exclude.map((item, i) => {
                return index === i ? !item : item;
            });

            legend
                .selectAll('g')
                .each((d, i, t) => {
                    console.log(t);
                    let lg = d3
                        .select(t[i])
                        .transition()
                        .duration(this.duration);
                    lg
                        .select('rect')
                        .attr('fill', () => {
                            return this.exclude[i] ? '#ddd' : this.colors[i];
                        });
                    lg
                        .select('text')
                        .attr('fill', () => {
                            return this.exclude[i] ? '#ddd' : '#000';
                        });
                });
        }
    },
    mounted() {
        let wrap = d3.select(this.$refs.pie);
        Object.keys(this.$refs).forEach(d => this.elements[d] = wrap.select(`.${d}`));
    },
    watch: {
        data() {
            this.$nextTick(() => {
                if (!this.init) {
                    this.exclude = new Array(this.series[0].data.length).fill(false);
                    this.initializePie();
                    this.init = true;
                } else {
                    this.inventPie();
                }
                this.$emit('update:refresh', false);
            });
        }
    }
};
</script>

<style>
.pie svg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.pie line {
    shape-rendering: crispEdges;
}

.pie {
    position: relative;
    height: 100%;
}

.pie .axis path,
.pie .axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.pie .legend g {
    cursor: pointer;
    font-size: 12px;
}

.pie .legend g circle {
    fill: #fff;
}

.pie .legend g rect {
    width: 13px;
    height: 13px;
}

.pie .focus rect {
    fill: none;
    pointer-events: all;
}

.pie .focus line {
    stroke: #666;
    stroke-dasharray: 2, 1;
    pointer-events: none;
}

.pie .focus circle {
    stroke: #333;
    pointer-events: none;
}
</style>
