<template>
<div>
    关于
    <chart-line class="line-bottom" :data="data" :width="width" height="19" stroke="#cccccc"></chart-line>
    <div class="drags">
        <div class="draggable" v-draggable:fixed.random.range>可以拖拽</div>
        <div class="draggable" v-draggable:fixed.random>可以拖拽可以拖拽可以拖拽</div>
    </div>
    <hunt v-draggable:fixed.center></hunt>
    <draggable mode="fixed" :confine="true">
        <div slot="head">
            1
        </div>
        <div>2</div>
    </draggable>
</div>
</template>

<script>
import ChartLine from '@/basic/chartLine';
import Hunt from '@/components/hunt';
import Draggable from '@/components/draggable';
export default {
    components: {ChartLine, Hunt, Draggable},
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
}

.draggable {
    display: block;
    background-color: #f60;
    color: #fff;
}

</style>
