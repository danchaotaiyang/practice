<template>
<g class="legend" ref="legend" :transform="`translate(${data.x}, ${data.y})`">
    <g v-if="data.type === 'linear'" v-for="(d, i) in data.data" :transform="`translate(${i * legendWidth % innerWidth}, ${((i * legendWidth / innerWidth) | 0) * 22})`" @click="updateView(i)">
        <line x1="0" y1="6" x2="20" y2="6" :stroke="series[i].color" stroke-width="1.5"></line>
        <circle cx="10" cy="6" r="4" :stroke="series[i].color" stroke-width="1.5"></circle>
        <text class="legendText" x="25" y="11" fill="#000">{{d}}</text>
    </g>
    <g v-if="data.type === 'bar'" v-for="(d, i) in data.data" :transform="`translate(${i * legendTickWidth % legendClientWidth}, ${((i * legendTickWidth / legendClientWidth) | 0) * 22})`" @click="updateView(i)">
        <rect rx="2" ry="2" :fill="series[i].color"></rect>
        <text class="legendText" x="18" y="11" fill="#000">{{d}}</text>
    </g>
</g>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        data: {
            type: Object, default: () => ({})
        },
        colors: {
            type: Array, default: () => ([])
        },
        exclude: {
            type: Array, default: () => ([])
        }
    },
    methods: {
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

            let scaleX = this.xScale;

            let mouseX = e.layerX - this.left,
                index = ((mouseX - this.scrollX) / scaleX.bandwidth()) | 0;
            let data = this.screen[index];
            this.tooltip = {
                title: data.name,
                desc: [{
                    name: '',
                    value: data.data,
                    color: data.color
                }]
            };

            this.tooltip.tipX = e.layerX + 20;
            this.tooltip.tipY = e.layerY;
        },
    }
};
</script>

<style scoped>
.legend g {
    cursor: pointer;
    font-size: 12px;
}

.legend g circle {
    fill: #fff;
}

.legend g rect {
    width: 13px;
    height: 13px;
}
.legend g {
    cursor: pointer;
    font-size: 12px;
}

.legend g circle {
    fill: #fff;
}

.legend g rect {
    width: 12px;
    height: 12px;
}

</style>
