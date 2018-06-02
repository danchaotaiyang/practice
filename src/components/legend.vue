<template>
<g class="legend" ref="legend" :transform="`translate(10, ${top - 30})`">
    <g v-for="(d, i) in data" :transform="`translate(${i * d.title.length * 20}, 0)`" @click="update(i)">
        <rect rx="2" ry="2" :fill="colors[i]"></rect>
        <text class="legendText" x="16" y="11">{{d.title}}</text>
    </g>
</g>
</template>

<script>
export default {
    methods: {
        update(index) {

        }
    }
};
</script>

<style scoped>

</style>
