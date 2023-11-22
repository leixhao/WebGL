<template>
    <el-row type="flex" :gutter="20" class="ul">
        <el-col :span="6" v-for="item in systemList" :key="item.id">
            <el-row class="item" @click.native="handClick(item)">
                <img :src="item.img" alt="" srcset="" />
                <el-row type="flex" justify="center" class="subItem">
                    <span class="t1">{{ item.appAbbr }}</span>
                    <span class="t2" v-html="item.appDesc"></span>
                </el-row>
            </el-row>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
import { getAppList } from "@/api/system/aescapp";
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
const systemList = ref([])
const emit = defineEmits(['select']);
queryAppList();
function queryAppList() {
    systemList.value = []; //任务大类字典
    getAppList({}).then((response) => {
        systemList.value = response.data.map((el: any) => ({
            ...el,
            img: el.appDevice == 'APP' ? new URL('@/assets/images/app.png',import.meta.url).href : new URL('@/assets/images/pc.png',import.meta.url).href
        }));
    });
}
function handClick(item: any) {
    console.log(item);
    emit('select', item);
}
</script>
<style lang="scss" scoped>
.ul {
    padding-top: 53px;
    padding-right: 48px;
    padding-left: 72px;
    flex-wrap: wrap;
    width: 100%;


    .item {
        background: linear-gradient(180deg, rgba(244, 245, 248, 0.72) 0%, #FFFFFF 100%);
        box-shadow: 2px 5px 17px 0px rgba(218, 218, 218, 0.2);
        border-radius: 4px;
        border: 2px solid;
        border-image: linear-gradient(180deg, rgba(255, 255, 255, 0.49), rgba(255, 255, 255, 1)) 2 2;
        display: flex;
        margin-bottom: 20px;

        cursor: pointer;

        &:hover {
            background: linear-gradient(180deg, #F0F9FF 0%, #EEF5FF 100%);
            box-shadow: inset 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            border: 2px solid;
            border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) 2 2;
        }

        img {
            margin-top: 16px;
            margin-left: 2px;
            margin-bottom: 27px;
            width: 110px;
            height: 110px;
        }

        .subItem {
            flex-direction: column;
            text-align: left;

            .t1 {
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.9);
            }

            .t2 {
                font-size: 15px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.4);
            }
        }
    }
}
</style>