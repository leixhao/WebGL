<template>
    <div :class="{'has-logo': showLogo}" :style="{
        backgroundColor:
            sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground,
    }">
        <logo v-if="showLogo" :class="{'light':sideTheme !== 'theme-dark'}" :collapse="isCollapse" />
        <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground
                " :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true" :active-text-color="theme" :collapse-transition="false" mode="vertical">
                <sidebar-item v-for="(routeItem, index) in sidebarRouters" :key="routeItem.path + index"
                    :item="routeItem" :base-path="routeItem.path" />
            </el-menu>
        </el-scrollbar>
        <!-- 配置中心 版本等 -->
        <!-- <SubMenu :class="sideTheme === 'theme-dark'?'dark':'light'"></SubMenu> -->
    </div>
</template>

<script setup lang="ts">
    import Logo from './Logo.vue';
    import SidebarItem from './SidebarItem.vue';
    import variables from '@/assets/styles/variables.module.scss';
    import useAppStore from '@/store/modules/app';
    import useSettingsStore from '@/store/modules/settings';
    import usePermissionStore from '@/store/modules/permission';
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
    import SubMenu from "./sub-menu.vue"
    const route = useRoute();
    const appStore = useAppStore();
    const settingsStore = useSettingsStore();
    const permissionStore = usePermissionStore();

    const sidebarRouters = computed(() => permissionStore.sidebarRouters);
    const showLogo = computed(() => settingsStore.sidebarLogo);
    const sideTheme = computed(() => settingsStore.sideTheme);
    const theme = computed(() => settingsStore.theme);
    const isCollapse = computed(() => !appStore.sidebar.opened);

    const activeMenu = computed(() => {
        const { meta, path } = route;
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
            console.log(meta.activeMenu)
            return meta.activeMenu;
        }
        return path;
    });
</script>