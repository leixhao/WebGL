<template>
    <div class="other-container" v-show="!isCollapse">
        <ul>
            <li v-for="item in menuList" :key='item.id'>
                <svg-icon :icon-class="item.icon" />
                <span>{{item.name}}</span>
            </li>
        </ul>
        <div class="versions">
            当前版本：{{version}}
        </div>
    </div>
</template>

<script lang="ts" setup>
    import useAppStore from '@/store/modules/app';
    import { computed, watch, ref } from 'vue';
    const appStore = useAppStore();
    const isCollapse = computed(() => !appStore.sidebar.opened);
    interface Row {
        id : number
        name : string
        icon : string
    }
    const menuList : Row[] = [{
        id: 1,
        name: '配置中心',
        icon: 'system',
    },
    {
        id: 2,
        name: '监控中心',
        icon: 'monitor'
    },
    {
        id: 3,
        name: '版本及更新日志',
        icon: 'documentation'
    }
    ]
    const version = ref('v1.2.6')
</script>

<style lang="scss" scoped>
    .other-container {
        height: 190px;
        border-top: 1px solid #888;
        padding: 5px 15px;
        color: #bbb;
        font-size: 13px;

        ul {

            li {
                line-height: 32px;
                cursor: pointer;

                &>.svg-icon {
                    font-size: 13px;
                }

                &:hover {
                    color: #ccc;
                }
            }
        }

        .versions {
            margin-top: 5px;
            line-height: 30px;
        }
    }
</style>