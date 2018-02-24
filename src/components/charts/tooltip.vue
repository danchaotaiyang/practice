<template>
<div class="tooltipWrap" ref="tooltipWrap" :style="{left: `${data.tipX}px`, top: `${data.tipY}px`}">
    <div class="title" ref="title">{{data.title}}</div>
    <ul class="desc" ref="desc">
        <li v-for="(item, index) in data.desc" v-show="!exclude[index]">
            <em :style="{'background': colors[index]}"></em><span>{{item.name}}</span><strong>{{item.value}}</strong>
        </li>
    </ul>
</div>
</template>

<script>
import * as d3 from 'd3';
import {colors} from '@/components/colors';

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
        },  }
};
</script>

<style>
.tooltipWrap {
    position: absolute;
    top: 100px;
    left: 100px;
    z-index: 500;
    background-color: #f9f9f9;
    border: 1px solid #aaa;
    opacity: 0;
    white-space: nowrap;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    pointer-events: none;
}

.tooltipWrap .title {
    padding: 4px 8px;
    border-bottom: 1px solid #aaa;
    font-weight: bold;
    font-size: 14px;
}

.tooltipWrap .desc {
    margin: 0;
    padding: 4px;
    list-style: none;
    justify-content: space-between;
}

.tooltipWrap .desc li {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    padding: 2px;
    font-size: 12px;
}

.tooltipWrap .desc li em {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
}

.tooltipWrap .desc li span {
    display: inline-block;
    font-size: 12px;
}

.tooltipWrap .desc li strong {
    -webkit-flex: 1;
    flex: 1;
    min-width: 2em;
    margin-left: 18px;
    font-size: 14px;
    text-align: right;
}
</style>
