<template>
<div>
    关于
    <div class="svg">
        <svg ref="svg" :width="width" :height="height">
            <path :d="line"></path>
        </svg>
    </div>
    <div class="find" v-show="find">

    </div>
</div>
</template>

<script>
import {line, scaleLinear, max, extent} from 'd3';

export default {
    data() {
        return {
            width: 100,
            height: 20,
            length: 60,
            data: [],
            line: '',
            find: false
        }
    },
    methods: {
        updateData(i) {
            this.data.push(parseInt(i || Math.random() * 100));
        },
        _scale() {
            const x = scaleLinear().range([0, this.width]);
            const y = scaleLinear().range([0, this.height]);
            x.domain(extent(this.data, (d, i) => i));
            y.domain([0, max(this.data, d => d)]);
            return {x, y};
        },
        _calculatePath() {
            let {x, y} = this._scale();
            let path = line()
                .x((d, i) => x(i))
                .y((d) => y(d));
            this.line = path(this.data);
        }
    },
    created() {
        for (let i = 0; i < this.length; i++) {
            this.updateData();
        }
        let ot = 0;
        document.onkeydown = (e) => {
            if (e.shiftKey) {
                let nt = new Date().getTime();
                let ct = nt - ot;
                if (ct > 0 && ct < 600) {
                    console.log(e.keyCode);
                    this.find = true;
                    ot = 0;
                }
                ot = nt;
            }
        };
        document.ondblclick = () => {
            console.log(1);
        }
    },
    mounted() {
        this._calculatePath();
        setInterval(() => {
            this.data.shift();
            this.updateData();
        }, 2000)
    },
    watch: {
        data() {
            this._calculatePath();
        },
        find() {

        }
    }
}
</script>

<style scoped>
path {
    fill: none;
    stroke: #76BF8A;
}
.find {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 30px;
    background-color: #ccc;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    transform: translate(-50%, -50%);
}

</style>
