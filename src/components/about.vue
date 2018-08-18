<template>
<div>
    关于
    <chart-line class="line-bottom" :data="data" :width="width" height="19" stroke="#cccccc"></chart-line>
    <div class="drags">
        <div class="draggable" v-drag:fixed.random.confine>可以拖拽</div>
        <div class="draggable" v-drag:absolute.random.confine>可以拖拽可以拖拽可以拖拽</div>
        <div class="draggable" v-drag:absolute.random>依然可以拖拽</div>
        <div class="draggable" v-drag:fixed.random>依然可以拖拽</div>
    </div>
    <hunt v-drag:fixed.center></hunt>
    <div class="drags">
        <drag mode="absolute" confine random>
            <div style="color: #ccc">absolute confine random</div>
        </drag>
        <drag mode="absolute" confine >
            <div style="color: #ccc">absolute confine</div>
        </drag>
        <drag mode="absolute">
            <div style="color: #ccc">absolute</div>
        </drag>
        <drag mode="fixed" confine random>
            <div style="color: #ccc">fixed confine</div>
        </drag>
        <drag mode="fixed" confine>
            <div style="color: #ccc">fixed confine</div>
        </drag>
        <drag mode="fixed">
            <div style="color: #ccc">fixed</div>
        </drag>
    </div>
</div>
</template>

<script>
import ChartLine from '@/basic/chartLine';
import Hunt from '@/components/hunt';
import Drag from '@/components/drag';

export default {
    components: {ChartLine, Hunt, Drag},
    data() {
        return {
            width: 600,
            height: 400,
            data: []
        }
    },
    methods: {
        updateData(i) {
            this.data.push(parseInt(i || Math.random() * 100));
        },
    },
    created() {
        let length = this.width / 1.5;
        for (let i = 0; i < length; i++) {
            this.updateData();
        }
        setInterval(() => {
            this.data.shift();
            this.updateData();
        }, 3000);
    },
    mounted() {

    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.drags {
    position: relative;
    width: 600px;
    height: 400px;
    background-color: #333;
    overflow: hidden;
}

.draggable {
    display: block;
    background-color: #f60;
    color: #fff;
}

</style>
