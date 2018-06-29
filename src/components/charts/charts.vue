<template>
<div class="main-wrap">
    <polygons :data="polygonsData" :width="400" :height="400"></polygons>
    <bar :data="initbardata" :width="1200" :height="300" :refresh.sync="refresh"></bar>
    <bar :data="initbardata" :width="1200" :height="300" :refresh.sync="refresh"></bar>
    <linear :data="initsigndata" :width="1200" :height="300" :refresh.sync="refresh"></linear>
    <button @click="upLineDate">更新折线图</button>
    <button @click="inLineData">替换折线图</button>
    <maps :data="mapsData" :width="1200" :height="600"></maps>
</div>
</template>

<script>
import * as d3 from 'd3';
import Linear from '@/components/charts/linear';
import Bar from '@/components/charts/bar';
import Maps from '@/components/charts/map';
import Polygons from '@/components/charts/polygons';

export default {
    data() {
        return {
            refresh: false,
            lineChanged: false,
            lineData: [],
            lineData1: [
                {
                    title: "资源量",
                    list: [
                        { value: 50, label: '2017/11/18' },
                        { value: 50, label: '2017/11/19' },
                        { value: 80, label: '2017/11/20' },
                        { value: 85, label: '2017/11/21' },
                        { value: 30, label: '2017/11/22' },
                        { value: 50, label: '2017/11/23' },
                        { value: 54, label: '2017/11/24' },
                        { value: 70, label: '2017/11/25' },
                        { value: 46, label: '2017/11/26' },
                        { value: 65, label: '2017/11/27' },
                        { value: 32, label: '2017/11/28' },
                        { value: 48, label: '2017/11/29' },
                        { value: 94, label: '2017/11/30' },
                        { value: 27, label: '2017/12/01' },
                        { value: 73, label: '2017/12/02' },
                        { value: 55, label: '2017/12/03' },
                        { value: 96, label: '2017/12/04' },
                        { value: 41, label: '2017/12/05' },
                        { value: 28, label: '2017/12/06' },
                        { value: 78, label: '2017/12/07' }
                    ]

                }, {
                    title: '当期签约量',
                    list: [
                        { value: 26, label: '2017/11/18' },
                        { value: 40, label: '2017/11/19' },
                        { value: 0, label: '2017/11/20' },
                        { value: 15, label: '2017/11/21' },
                        { value: 5, label: '2017/11/22' },
                        { value: 48, label: '2017/11/23' },
                        { value: 11, label: '2017/11/24' },
                        { value: 0, label: '2017/11/25' },
                        { value: 6, label: '2017/11/26' },
                        { value: 0, label: '2017/11/27' },
                        { value: 30, label: '2017/11/28' },
                        { value: 12, label: '2017/11/29' },
                        { value: 56, label: '2017/11/30' },
                        { value: 7, label: '2017/12/01' },
                        { value: 34, label: '2017/12/02' },
                        { value: 5, label: '2017/12/03' },
                        { value: 6, label: '2017/12/04' },
                        { value: 1, label: '2017/12/05' },
                        { value: 19, label: '2017/12/06' },
                        { value: 22, label: '2017/12/07' }
                    ]
                }, {
                    title: '实际签约量',
                    list: [
                        { value: 29, label: '2017/11/18' },
                        { value: 40, label: '2017/11/19' },
                        { value: 6, label: '2017/11/20' },
                        { value: 19, label: '2017/11/21' },
                        { value: 9, label: '2017/11/22' },
                        { value: 49, label: '2017/11/23' },
                        { value: 18, label: '2017/11/24' },
                        { value: 2, label: '2017/11/25' },
                        { value: 18, label: '2017/11/26' },
                        { value: 2, label: '2017/11/27' },
                        { value: 31, label: '2017/11/28' },
                        { value: 20, label: '2017/11/29' },
                        { value: 57, label: '2017/11/30' },
                        { value: 10, label: '2017/12/01' },
                        { value: 35, label: '2017/12/02' },
                        { value: 25, label: '2017/12/03' },
                        { value: 6, label: '2017/12/04' },
                        { value: 3, label: '2017/12/05' },
                        { value: 21, label: '2017/12/06' },
                        { value: 24, label: '2017/12/07' }
                    ]
                }
            ],
            lineData2: [
                {
                    title: "资源量",
                    list: [
                        { value: 50, label: '2017/11/18' },
                        { value: 50, label: '2017/11/19' },
                        { value: 80, label: '2017/11/20' },
                        { value: 85, label: '2017/11/21' },
                        { value: 30, label: '2017/11/22' },
                        { value: 50, label: '2017/11/23' },
                        { value: 54, label: '2017/11/24' },
                        { value: 70, label: '2017/11/25' },
                        { value: 46, label: '2017/11/26' },
                        { value: 65, label: '2017/11/27' },
                        { value: 32, label: '2017/11/28' },
                        { value: 48, label: '2017/11/29' },
                        { value: 94, label: '2017/11/30' },
                        { value: 27, label: '2017/12/01' },
                        { value: 73, label: '2017/12/02' },
                        { value: 55, label: '2017/12/03' },
                        { value: 96, label: '2017/12/04' },
                        { value: 41, label: '2017/12/05' },
                        { value: 28, label: '2017/12/06' },
                        { value: 78, label: '2017/12/07' }
                    ]

                }, {
                    title: '当期签约量',
                    list: [
                        { value: 26, label: '2017/11/18' },
                        { value: 40, label: '2017/11/19' },
                        { value: 0, label: '2017/11/20' },
                        { value: 15, label: '2017/11/21' },
                        { value: 5, label: '2017/11/22' },
                        { value: 48, label: '2017/11/23' },
                        { value: 11, label: '2017/11/24' },
                        { value: 0, label: '2017/11/25' },
                        { value: 6, label: '2017/11/26' },
                        { value: 0, label: '2017/11/27' },
                        { value: 30, label: '2017/11/28' },
                        { value: 12, label: '2017/11/29' },
                        { value: 56, label: '2017/11/30' },
                        { value: 7, label: '2017/12/01' },
                        { value: 34, label: '2017/12/02' },
                        { value: 5, label: '2017/12/03' },
                        { value: 6, label: '2017/12/04' },
                        { value: 1, label: '2017/12/05' },
                        { value: 19, label: '2017/12/06' },
                        { value: 22, label: '2017/12/07' }
                    ]
                }, {
                    title: '实际签约量',
                    list: [
                        { value: 29, label: '2017/11/18' },
                        { value: 40, label: '2017/11/19' },
                        { value: 6, label: '2017/11/20' },
                        { value: 19, label: '2017/11/21' },
                        { value: 9, label: '2017/11/22' },
                        { value: 49, label: '2017/11/23' },
                        { value: 18, label: '2017/11/24' },
                        { value: 2, label: '2017/11/25' },
                        { value: 18, label: '2017/11/26' },
                        { value: 2, label: '2017/11/27' },
                        { value: 31, label: '2017/11/28' },
                        { value: 20, label: '2017/11/29' },
                        { value: 57, label: '2017/11/30' },
                        { value: 10, label: '2017/12/01' },
                        { value: 35, label: '2017/12/02' },
                        { value: 25, label: '2017/12/03' },
                        { value: 6, label: '2017/12/04' },
                        { value: 3, label: '2017/12/05' },
                        { value: 21, label: '2017/12/06' },
                        { value: 24, label: '2017/12/07' }
                    ]
                }
            ],
            barData: [
                ['小米', 60.8],
                ['三星', 58.4],
                ['联想', 47.3],
                ['苹果', 46.6],
                ['华为', 41.3],
                ['酷派', 40.1],
                ['小米1', 60.8],
                ['三星1', 58.4],
                ['联想1', 47.3],
                ['苹果1', 46.6],
                ['华为1', 41.3],
                ['酷派1', 40.1],
                ['小米2', 60.8],
                ['三星2', 58.4],
                ['联想2', 47.3],
                ['苹果2', 46.6],
                ['华为2', 41.3],
                ['酷派2', 40.1],
                ['其他', 111]
            ],
            initsigndata: {
                legend: {
                    data: []
                },
                xAxis: {
                    type: 'time',
                    format: '%Y-%m-%d'
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            initbardata: {
                legend: {
                    data: []
                },
                xAxis: {
                    type: 'string'
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            barlinedata: {
                xAxis: ['加盟商', '大型活动', '微信', '产品自然量', 'APP', 'QQ', '小程序', '400电话', '官网（澳洲）粉丝通', '百度贴吧', '伯明翰大学', '产品合作', '商务合作', '诺丁汉大学', '个人号', '线下渠道', '微博'],
                data1: [{ title: '当期转化率', list: [{ label: '加盟商', value: 0 }, { label: '大型活动', value: 0 }, { label: '微信', value: 0.06 }, { label: '产品自然量', value: 0 }, { label: 'APP', value: 0.23 }, { label: 'QQ', value: 0.3 }, { label: '小程序', value: 0.1 }, { label: '400电话', value: 0.14 }, { label: '官网（澳洲）粉丝通', value: 0 }, { label: '百度贴吧', value: 0 }, { label: '伯明翰大学', value: 0 }, { label: '产品合作', value: 0 }, { label: '商务合作', value: 0 }, { label: '诺丁汉大学', value: 0 }, { label: '个人号', value: 0 }, { label: '线下渠道', value: 0 }, { label: '微博', value: 0 }] }],
                yAxis1: [0, 1],
                classes1: ['当期转化率'],
                classes: ['注册量', '当期签约量', '实际签约量'],
                data: [{ value: 23, label: '加盟商', class: '注册量' }, { value: 20, label: '大型活动', class: '注册量' }, { value: 17, label: '微信', class: '注册量' }, { value: 13, label: '产品自然量', class: '注册量' }, { value: 13, label: 'APP', class: '注册量' }, { value: 10, label: 'QQ', class: '注册量' }, { value: 10, label: '小程序', class: '注册量' }, { value: 7, label: '400电话', class: '注册量' }, { value: 4, label: '官网（澳洲）粉丝通', class: '注册量' }, { value: 3, label: '百度贴吧', class: '注册量' }, { value: 2, label: '伯明翰大学', class: '注册量' }, { value: 2, label: '产品合作', class: '注册量' }, { value: 2, label: '商务合作', class: '注册量' }, { value: 1, label: '诺丁汉大学', class: '注册量' }, { value: 1, label: '个人号', class: '注册量' }, { value: 1, label: '线下渠道', class: '注册量' }, { value: 1, label: '微博', class: '注册量' }, { value: 1, label: '微信', class: '当期签约量' }, { value: 1, label: '400电话', class: '当期签约量' }, {
                    value: 3,
                    label: 'QQ',
                    class: '当期签约量'
                }, { value: 3, label: 'APP', class: '当期签约量' }, { value: 1, label: '小程序', class: '当期签约量' }, { value: 1, label: '微信', class: '实际签约量' }, { value: 1, label: '400电话', class: '实际签约量' }, { value: 3, label: 'QQ', class: '实际签约量' }, { value: 3, label: 'APP', class: '实际签约量' }, { value: 1, label: '产品自然量', class: '实际签约量' }, { value: 1, label: '小程序', class: '实际签约量' }],
                yAxis: [0, 23]
            },
            mapsData: {
                series: []
            },
            polygonsData: {
                axis: [
                    { label: '语文', max: 150 },
                    { label: '数学', max: 100 },
                    { label: '外语', max: 100 },
                    { label: '物理', max: 100 },
                    { label: '化学', max: 100 },
                ],
                data: [
                    { data: [100, 30, 78, 89, 100], class: '张同学' }
                ]
            },
            barPointsData: {
                "classes": ["咨询数", "在办流程数", "签约数"],
                "data": [{ "value": 28, "label": "马晓岩", "class": "咨询数" }, { "value": 2, "label": "马晓岩", "class": "在办流程数" }, { "value": 2, "label": "马晓岩", "class": "签约数" }, { "value": 21, "label": "杨小萱", "class": "咨询数" }, { "value": 0, "label": "杨小萱", "class": "在办流程数" }, { "value": 1, "label": "杨小萱", "class": "签约数" }, { "value": 31, "label": "袁鑫", "class": "咨询数" }, { "value": 0, "label": "袁鑫", "class": "在办流程数" }, { "value": 0, "label": "袁鑫", "class": "签约数" }, { "value": 6, "label": "汤楠", "class": "咨询数" }, { "value": 1, "label": "汤楠", "class": "在办流程数" }, { "value": 1, "label": "汤楠", "class": "签约数" }, { "value": 26, "label": "琚琼", "class": "咨询数" }, { "value": 3, "label": "琚琼", "class": "在办流程数" }, { "value": 1, "label": "琚琼", "class": "签约数" }, { "value": 3, "label": "马春宇", "class": "咨询数" }, { "value": 8, "label": "马春宇", "class": "在办流程数" }, { "value": 0, "label": "马春宇", "class": "签约数" }],
                "xAxis": ["马晓岩", "杨小萱", "袁鑫", "汤楠", "琚琼", "马春宇"],
                "yAxis": [0, 31],
                "data1": [{ "title": "转化率", "list": [{ "value": 0.07139999999999999, "label": "马晓岩" }, { "value": 0.047599999999999996, "label": "杨小萱" }, { "value": 0, "label": "袁鑫" }, { "value": 0.16670000000000001, "label": "汤楠" }, { "value": 0.0385, "label": "琚琼" }, { "value": 0, "label": "马春宇" }] }],
                "classes1": ["转化率"],
                "yAxis1": [0, 1]
            }
        };
    },
    components: { Linear, Bar, Maps, Polygons },
    computed: {
        datum() {
            return d3.merge(this.data.map(item => item.list));
        }
    },
    methods: {
        formatLinear() {
            let data = this.lineData;
            let legend = Object.assign({}, this.initsigndata.legend);
            let series = data.map((item, index) => {
                let list = item.list.map((v) => {
                    let label = new Date(v.label);
                    let value = v.value;
                    return { label, value };
                });
                legend.data[index] = item.title;
                return {
                    name: item.title, data: list
                };
            });
            return Object.assign({}, this.initsigndata, { legend, series });
        },
        formatBar() {
            let data = this.barData;
            let legend = Object.assign({}, this.initbardata.legend);
            let series = data.map((item, index) => {
                legend.data[index] = item[0];
                return {
                    name: item[0], data: item[1]
                };
            });
            return Object.assign({}, this.initbardata, { legend, series });
        },
        upLineDate() {
            let ary = [57, 81, 99, 112, 36, 36, 26, 91];
            this.lineData = this.lineData.map((item) => {
                let index = Math.random() * ary.length - 1 | 0;
                item.list.forEach((list) => {
                    list.value = (Math.random() * ary[index]) | 0;
                });
                return item;
            });
            this.initsigndata = this.formatLinear();
            this.refresh = true;
        },
        inLineData() {
            this.lineData = this.lineChanged ? this.lineData2 : this.lineData1;
            this.initsigndata = this.formatLinear();
            this.lineChanged = !this.lineChanged;
            this.refresh = true;
        },
        inBarData() {
            this.initbardata = this.formatBar();
            this.refresh = true;
        },
        inMapData() {
            for (let i = 1; i <= 36; i++) {
                this.mapsData.series.push({
                    label: i,
                    value: Math.random() * 100
                });
            }
        },
        inPolygonsData() {

        }
    },
    created() {
        this.inMapData();

    },
    mounted() {
        this.inLineData();
        this.inBarData();
    }
};
</script>

<style scoped>
.main-wrap {
    padding: 50px;
}
</style>
