<template>
<div class="main-wrap">
    <bi-line-s :data="initsigndata.data" :options="lineOption" :width="800" :height="300" domainType="time" :refresh.sync="refresh"></bi-line-s>
</div>
</template>

<script>
import BiLineS from '@/components/biLineS';

export default {
    data() {
        return {
            lineOption: {
                domainType: 'time'
            },
            refresh: false,
            initsigndata: {
                data: [
                    {
                        title: '资源量',
                        list: [{
                            value: 0,
                            label: 1522512000000
                        }, {
                            value: 0,
                            label: 1522598400000
                        }, {
                            value: 7,
                            label: 1522684800000
                        }, {
                            value: 0,
                            label: 1522771200000
                        }, {
                            value: 0,
                            label: 1522857600000
                        }, {
                            value: 0,
                            label: 1522944000000
                        }, {
                            value: 1,
                            label: 1523030400000
                        }, {
                            value: 0,
                            label: 1523116800000
                        }, {
                            value: 1,
                            label: 1523203200000
                        }, {
                            value: 2,
                            label: 1523289600000
                        }, {
                            value: 4,
                            label: 1523376000000
                        }, {
                            value: 11,
                            label: 1523462400000
                        }, {
                            value: 27,
                            label: 1523548800000
                        }, {
                            value: 0,
                            label: 1523635200000
                        }, {
                            value: 0,
                            label: 1523721600000
                        }, {
                            value: 3,
                            label: 1523808000000
                        }, {
                            value: 0,
                            label: 1523894400000
                        }, {
                            value: 2,
                            label: 1523980800000
                        }, {
                            value: 0,
                            label: 1524067200000
                        }, {
                            value: 0,
                            label: 1524153600000
                        }, {
                            value: 2,
                            label: 1524240000000
                        }, {
                            value: 0,
                            label: 1524326400000
                        }, {
                            value: 2,
                            label: 1524412800000
                        }, {
                            value: 1,
                            label: 1524499200000
                        }, {
                            value: 3,
                            label: 1524585600000
                        }, {
                            value: 0,
                            label: 1524672000000
                        }]
                    },
                    {
                        title: '当期签约量',
                        list: [{
                            value: 0,
                            label: 1522512000000
                        }, {
                            value: 0,
                            label: 1522598400000
                        }, {
                            value: 0,
                            label: 1522684800000
                        }, {
                            value: 0,
                            label: 1522771200000
                        }, {
                            value: 0,
                            label: 1522857600000
                        }, {
                            value: 0,
                            label: 1522944000000
                        }, {
                            value: 0,
                            label: 1523030400000
                        }, {
                            value: 0,
                            label: 1523116800000
                        }, {
                            value: 0,
                            label: 1523203200000
                        }, {
                            value: 0,
                            label: 1523289600000
                        }, {
                            value: 0,
                            label: 1523376000000
                        }, {
                            value: 1,
                            label: 1523462400000
                        }, {
                            value: 0,
                            label: 1523548800000
                        }, {
                            value: 0,
                            label: 1523635200000
                        }, {
                            value: 0,
                            label: 1523721600000
                        }, {
                            value: 1,
                            label: 1523808000000
                        }, {
                            value: 0,
                            label: 1523894400000
                        }, {
                            value: 0,
                            label: 1523980800000
                        }, {
                            value: 0,
                            label: 1524067200000
                        }, {
                            value: 0,
                            label: 1524153600000
                        }, {
                            value: 0,
                            label: 1524240000000
                        }, {
                            value: 0,
                            label: 1524326400000
                        }, {
                            value: 0,
                            label: 1524412800000
                        }, {
                            value: 0,
                            label: 1524499200000
                        }, {
                            value: 0,
                            label: 1524585600000
                        }, {
                            value: 0,
                            label: 1524672000000
                        }]
                    },
                    {
                        title: '实际签约量',
                        list: [{
                            value: 0,
                            label: 1522512000000
                        }, {
                            value: 0,
                            label: 1522598400000
                        }, {
                            value: 0,
                            label: 1522684800000
                        }, {
                            value: 0,
                            label: 1522771200000
                        }, {
                            value: 0,
                            label: 1522857600000
                        }, {
                            value: 0,
                            label: 1522944000000
                        }, {
                            value: 0,
                            label: 1523030400000
                        }, {
                            value: 0,
                            label: 1523116800000
                        }, {
                            value: 0,
                            label: 1523203200000
                        }, {
                            value: 0,
                            label: 1523289600000
                        }, {
                            value: 0,
                            label: 1523376000000
                        }, {
                            value: 0,
                            label: 1523462400000
                        }, {
                            value: 0,
                            label: 1523548800000
                        }, {
                            value: 0,
                            label: 1523635200000
                        }, {
                            value: 0,
                            label: 1523721600000
                        }, {
                            value: 0,
                            label: 1523808000000
                        }, {
                            value: 0,
                            label: 1523894400000
                        }, {
                            value: 0,
                            label: 1523980800000
                        }, {
                            value: 0,
                            label: 1524067200000
                        }, {
                            value: 0,
                            label: 1524153600000
                        }, {
                            value: 0,
                            label: 1524240000000
                        }, {
                            value: 0,
                            label: 1524326400000
                        }, {
                            value: 0,
                            label: 1524412800000
                        }, {
                            value: 0,
                            label: 1524499200000
                        }, {
                            value: 0,
                            label: 1524585600000
                        }, {
                            value: 0,
                            label: 1524672000000
                        }]
                    }],
            }
        };
    },
    components: {BiLineS},
    mounted() {
        setInterval(() => {
            let ary = [7, 1, 9, 112, 6, 3, 2, 91];
            this.initsigndata.data = this.initsigndata.data.map((item) => {
                let index = Math.random() * ary.length - 1 | 0;
                item.list.forEach((list) => {
                    list.value = (Math.random() * ary[index]) | 0;
                });
                return item;
            });
            // this.refresh = true;
        }, 3500);
    }
};
</script>

<style scoped>
.bi {
    width: 100%;
}
</style>
