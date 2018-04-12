<template>
<div >
    <div class="tabWrap">
        <div class="tabHead">
            <ul>
                <li v-for="(item, index) in tabs.data" :data-tab="item.data" @click="tabChange(index, $event)" :class="[item.classes, {'active': tabs.choose === index}]">{{item.content}}</li>
            </ul>

        </div>
        <div class="tabBody">
            <div v-for="(item, index) in tabs.data" :class="['tabSection', {'active': tabs.choose === index}]">{{index}}</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            tabs: {
                choose: 0,
                data: [
                    {
                        data: 'major',
                        classes: 'cpss_sideBar_icon_01_ov',
                        content: '主修课'
                    },
                    {
                        data: 'oral',
                        classes: 'cpss_sideBar_icon_02_ov left150',
                        content: '口语课'
                    },
                    {
                        data: 'special',
                        classes: 'cpss_sideBar_icon_03_ov left300',
                        content: '技能课'
                    },
                    {
                        data: 'elective',
                        classes: 'cpss_sideBar_icon_04_ov left450',
                        content: '选修课'
                    },
                    {
                        data: 'custom',
                        classes: 'cpss_sideBar_icon_05_ov left600',
                        content: '定制课'
                    }
                ],
            }
        };
    },
    methods: {
        tabChange(index, {target}) {
            let {tab} = target.dataset;
            this.tabs.choose = index;
            console.log(index, tab);
        }
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tabWrap {
    .tabHead {
        .active {
            color: red;
        }
    }
    .tabBody {
        .tabSection {
            display: none;
        }
        .active {
            display: block;
        }

    }

}
</style>
