import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';
/* Layout */
import Layout from '@/layout/index.vue';

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */
declare module 'vue-router' {
    interface RouteMeta {
        hidden?: boolean;
        title?: string;
        icon?: string;
        elSvgIcon?: string;
        permissions?: string[]
    }
    interface _RouteRecordBase {
        hidden?: boolean;
        parentPath?: string;
        permissions?: string[]

    }
    interface _RouteLocationBase {
        title?: string;
    }
}

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue'),
            },
        ],
    },
    {
        path: '/login',
        component: () => import('@/views/login.vue'),
        hidden: true,
    },
    {
        path: '/register',
        component: () => import('@/views/register.vue'),
        hidden: true,
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/error/404.vue'),
        hidden: true,
    },
    {
        path: '/401',
        component: () => import('@/views/error/401.vue'),
        hidden: true,
    },
    {
        path: '',
        hidden: true,
        component: Layout,
        redirect: '/index',
        // children: [
        //     {
        //         path: '/index',
        //         component: () => import('@/views/template/matrix/index.vue'),
        //         name: 'Index',
        //         meta: { title: '变更矩阵', icon: 'dashboard', affix: true },
        //     },
        // ],
    },
    {
        path: '/template',
        hidden: false,
        component: Layout,
        meta: { title: '模板管理', icon: 'dashboard'},
        children: [
            {
                path: '/index',
                component: () => import('@/views/template/matrix/index.vue'),
                name: 'matrix',
                meta: { title: '变更矩阵', },
            },
            {
                path: '/chePro',
                component: () => import('@/views/template/chePro/index.vue'),
                name: 'chePro',
                meta: { title: '变更流程', },
            },
        ],
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'profile',
                component: () => import('@/views/system/user/profile/index.vue'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user' },
            },
        ],
    },
    {
        path: '/system',
        component: Layout,
        hidden: true,
        children: [{
            path: 'aescapp/index',
            component: () => import('@/views/system/aescapp/index.vue'),
            name: 'aescapp',
            meta: { title: '应用管理', icon: '' }
        },
        {
            path: '/system/email',
            component: () => import('@/views/system/email/index.vue'),
            // component: (resolve) => require(['@/views/index'], resolve),
            name: 'Email',
            meta: { title: '邮箱配置', icon: 'email', affix: false }
        },
        {
            path: '/system/wechat',
            component: () => import('@/views/system/wechat/index.vue'),
            name: 'Wechat',
            meta: { title: '企业微信小程序配置', icon: 'wechat', affix: false }
        },
        {
            path: '/system/robot',
            component: () => import('@/views/system/robot/index.vue'),
            name: 'Robot',
            meta: { title: '企业微信机器人配置', icon: 'people', affix: false }
        },
        {
            path: '/system/template',
            component: () => import('@/views/system/template/index.vue'),
            name: 'TemplateIndex',
            meta: { title: '模板配置', icon: 'excel', affix: false }
        },
        {
            path: '/monitor/emailLog',
            component: () => import('@/views/monitor/emailLog/index.vue'),
            name: 'EmailLog',
            meta: { title: '邮件通知日志', icon: 'log', affix: false }

        },
        {
            path: '/monitor/wechatLog',
            component: () => import('@/views/monitor/wechatLog/index.vue'),
            name: 'WechatLog',
            meta: { title: '微信通知日志', icon: 'log', affix: false }
        }]
    },

];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes: RouteRecordRaw[] = [
    {
        path: '/system/user-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:user:edit'],
        children: [
            {
                path: 'role/:userId(\\d+)',
                component: () => import('@/views/system/user/authRole.vue'),
                name: 'AuthRole',
                meta: { title: '分配角色', activeMenu: '/system/user' },
            },
        ],
    },
    {
        path: '/system/role-auth',
        component: Layout,
        hidden: true,
        permissions: ['system:role:edit'],
        children: [
            {
                path: 'user/:roleId(\\d+)',
                component: () => import('@/views/system/role/authUser.vue'),
                name: 'AuthUser',
                meta: { title: '分配用户', activeMenu: '/system/role' },
            },
        ],
    },
    {
        path: '/system/dict-data',
        component: Layout,
        hidden: true,
        permissions: ['system:dict:list'],
        children: [
            {
                path: 'index/:dictId(\\d+)',
                component: () => import('@/views/system/dict/data.vue'),
                name: 'Data',
                meta: { title: '字典数据', activeMenu: '/system/dict' },
            },
        ],
    },
    {
        path: '/monitor/job-log',
        component: Layout,
        hidden: true,
        permissions: ['monitor:job:list'],
        children: [
            {
                path: 'index/:jobId(\\d+)',
                component: () => import('@/views/monitor/job/log.vue'),
                name: 'JobLog',
                meta: { title: '调度日志', activeMenu: '/monitor/job' },
            },
        ],
    },
    {
        path: '/tool/gen-edit',
        component: Layout,
        hidden: true,
        permissions: ['tool:gen:edit'],
        children: [
            {
                path: 'index/:tableId(\\d+)',
                component: () => import('@/views/tool/gen/editTable.vue'),
                name: 'GenEdit',
                meta: { title: '修改生成配置', activeMenu: '/tool/gen' },
            },
        ],
    },
];
// console.log(import.meta.env)
const router = createRouter({
    history: createWebHistory('/ecm/'),
    routes: constantRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

export default router;
