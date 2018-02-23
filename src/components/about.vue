<template>
<div>
    关于
    <chart-line class="line-bottom" :data="data" :width="width" height="19" stroke="#cccccc"></chart-line>
    <div class="drags">
        <div class="draggable" v-draggable:absolute.random>可以拖拽</div>
    </div>
    <hunt v-draggable:fixed.center></hunt>
</div>
</template>

<script>
import ChartLine from '@/basic/chartLine';
import Hunt from '@/components/hunt';
export default {
    components: {ChartLine, Hunt},
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
    background-color: #f60;
    color: #fff;
}

</style>
