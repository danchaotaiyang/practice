import {select, scaleLinear, max, extent, line} from 'd3';

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
        fill: {
            type: String,
            default: 'none'
        },
        stroke: {
            type: String,
            default: '#000000'
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        _scale() {
            const x = scaleLinear().range([0, this.width]);
            const y = scaleLinear().range([0, this.height]);
            x.domain(extent(this.data, (d, i) => i));
            y.domain([0, max(this.data, d => d)]);
            return {x, y};
        },
        _calculateLine() {
            let {x, y} = this._scale();
            let path = line()
                .x((d, i) => x(i))
                .y((d) => y(d));
            return path(this.data);
        },
        _calculateSvg() {
            const $svg = select(this.$refs.svg);
            ['width', 'height'].forEach(i => {
                this[i] && $svg.attr(i, this[i]);
            });
        },
        _calculatePath() {
            const $path = select(this.$refs.path);
            ['fill', 'stroke'].forEach(i => {
                this[i] && $path.attr(i, this[i]);
            });
            $path.attr('d', this._calculateLine());
        }
    },
    render: h => {
        return h('div', {ref: 'line'}, [
            h('svg', {ref: 'svg'}, [
                h('g', {ref: 'g'}, [
                    h('path', {ref: 'path'})
                ])
            ])
        ]);
    },
    mounted() {
        this._calculateSvg();
        this._calculatePath();
    },
    watch: {
        data() {
            this._calculatePath();
        }
    }
}
