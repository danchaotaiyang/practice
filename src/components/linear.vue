<template>
<div class="chart lines" ref="chart">
    <svg ref="svg" :width="width" :height="height">
        <g class="view" ref="view">
            <g class="paths" ref="paths"></g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
            <g class="focus" ref="focus" opacity="0">
                <rect :x="left" :y="top" :width="innerWidth" :height="innerHeight"></rect>
                <line :x1="focus.focusX" :y1="top" :x2="focus.focusX" :y2="bottom"></line>
                <g v-for="(item, index) in data" :opacity="exclude[index] ? 0 : 1">
                    <line :x1="left" :y1="focus.focusY[index]" :x2="focus.focusX" :y2="focus.focusY[index]"></line>
                    <circle :cx="focus.focusX" :cy="focus.focusY[index]" :fill="colors[index]" r="4" stroke-width="1.5"></circle>
                </g>
            </g>
        </g>
        <g class="legend" ref="legend" :transform="`translate(10, ${top - 30})`">
            <g v-for="(d, i) in data" :transform="`translate(${i * legendWidth}, ${((i * legendWidth / width) | 0) * 22})`" @click="updateView(i)">
                <rect rx="2" ry="2" :fill="colors[i]"></rect>
                <text class="legendText" x="16" y="11">{{d.title}}</text>
            </g>
        </g>
        <defs>
            <clipPath id="clipPath">
                <rect :width="innerWidth + 2" :height="innerHeight" :x="left" :y="top"></rect>
            </clipPath>
        </defs>
    </svg>
    <div class="tips" ref="tips" :style="{left: `${tooltip.tipX}px`, top: `${tooltip.tipY}px`, opacity: tooltip.opacity}">
        <div class="title" ref="title">{{tooltip.title}}</div>
        <ul class="desc" ref="desc">
            <li v-for="(item, index) in data" v-show="!exclude[index]">
                <em :style="{'background': colors[index]}"></em><span>{{item.title}}</span><strong>{{tooltip.desc[index]}}</strong>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import * as d3 from 'd3';
import {colors} from '@/components/colors';

export default {
    data() {
        return {
            defaults: {
                margin: {top: 40, right: 30, bottom: 30, left: 45},
                domainType: 'number',
                duration: 400,
                curve: 'curveLinear',
                timeFormat: '%Y-%m-%d',
                colors: []
            },
            exclude: [],
            paths: [],
            focus: {
                focusX: 0,
                focusY: [],
            },
            tooltip: {
                title: '',
                desc: [],
                tipX: 0,
                tipY: 0,
                opacity: 0
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
            type: Array, default: () => []
        },
        refresh: {
            type: Boolean, default: false
        },
        options: {
            type: Object, default: () => ({})
        }
    },
    computed: {
        config() {
            return Object.assign({}, this.defaults, this.options);
        },
        colors() {
            return [...this.config.colors, ...colors];
        },
        clientWidth() {
            return this.width !== 0 ? this.width : this.$refs.chart.clientWidth;
        },
        clientHeight() {
            return this.height !== 0 ? this.height : this.$refs.chart.clientHeight;
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
        format() {
            return this.data.map((i) => {
                if (this.config.domainType === 'time') {
                    i.list.forEach(o => o.label = new Date(o.label));
                }
                return i;
            });
        },
        screen() {
            let data = [];
            this.format.forEach((d, i) => !this.exclude[i] && data.push(d));
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
        scaleX() {
            let scale;
            switch (this.config.domainType) {
                case 'time':
                    scale = d3.scaleTime();
                    break;
                default:
                    scale = d3.scaleLinear();
            }
            return scale.range([this.left, this.right]).domain(this.domainX);
        },
        scaleY() {
            return d3
                .scaleLinear()
                .range([this.bottom, this.top])
                .domain(this.domainY);
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
                .curve(d3[this.curve]);
        },
        duration() {
            return this.config.duration;
        },
        curve() {
            return this.config.curve;
        },
        legendWidth() {
            let lwp = this.config.legendWidth;
            let max = d3.max(this.format, d => d.title.length);
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
                .data(this.data);

            let enter = lines.enter();
            let exit = lines.exit();

            enter
                .append('path')
                .datum(d => d.list)
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

            let dateFormat = d3.timeFormat(this.config.timeFormat);

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

                    let data = that.screen[0].list,
                        bisect = d3.bisector(d => d.label).left;

                    let index = bisect(data, x0),
                        x1 = data[index].label;

                    that.focus.focusX = scaleX(x1);

                    that.focus.focusY = that.data.map((d, i) => {
                        let y1 = d.list[index].value;
                        that.tooltip.desc[i] = that.exclude[i] ? '--' : d.list[index].value;
                        return scaleY(y1);
                    });

                    that.tooltip.tipX = d3.event.pageX - that.left;
                    that.tooltip.tipY = d3.event.pageY - that.top;

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
                .select(this.$refs.view)
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
                        .select('rect')
                        .attr('fill', () => {
                            return this.exclude[i] ? '#ddd' : this.colors[i];
                        });
                    lg
                        .select('text')
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

                this.calculateAxis();
            }
        }
    },
    watch: {
        data() {
            this.$nextTick(() => {
                if (!this.init) {
                    this.exclude = new Array(this.format.length).fill(false);
                    this.tooltip.desc = new Array(this.data.length).fill(0);
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
svg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

line {
    shape-rendering: crispEdges;
}

.lines {
    position: relative;
    height: 100%;
}

.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.legend g {
    cursor: pointer;
    font-size: 12px;
}

.legend g rect {
    width: 12px;
    height: 12px;
}

.focus rect {
    fill: none;
    pointer-events: all;
}

.focus line {
    stroke: #666;
    stroke-dasharray: 2, 1;
}

.focus circle {
    stroke: #333;
}

.tips {
    position: absolute;
    top: 100px;
    left: 100px;
    z-index: 500;
    background-color: #f9f9f9;
    border: 1px solid #aaa;
    opacity: 0;
    white-space: nowrap;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    pointer-events: none;
}

.tips .title {
    padding: 4px 8px;
    border-bottom: 1px solid #aaa;
    font-weight: bold;
    font-size: 14px;
}

.tips .desc {
    margin: 0;
    padding: 4px;
    list-style: none;
    justify-content: space-between;
}

.tips .desc li {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    padding: 2px;
    font-size: 12px;
}

.tips .desc li em {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
}

.tips .desc li span {
    display: inline-block;
    font-size: 12px;
}

.tips .desc li strong {
    -webkit-flex: 1;
    flex: 1;
    min-width: 2em;
    margin-left: 18px;
    font-size: 14px;
    text-align: right;
}

</style>
