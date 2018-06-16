<template>
<div>
    <div @click="abc" data-tab="a">首页</div>
    <div v-draggable:fixed.confine>aaa</div>
</div>
</template>

<script>
export default {
    methods: {
        abc(e) {
            console.log(e);
        }
    }
};
</script>

<style scoped>
</style>
