<template>
    <div class="top-left-btn" :style="style">
        <el-row>
            <el-tooltip v-if="add" :content="t('button.new')" placement="top">
                <el-button circle icon="DocumentAdd" @click="handleChange('docAdd')" />
            </el-tooltip>
            <el-tooltip v-if="del" :content="t('button.delete')" placement="top">
                <el-button circle icon="Delete" :disabled="delDis" @click="handleChange('docDelete')" />
            </el-tooltip>
            <el-tooltip v-if="edit" :content="t('button.edit')" placement="top">
                <el-button circle icon="EditPen" :disabled="editDis" @click="handleChange('docEdit')" />
            </el-tooltip>
            <el-tooltip v-if="showSet" :content="t('button.setStatus')" placement="top">
                <el-button circle icon="Switch" @click="handleChange('docStatus')" />
            </el-tooltip>
            <el-tooltip v-if="showToogle" :content="t('button.setStatus')" placement="top">
                <el-switch :model-value="toogle" @change="handleToogle($event)" style="margin:0 10px" />
            </el-tooltip>
            <el-tooltip v-if="showExport" :content="t('button.setStatus')" placement="top">
                <el-button circle icon="Upload" @click="handleChange('docExport')" />
            </el-tooltip>
            <!-- <el-tooltip v-if="search" class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
                <el-button circle icon="Search" @click="toggleSearch()" />
            </el-tooltip>
            <el-tooltip v-if="columns" class="item" effect="dark" content="显隐列" placement="top">
                <el-button circle icon="Menu" @click="showColumn()" />
            </el-tooltip> -->
        </el-row>
        <el-dialog v-model="open" :title="title" append-to-body>
            <el-transfer v-model="value" :titles="['显示', '隐藏']" :data="columns" @change="dataChange"></el-transfer>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { type } from 'os';
import { ref, computed } from 'vue';
import { useI18n } from "vue-i18n";
const { t } = useI18n()

const props = defineProps({
    add: {
        type: Boolean,
        default: true,
    },
    del: {
        type: Boolean,
        default: true,
    },
    edit: {
        type: Boolean,
        default: true,
    },
    delDis: {
        type: Boolean,
        default: true,
    },
    editDis: {
        type: Boolean,
        default: true,
    },
    showSet: {
        type: Boolean,
        default: true,
    },
    toogle: {
        type: Boolean,
        default: true,
    },
    showToogle: {
        type: Boolean,
        default: true,
    },
    showExport: {
        type: Boolean,
        default: true,
    },
    showSearch: {
        type: Boolean,
        default: true,
    },
    columns: {
        type: Array as () => Array<any>,
    },
    search: {
        type: Boolean,
        default: true,
    },
    gutter: {
        type: Number,
        default: 10,
    },
});

const emits = defineEmits(['update:showSearch', 'update:toogle', 'docAdd', 'docDelete', 'docEdit', 'docStatus', 'docExport', 'queryTable']);

// 显隐数据
const value = ref<any[]>([]);
// 弹出层标题
const title = ref('显示/隐藏');
// 是否显示弹出层
const open = ref(false);
// const toogle = ref(true)
const style = computed(() => {
    const ret: any = {};
    if (props.gutter) {
        ret.marginRight = `${props.gutter / 2}px`;
    }
    return ret;
});

// 事件
function handleChange(type: any) {
    emits(type)
}
function handleToogle(val: any) {
    emits('update:toogle', val)
}

// 新增
function handleAdd() {
    emits('docAdd')
}

// 删除
function handleDelete() {
    emits('docDelete')
}

// 搜索
function toggleSearch() {
    emits('update:showSearch', !props.showSearch);
}

// 刷新
function refresh() {
    emits('queryTable');
}

// 右侧列表元素变化
function dataChange(data: any) {
    for (let item in props.columns) {
        const key = props.columns[item as any].key;
        // eslint-disable-next-line vue/no-mutating-props
        props.columns[item as any].visible = !data.includes(key);
    }
}

// 打开显隐列dialog
function showColumn() {
    open.value = true;
}

// 显隐列初始默认隐藏列
for (let item in props.columns) {
    if (props.columns[item as any].visible === false) {
        value.value.push(parseInt(item));
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-transfer__button) {
    border-radius: 50%;
    display: block;
    margin-left: 0px;
}

:deep(.el-transfer__button:first-child) {
    margin-bottom: 10px;
}

.my-el-transfer {
    text-align: center;
}
</style>
