<template>
<div class="polygons" ref="polygons">
    <svg ref="svg" :width="clientWidth" :height="clientHeight">
        <g class="web" ref="web">
            <g class="webs" ref="webs"></g>
            <g class="lines" ref="lines"></g>
            <g class="areas" ref="areas"></g>
            <g class="texts" ref="texts"></g>
        </g>
    </svg>
    <tool-tip class="tooltip" ref="tooltip" :data="tooltip"></tool-tip>
</div>
</template>

<script>
import ToolTip from '@/components/charts/tooltip';
import { colors } from '@/components/charts/colors';
import * as d3 from 'd3';

export default {
    components: { ToolTip },
    data() {
        return {
            defaultLegend: {
                type: 'linear',
                x: 10,
                y: 10,
                data: []
            },
            defaultConfig: {
                padding: { top: 40, right: 30, bottom: 30, left: 30 },
                duration: 200
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
            polygons: {
                webs: [],
                webPoints: []
            },
            areasData: [],
            textPoints: []
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
        level: {
            type: Number, default: 4
        }
    },
    computed: {
        fields() {
            return [...this.data.fields];
        },
        values() {
            return [...this.data.values];
        },
        radius() {
            return d3.min([this.innerWidth, this.innerHeight]) / 2;
        },
        total() {
            return this.fields.length;
        },
        config() {
            let config = {};
            let { padding, curve, colors, duration } = this.data;
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
        clientWidth() {
            return this.width || this.$refs.polygons.clientWidth;
        },
        clientHeight() {
            return this.height || this.$refs.polygons.clientHeight;
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
        extent() {
            return [this.innerWidth, this.innerHeight];
        },
        min() {
            return 0;
        },
        max() {
            return d3.min(this.extent);
        },
        arc() {
            return 2 * Math.PI;
        },
        onePiece() {
            return this.arc / this.total;
        }
    },
    methods: {
        initializePolygons() {
            let { web, areas, webs, lines, texts } = this.elements;
            web.attr('transform', `translate(${this.clientWidth / 2}, ${this.clientHeight / 2})`);

            webs
                .selectAll('polygon')
                .data(this.polygons.webs)
                .enter()
                .append('polygon')
                .attr('points', d => d)
                .attr('fill', (d, i) => i % 2 ? '#fff' : '#eee');

            lines
                .selectAll('line')
                .data(this.polygons.webPoints[0])
                .enter()
                .append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', d => d.x)
                .attr('y2', d => d.y)
                .attr('stroke', '#cecece');

            areas
                .selectAll('g')
                .data(this.areasData)
                .enter()
                .append('g')
                .attr('class', (d, i) => `area${i + 1}`);

            for (let i = 0; i < this.areasData.length; i++) {
                let area = areas.select(`.area${i + 1}`);
                let areaData = this.areasData[i];
                area
                    .append('polygon')
                    .attr('points', areaData.polygon)
                    .attr('stroke', () => d3.interpolateSinebow(0.7))
                    .attr('stroke-width', 2)
                    .attr('fill', () => d3.interpolateSinebow(0.7))
                    .attr('fill-opacity', 0.4);

                let circles = web
                    .append('g')
                    .attr('class', 'circles');

                circles
                    .selectAll('circle')
                    .data(areaData.points)
                    .enter()
                    .append('circle')
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', 5)
                    .attr('stroke', d3.interpolateSinebow(0.7))
                    .attr('stroke-width', 2)
                    .attr('fill', '#fff');
            }
            texts
                .selectAll('text')
                .data(this.textPoints)
                .enter()
                .append('text')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .text((d, i) => this.fields[i])
                .style('text-anchor', 'middle');
        },
    },
    created() {
        for (let k = this.level; k > 0; k--) {
            let webs = '';
            let webPoints = [];
            let r = this.radius / this.level * k;
            for (let i = 0; i < this.total; i++) {
                let x = r * Math.sin(i * this.onePiece) + Math.sin(360 / this.total / 2),
                    y = r * Math.cos(i * this.onePiece) + Math.cos(360 / this.total / 2);
                webs += `${x}, ${y} `;
                webPoints.push({ x, y });
            }
            this.polygons.webs.push(webs);
            this.polygons.webPoints.push(webPoints);
        }
        for (let i = 0; i < this.values.length; i++) {
            let value = this.values[i];
            let area = '';
            let points = [];
            for (let k = 0; k < this.total; k++) {
                let r = this.radius * (value[k] - this.min) / (this.max - this.min);
                let x = r * Math.sin(k * this.onePiece) + Math.sin(360 / this.total / 2);
                let y = r * Math.cos(k * this.onePiece) + Math.cos(360 / this.total / 2);
                area += `${x}, ${y} `;
                points.push({ x, y });
            }
            this.areasData.push({
                polygon: area,
                points
            });
        }
        let textRadius = this.radius + 20;
        for (let ii = 0; ii < this.total; ii++) {
            let x = textRadius * Math.sin(ii * this.onePiece);
            let y = textRadius * Math.cos(ii * this.onePiece);
            this.textPoints.push({ x, y });
        }
    },
    mounted() {
        let wrap = d3.select(this.$refs.polygons);
        Object.keys(this.$refs).forEach(d => this.elements[d] = wrap.select(`.${d}`));
        this.initializePolygons();
    }
};
</script>

<style scoped>
.polygons svg {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.polygons polygon {
    fill: white;
    fill-opacity: 0.5;
    stroke: gray;
}

.polygons {
    position: relative;
    height: 100%;
}

.polygons polygon,
.polygons line {
    shape-rendering: crispEdges;
}

.polygons .legend g {
    cursor: pointer;
    font-size: 12px;
}

.polygons .legend g circle {
    fill: #fff;
}

.polygons .legend g rect {
    width: 12px;
    height: 12px;
}

.polygons .focus rect {
    fill: none;
    pointer-events: all;
}

.polygons .focus line {
    stroke: #666;
    stroke-dasharray: 2, 1;
    pointer-events: none;
}

.polygons .focus circle {
    stroke: #333;
    pointer-events: none;
}
</style>
