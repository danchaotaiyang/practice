<template>
<div class="main-wrap">
    <bar :data="initbardata" :width="1200" :height="300" :refresh.sync="refresh"></bar>
    <bar :data="initbardata" :width="1200" :height="300" :refresh.sync="refresh"></bar>
    <linear :data="initsigndata" :width="1200" :height="300" :refresh.sync="refresh"></linear>
    <maps :data="mapsData" :width="1200" :height="600"></maps>
    <button @click="upLineDate">更新折线图</button>
    <button @click="inLineData">替换折线图</button>
</div>
</template>

<script>
import * as d3 from 'd3';
import Linear from '@/components/charts/linear';
import Bar from '@/components/charts/bar';
import Maps from '@/components/charts/map';

export default {
    data() {
        return {
            refresh: false,
            lineChanged: false,
            lineData: [],
            lineData1: [
                {
                    title: '资源量',
                    list: [{
                        value: 0,
                        label: '2017/05/17'
                    }, { value: 6, label: '2017/05/18' }, {
                        value: 0,
                        label: '2017/05/19'
                    }, { value: 0, label: '2017/05/20' }, {
                        value: 0,
                        label: '2017/05/21'
                    }, { value: 0, label: '2017/05/22' }, {
                        value: 0,
                        label: '2017/05/23'
                    }, { value: 0, label: '2017/05/24' }, {
                        value: 2,
                        label: '2017/05/25'
                    }, { value: 0, label: '2017/05/26' }, {
                        value: 0,
                        label: '2017/05/27'
                    }, { value: 0, label: '2017/05/28' }, {
                        value: 0,
                        label: '2017/05/29'
                    }, { value: 0, label: '2017/05/30' }, {
                        value: 0,
                        label: '2017/05/31'
                    }, { value: 0, label: '2017/06/01' }, {
                        value: 1,
                        label: '2017/06/02'
                    }, { value: 0, label: '2017/06/03' }, {
                        value: 0,
                        label: '2017/06/04'
                    }, { value: 0, label: '2017/06/05' }, {
                        value: 20,
                        label: '2017/06/06'
                    }, { value: 0, label: '2017/06/07' }, {
                        value: 0,
                        label: '2017/06/08'
                    }, { value: 0, label: '2017/06/09' }, {
                        value: 0,
                        label: '2017/06/10'
                    }, { value: 0, label: '2017/06/11' }, {
                        value: 0,
                        label: '2017/06/12'
                    }, { value: 0, label: '2017/06/13' }, {
                        value: 1,
                        label: '2017/06/14'
                    }, { value: 2, label: '2017/06/15' }, {
                        value: 0,
                        label: '2017/06/16'
                    }, { value: 0, label: '2017/06/17' }, {
                        value: 0,
                        label: '2017/06/18'
                    }, { value: 1, label: '2017/06/19' }, {
                        value: 0,
                        label: '2017/06/20'
                    }, { value: 0, label: '2017/06/21' }, {
                        value: 0,
                        label: '2017/06/22'
                    }, { value: 0, label: '2017/06/23' }, {
                        value: 0,
                        label: '2017/06/24'
                    }, { value: 0, label: '2017/06/25' }, {
                        value: 0,
                        label: '2017/06/26'
                    }, { value: 2, label: '2017/06/27' }, {
                        value: 0,
                        label: '2017/06/28'
                    }, { value: 0, label: '2017/06/29' }, {
                        value: 3,
                        label: '2017/06/30'
                    }, { value: 0, label: '2017/07/01' }, {
                        value: 0,
                        label: '2017/07/02'
                    }, { value: 0, label: '2017/07/03' }, {
                        value: 0,
                        label: '2017/07/04'
                    }, { value: 0, label: '2017/07/05' }, {
                        value: 0,
                        label: '2017/07/06'
                    }, { value: 0, label: '2017/07/07' }, {
                        value: 0,
                        label: '2017/07/08'
                    }, { value: 0, label: '2017/07/09' }, {
                        value: 0,
                        label: '2017/07/10'
                    }, { value: 0, label: '2017/07/11' }, {
                        value: 0,
                        label: '2017/07/12'
                    }, { value: 0, label: '2017/07/13' }, {
                        value: 0,
                        label: '2017/07/14'
                    }, { value: 0, label: '2017/07/15' }, {
                        value: 0,
                        label: '2017/07/16'
                    }, { value: 0, label: '2017/07/17' }, {
                        value: 0,
                        label: '2017/07/18'
                    }, { value: 0, label: '2017/07/19' }, {
                        value: 0,
                        label: '2017/07/20'
                    }, { value: 0, label: '2017/07/21' }, {
                        value: 0,
                        label: '2017/07/22'
                    }, { value: 0, label: '2017/07/23' }, {
                        value: 0,
                        label: '2017/07/24'
                    }, { value: 0, label: '2017/07/25' }, {
                        value: 0,
                        label: '2017/07/26'
                    }, { value: 0, label: '2017/07/27' }, {
                        value: 0,
                        label: '2017/07/28'
                    }, { value: 0, label: '2017/07/29' }, {
                        value: 0,
                        label: '2017/07/30'
                    }, { value: 0, label: '2017/07/31' }, {
                        value: 1,
                        label: '2017/08/01'
                    }, { value: 0, label: '2017/08/02' }, {
                        value: 0,
                        label: '2017/08/03'
                    }, { value: 0, label: '2017/08/04' }, {
                        value: 0,
                        label: '2017/08/05'
                    }, { value: 0, label: '2017/08/06' }, {
                        value: 2,
                        label: '2017/08/07'
                    }, { value: 1, label: '2017/08/08' }, {
                        value: 0,
                        label: '2017/08/09'
                    }, { value: 0, label: '2017/08/10' }, {
                        value: 0,
                        label: '2017/08/11'
                    }, { value: 0, label: '2017/08/12' }, {
                        value: 0,
                        label: '2017/08/13'
                    }, { value: 0, label: '2017/08/14' }, {
                        value: 0,
                        label: '2017/08/15'
                    }, { value: 0, label: '2017/08/16' }, {
                        value: 0,
                        label: '2017/08/17'
                    }, { value: 0, label: '2017/08/18' }, {
                        value: 0,
                        label: '2017/08/19'
                    }, { value: 0, label: '2017/08/20' }, {
                        value: 4,
                        label: '2017/08/21'
                    }, { value: 0, label: '2017/08/22' }, {
                        value: 0,
                        label: '2017/08/23'
                    }, { value: 0, label: '2017/08/24' }, {
                        value: 2,
                        label: '2017/08/25'
                    }, { value: 0, label: '2017/08/26' }, {
                        value: 0,
                        label: '2017/08/27'
                    }, { value: 0, label: '2017/08/28' }, {
                        value: 0,
                        label: '2017/08/29'
                    }, { value: 1, label: '2017/08/30' }, {
                        value: 0,
                        label: '2017/08/31'
                    }, { value: 0, label: '2017/09/01' }, {
                        value: 0,
                        label: '2017/09/02'
                    }, { value: 0, label: '2017/09/03' }, {
                        value: 0,
                        label: '2017/09/04'
                    }, { value: 0, label: '2017/09/05' }, {
                        value: 0,
                        label: '2017/09/06'
                    }, { value: 0, label: '2017/09/07' }, {
                        value: 0,
                        label: '2017/09/08'
                    }, { value: 0, label: '2017/09/09' }, {
                        value: 0,
                        label: '2017/09/10'
                    }, { value: 0, label: '2017/09/11' }, {
                        value: 0,
                        label: '2017/09/12'
                    }, { value: 1, label: '2017/09/13' }, {
                        value: 0,
                        label: '2017/09/14'
                    }, { value: 0, label: '2017/09/15' }, {
                        value: 0,
                        label: '2017/09/16'
                    }, { value: 0, label: '2017/09/17' }, {
                        value: 0,
                        label: '2017/09/18'
                    }, { value: 0, label: '2017/09/19' }, {
                        value: 0,
                        label: '2017/09/20'
                    }, { value: 1, label: '2017/09/21' }, {
                        value: 0,
                        label: '2017/09/22'
                    }, { value: 0, label: '2017/09/23' }, {
                        value: 0,
                        label: '2017/09/24'
                    }, { value: 1, label: '2017/09/25' }, {
                        value: 0,
                        label: '2017/09/26'
                    }, { value: 0, label: '2017/09/27' }, {
                        value: 1,
                        label: '2017/09/28'
                    }, { value: 0, label: '2017/09/29' }, {
                        value: 0,
                        label: '2017/09/30'
                    }, { value: 0, label: '2017/10/01' }, {
                        value: 0,
                        label: '2017/10/02'
                    }, { value: 0, label: '2017/10/03' }, {
                        value: 0,
                        label: '2017/10/04'
                    }, { value: 0, label: '2017/10/05' }, {
                        value: 0,
                        label: '2017/10/06'
                    }, { value: 0, label: '2017/10/07' }, {
                        value: 0,
                        label: '2017/10/08'
                    }, { value: 0, label: '2017/10/09' }, {
                        value: 5,
                        label: '2017/10/10'
                    }, { value: 0, label: '2017/10/11' }, {
                        value: 2,
                        label: '2017/10/12'
                    }, { value: 1, label: '2017/10/13' }, {
                        value: 0,
                        label: '2017/10/14'
                    }, { value: 0, label: '2017/10/15' }, {
                        value: 0,
                        label: '2017/10/16'
                    }, { value: 0, label: '2017/10/17' }, {
                        value: 0,
                        label: '2017/10/18'
                    }, { value: 0, label: '2017/10/19' }, {
                        value: 0,
                        label: '2017/10/20'
                    }, { value: 0, label: '2017/10/21' }, {
                        value: 0,
                        label: '2017/10/22'
                    }, { value: 0, label: '2017/10/23' }, {
                        value: 0,
                        label: '2017/10/24'
                    }, { value: 1, label: '2017/10/25' }, {
                        value: 0,
                        label: '2017/10/26'
                    }, { value: 0, label: '2017/10/27' }, {
                        value: 0,
                        label: '2017/10/28'
                    }, { value: 0, label: '2017/10/29' }, {
                        value: 0,
                        label: '2017/10/30'
                    }, { value: 0, label: '2017/10/31' }, {
                        value: 1,
                        label: '2017/11/01'
                    }, { value: 0, label: '2017/11/02' }, {
                        value: 0,
                        label: '2017/11/03'
                    }, { value: 0, label: '2017/11/04' }, {
                        value: 0,
                        label: '2017/11/05'
                    }, { value: 0, label: '2017/11/06' }, {
                        value: 0,
                        label: '2017/11/07'
                    }, { value: 0, label: '2017/11/08' }, {
                        value: 0,
                        label: '2017/11/09'
                    }, { value: 0, label: '2017/11/10' }, {
                        value: 0,
                        label: '2017/11/11'
                    }, { value: 0, label: '2017/11/12' }, {
                        value: 0,
                        label: '2017/11/13'
                    }, { value: 0, label: '2017/11/14' }, {
                        value: 0,
                        label: '2017/11/15'
                    }, { value: 4, label: '2017/11/16' }, {
                        value: 4,
                        label: '2017/11/17'
                    }, { value: 0, label: '2017/11/18' }, {
                        value: 0,
                        label: '2017/11/19'
                    }, { value: 0, label: '2017/11/20' }, {
                        value: 1,
                        label: '2017/11/21'
                    }, { value: 0, label: '2017/11/22' }, {
                        value: 5,
                        label: '2017/11/23'
                    }, { value: 0, label: '2017/11/24' }, {
                        value: 0,
                        label: '2017/11/25'
                    }, { value: 0, label: '2017/11/26' }, {
                        value: 0,
                        label: '2017/11/27'
                    }, { value: 0, label: '2017/11/28' }, {
                        value: 0,
                        label: '2017/11/29'
                    }, { value: 0, label: '2017/11/30' }, {
                        value: 0,
                        label: '2017/12/01'
                    }, { value: 0, label: '2017/12/02' }, {
                        value: 0,
                        label: '2017/12/03'
                    }, { value: 0, label: '2017/12/04' }, {
                        value: 0,
                        label: '2017/12/05'
                    }, { value: 0, label: '2017/12/06' }, {
                        value: 0,
                        label: '2017/12/07'
                    }, { value: 0, label: '2017/12/08' }, {
                        value: 0,
                        label: '2017/12/09'
                    }, { value: 0, label: '2017/12/10' }, {
                        value: 0,
                        label: '2017/12/11'
                    }, { value: 7, label: '2017/12/12' }, {
                        value: 1,
                        label: '2017/12/13'
                    }, { value: 1, label: '2017/12/14' }, {
                        value: 1,
                        label: '2017/12/15'
                    }, { value: 0, label: '2017/12/16' }, {
                        value: 0,
                        label: '2017/12/17'
                    }, { value: 6, label: '2017/12/18' }, {
                        value: 1,
                        label: '2017/12/19'
                    }, { value: 1, label: '2017/12/20' }, {
                        value: 1,
                        label: '2017/12/21'
                    }, { value: 2, label: '2017/12/22' }, {
                        value: 0,
                        label: '2017/12/23'
                    }, { value: 0, label: '2017/12/24' }, {
                        value: 0,
                        label: '2017/12/25'
                    }, { value: 0, label: '2017/12/26' }, {
                        value: 1,
                        label: '2017/12/27'
                    }, { value: 0, label: '2017/12/28' }, {
                        value: 2,
                        label: '2017/12/29'
                    }, { value: 0, label: '2017/12/30' }, {
                        value: 0,
                        label: '2017/12/31'
                    }, { value: 0, label: '2018/01/01' }, {
                        value: 6,
                        label: '2018/01/02'
                    }, { value: 0, label: '2018/01/03' }, {
                        value: 0,
                        label: '2018/01/04'
                    }, { value: 0, label: '2018/01/05' }, {
                        value: 0,
                        label: '2018/01/06'
                    }, { value: 0, label: '2018/01/07' }, {
                        value: 0,
                        label: '2018/01/08'
                    }, { value: 0, label: '2018/01/09' }, {
                        value: 0,
                        label: '2018/01/10'
                    }, { value: 0, label: '2018/01/11' }, {
                        value: 1,
                        label: '2018/01/12'
                    }, { value: 0, label: '2018/01/13' }, {
                        value: 0,
                        label: '2018/01/14'
                    }, { value: 0, label: '2018/01/15' }, {
                        value: 0,
                        label: '2018/01/16'
                    }, { value: 3, label: '2018/01/17' }, {
                        value: 0,
                        label: '2018/01/18'
                    }, { value: 0, label: '2018/01/19' }, {
                        value: 0,
                        label: '2018/01/20'
                    }, { value: 0, label: '2018/01/21' }, {
                        value: 0,
                        label: '2018/01/22'
                    }, { value: 0, label: '2018/01/23' }, {
                        value: 0,
                        label: '2018/01/24'
                    }, { value: 0, label: '2018/01/25' }, {
                        value: 0,
                        label: '2018/01/26'
                    }, { value: 0, label: '2018/01/27' }, {
                        value: 0,
                        label: '2018/01/28'
                    }, { value: 0, label: '2018/01/29' }, {
                        value: 2,
                        label: '2018/01/30'
                    }, { value: 0, label: '2018/01/31' }, {
                        value: 0,
                        label: '2018/02/01'
                    }, { value: 1, label: '2018/02/02' }, {
                        value: 0,
                        label: '2018/02/03'
                    }, { value: 0, label: '2018/02/04' }, {
                        value: 0,
                        label: '2018/02/05'
                    }, { value: 0, label: '2018/02/06' }, {
                        value: 1,
                        label: '2018/02/07'
                    }, { value: 0, label: '2018/02/08' }, {
                        value: 1,
                        label: '2018/02/09'
                    }, { value: 0, label: '2018/02/10' }, {
                        value: 2,
                        label: '2018/02/11'
                    }, { value: 5, label: '2018/02/12' }, {
                        value: 0,
                        label: '2018/02/13'
                    }, { value: 0, label: '2018/02/14' }, {
                        value: 0,
                        label: '2018/02/15'
                    }, { value: 0, label: '2018/02/16' }, {
                        value: 0,
                        label: '2018/02/17'
                    }, { value: 0, label: '2018/02/18' }, {
                        value: 0,
                        label: '2018/02/19'
                    }, { value: 0, label: '2018/02/20' }, {
                        value: 0,
                        label: '2018/02/21'
                    }, { value: 0, label: '2018/02/22' }, {
                        value: 0,
                        label: '2018/02/23'
                    }, { value: 0, label: '2018/02/24' }, {
                        value: 0,
                        label: '2018/02/25'
                    }, { value: 0, label: '2018/02/26' }, {
                        value: 0,
                        label: '2018/02/27'
                    }, { value: 0, label: '2018/02/28' }, {
                        value: 0,
                        label: '2018/03/01'
                    }, { value: 0, label: '2018/03/02' }, {
                        value: 0,
                        label: '2018/03/03'
                    }, { value: 0, label: '2018/03/04' }, {
                        value: 4,
                        label: '2018/03/05'
                    }, { value: 0, label: '2018/03/06' }, {
                        value: 0,
                        label: '2018/03/07'
                    }, { value: 0, label: '2018/03/08' }, {
                        value: 0,
                        label: '2018/03/09'
                    }, { value: 0, label: '2018/03/10' }, {
                        value: 0,
                        label: '2018/03/11'
                    }, { value: 0, label: '2018/03/12' }, {
                        value: 0,
                        label: '2018/03/13'
                    }, { value: 0, label: '2018/03/14' }, {
                        value: 0,
                        label: '2018/03/15'
                    }, { value: 0, label: '2018/03/16' }, {
                        value: 0,
                        label: '2018/03/17'
                    }, { value: 0, label: '2018/03/18' }, {
                        value: 0,
                        label: '2018/03/19'
                    }, { value: 0, label: '2018/03/20' }, {
                        value: 2,
                        label: '2018/03/21'
                    }, { value: 0, label: '2018/03/22' }, {
                        value: 0,
                        label: '2018/03/23'
                    }, { value: 0, label: '2018/03/24' }, {
                        value: 0,
                        label: '2018/03/25'
                    }, { value: 0, label: '2018/03/26' }, {
                        value: 0,
                        label: '2018/03/27'
                    }, { value: 0, label: '2018/03/28' }, {
                        value: 0,
                        label: '2018/03/29'
                    }, { value: 0, label: '2018/03/30' }, {
                        value: 0,
                        label: '2018/03/31'
                    }, { value: 0, label: '2018/04/01' }, {
                        value: 0,
                        label: '2018/04/02'
                    }, { value: 0, label: '2018/04/03' }, {
                        value: 0,
                        label: '2018/04/04'
                    }, { value: 0, label: '2018/04/05' }, {
                        value: 0,
                        label: '2018/04/06'
                    }, { value: 0, label: '2018/04/07' }, {
                        value: 0,
                        label: '2018/04/08'
                    }, { value: 0, label: '2018/04/09' }, {
                        value: 0,
                        label: '2018/04/10'
                    }, { value: 1, label: '2018/04/11' }, {
                        value: 0,
                        label: '2018/04/12'
                    }, { value: 0, label: '2018/04/13' }, {
                        value: 0,
                        label: '2018/04/14'
                    }, { value: 0, label: '2018/04/15' }, {
                        value: 0,
                        label: '2018/04/16'
                    }, { value: 0, label: '2018/04/17' }, {
                        value: 0,
                        label: '2018/04/18'
                    }, { value: 0, label: '2018/04/19' }, {
                        value: 0,
                        label: '2018/04/20'
                    }, { value: 0, label: '2018/04/21' }, {
                        value: 0,
                        label: '2018/04/22'
                    }, { value: 0, label: '2018/04/23' }, {
                        value: 1,
                        label: '2018/04/24'
                    }, { value: 0, label: '2018/04/25' }, {
                        value: 0,
                        label: '2018/04/26'
                    }, { value: 0, label: '2018/04/27' }, {
                        value: 0,
                        label: '2018/04/28'
                    }, { value: 0, label: '2018/04/29' }, {
                        value: 0,
                        label: '2018/04/30'
                    }, { value: 0, label: '2018/05/01' }, {
                        value: 0,
                        label: '2018/05/02'
                    }, { value: 0, label: '2018/05/03' }, {
                        value: 0,
                        label: '2018/05/04'
                    }, { value: 0, label: '2018/05/05' }, {
                        value: 0,
                        label: '2018/05/06'
                    }, { value: 1, label: '2018/05/07' }, {
                        value: 0,
                        label: '2018/05/08'
                    }, { value: 0, label: '2018/05/09' }, {
                        value: 0,
                        label: '2018/05/10'
                    }, { value: 0, label: '2018/05/11' }, {
                        value: 0,
                        label: '2018/05/12'
                    }, { value: 0, label: '2018/05/13' }, {
                        value: 1,
                        label: '2018/05/14'
                    }, { value: 1, label: '2018/05/15' }, {
                        value: 0,
                        label: '2018/05/16'
                    }, { value: 0, label: '2018/05/17' }]
                },
                {
                    title: '当期签约量',
                    list: [{
                        value: 0,
                        label: '2017/05/17'
                    }, { value: 0, label: '2017/05/18' }, {
                        value: 0,
                        label: '2017/05/19'
                    }, { value: 0, label: '2017/05/20' }, {
                        value: 0,
                        label: '2017/05/21'
                    }, { value: 0, label: '2017/05/22' }, {
                        value: 0,
                        label: '2017/05/23'
                    }, { value: 0, label: '2017/05/24' }, {
                        value: 0,
                        label: '2017/05/25'
                    }, { value: 0, label: '2017/05/26' }, {
                        value: 0,
                        label: '2017/05/27'
                    }, { value: 0, label: '2017/05/28' }, {
                        value: 0,
                        label: '2017/05/29'
                    }, { value: 0, label: '2017/05/30' }, {
                        value: 0,
                        label: '2017/05/31'
                    }, { value: 0, label: '2017/06/01' }, {
                        value: 0,
                        label: '2017/06/02'
                    }, { value: 0, label: '2017/06/03' }, {
                        value: 0,
                        label: '2017/06/04'
                    }, { value: 0, label: '2017/06/05' }, {
                        value: 0,
                        label: '2017/06/06'
                    }, { value: 0, label: '2017/06/07' }, {
                        value: 0,
                        label: '2017/06/08'
                    }, { value: 0, label: '2017/06/09' }, {
                        value: 0,
                        label: '2017/06/10'
                    }, { value: 0, label: '2017/06/11' }, {
                        value: 0,
                        label: '2017/06/12'
                    }, { value: 0, label: '2017/06/13' }, {
                        value: 0,
                        label: '2017/06/14'
                    }, { value: 0, label: '2017/06/15' }, {
                        value: 0,
                        label: '2017/06/16'
                    }, { value: 0, label: '2017/06/17' }, {
                        value: 0,
                        label: '2017/06/18'
                    }, { value: 0, label: '2017/06/19' }, {
                        value: 0,
                        label: '2017/06/20'
                    }, { value: 0, label: '2017/06/21' }, {
                        value: 0,
                        label: '2017/06/22'
                    }, { value: 0, label: '2017/06/23' }, {
                        value: 0,
                        label: '2017/06/24'
                    }, { value: 0, label: '2017/06/25' }, {
                        value: 0,
                        label: '2017/06/26'
                    }, { value: 0, label: '2017/06/27' }, {
                        value: 0,
                        label: '2017/06/28'
                    }, { value: 0, label: '2017/06/29' }, {
                        value: 1,
                        label: '2017/06/30'
                    }, { value: 0, label: '2017/07/01' }, {
                        value: 0,
                        label: '2017/07/02'
                    }, { value: 0, label: '2017/07/03' }, {
                        value: 0,
                        label: '2017/07/04'
                    }, { value: 0, label: '2017/07/05' }, {
                        value: 0,
                        label: '2017/07/06'
                    }, { value: 0, label: '2017/07/07' }, {
                        value: 0,
                        label: '2017/07/08'
                    }, { value: 0, label: '2017/07/09' }, {
                        value: 0,
                        label: '2017/07/10'
                    }, { value: 0, label: '2017/07/11' }, {
                        value: 0,
                        label: '2017/07/12'
                    }, { value: 0, label: '2017/07/13' }, {
                        value: 0,
                        label: '2017/07/14'
                    }, { value: 0, label: '2017/07/15' }, {
                        value: 0,
                        label: '2017/07/16'
                    }, { value: 0, label: '2017/07/17' }, {
                        value: 0,
                        label: '2017/07/18'
                    }, { value: 0, label: '2017/07/19' }, {
                        value: 0,
                        label: '2017/07/20'
                    }, { value: 0, label: '2017/07/21' }, {
                        value: 0,
                        label: '2017/07/22'
                    }, { value: 0, label: '2017/07/23' }, {
                        value: 0,
                        label: '2017/07/24'
                    }, { value: 0, label: '2017/07/25' }, {
                        value: 0,
                        label: '2017/07/26'
                    }, { value: 0, label: '2017/07/27' }, {
                        value: 0,
                        label: '2017/07/28'
                    }, { value: 0, label: '2017/07/29' }, {
                        value: 0,
                        label: '2017/07/30'
                    }, { value: 0, label: '2017/07/31' }, {
                        value: 0,
                        label: '2017/08/01'
                    }, { value: 0, label: '2017/08/02' }, {
                        value: 0,
                        label: '2017/08/03'
                    }, { value: 0, label: '2017/08/04' }, {
                        value: 0,
                        label: '2017/08/05'
                    }, { value: 0, label: '2017/08/06' }, {
                        value: 0,
                        label: '2017/08/07'
                    }, { value: 0, label: '2017/08/08' }, {
                        value: 0,
                        label: '2017/08/09'
                    }, { value: 0, label: '2017/08/10' }, {
                        value: 0,
                        label: '2017/08/11'
                    }, { value: 0, label: '2017/08/12' }, {
                        value: 0,
                        label: '2017/08/13'
                    }, { value: 0, label: '2017/08/14' }, {
                        value: 0,
                        label: '2017/08/15'
                    }, { value: 0, label: '2017/08/16' }, {
                        value: 0,
                        label: '2017/08/17'
                    }, { value: 0, label: '2017/08/18' }, {
                        value: 0,
                        label: '2017/08/19'
                    }, { value: 0, label: '2017/08/20' }, {
                        value: 0,
                        label: '2017/08/21'
                    }, { value: 0, label: '2017/08/22' }, {
                        value: 0,
                        label: '2017/08/23'
                    }, { value: 0, label: '2017/08/24' }, {
                        value: 0,
                        label: '2017/08/25'
                    }, { value: 0, label: '2017/08/26' }, {
                        value: 0,
                        label: '2017/08/27'
                    }, { value: 0, label: '2017/08/28' }, {
                        value: 0,
                        label: '2017/08/29'
                    }, { value: 0, label: '2017/08/30' }, {
                        value: 0,
                        label: '2017/08/31'
                    }, { value: 0, label: '2017/09/01' }, {
                        value: 0,
                        label: '2017/09/02'
                    }, { value: 0, label: '2017/09/03' }, {
                        value: 0,
                        label: '2017/09/04'
                    }, { value: 0, label: '2017/09/05' }, {
                        value: 0,
                        label: '2017/09/06'
                    }, { value: 0, label: '2017/09/07' }, {
                        value: 0,
                        label: '2017/09/08'
                    }, { value: 0, label: '2017/09/09' }, {
                        value: 0,
                        label: '2017/09/10'
                    }, { value: 0, label: '2017/09/11' }, {
                        value: 0,
                        label: '2017/09/12'
                    }, { value: 0, label: '2017/09/13' }, {
                        value: 0,
                        label: '2017/09/14'
                    }, { value: 0, label: '2017/09/15' }, {
                        value: 0,
                        label: '2017/09/16'
                    }, { value: 0, label: '2017/09/17' }, {
                        value: 0,
                        label: '2017/09/18'
                    }, { value: 0, label: '2017/09/19' }, {
                        value: 0,
                        label: '2017/09/20'
                    }, { value: 0, label: '2017/09/21' }, {
                        value: 0,
                        label: '2017/09/22'
                    }, { value: 0, label: '2017/09/23' }, {
                        value: 0,
                        label: '2017/09/24'
                    }, { value: 0, label: '2017/09/25' }, {
                        value: 0,
                        label: '2017/09/26'
                    }, { value: 0, label: '2017/09/27' }, {
                        value: 0,
                        label: '2017/09/28'
                    }, { value: 0, label: '2017/09/29' }, {
                        value: 0,
                        label: '2017/09/30'
                    }, { value: 0, label: '2017/10/01' }, {
                        value: 0,
                        label: '2017/10/02'
                    }, { value: 0, label: '2017/10/03' }, {
                        value: 0,
                        label: '2017/10/04'
                    }, { value: 0, label: '2017/10/05' }, {
                        value: 0,
                        label: '2017/10/06'
                    }, { value: 0, label: '2017/10/07' }, {
                        value: 0,
                        label: '2017/10/08'
                    }, { value: 0, label: '2017/10/09' }, {
                        value: 0,
                        label: '2017/10/10'
                    }, { value: 0, label: '2017/10/11' }, {
                        value: 0,
                        label: '2017/10/12'
                    }, { value: 0, label: '2017/10/13' }, {
                        value: 0,
                        label: '2017/10/14'
                    }, { value: 0, label: '2017/10/15' }, {
                        value: 0,
                        label: '2017/10/16'
                    }, { value: 0, label: '2017/10/17' }, {
                        value: 0,
                        label: '2017/10/18'
                    }, { value: 0, label: '2017/10/19' }, {
                        value: 0,
                        label: '2017/10/20'
                    }, { value: 0, label: '2017/10/21' }, {
                        value: 0,
                        label: '2017/10/22'
                    }, { value: 0, label: '2017/10/23' }, {
                        value: 0,
                        label: '2017/10/24'
                    }, { value: 1, label: '2017/10/25' }, {
                        value: 0,
                        label: '2017/10/26'
                    }, { value: 0, label: '2017/10/27' }, {
                        value: 0,
                        label: '2017/10/28'
                    }, { value: 0, label: '2017/10/29' }, {
                        value: 0,
                        label: '2017/10/30'
                    }, { value: 0, label: '2017/10/31' }, {
                        value: 1,
                        label: '2017/11/01'
                    }, { value: 0, label: '2017/11/02' }, {
                        value: 0,
                        label: '2017/11/03'
                    }, { value: 0, label: '2017/11/04' }, {
                        value: 0,
                        label: '2017/11/05'
                    }, { value: 0, label: '2017/11/06' }, {
                        value: 0,
                        label: '2017/11/07'
                    }, { value: 0, label: '2017/11/08' }, {
                        value: 0,
                        label: '2017/11/09'
                    }, { value: 0, label: '2017/11/10' }, {
                        value: 0,
                        label: '2017/11/11'
                    }, { value: 0, label: '2017/11/12' }, {
                        value: 0,
                        label: '2017/11/13'
                    }, { value: 0, label: '2017/11/14' }, {
                        value: 0,
                        label: '2017/11/15'
                    }, { value: 0, label: '2017/11/16' }, {
                        value: 0,
                        label: '2017/11/17'
                    }, { value: 0, label: '2017/11/18' }, {
                        value: 0,
                        label: '2017/11/19'
                    }, { value: 0, label: '2017/11/20' }, {
                        value: 0,
                        label: '2017/11/21'
                    }, { value: 0, label: '2017/11/22' }, {
                        value: 0,
                        label: '2017/11/23'
                    }, { value: 0, label: '2017/11/24' }, {
                        value: 0,
                        label: '2017/11/25'
                    }, { value: 0, label: '2017/11/26' }, {
                        value: 0,
                        label: '2017/11/27'
                    }, { value: 0, label: '2017/11/28' }, {
                        value: 0,
                        label: '2017/11/29'
                    }, { value: 0, label: '2017/11/30' }, {
                        value: 0,
                        label: '2017/12/01'
                    }, { value: 0, label: '2017/12/02' }, {
                        value: 0,
                        label: '2017/12/03'
                    }, { value: 0, label: '2017/12/04' }, {
                        value: 0,
                        label: '2017/12/05'
                    }, { value: 0, label: '2017/12/06' }, {
                        value: 0,
                        label: '2017/12/07'
                    }, { value: 0, label: '2017/12/08' }, {
                        value: 0,
                        label: '2017/12/09'
                    }, { value: 0, label: '2017/12/10' }, {
                        value: 0,
                        label: '2017/12/11'
                    }, { value: 0, label: '2017/12/12' }, {
                        value: 0,
                        label: '2017/12/13'
                    }, { value: 0, label: '2017/12/14' }, {
                        value: 0,
                        label: '2017/12/15'
                    }, { value: 0, label: '2017/12/16' }, {
                        value: 0,
                        label: '2017/12/17'
                    }, { value: 1, label: '2017/12/18' }, {
                        value: 1,
                        label: '2017/12/19'
                    }, { value: 0, label: '2017/12/20' }, {
                        value: 0,
                        label: '2017/12/21'
                    }, { value: 0, label: '2017/12/22' }, {
                        value: 0,
                        label: '2017/12/23'
                    }, { value: 0, label: '2017/12/24' }, {
                        value: 0,
                        label: '2017/12/25'
                    }, { value: 0, label: '2017/12/26' }, {
                        value: 0,
                        label: '2017/12/27'
                    }, { value: 0, label: '2017/12/28' }, {
                        value: 0,
                        label: '2017/12/29'
                    }, { value: 0, label: '2017/12/30' }, {
                        value: 0,
                        label: '2017/12/31'
                    }, { value: 0, label: '2018/01/01' }, {
                        value: 1,
                        label: '2018/01/02'
                    }, { value: 0, label: '2018/01/03' }, {
                        value: 0,
                        label: '2018/01/04'
                    }, { value: 0, label: '2018/01/05' }, {
                        value: 0,
                        label: '2018/01/06'
                    }, { value: 0, label: '2018/01/07' }, {
                        value: 0,
                        label: '2018/01/08'
                    }, { value: 0, label: '2018/01/09' }, {
                        value: 0,
                        label: '2018/01/10'
                    }, { value: 0, label: '2018/01/11' }, {
                        value: 0,
                        label: '2018/01/12'
                    }, { value: 0, label: '2018/01/13' }, {
                        value: 0,
                        label: '2018/01/14'
                    }, { value: 0, label: '2018/01/15' }, {
                        value: 0,
                        label: '2018/01/16'
                    }, { value: 0, label: '2018/01/17' }, {
                        value: 0,
                        label: '2018/01/18'
                    }, { value: 0, label: '2018/01/19' }, {
                        value: 0,
                        label: '2018/01/20'
                    }, { value: 0, label: '2018/01/21' }, {
                        value: 0,
                        label: '2018/01/22'
                    }, { value: 0, label: '2018/01/23' }, {
                        value: 0,
                        label: '2018/01/24'
                    }, { value: 0, label: '2018/01/25' }, {
                        value: 0,
                        label: '2018/01/26'
                    }, { value: 0, label: '2018/01/27' }, {
                        value: 0,
                        label: '2018/01/28'
                    }, { value: 0, label: '2018/01/29' }, {
                        value: 0,
                        label: '2018/01/30'
                    }, { value: 0, label: '2018/01/31' }, {
                        value: 0,
                        label: '2018/02/01'
                    }, { value: 0, label: '2018/02/02' }, {
                        value: 0,
                        label: '2018/02/03'
                    }, { value: 0, label: '2018/02/04' }, {
                        value: 0,
                        label: '2018/02/05'
                    }, { value: 0, label: '2018/02/06' }, {
                        value: 0,
                        label: '2018/02/07'
                    }, { value: 0, label: '2018/02/08' }, {
                        value: 0,
                        label: '2018/02/09'
                    }, { value: 0, label: '2018/02/10' }, {
                        value: 0,
                        label: '2018/02/11'
                    }, { value: 1, label: '2018/02/12' }, {
                        value: 0,
                        label: '2018/02/13'
                    }, { value: 0, label: '2018/02/14' }, {
                        value: 0,
                        label: '2018/02/15'
                    }, { value: 0, label: '2018/02/16' }, {
                        value: 0,
                        label: '2018/02/17'
                    }, { value: 0, label: '2018/02/18' }, {
                        value: 0,
                        label: '2018/02/19'
                    }, { value: 0, label: '2018/02/20' }, {
                        value: 0,
                        label: '2018/02/21'
                    }, { value: 0, label: '2018/02/22' }, {
                        value: 0,
                        label: '2018/02/23'
                    }, { value: 0, label: '2018/02/24' }, {
                        value: 0,
                        label: '2018/02/25'
                    }, { value: 0, label: '2018/02/26' }, {
                        value: 0,
                        label: '2018/02/27'
                    }, { value: 0, label: '2018/02/28' }, {
                        value: 0,
                        label: '2018/03/01'
                    }, { value: 0, label: '2018/03/02' }, {
                        value: 0,
                        label: '2018/03/03'
                    }, { value: 0, label: '2018/03/04' }, {
                        value: 2,
                        label: '2018/03/05'
                    }, { value: 0, label: '2018/03/06' }, {
                        value: 0,
                        label: '2018/03/07'
                    }, { value: 0, label: '2018/03/08' }, {
                        value: 0,
                        label: '2018/03/09'
                    }, { value: 0, label: '2018/03/10' }, {
                        value: 0,
                        label: '2018/03/11'
                    }, { value: 0, label: '2018/03/12' }, {
                        value: 0,
                        label: '2018/03/13'
                    }, { value: 0, label: '2018/03/14' }, {
                        value: 0,
                        label: '2018/03/15'
                    }, { value: 0, label: '2018/03/16' }, {
                        value: 0,
                        label: '2018/03/17'
                    }, { value: 0, label: '2018/03/18' }, {
                        value: 0,
                        label: '2018/03/19'
                    }, { value: 0, label: '2018/03/20' }, {
                        value: 0,
                        label: '2018/03/21'
                    }, { value: 0, label: '2018/03/22' }, {
                        value: 0,
                        label: '2018/03/23'
                    }, { value: 0, label: '2018/03/24' }, {
                        value: 0,
                        label: '2018/03/25'
                    }, { value: 0, label: '2018/03/26' }, {
                        value: 0,
                        label: '2018/03/27'
                    }, { value: 0, label: '2018/03/28' }, {
                        value: 0,
                        label: '2018/03/29'
                    }, { value: 0, label: '2018/03/30' }, {
                        value: 0,
                        label: '2018/03/31'
                    }, { value: 0, label: '2018/04/01' }, {
                        value: 0,
                        label: '2018/04/02'
                    }, { value: 0, label: '2018/04/03' }, {
                        value: 0,
                        label: '2018/04/04'
                    }, { value: 0, label: '2018/04/05' }, {
                        value: 0,
                        label: '2018/04/06'
                    }, { value: 0, label: '2018/04/07' }, {
                        value: 0,
                        label: '2018/04/08'
                    }, { value: 0, label: '2018/04/09' }, {
                        value: 0,
                        label: '2018/04/10'
                    }, { value: 0, label: '2018/04/11' }, {
                        value: 0,
                        label: '2018/04/12'
                    }, { value: 0, label: '2018/04/13' }, {
                        value: 0,
                        label: '2018/04/14'
                    }, { value: 0, label: '2018/04/15' }, {
                        value: 0,
                        label: '2018/04/16'
                    }, { value: 0, label: '2018/04/17' }, {
                        value: 0,
                        label: '2018/04/18'
                    }, { value: 0, label: '2018/04/19' }, {
                        value: 0,
                        label: '2018/04/20'
                    }, { value: 0, label: '2018/04/21' }, {
                        value: 0,
                        label: '2018/04/22'
                    }, { value: 0, label: '2018/04/23' }, {
                        value: 0,
                        label: '2018/04/24'
                    }, { value: 0, label: '2018/04/25' }, {
                        value: 0,
                        label: '2018/04/26'
                    }, { value: 0, label: '2018/04/27' }, {
                        value: 0,
                        label: '2018/04/28'
                    }, { value: 0, label: '2018/04/29' }, {
                        value: 0,
                        label: '2018/04/30'
                    }, { value: 0, label: '2018/05/01' }, {
                        value: 0,
                        label: '2018/05/02'
                    }, { value: 0, label: '2018/05/03' }, {
                        value: 0,
                        label: '2018/05/04'
                    }, { value: 0, label: '2018/05/05' }, {
                        value: 0,
                        label: '2018/05/06'
                    }, { value: 0, label: '2018/05/07' }, {
                        value: 0,
                        label: '2018/05/08'
                    }, { value: 0, label: '2018/05/09' }, {
                        value: 0,
                        label: '2018/05/10'
                    }, { value: 0, label: '2018/05/11' }, {
                        value: 0,
                        label: '2018/05/12'
                    }, { value: 0, label: '2018/05/13' }, {
                        value: 0,
                        label: '2018/05/14'
                    }, { value: 0, label: '2018/05/15' }, {
                        value: 0,
                        label: '2018/05/16'
                    }, { value: 0, label: '2018/05/17' }]
                },
                {
                    title: '实际签约量',
                    list: [{
                        value: 0,
                        label: '2017/05/17'
                    }, { value: 0, label: '2017/05/18' }, {
                        value: 0,
                        label: '2017/05/19'
                    }, { value: 0, label: '2017/05/20' }, {
                        value: 0,
                        label: '2017/05/21'
                    }, { value: 0, label: '2017/05/22' }, {
                        value: 0,
                        label: '2017/05/23'
                    }, { value: 0, label: '2017/05/24' }, {
                        value: 0,
                        label: '2017/05/25'
                    }, { value: 0, label: '2017/05/26' }, {
                        value: 0,
                        label: '2017/05/27'
                    }, { value: 0, label: '2017/05/28' }, {
                        value: 0,
                        label: '2017/05/29'
                    }, { value: 0, label: '2017/05/30' }, {
                        value: 0,
                        label: '2017/05/31'
                    }, { value: 0, label: '2017/06/01' }, {
                        value: 0,
                        label: '2017/06/02'
                    }, { value: 0, label: '2017/06/03' }, {
                        value: 0,
                        label: '2017/06/04'
                    }, { value: 0, label: '2017/06/05' }, {
                        value: 0,
                        label: '2017/06/06'
                    }, { value: 0, label: '2017/06/07' }, {
                        value: 0,
                        label: '2017/06/08'
                    }, { value: 0, label: '2017/06/09' }, {
                        value: 0,
                        label: '2017/06/10'
                    }, { value: 0, label: '2017/06/11' }, {
                        value: 0,
                        label: '2017/06/12'
                    }, { value: 0, label: '2017/06/13' }, {
                        value: 0,
                        label: '2017/06/14'
                    }, { value: 0, label: '2017/06/15' }, {
                        value: 0,
                        label: '2017/06/16'
                    }, { value: 0, label: '2017/06/17' }, {
                        value: 0,
                        label: '2017/06/18'
                    }, { value: 0, label: '2017/06/19' }, {
                        value: 0,
                        label: '2017/06/20'
                    }, { value: 0, label: '2017/06/21' }, {
                        value: 0,
                        label: '2017/06/22'
                    }, { value: 0, label: '2017/06/23' }, {
                        value: 0,
                        label: '2017/06/24'
                    }, { value: 0, label: '2017/06/25' }, {
                        value: 0,
                        label: '2017/06/26'
                    }, { value: 0, label: '2017/06/27' }, {
                        value: 0,
                        label: '2017/06/28'
                    }, { value: 0, label: '2017/06/29' }, {
                        value: 0,
                        label: '2017/06/30'
                    }, { value: 0, label: '2017/07/01' }, {
                        value: 0,
                        label: '2017/07/02'
                    }, { value: 0, label: '2017/07/03' }, {
                        value: 0,
                        label: '2017/07/04'
                    }, { value: 0, label: '2017/07/05' }, {
                        value: 0,
                        label: '2017/07/06'
                    }, { value: 0, label: '2017/07/07' }, {
                        value: 0,
                        label: '2017/07/08'
                    }, { value: 0, label: '2017/07/09' }, {
                        value: 0,
                        label: '2017/07/10'
                    }, { value: 0, label: '2017/07/11' }, {
                        value: 0,
                        label: '2017/07/12'
                    }, { value: 0, label: '2017/07/13' }, {
                        value: 0,
                        label: '2017/07/14'
                    }, { value: 0, label: '2017/07/15' }, {
                        value: 0,
                        label: '2017/07/16'
                    }, { value: 1, label: '2017/07/17' }, {
                        value: 0,
                        label: '2017/07/18'
                    }, { value: 0, label: '2017/07/19' }, {
                        value: 0,
                        label: '2017/07/20'
                    }, { value: 0, label: '2017/07/21' }, {
                        value: 0,
                        label: '2017/07/22'
                    }, { value: 0, label: '2017/07/23' }, {
                        value: 0,
                        label: '2017/07/24'
                    }, { value: 0, label: '2017/07/25' }, {
                        value: 0,
                        label: '2017/07/26'
                    }, { value: 0, label: '2017/07/27' }, {
                        value: 0,
                        label: '2017/07/28'
                    }, { value: 0, label: '2017/07/29' }, {
                        value: 0,
                        label: '2017/07/30'
                    }, { value: 0, label: '2017/07/31' }, {
                        value: 0,
                        label: '2017/08/01'
                    }, { value: 0, label: '2017/08/02' }, {
                        value: 0,
                        label: '2017/08/03'
                    }, { value: 0, label: '2017/08/04' }, {
                        value: 0,
                        label: '2017/08/05'
                    }, { value: 0, label: '2017/08/06' }, {
                        value: 0,
                        label: '2017/08/07'
                    }, { value: 0, label: '2017/08/08' }, {
                        value: 0,
                        label: '2017/08/09'
                    }, { value: 0, label: '2017/08/10' }, {
                        value: 0,
                        label: '2017/08/11'
                    }, { value: 0, label: '2017/08/12' }, {
                        value: 0,
                        label: '2017/08/13'
                    }, { value: 0, label: '2017/08/14' }, {
                        value: 0,
                        label: '2017/08/15'
                    }, { value: 0, label: '2017/08/16' }, {
                        value: 0,
                        label: '2017/08/17'
                    }, { value: 0, label: '2017/08/18' }, {
                        value: 0,
                        label: '2017/08/19'
                    }, { value: 0, label: '2017/08/20' }, {
                        value: 0,
                        label: '2017/08/21'
                    }, { value: 0, label: '2017/08/22' }, {
                        value: 0,
                        label: '2017/08/23'
                    }, { value: 0, label: '2017/08/24' }, {
                        value: 0,
                        label: '2017/08/25'
                    }, { value: 0, label: '2017/08/26' }, {
                        value: 0,
                        label: '2017/08/27'
                    }, { value: 0, label: '2017/08/28' }, {
                        value: 0,
                        label: '2017/08/29'
                    }, { value: 0, label: '2017/08/30' }, {
                        value: 0,
                        label: '2017/08/31'
                    }, { value: 0, label: '2017/09/01' }, {
                        value: 0,
                        label: '2017/09/02'
                    }, { value: 0, label: '2017/09/03' }, {
                        value: 0,
                        label: '2017/09/04'
                    }, { value: 0, label: '2017/09/05' }, {
                        value: 0,
                        label: '2017/09/06'
                    }, { value: 0, label: '2017/09/07' }, {
                        value: 0,
                        label: '2017/09/08'
                    }, { value: 0, label: '2017/09/09' }, {
                        value: 0,
                        label: '2017/09/10'
                    }, { value: 0, label: '2017/09/11' }, {
                        value: 0,
                        label: '2017/09/12'
                    }, { value: 0, label: '2017/09/13' }, {
                        value: 0,
                        label: '2017/09/14'
                    }, { value: 0, label: '2017/09/15' }, {
                        value: 0,
                        label: '2017/09/16'
                    }, { value: 0, label: '2017/09/17' }, {
                        value: 0,
                        label: '2017/09/18'
                    }, { value: 0, label: '2017/09/19' }, {
                        value: 0,
                        label: '2017/09/20'
                    }, { value: 0, label: '2017/09/21' }, {
                        value: 0,
                        label: '2017/09/22'
                    }, { value: 0, label: '2017/09/23' }, {
                        value: 0,
                        label: '2017/09/24'
                    }, { value: 0, label: '2017/09/25' }, {
                        value: 0,
                        label: '2017/09/26'
                    }, { value: 0, label: '2017/09/27' }, {
                        value: 0,
                        label: '2017/09/28'
                    }, { value: 0, label: '2017/09/29' }, {
                        value: 0,
                        label: '2017/09/30'
                    }, { value: 0, label: '2017/10/01' }, {
                        value: 0,
                        label: '2017/10/02'
                    }, { value: 0, label: '2017/10/03' }, {
                        value: 0,
                        label: '2017/10/04'
                    }, { value: 0, label: '2017/10/05' }, {
                        value: 0,
                        label: '2017/10/06'
                    }, { value: 0, label: '2017/10/07' }, {
                        value: 0,
                        label: '2017/10/08'
                    }, { value: 0, label: '2017/10/09' }, {
                        value: 1,
                        label: '2017/10/10'
                    }, { value: 0, label: '2017/10/11' }, {
                        value: 0,
                        label: '2017/10/12'
                    }, { value: 0, label: '2017/10/13' }, {
                        value: 0,
                        label: '2017/10/14'
                    }, { value: 0, label: '2017/10/15' }, {
                        value: 0,
                        label: '2017/10/16'
                    }, { value: 0, label: '2017/10/17' }, {
                        value: 0,
                        label: '2017/10/18'
                    }, { value: 0, label: '2017/10/19' }, {
                        value: 0,
                        label: '2017/10/20'
                    }, { value: 0, label: '2017/10/21' }, {
                        value: 0,
                        label: '2017/10/22'
                    }, { value: 0, label: '2017/10/23' }, {
                        value: 0,
                        label: '2017/10/24'
                    }, { value: 1, label: '2017/10/25' }, {
                        value: 0,
                        label: '2017/10/26'
                    }, { value: 0, label: '2017/10/27' }, {
                        value: 0,
                        label: '2017/10/28'
                    }, { value: 0, label: '2017/10/29' }, {
                        value: 0,
                        label: '2017/10/30'
                    }, { value: 0, label: '2017/10/31' }, {
                        value: 1,
                        label: '2017/11/01'
                    }, { value: 0, label: '2017/11/02' }, {
                        value: 0,
                        label: '2017/11/03'
                    }, { value: 0, label: '2017/11/04' }, {
                        value: 0,
                        label: '2017/11/05'
                    }, { value: 0, label: '2017/11/06' }, {
                        value: 0,
                        label: '2017/11/07'
                    }, { value: 0, label: '2017/11/08' }, {
                        value: 0,
                        label: '2017/11/09'
                    }, { value: 0, label: '2017/11/10' }, {
                        value: 0,
                        label: '2017/11/11'
                    }, { value: 0, label: '2017/11/12' }, {
                        value: 1,
                        label: '2017/11/13'
                    }, { value: 0, label: '2017/11/14' }, {
                        value: 0,
                        label: '2017/11/15'
                    }, { value: 0, label: '2017/11/16' }, {
                        value: 0,
                        label: '2017/11/17'
                    }, { value: 0, label: '2017/11/18' }, {
                        value: 0,
                        label: '2017/11/19'
                    }, { value: 0, label: '2017/11/20' }, {
                        value: 0,
                        label: '2017/11/21'
                    }, { value: 0, label: '2017/11/22' }, {
                        value: 0,
                        label: '2017/11/23'
                    }, { value: 0, label: '2017/11/24' }, {
                        value: 0,
                        label: '2017/11/25'
                    }, { value: 0, label: '2017/11/26' }, {
                        value: 0,
                        label: '2017/11/27'
                    }, { value: 0, label: '2017/11/28' }, {
                        value: 0,
                        label: '2017/11/29'
                    }, { value: 0, label: '2017/11/30' }, {
                        value: 0,
                        label: '2017/12/01'
                    }, { value: 0, label: '2017/12/02' }, {
                        value: 0,
                        label: '2017/12/03'
                    }, { value: 0, label: '2017/12/04' }, {
                        value: 0,
                        label: '2017/12/05'
                    }, { value: 0, label: '2017/12/06' }, {
                        value: 0,
                        label: '2017/12/07'
                    }, { value: 0, label: '2017/12/08' }, {
                        value: 0,
                        label: '2017/12/09'
                    }, { value: 0, label: '2017/12/10' }, {
                        value: 0,
                        label: '2017/12/11'
                    }, { value: 0, label: '2017/12/12' }, {
                        value: 0,
                        label: '2017/12/13'
                    }, { value: 0, label: '2017/12/14' }, {
                        value: 0,
                        label: '2017/12/15'
                    }, { value: 0, label: '2017/12/16' }, {
                        value: 0,
                        label: '2017/12/17'
                    }, { value: 0, label: '2017/12/18' }, {
                        value: 0,
                        label: '2017/12/19'
                    }, { value: 0, label: '2017/12/20' }, {
                        value: 0,
                        label: '2017/12/21'
                    }, { value: 0, label: '2017/12/22' }, {
                        value: 0,
                        label: '2017/12/23'
                    }, { value: 0, label: '2017/12/24' }, {
                        value: 0,
                        label: '2017/12/25'
                    }, { value: 0, label: '2017/12/26' }, {
                        value: 0,
                        label: '2017/12/27'
                    }, { value: 0, label: '2017/12/28' }, {
                        value: 0,
                        label: '2017/12/29'
                    }, { value: 0, label: '2017/12/30' }, {
                        value: 0,
                        label: '2017/12/31'
                    }, { value: 0, label: '2018/01/01' }, {
                        value: 0,
                        label: '2018/01/02'
                    }, { value: 0, label: '2018/01/03' }, {
                        value: 0,
                        label: '2018/01/04'
                    }, { value: 0, label: '2018/01/05' }, {
                        value: 0,
                        label: '2018/01/06'
                    }, { value: 0, label: '2018/01/07' }, {
                        value: 0,
                        label: '2018/01/08'
                    }, { value: 0, label: '2018/01/09' }, {
                        value: 0,
                        label: '2018/01/10'
                    }, { value: 0, label: '2018/01/11' }, {
                        value: 0,
                        label: '2018/01/12'
                    }, { value: 0, label: '2018/01/13' }, {
                        value: 0,
                        label: '2018/01/14'
                    }, { value: 0, label: '2018/01/15' }, {
                        value: 0,
                        label: '2018/01/16'
                    }, { value: 0, label: '2018/01/17' }, {
                        value: 0,
                        label: '2018/01/18'
                    }, { value: 1, label: '2018/01/19' }, {
                        value: 0,
                        label: '2018/01/20'
                    }, { value: 0, label: '2018/01/21' }, {
                        value: 0,
                        label: '2018/01/22'
                    }, { value: 0, label: '2018/01/23' }, {
                        value: 0,
                        label: '2018/01/24'
                    }, { value: 0, label: '2018/01/25' }, {
                        value: 0,
                        label: '2018/01/26'
                    }, { value: 0, label: '2018/01/27' }, {
                        value: 0,
                        label: '2018/01/28'
                    }, { value: 1, label: '2018/01/29' }, {
                        value: 0,
                        label: '2018/01/30'
                    }, { value: 0, label: '2018/01/31' }, {
                        value: 0,
                        label: '2018/02/01'
                    }, { value: 0, label: '2018/02/02' }, {
                        value: 0,
                        label: '2018/02/03'
                    }, { value: 0, label: '2018/02/04' }, {
                        value: 0,
                        label: '2018/02/05'
                    }, { value: 0, label: '2018/02/06' }, {
                        value: 0,
                        label: '2018/02/07'
                    }, { value: 0, label: '2018/02/08' }, {
                        value: 0,
                        label: '2018/02/09'
                    }, { value: 0, label: '2018/02/10' }, {
                        value: 0,
                        label: '2018/02/11'
                    }, { value: 0, label: '2018/02/12' }, {
                        value: 0,
                        label: '2018/02/13'
                    }, { value: 0, label: '2018/02/14' }, {
                        value: 0,
                        label: '2018/02/15'
                    }, { value: 0, label: '2018/02/16' }, {
                        value: 0,
                        label: '2018/02/17'
                    }, { value: 0, label: '2018/02/18' }, {
                        value: 0,
                        label: '2018/02/19'
                    }, { value: 0, label: '2018/02/20' }, {
                        value: 0,
                        label: '2018/02/21'
                    }, { value: 0, label: '2018/02/22' }, {
                        value: 1,
                        label: '2018/02/23'
                    }, { value: 0, label: '2018/02/24' }, {
                        value: 0,
                        label: '2018/02/25'
                    }, { value: 0, label: '2018/02/26' }, {
                        value: 1,
                        label: '2018/02/27'
                    }, { value: 0, label: '2018/02/28' }, {
                        value: 0,
                        label: '2018/03/01'
                    }, { value: 0, label: '2018/03/02' }, {
                        value: 0,
                        label: '2018/03/03'
                    }, { value: 0, label: '2018/03/04' }, {
                        value: 1,
                        label: '2018/03/05'
                    }, { value: 0, label: '2018/03/06' }, {
                        value: 0,
                        label: '2018/03/07'
                    }, { value: 0, label: '2018/03/08' }, {
                        value: 0,
                        label: '2018/03/09'
                    }, { value: 0, label: '2018/03/10' }, {
                        value: 0,
                        label: '2018/03/11'
                    }, { value: 0, label: '2018/03/12' }, {
                        value: 0,
                        label: '2018/03/13'
                    }, { value: 0, label: '2018/03/14' }, {
                        value: 0,
                        label: '2018/03/15'
                    }, { value: 0, label: '2018/03/16' }, {
                        value: 0,
                        label: '2018/03/17'
                    }, { value: 0, label: '2018/03/18' }, {
                        value: 0,
                        label: '2018/03/19'
                    }, { value: 0, label: '2018/03/20' }, {
                        value: 0,
                        label: '2018/03/21'
                    }, { value: 0, label: '2018/03/22' }, {
                        value: 0,
                        label: '2018/03/23'
                    }, { value: 0, label: '2018/03/24' }, {
                        value: 0,
                        label: '2018/03/25'
                    }, { value: 0, label: '2018/03/26' }, {
                        value: 0,
                        label: '2018/03/27'
                    }, { value: 0, label: '2018/03/28' }, {
                        value: 0,
                        label: '2018/03/29'
                    }, { value: 0, label: '2018/03/30' }, {
                        value: 0,
                        label: '2018/03/31'
                    }, { value: 0, label: '2018/04/01' }, {
                        value: 0,
                        label: '2018/04/02'
                    }, { value: 0, label: '2018/04/03' }, {
                        value: 0,
                        label: '2018/04/04'
                    }, { value: 0, label: '2018/04/05' }, {
                        value: 0,
                        label: '2018/04/06'
                    }, { value: 0, label: '2018/04/07' }, {
                        value: 0,
                        label: '2018/04/08'
                    }, { value: 0, label: '2018/04/09' }, {
                        value: 0,
                        label: '2018/04/10'
                    }, { value: 0, label: '2018/04/11' }, {
                        value: 0,
                        label: '2018/04/12'
                    }, { value: 0, label: '2018/04/13' }, {
                        value: 0,
                        label: '2018/04/14'
                    }, { value: 0, label: '2018/04/15' }, {
                        value: 0,
                        label: '2018/04/16'
                    }, { value: 0, label: '2018/04/17' }, {
                        value: 0,
                        label: '2018/04/18'
                    }, { value: 0, label: '2018/04/19' }, {
                        value: 0,
                        label: '2018/04/20'
                    }, { value: 0, label: '2018/04/21' }, {
                        value: 0,
                        label: '2018/04/22'
                    }, { value: 0, label: '2018/04/23' }, {
                        value: 0,
                        label: '2018/04/24'
                    }, { value: 0, label: '2018/04/25' }, {
                        value: 0,
                        label: '2018/04/26'
                    }, { value: 0, label: '2018/04/27' }, {
                        value: 0,
                        label: '2018/04/28'
                    }, { value: 0, label: '2018/04/29' }, {
                        value: 0,
                        label: '2018/04/30'
                    }, { value: 0, label: '2018/05/01' }, {
                        value: 0,
                        label: '2018/05/02'
                    }, { value: 0, label: '2018/05/03' }, {
                        value: 0,
                        label: '2018/05/04'
                    }, { value: 0, label: '2018/05/05' }, {
                        value: 0,
                        label: '2018/05/06'
                    }, { value: 0, label: '2018/05/07' }, {
                        value: 0,
                        label: '2018/05/08'
                    }, { value: 0, label: '2018/05/09' }, {
                        value: 0,
                        label: '2018/05/10'
                    }, { value: 0, label: '2018/05/11' }, {
                        value: 0,
                        label: '2018/05/12'
                    }, { value: 0, label: '2018/05/13' }, {
                        value: 0,
                        label: '2018/05/14'
                    }, { value: 0, label: '2018/05/15' }, {
                        value: 0,
                        label: '2018/05/16'
                    }, { value: 0, label: '2018/05/17' }]
                }],
            lineData2: [
                {
                    title: "资源量",
                    list: [{ value: 0, label: '2017/11/18' }, {
                        value: 0,
                        label: '2017/11/19'
                    }, { value: 0, label: '2017/11/20' }, {
                        value: 1,
                        label: '2017/11/21'
                    }, { value: 0, label: '2017/11/22' }, {
                        value: 5,
                        label: '2017/11/23'
                    }, { value: 0, label: '2017/11/24' }, {
                        value: 0,
                        label: '2017/11/25'
                    }, { value: 0, label: '2017/11/26' }, {
                        value: 0,
                        label: '2017/11/27'
                    }, { value: 0, label: '2017/11/28' }, {
                        value: 0,
                        label: '2017/11/29'
                    }, { value: 0, label: '2017/11/30' }, {
                        value: 0,
                        label: '2017/12/01'
                    }, { value: 0, label: '2017/12/02' }, {
                        value: 0,
                        label: '2017/12/03'
                    }, { value: 0, label: '2017/12/04' }, {
                        value: 0,
                        label: '2017/12/05'
                    }, { value: 0, label: '2017/12/06' }, {
                        value: 0,
                        label: '2017/12/07'
                    }, { value: 0, label: '2017/12/08' }, {
                        value: 0,
                        label: '2017/12/09'
                    }, { value: 0, label: '2017/12/10' }, {
                        value: 0,
                        label: '2017/12/11'
                    }, { value: 7, label: '2017/12/12' }, {
                        value: 1,
                        label: '2017/12/13'
                    }, { value: 1, label: '2017/12/14' }, {
                        value: 1,
                        label: '2017/12/15'
                    }, { value: 0, label: '2017/12/16' }, {
                        value: 0,
                        label: '2017/12/17'
                    }, { value: 6, label: '2017/12/18' }, {
                        value: 1,
                        label: '2017/12/19'
                    }, { value: 1, label: '2017/12/20' }, {
                        value: 1,
                        label: '2017/12/21'
                    }, { value: 2, label: '2017/12/22' }, {
                        value: 0,
                        label: '2017/12/23'
                    }, { value: 0, label: '2017/12/24' }, {
                        value: 0,
                        label: '2017/12/25'
                    }, { value: 0, label: '2017/12/26' }, {
                        value: 1,
                        label: '2017/12/27'
                    }, { value: 0, label: '2017/12/28' }, {
                        value: 2,
                        label: '2017/12/29'
                    }, { value: 0, label: '2017/12/30' }, {
                        value: 0,
                        label: '2017/12/31'
                    }, { value: 0, label: '2018/01/01' }, {
                        value: 6,
                        label: '2018/01/02'
                    }, { value: 0, label: '2018/01/03' }, {
                        value: 0,
                        label: '2018/01/04'
                    }, { value: 0, label: '2018/01/05' }, {
                        value: 0,
                        label: '2018/01/06'
                    }, { value: 0, label: '2018/01/07' }, {
                        value: 0,
                        label: '2018/01/08'
                    }, { value: 0, label: '2018/01/09' }, {
                        value: 0,
                        label: '2018/01/10'
                    }, { value: 0, label: '2018/01/11' }, {
                        value: 1,
                        label: '2018/01/12'
                    }, { value: 0, label: '2018/01/13' }, {
                        value: 0,
                        label: '2018/01/14'
                    }, { value: 0, label: '2018/01/15' }, {
                        value: 0,
                        label: '2018/01/16'
                    }, { value: 3, label: '2018/01/17' }, {
                        value: 0,
                        label: '2018/01/18'
                    }, { value: 0, label: '2018/01/19' }, {
                        value: 0,
                        label: '2018/01/20'
                    }, { value: 0, label: '2018/01/21' }, {
                        value: 0,
                        label: '2018/01/22'
                    }, { value: 0, label: '2018/01/23' }, {
                        value: 0,
                        label: '2018/01/24'
                    }, { value: 0, label: '2018/01/25' }, {
                        value: 0,
                        label: '2018/01/26'
                    }, { value: 0, label: '2018/01/27' }, {
                        value: 0,
                        label: '2018/01/28'
                    }, { value: 0, label: '2018/01/29' }, {
                        value: 2,
                        label: '2018/01/30'
                    }, { value: 0, label: '2018/01/31' }, {
                        value: 0,
                        label: '2018/02/01'
                    }, { value: 1, label: '2018/02/02' }, {
                        value: 0,
                        label: '2018/02/03'
                    }, { value: 0, label: '2018/02/04' }, {
                        value: 0,
                        label: '2018/02/05'
                    }, { value: 0, label: '2018/02/06' }, {
                        value: 1,
                        label: '2018/02/07'
                    }, { value: 0, label: '2018/02/08' }, {
                        value: 1,
                        label: '2018/02/09'
                    }, { value: 0, label: '2018/02/10' }, {
                        value: 2,
                        label: '2018/02/11'
                    }, { value: 5, label: '2018/02/12' }, {
                        value: 0,
                        label: '2018/02/13'
                    }, { value: 0, label: '2018/02/14' }, {
                        value: 0,
                        label: '2018/02/15'
                    }, { value: 0, label: '2018/02/16' }, {
                        value: 0,
                        label: '2018/02/17'
                    }, { value: 0, label: '2018/02/18' }, {
                        value: 0,
                        label: '2018/02/19'
                    }, { value: 0, label: '2018/02/20' }, {
                        value: 0,
                        label: '2018/02/21'
                    }, { value: 0, label: '2018/02/22' }, {
                        value: 0,
                        label: '2018/02/23'
                    }, { value: 0, label: '2018/02/24' }, {
                        value: 0,
                        label: '2018/02/25'
                    }, { value: 0, label: '2018/02/26' }, {
                        value: 0,
                        label: '2018/02/27'
                    }, { value: 0, label: '2018/02/28' }, {
                        value: 0,
                        label: '2018/03/01'
                    }, { value: 0, label: '2018/03/02' }, {
                        value: 0,
                        label: '2018/03/03'
                    }, { value: 0, label: '2018/03/04' }, {
                        value: 4,
                        label: '2018/03/05'
                    }, { value: 0, label: '2018/03/06' }, {
                        value: 0,
                        label: '2018/03/07'
                    }, { value: 0, label: '2018/03/08' }, {
                        value: 0,
                        label: '2018/03/09'
                    }, { value: 0, label: '2018/03/10' }, {
                        value: 0,
                        label: '2018/03/11'
                    }, { value: 0, label: '2018/03/12' }, {
                        value: 0,
                        label: '2018/03/13'
                    }, { value: 0, label: '2018/03/14' }, {
                        value: 0,
                        label: '2018/03/15'
                    }, { value: 0, label: '2018/03/16' }, {
                        value: 0,
                        label: '2018/03/17'
                    }, { value: 0, label: '2018/03/18' }, {
                        value: 0,
                        label: '2018/03/19'
                    }, { value: 0, label: '2018/03/20' }, {
                        value: 2,
                        label: '2018/03/21'
                    }, { value: 0, label: '2018/03/22' }, {
                        value: 0,
                        label: '2018/03/23'
                    }, { value: 0, label: '2018/03/24' }, {
                        value: 0,
                        label: '2018/03/25'
                    }, { value: 0, label: '2018/03/26' }, {
                        value: 0,
                        label: '2018/03/27'
                    }, { value: 0, label: '2018/03/28' }, {
                        value: 0,
                        label: '2018/03/29'
                    }, { value: 0, label: '2018/03/30' }, {
                        value: 0,
                        label: '2018/03/31'
                    }, { value: 0, label: '2018/04/01' }, {
                        value: 0,
                        label: '2018/04/02'
                    }, { value: 0, label: '2018/04/03' }, {
                        value: 0,
                        label: '2018/04/04'
                    }, { value: 0, label: '2018/04/05' }, {
                        value: 0,
                        label: '2018/04/06'
                    }, { value: 0, label: '2018/04/07' }, {
                        value: 0,
                        label: '2018/04/08'
                    }, { value: 0, label: '2018/04/09' }, {
                        value: 0,
                        label: '2018/04/10'
                    }, { value: 1, label: '2018/04/11' }, {
                        value: 0,
                        label: '2018/04/12'
                    }, { value: 0, label: '2018/04/13' }, {
                        value: 0,
                        label: '2018/04/14'
                    }, { value: 0, label: '2018/04/15' }, {
                        value: 0,
                        label: '2018/04/16'
                    }, { value: 0, label: '2018/04/17' }, {
                        value: 0,
                        label: '2018/04/18'
                    }, { value: 0, label: '2018/04/19' }, {
                        value: 0,
                        label: '2018/04/20'
                    }, { value: 0, label: '2018/04/21' }, {
                        value: 0,
                        label: '2018/04/22'
                    }, { value: 0, label: '2018/04/23' }, {
                        value: 1,
                        label: '2018/04/24'
                    }, { value: 0, label: '2018/04/25' }, {
                        value: 0,
                        label: '2018/04/26'
                    }, { value: 0, label: '2018/04/27' }, {
                        value: 0,
                        label: '2018/04/28'
                    }, { value: 0, label: '2018/04/29' }, {
                        value: 0,
                        label: '2018/04/30'
                    }, { value: 0, label: '2018/05/01' }, {
                        value: 0,
                        label: '2018/05/02'
                    }, { value: 0, label: '2018/05/03' }, {
                        value: 0,
                        label: '2018/05/04'
                    }, { value: 0, label: '2018/05/05' }, {
                        value: 0,
                        label: '2018/05/06'
                    }, { value: 1, label: '2018/05/07' }, {
                        value: 0,
                        label: '2018/05/08'
                    }, { value: 0, label: '2018/05/09' }, {
                        value: 0,
                        label: '2018/05/10'
                    }, { value: 0, label: '2018/05/11' }, {
                        value: 0,
                        label: '2018/05/12'
                    }, { value: 0, label: '2018/05/13' }, {
                        value: 1,
                        label: '2018/05/14'
                    }, { value: 1, label: '2018/05/15' }, {
                        value: 0,
                        label: '2018/05/16'
                    }, { value: 0, label: '2018/05/17' }]
                }, {
                    title: '当期签约量',
                    list: [{ value: 0, label: '2017/11/18' }, {
                        value: 0,
                        label: '2017/11/19'
                    }, { value: 0, label: '2017/11/20' }, {
                        value: 0,
                        label: '2017/11/21'
                    }, { value: 0, label: '2017/11/22' }, {
                        value: 0,
                        label: '2017/11/23'
                    }, { value: 0, label: '2017/11/24' }, {
                        value: 0,
                        label: '2017/11/25'
                    }, { value: 0, label: '2017/11/26' }, {
                        value: 0,
                        label: '2017/11/27'
                    }, { value: 0, label: '2017/11/28' }, {
                        value: 0,
                        label: '2017/11/29'
                    }, { value: 0, label: '2017/11/30' }, {
                        value: 0,
                        label: '2017/12/01'
                    }, { value: 0, label: '2017/12/02' }, {
                        value: 0,
                        label: '2017/12/03'
                    }, { value: 0, label: '2017/12/04' }, {
                        value: 0,
                        label: '2017/12/05'
                    }, { value: 0, label: '2017/12/06' }, {
                        value: 0,
                        label: '2017/12/07'
                    }, { value: 0, label: '2017/12/08' }, {
                        value: 0,
                        label: '2017/12/09'
                    }, { value: 0, label: '2017/12/10' }, {
                        value: 0,
                        label: '2017/12/11'
                    }, { value: 0, label: '2017/12/12' }, {
                        value: 0,
                        label: '2017/12/13'
                    }, { value: 0, label: '2017/12/14' }, {
                        value: 0,
                        label: '2017/12/15'
                    }, { value: 0, label: '2017/12/16' }, {
                        value: 0,
                        label: '2017/12/17'
                    }, { value: 1, label: '2017/12/18' }, {
                        value: 1,
                        label: '2017/12/19'
                    }, { value: 0, label: '2017/12/20' }, {
                        value: 0,
                        label: '2017/12/21'
                    }, { value: 0, label: '2017/12/22' }, {
                        value: 0,
                        label: '2017/12/23'
                    }, { value: 0, label: '2017/12/24' }, {
                        value: 0,
                        label: '2017/12/25'
                    }, { value: 0, label: '2017/12/26' }, {
                        value: 0,
                        label: '2017/12/27'
                    }, { value: 0, label: '2017/12/28' }, {
                        value: 0,
                        label: '2017/12/29'
                    }, { value: 0, label: '2017/12/30' }, {
                        value: 0,
                        label: '2017/12/31'
                    }, { value: 0, label: '2018/01/01' }, {
                        value: 1,
                        label: '2018/01/02'
                    }, { value: 0, label: '2018/01/03' }, {
                        value: 0,
                        label: '2018/01/04'
                    }, { value: 0, label: '2018/01/05' }, {
                        value: 0,
                        label: '2018/01/06'
                    }, { value: 0, label: '2018/01/07' }, {
                        value: 0,
                        label: '2018/01/08'
                    }, { value: 0, label: '2018/01/09' }, {
                        value: 0,
                        label: '2018/01/10'
                    }, { value: 0, label: '2018/01/11' }, {
                        value: 0,
                        label: '2018/01/12'
                    }, { value: 0, label: '2018/01/13' }, {
                        value: 0,
                        label: '2018/01/14'
                    }, { value: 0, label: '2018/01/15' }, {
                        value: 0,
                        label: '2018/01/16'
                    }, { value: 0, label: '2018/01/17' }, {
                        value: 0,
                        label: '2018/01/18'
                    }, { value: 0, label: '2018/01/19' }, {
                        value: 0,
                        label: '2018/01/20'
                    }, { value: 0, label: '2018/01/21' }, {
                        value: 0,
                        label: '2018/01/22'
                    }, { value: 0, label: '2018/01/23' }, {
                        value: 0,
                        label: '2018/01/24'
                    }, { value: 0, label: '2018/01/25' }, {
                        value: 0,
                        label: '2018/01/26'
                    }, { value: 0, label: '2018/01/27' }, {
                        value: 0,
                        label: '2018/01/28'
                    }, { value: 0, label: '2018/01/29' }, {
                        value: 0,
                        label: '2018/01/30'
                    }, { value: 0, label: '2018/01/31' }, {
                        value: 0,
                        label: '2018/02/01'
                    }, { value: 0, label: '2018/02/02' }, {
                        value: 0,
                        label: '2018/02/03'
                    }, { value: 0, label: '2018/02/04' }, {
                        value: 0,
                        label: '2018/02/05'
                    }, { value: 0, label: '2018/02/06' }, {
                        value: 0,
                        label: '2018/02/07'
                    }, { value: 0, label: '2018/02/08' }, {
                        value: 0,
                        label: '2018/02/09'
                    }, { value: 0, label: '2018/02/10' }, {
                        value: 0,
                        label: '2018/02/11'
                    }, { value: 1, label: '2018/02/12' }, {
                        value: 0,
                        label: '2018/02/13'
                    }, { value: 0, label: '2018/02/14' }, {
                        value: 0,
                        label: '2018/02/15'
                    }, { value: 0, label: '2018/02/16' }, {
                        value: 0,
                        label: '2018/02/17'
                    }, { value: 0, label: '2018/02/18' }, {
                        value: 0,
                        label: '2018/02/19'
                    }, { value: 0, label: '2018/02/20' }, {
                        value: 0,
                        label: '2018/02/21'
                    }, { value: 0, label: '2018/02/22' }, {
                        value: 0,
                        label: '2018/02/23'
                    }, { value: 0, label: '2018/02/24' }, {
                        value: 0,
                        label: '2018/02/25'
                    }, { value: 0, label: '2018/02/26' }, {
                        value: 0,
                        label: '2018/02/27'
                    }, { value: 0, label: '2018/02/28' }, {
                        value: 0,
                        label: '2018/03/01'
                    }, { value: 0, label: '2018/03/02' }, {
                        value: 0,
                        label: '2018/03/03'
                    }, { value: 0, label: '2018/03/04' }, {
                        value: 2,
                        label: '2018/03/05'
                    }, { value: 0, label: '2018/03/06' }, {
                        value: 0,
                        label: '2018/03/07'
                    }, { value: 0, label: '2018/03/08' }, {
                        value: 0,
                        label: '2018/03/09'
                    }, { value: 0, label: '2018/03/10' }, {
                        value: 0,
                        label: '2018/03/11'
                    }, { value: 0, label: '2018/03/12' }, {
                        value: 0,
                        label: '2018/03/13'
                    }, { value: 0, label: '2018/03/14' }, {
                        value: 0,
                        label: '2018/03/15'
                    }, { value: 0, label: '2018/03/16' }, {
                        value: 0,
                        label: '2018/03/17'
                    }, { value: 0, label: '2018/03/18' }, {
                        value: 0,
                        label: '2018/03/19'
                    }, { value: 0, label: '2018/03/20' }, {
                        value: 0,
                        label: '2018/03/21'
                    }, { value: 0, label: '2018/03/22' }, {
                        value: 0,
                        label: '2018/03/23'
                    }, { value: 0, label: '2018/03/24' }, {
                        value: 0,
                        label: '2018/03/25'
                    }, { value: 0, label: '2018/03/26' }, {
                        value: 0,
                        label: '2018/03/27'
                    }, { value: 0, label: '2018/03/28' }, {
                        value: 0,
                        label: '2018/03/29'
                    }, { value: 0, label: '2018/03/30' }, {
                        value: 0,
                        label: '2018/03/31'
                    }, { value: 0, label: '2018/04/01' }, {
                        value: 0,
                        label: '2018/04/02'
                    }, { value: 0, label: '2018/04/03' }, {
                        value: 0,
                        label: '2018/04/04'
                    }, { value: 0, label: '2018/04/05' }, {
                        value: 0,
                        label: '2018/04/06'
                    }, { value: 0, label: '2018/04/07' }, {
                        value: 0,
                        label: '2018/04/08'
                    }, { value: 0, label: '2018/04/09' }, {
                        value: 0,
                        label: '2018/04/10'
                    }, { value: 0, label: '2018/04/11' }, {
                        value: 0,
                        label: '2018/04/12'
                    }, { value: 0, label: '2018/04/13' }, {
                        value: 0,
                        label: '2018/04/14'
                    }, { value: 0, label: '2018/04/15' }, {
                        value: 0,
                        label: '2018/04/16'
                    }, { value: 0, label: '2018/04/17' }, {
                        value: 0,
                        label: '2018/04/18'
                    }, { value: 0, label: '2018/04/19' }, {
                        value: 0,
                        label: '2018/04/20'
                    }, { value: 0, label: '2018/04/21' }, {
                        value: 0,
                        label: '2018/04/22'
                    }, { value: 0, label: '2018/04/23' }, {
                        value: 0,
                        label: '2018/04/24'
                    }, { value: 0, label: '2018/04/25' }, {
                        value: 0,
                        label: '2018/04/26'
                    }, { value: 0, label: '2018/04/27' }, {
                        value: 0,
                        label: '2018/04/28'
                    }, { value: 0, label: '2018/04/29' }, {
                        value: 0,
                        label: '2018/04/30'
                    }, { value: 0, label: '2018/05/01' }, {
                        value: 0,
                        label: '2018/05/02'
                    }, { value: 0, label: '2018/05/03' }, {
                        value: 0,
                        label: '2018/05/04'
                    }, { value: 0, label: '2018/05/05' }, {
                        value: 0,
                        label: '2018/05/06'
                    }, { value: 0, label: '2018/05/07' }, {
                        value: 0,
                        label: '2018/05/08'
                    }, { value: 0, label: '2018/05/09' }, {
                        value: 0,
                        label: '2018/05/10'
                    }, { value: 0, label: '2018/05/11' }, {
                        value: 0,
                        label: '2018/05/12'
                    }, { value: 0, label: '2018/05/13' }, {
                        value: 0,
                        label: '2018/05/14'
                    }, { value: 0, label: '2018/05/15' }, {
                        value: 0,
                        label: '2018/05/16'
                    }, { value: 0, label: '2018/05/17' }]
                }, {
                    title: '实际签约量',
                    list: [{ value: 0, label: '2017/11/18' }, {
                        value: 0,
                        label: '2017/11/19'
                    }, { value: 0, label: '2017/11/20' }, {
                        value: 0,
                        label: '2017/11/21'
                    }, { value: 0, label: '2017/11/22' }, {
                        value: 0,
                        label: '2017/11/23'
                    }, { value: 0, label: '2017/11/24' }, {
                        value: 0,
                        label: '2017/11/25'
                    }, { value: 0, label: '2017/11/26' }, {
                        value: 0,
                        label: '2017/11/27'
                    }, { value: 0, label: '2017/11/28' }, {
                        value: 0,
                        label: '2017/11/29'
                    }, { value: 0, label: '2017/11/30' }, {
                        value: 0,
                        label: '2017/12/01'
                    }, { value: 0, label: '2017/12/02' }, {
                        value: 0,
                        label: '2017/12/03'
                    }, { value: 0, label: '2017/12/04' }, {
                        value: 0,
                        label: '2017/12/05'
                    }, { value: 0, label: '2017/12/06' }, {
                        value: 0,
                        label: '2017/12/07'
                    }, { value: 0, label: '2017/12/08' }, {
                        value: 0,
                        label: '2017/12/09'
                    }, { value: 0, label: '2017/12/10' }, {
                        value: 0,
                        label: '2017/12/11'
                    }, { value: 0, label: '2017/12/12' }, {
                        value: 0,
                        label: '2017/12/13'
                    }, { value: 0, label: '2017/12/14' }, {
                        value: 0,
                        label: '2017/12/15'
                    }, { value: 0, label: '2017/12/16' }, {
                        value: 0,
                        label: '2017/12/17'
                    }, { value: 0, label: '2017/12/18' }, {
                        value: 0,
                        label: '2017/12/19'
                    }, { value: 0, label: '2017/12/20' }, {
                        value: 0,
                        label: '2017/12/21'
                    }, { value: 0, label: '2017/12/22' }, {
                        value: 0,
                        label: '2017/12/23'
                    }, { value: 0, label: '2017/12/24' }, {
                        value: 0,
                        label: '2017/12/25'
                    }, { value: 0, label: '2017/12/26' }, {
                        value: 0,
                        label: '2017/12/27'
                    }, { value: 0, label: '2017/12/28' }, {
                        value: 0,
                        label: '2017/12/29'
                    }, { value: 0, label: '2017/12/30' }, {
                        value: 0,
                        label: '2017/12/31'
                    }, { value: 0, label: '2018/01/01' }, {
                        value: 0,
                        label: '2018/01/02'
                    }, { value: 0, label: '2018/01/03' }, {
                        value: 0,
                        label: '2018/01/04'
                    }, { value: 0, label: '2018/01/05' }, {
                        value: 0,
                        label: '2018/01/06'
                    }, { value: 0, label: '2018/01/07' }, {
                        value: 0,
                        label: '2018/01/08'
                    }, { value: 0, label: '2018/01/09' }, {
                        value: 0,
                        label: '2018/01/10'
                    }, { value: 0, label: '2018/01/11' }, {
                        value: 0,
                        label: '2018/01/12'
                    }, { value: 0, label: '2018/01/13' }, {
                        value: 0,
                        label: '2018/01/14'
                    }, { value: 0, label: '2018/01/15' }, {
                        value: 0,
                        label: '2018/01/16'
                    }, { value: 0, label: '2018/01/17' }, {
                        value: 0,
                        label: '2018/01/18'
                    }, { value: 1, label: '2018/01/19' }, {
                        value: 0,
                        label: '2018/01/20'
                    }, { value: 0, label: '2018/01/21' }, {
                        value: 0,
                        label: '2018/01/22'
                    }, { value: 0, label: '2018/01/23' }, {
                        value: 0,
                        label: '2018/01/24'
                    }, { value: 0, label: '2018/01/25' }, {
                        value: 0,
                        label: '2018/01/26'
                    }, { value: 0, label: '2018/01/27' }, {
                        value: 0,
                        label: '2018/01/28'
                    }, { value: 1, label: '2018/01/29' }, {
                        value: 0,
                        label: '2018/01/30'
                    }, { value: 0, label: '2018/01/31' }, {
                        value: 0,
                        label: '2018/02/01'
                    }, { value: 0, label: '2018/02/02' }, {
                        value: 0,
                        label: '2018/02/03'
                    }, { value: 0, label: '2018/02/04' }, {
                        value: 0,
                        label: '2018/02/05'
                    }, { value: 0, label: '2018/02/06' }, {
                        value: 0,
                        label: '2018/02/07'
                    }, { value: 0, label: '2018/02/08' }, {
                        value: 0,
                        label: '2018/02/09'
                    }, { value: 0, label: '2018/02/10' }, {
                        value: 0,
                        label: '2018/02/11'
                    }, { value: 0, label: '2018/02/12' }, {
                        value: 0,
                        label: '2018/02/13'
                    }, { value: 0, label: '2018/02/14' }, {
                        value: 0,
                        label: '2018/02/15'
                    }, { value: 0, label: '2018/02/16' }, {
                        value: 0,
                        label: '2018/02/17'
                    }, { value: 0, label: '2018/02/18' }, {
                        value: 0,
                        label: '2018/02/19'
                    }, { value: 0, label: '2018/02/20' }, {
                        value: 0,
                        label: '2018/02/21'
                    }, { value: 0, label: '2018/02/22' }, {
                        value: 1,
                        label: '2018/02/23'
                    }, { value: 0, label: '2018/02/24' }, {
                        value: 0,
                        label: '2018/02/25'
                    }, { value: 0, label: '2018/02/26' }, {
                        value: 1,
                        label: '2018/02/27'
                    }, { value: 0, label: '2018/02/28' }, {
                        value: 0,
                        label: '2018/03/01'
                    }, { value: 0, label: '2018/03/02' }, {
                        value: 0,
                        label: '2018/03/03'
                    }, { value: 0, label: '2018/03/04' }, {
                        value: 1,
                        label: '2018/03/05'
                    }, { value: 0, label: '2018/03/06' }, {
                        value: 0,
                        label: '2018/03/07'
                    }, { value: 0, label: '2018/03/08' }, {
                        value: 0,
                        label: '2018/03/09'
                    }, { value: 0, label: '2018/03/10' }, {
                        value: 0,
                        label: '2018/03/11'
                    }, { value: 0, label: '2018/03/12' }, {
                        value: 0,
                        label: '2018/03/13'
                    }, { value: 0, label: '2018/03/14' }, {
                        value: 0,
                        label: '2018/03/15'
                    }, { value: 0, label: '2018/03/16' }, {
                        value: 0,
                        label: '2018/03/17'
                    }, { value: 0, label: '2018/03/18' }, {
                        value: 0,
                        label: '2018/03/19'
                    }, { value: 0, label: '2018/03/20' }, {
                        value: 0,
                        label: '2018/03/21'
                    }, { value: 0, label: '2018/03/22' }, {
                        value: 0,
                        label: '2018/03/23'
                    }, { value: 0, label: '2018/03/24' }, {
                        value: 0,
                        label: '2018/03/25'
                    }, { value: 0, label: '2018/03/26' }, {
                        value: 0,
                        label: '2018/03/27'
                    }, { value: 0, label: '2018/03/28' }, {
                        value: 0,
                        label: '2018/03/29'
                    }, { value: 0, label: '2018/03/30' }, {
                        value: 0,
                        label: '2018/03/31'
                    }, { value: 0, label: '2018/04/01' }, {
                        value: 0,
                        label: '2018/04/02'
                    }, { value: 0, label: '2018/04/03' }, {
                        value: 0,
                        label: '2018/04/04'
                    }, { value: 0, label: '2018/04/05' }, {
                        value: 0,
                        label: '2018/04/06'
                    }, { value: 0, label: '2018/04/07' }, {
                        value: 0,
                        label: '2018/04/08'
                    }, { value: 0, label: '2018/04/09' }, {
                        value: 0,
                        label: '2018/04/10'
                    }, { value: 0, label: '2018/04/11' }, {
                        value: 0,
                        label: '2018/04/12'
                    }, { value: 0, label: '2018/04/13' }, {
                        value: 0,
                        label: '2018/04/14'
                    }, { value: 0, label: '2018/04/15' }, {
                        value: 0,
                        label: '2018/04/16'
                    }, { value: 0, label: '2018/04/17' }, {
                        value: 0,
                        label: '2018/04/18'
                    }, { value: 0, label: '2018/04/19' }, {
                        value: 0,
                        label: '2018/04/20'
                    }, { value: 0, label: '2018/04/21' }, {
                        value: 0,
                        label: '2018/04/22'
                    }, { value: 0, label: '2018/04/23' }, {
                        value: 0,
                        label: '2018/04/24'
                    }, { value: 0, label: '2018/04/25' }, {
                        value: 0,
                        label: '2018/04/26'
                    }, { value: 0, label: '2018/04/27' }, {
                        value: 0,
                        label: '2018/04/28'
                    }, { value: 0, label: '2018/04/29' }, {
                        value: 0,
                        label: '2018/04/30'
                    }, { value: 0, label: '2018/05/01' }, {
                        value: 0,
                        label: '2018/05/02'
                    }, { value: 0, label: '2018/05/03' }, {
                        value: 0,
                        label: '2018/05/04'
                    }, { value: 0, label: '2018/05/05' }, {
                        value: 0,
                        label: '2018/05/06'
                    }, { value: 0, label: '2018/05/07' }, {
                        value: 0,
                        label: '2018/05/08'
                    }, { value: 0, label: '2018/05/09' }, {
                        value: 0,
                        label: '2018/05/10'
                    }, { value: 0, label: '2018/05/11' }, {
                        value: 0,
                        label: '2018/05/12'
                    }, { value: 0, label: '2018/05/13' }, {
                        value: 0,
                        label: '2018/05/14'
                    }, { value: 0, label: '2018/05/15' }, {
                        value: 0,
                        label: '2018/05/16'
                    }, { value: 0, label: '2018/05/17' }]
                }],
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
        };
    },
    components: { Linear, Bar, Maps },
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
                })
            }
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
