<template>
<div class="lines" ref="lines">
    <svg ref="svg">
        <g class="legend" ref="legend">
            <g v-for="(item, index) in data" :transform="`translate(${index * item.title.length * 20}, 0)`" @click="updateLegend(index)">
                <rect width="12" height="12" rx="2" ry="2" :fill="colors[index]"></rect>
                <text class="legendText" x="15" y="11">{{item.title}}</text>
            </g>
        </g>
        <g class="view" ref="view">
            <g class="paths" ref="paths">
                <path></path>
            </g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
            <g class="focus" ref="focus">
                <rect fill="none" :x="left" :y="top" :width="innerWidth" :height="innerHeight"></rect>
                <line class="focusLine" stroke="#999999" :x1="focusX" :y1="top" :x2="focusX" :y2="bottom"></line>
                <circle v-for="(item, index) in data" class="focusCircle" :cx="focusX" :cy="focusY[index]" :opacity="exclude[index] ? 0 : 1" r="6"
                        fill="#ffffff" :stroke="colors[index]" stroke-width="1.5"></circle>
            </g>
        </g>
    </svg>
    <div class="tooltip" ref="tooltip" :style="{left: `${tipX}px`, top: `${tipY}px`}">
        <div class="title" ref="title">{{title}}</div>
        <ul class="desc" ref="desc">
            <li v-for="(item, index) in data" v-show="!exclude[index]"><em :style="{'background': colors[index]}"></em><span>{{item.title}}</span><strong>{{desc[index]}}</strong></li>
        </ul>
    </div>
</div>
</template>

<script>
import * as d3 from 'd3';
import { colors } from '@/components/colors';

const dateFormat = d3.timeFormat('%Y-%m-%d');

let exclude = [];

const defaults = {
    margin: { top: 35, right: 30, bottom: 30, left: 30 },
    domainType: 'number',
    duration: 400,
    curve: 'curveLinear'
};

