<template>
<div class="line" ref="line"></div>
</template>
<script>
import * as d3 from 'd3';

export default {
    props: {
        width: {
            type: [Number, String],
            default: 100
        },
        height: {
            type: [Number, String],
            default: 50
        },
        lines: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        length() {
            return d3.max(this.lines.map((item) => item.length));
        },
        domain() {
            return [
                d3.min(this.lines.map((item) => d3.min(item))),
                d3.max(this.lines.map((item) => d3.max(item)))
            ];
        },
        top() {
            return 0;
        },
        right() {
            return this.width;
        },
        bottom() {
            return this.height;
        },
        left() {
            return 0;
        },
        scaleX() {
            return d3.scaleLinear().domain([0, this.length]).range([this.left, this.right]);
        },
        scaleY() {
            return d3.scaleLinear().domain(this.domain).range([this.top, this.bottom]);
        },
        line() {
            return d3.line().x(d => this.scaleX(d)).y(d => this.scaleY(d));
        }
    },
    methods: {
        init() {
            this.svg = d3
                .select(this.$refs.line)
                .append('svg')
                .attr('width', this.width)
                .attr('height', this.height);
            this.update = this.svg
                .append('g')
                .attr('width', this.width)
                .attr('height', this.height)
                .selectAll('path')
                .data(this.lines);

            let enter = this.update.enter();
            let exit = this.update.exit();

            enter
                .datum(d => d)
                .append('path')
                .attr('d', this.line);
            exit
                .remove();
        }
    },
    created() {
        console.log(this.lines);
    },
    mounted() {
        this.init();
        console.log(this.domain);
        console.log(this.length);
    },
    watch: {
        lines(line) {
            console.log(line);
        }
    }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
