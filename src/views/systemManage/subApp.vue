<template>
    <el-row type="flex" justify="center" :gutter="58" class="ul">

        <el-row v-for="item in systemList" :key="item.id" type="flex" justify="center" align="middle" class="item">
            <span>类目一</span>
        </el-row>

    </el-row>
</template>
<script setup lang="ts" name="subApp">
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
const systemList = ref([
    {
        id: 1,
    }, {
        id: 2,
    }, {
        id: 3,
    }, {
        id: 4,
    }, {
        id: 5,
    },
])
</script>
<style lang="scss" scoped>
.ul {
    display: inline-flex;
    flex-wrap: wrap;
    width: 716px;
    gap: 37px 58px;
    margin-top: 67px;

    .item {
        width: 200px;
        height: 200px;
        background: linear-gradient(180deg, rgba(244, 245, 248, 0.72) 0%, #FFFFFF 100%);
        box-shadow: 2px 5px 17px 0px rgba(218, 218, 218, 0.2);
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.49);

        // margin-bottom: 20px;
        cursor: pointer;

        &:hover {
            background: linear-gradient(180deg, #F0F9FF 0%, #EEF5FF 100%);
            box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
            border-radius: 100px;
            border: 2px solid rgba(255, 255, 255, 1);
        }

        span {
            font-size: 26px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.9);
        }
    }
}
</style>