export default {
    data() {
        return {
            init: false,
            defaults, exclude,
            focusX: 0,
            focusY: [],
            tipX: 0,
            tipY: 0,
            title: ''
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
            return Object.assign({}, colors, this.config.colors);
        },
        clientWidth() {
            return this.width !== 0 ? this.width : this.$refs.lines.clientWidth;
        },
        clientHeight() {
            return this.height !== 0 ? this.height : this.$refs.lines.clientHeight;
        },
        innerWidth() {
            return this.right - this.left;
        },
        innerHeight() {
            return this.bottom - this.top;
        },
        margin() {
            return this.config.margin;
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
        dataFormat() {
            return this.data.map((i) => {
                if (this.config.domainType === 'time') {
                    i.list.forEach(o => o.label = new Date(o.label));
                }
                return i;
            });
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
        desc() {
            return new Array(this.data.length).fill(0);
        }
    },
    methods: {
        initializeLine() {
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

            if (this.screen.length === 0) return;
            this.inventLegend();
            this.inventPaths();
            this.inventFocus();
            this.calculationAxis();
        },
        inventLegend() {
            /*
                  let legend = d3
                         .select(this.$refs.legend)
                         .attr('transform', `translate(8, ${this.top - 27})`)
                         .selectAll('g')
                      .data(this.screen);

         /*
                     let enter = legend.enter();
                     let exit = legend.exit();

                     let group = enter
                         .append('g')
                         .style('cursor', 'pointer')
                         .attr('transform', (d, i) => {
                             return `translate(${i * (d.title.length * 18)}, 0)`;
                         })
                         .on('click', (d, i) => {
                             this.exclude = this.status().map((item, index) => {
                                 return index === i ? !item : item;
                             });
                             this.updateSVG();
                         });

                     group
                         .append('rect')
                         .attr('width', 12)
                         .attr('height', 12)
                         .attr('rx', 2)
                         .attr('ry', 2)
                         .attr('fill', (d, i) => this.colors[i]);

                     group
                         .append('text')
                         .attr('class', 'legendText')
                         .attr('x', 15)
                         .attr('y', 11)
                         .style('font-size', 12)
                         .text(d => d.title);

                     exit
                         .attr('opacity', 1)
                         .transition()
                         .duration(this.duration)
                         .attr('opacity', 0)
                         .remove();
         */
        },
        inventPaths() {
            d3
                .select(this.$refs.paths)
                .selectAll('path')
                .remove();

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
                .attr('stroke', (d, i) => this.colors[i])
                .attr('stroke-width', 1.5)
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
        },
        inventFocus() {
            let that = this;
            let focusGroup = d3.select(this.$refs.focus);

            let tooltip = d3
                .select(this.$refs.tooltip);

            const opacity = (opacity) => {
                focusGroup
                    .transition()
                    .duration(this.duration / 2)
                    .attr('opacity', opacity || 0);
                tooltip
                    .transition()
                    .duration(this.duration / 2)
                    .style('opacity', opacity || 0);
            };

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

                    that.focusX = scaleX(x1);

                    that.focusY = that.data.map((d, i) => {
                        let y1 = d.list[index].value;
                        that.desc[i] = that.exclude[i] ? '--' : d.list[index].value;
                        return scaleY(y1);
                    });

                    that.tipX = d3.event.pageX - that.left;
                    that.tipY = d3.event.pageY - that.top;

                    that.title = dateFormat(new Date(x0).getTime() + 86400000);
                });
        },
        calculationAxis() {
            d3
                .select(this.$refs.axisX)
                .attr('transform', `translate(0, ${this.bottom})`)
                .transition()
                .duration(this.duration)
                .call(d3.axisBottom(this.scaleX));
            // .call(d3.axisBottom(this.scaleX).ticks(d3.timeDay.every(1)));

            d3
                .select(this.$refs.axisY)
                .attr('transform', `translate(${this.left}, 0)`)
                .transition()
                .duration(this.duration)
                .call(d3.axisLeft(this.scaleY));
        },
        updateLegend(idx) {
            this.exclude = this.exclude.map((item, index) => {
                return index === idx ? !item : item;
            });
            d3
                .select(this.$refs.view)
                .transition()
                .duration(this.duration)
                .attr('opacity', this.screen.length ? 1 : 0);

            d3
                .select(this.$refs.legend)
                .selectAll('g')
                .each((data, index, nodes) => {
                    let lg = d3
                        .select(nodes[index]);
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
                this.calculationAxis();

            }
        }

    },
    mounted() {
        console.log(this.refresh);
    },
    watch: {
        data() {
            console.log(this.data);
            if (!this.init) {
                this.exclude = new Array(this.data.length).fill(false);
                this.initializeLine();
                this.init = true;
            } else {
                this.inventPaths();
                this.inventFocus();
            }
        }
    }
};
</script>

<style scoped>
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
}

.legend g text {
    font-size: 12px;
}

.focus rect {
    pointer-events: all;
}

.tooltip {
    position: absolute;
    top: 100px;
    left: 100px;
    z-index: 500;
    background-color: #f6f6f6;
    border: 1px solid #ccc;
    opacity: 0;
    white-space: nowrap;
    -webkit-border-radius: 4px;
    border-radius: 4px;
}

.tooltip .title {
    padding: 4px 8px;
    border-bottom: 1px solid #ccc;
    font-size: 14px;
}

.tooltip .desc {
    margin: 0;
    padding: 4px;
    list-style: none;
    justify-content: space-between;
}

.tooltip .desc li {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    padding: 2px;
    font-size: 12px;
}

.tooltip .desc li em {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
}

.tooltip .desc li span {
    display: inline-block;
    font-size: 12px;
}

.tooltip .desc li strong {
    -webkit-flex: 1;
    flex: 1;
    min-width: 2em;
    margin-left: 18px;
    font-size: 14px;
    text-align: right;
}

</style>
