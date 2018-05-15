<template>
<div class="line">
    <bi-line class="line-bottom" :lines="data" :width="width" :height="height" stroke="#333"></bi-line>
</div>
</template>
<script>
import BiLine from '@/basic/biLine';

export default {
    components: {BiLine},
    data() {
        return {
            width: 600,
            height: 400,
            data: []
        }
    },
    methods: {
        updateData(i) {
            return parseInt(i || Math.random() * 100);
        },
        generate() {
            let line = [];
            let length = (Math.random() * 60) | 0;
            for (let i = 0; i < length; i++) {
                line.push(this.updateData());
            }
            return line;
        }
    },
    created() {
        for (let i = 0; i < 4; i++) {
            this.data.push(this.generate());
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
