<template>
<div>
    关于
    <chart-line class="line-bottom" :data="data" :width="width" height="19" stroke="#cccccc"></chart-line>
</div>
</template>

<script>
import chartLine from '@/basic/chartLine';
export default {
    components: {chartLine},
    data() {
        return {
            width: 600,
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
path {
    fill: none;
    stroke: #76BF8A;
}

</style>
