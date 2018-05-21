<template>
<div class="lines" ref="lines">
    <svg ref="svg">
        <g class="legend" ref="legend"></g>
        <g class="view" ref="view">
            <g class="paths" ref="paths"></g>
            <g class="axisX" ref="axisX"></g>
            <g class="axisY" ref="axisY"></g>
            <g class="focus" ref="focus"></g>
        </g>
    </svg>
    <div class="tooltip" ref="tooltip">
        <div class="title" ref="title"></div>
        <ul class="desc" ref="desc"></ul>
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
            defaults, exclude,
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
                i.list.forEach(o => o.label = new Date(o.label));
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
            let legend = d3
                .select(this.$refs.legend)
                .attr('transform', `translate(8, ${this.top - 27})`)
                .selectAll('g')
                .data(this.screen);

            let enter = legend.enter();
            let exit = legend.exit();

            let group = enter
                .append('g')
                .style('cursor', 'pointer')
                .attr('transform', (d, i) => {
                    return `translate(${i * (d.title.length * 18)}, 0)`;
                })
                .on('click', this.updateLegend);

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
            let focusGroup = d3.select(this.$refs.focus).attr('opacity', 0);

            focusGroup
                .append('rect')
                .attr('fill', 'none')
                .style('pointer-events', 'all')
                .attr('x', this.left)
                .attr('y', this.top)
                .attr('width', this.innerWidth)
                .attr('height', this.innerHeight);

            let focusLine = focusGroup
                .append('line')
                .attr('class', 'focusLine')
                .attr('stroke', '#999999');

            let focusCircle = focusGroup
                .selectAll('circle')
                .data(this.screen)
                .enter()
                .append('circle')
                .attr('class', 'focusCircle')
                .attr('r', 6)
                .attr('fill', '#ffffff')
                .attr('stroke', (d, i) => this.colors[i])
                .attr('stroke-width', 1.5);

            let tooltip = d3
                .select(this.$refs.tooltip);

            let title = d3
                .select(this.$refs.title);

            let desc = d3
                .select(this.$refs.desc);

            let li = desc
                .selectAll('li')
                .data(this.screen)
                .enter()
                .append('li')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('justify-content', 'space-between')
                .style('padding', '2px')
                .style('font-size', '12px');

            li
                .append('em')
                .style('display', 'inline-block')
                .style('width', '12px')
                .style('height', '12px')
                .style('margin', '0 4px 0 0')
                .style('background-color', (d, i) => this.colors[i])
                .style('border-radius', '2px');

            li
                .append('span')
                .style('display', 'inline-block')
                .style('font-size', '12px')
                .html((d, i) => this.screen[i].title);

            li
                .append('strong')
                .style('text-align', 'right')
                .style('flex', 1)
                .style('min-width', '2em')
                .style('margin-left', '18px')
                .style('font-size', '14px')
                .style('color', (d, i) => this.colors[i])
                .html('-');

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
                        x1 = data[index].label,
                        focusX = scaleX(x1);

                    focusCircle.each((d, i, t) => {
                        let y1 = d.list[index].value;
                        let focusY = scaleY(y1);
                        d3
                            .select(t[i])
                            .attr('cx', focusX)
                            .attr('cy', focusY);
                    });

                    focusLine
                        .attr('x1', focusX)
                        .attr('y1', that.top)
                        .attr('x2', focusX)
                        .attr('y2', that.bottom);

                    tooltip
                        .style('left', `${d3.event.pageX - that.left}px`)
                        .style('top', `${d3.event.pageY - that.top}px`);

                    title
                        .html(() => {
                            let date = new Date(x0).getTime() + 86400000;
                            return dateFormat(date);
                        });

                    li.each((d, i, t) => {
                        let ii = d3.select(t[i]);
                        ii
                            .select('strong')
                            .html(d => that.exclude[i] ? '--' : d.list[index].value);
                    });
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
        updateSVG() {
            d3
                .select(this.$refs.view)
                .transition()
                .duration(this.duration)
                .attr('opacity', this.screen.length ? 1 : 0);

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

                d3
                    .select(this.$refs.focus)
                    .selectAll('circle')
                    .each((d, i, t) => {
                        d3
                            .select(t[i])
                            .transition()
                            .duration(this.duration)
                            .attr('opacity', this.exclude[i] ? 0 : 1);
                    });

                d3
                    .select(this.$refs.tooltip)
                    .selectAll('li')
                    .each((d, i, t) => {
                        let li = d3.select(t[i]);

                        li
                            .style('display', this.exclude[i] ? 'none' : 'flex');

                        li
                            .select('em')
                            .style('background-color', this.exclude[i] ? '#ccc' : this.colors[i]);
                        li
                            .select('span')
                            .style('color', this.exclude[i] ? '#ccc' : null);
                        li
                            .select('strong')
                            .style('color', this.exclude[i] ? '#ccc' : this.colors[i]);
                    });
            }

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
        }
    },
    created() {
        this.exclude = new Array(this.dataFormat.length).fill(false);
    },
    mounted() {
        this.initializeLine();
    },
    watch: {
        data() {
            this.exclude = new Array(this.dataFormat.length).fill(false);
        },
        exclude() {
            this.$nextTick(this.updateSVG);
        },
        refresh(state) {
            state && this.$nextTick(this.updateSVG);
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

</style>
