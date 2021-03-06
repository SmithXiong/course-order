import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 's-home', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: {
          title: '用户手册',
          icon: 'notebook-1',
          noCache: true
        }
      }]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '课堂下单',
      icon: 's-goods',
      noCache: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/course/index'),
        name: 'Course',
        hidden: true,
        meta: {
          title: '课堂下单',
          icon: 's-goods',
          noCache: true
        }
      },
      {
        path: 'order/:id/:courseName',
        component: () => import('@/views/course/order'),
        name: 'CourseOrder',
        hidden: true,
        meta: {
          icon: 's-goods',
          noCache: true
        }
      }]
  },
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/orders/index'),
        name: 'Orders',
        meta: {
          title: '订单查询',
          icon: 's-order',
          noCache: true
        }
      }]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/finance/index'),
        name: 'Finance',
        meta: {
          title: '财务管理',
          icon: 's-finance',
          noCache: true
        }
      }]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/agent/index'),
        name: 'Agent',
        meta: {
          title: '代理管理',
          icon: 'user-solid',
          noCache: true
        }
      }]
  },
  {
    path: '/benefits',
    component: Layout,
    redirect: '/benefits/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/empty/index'),
        name: 'Benefits',
        meta: {
          title: '每日福利',
          icon: 'present',
          noCache: true
        }
      }]
  },
  {
    path: '/explain',
    component: Layout,
    redirect: '/explain/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/empty/index'),
        name: 'Explain',
        meta: {
          title: '对接说明',
          icon: 'notebook-2',
          noCache: true
        }
      }]
  },
  /*  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },*/
  /*  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },*/
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/backend',
    component: Layout,
    redirect: '/backend/platform',
    alwaysShow: true, // will always show the root menu
    name: 'Backend',
    meta: {
      title: '后台管理',
      icon: 'setting',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: 'notice',
        component: () => import('@/views/backend/notice/index'),
        name: 'Notice',
        meta: {
          title: '公告管理',
          noCache: true
        }
      },
      {
        path: 'level',
        component: () => import('@/views/backend/level/index'),
        name: 'Level',
        meta: {
          title: '等级管理',
          noCache: true
        }
      },
      {
        path: 'platform',
        component: () => import('@/views/backend/platform/index'),
        name: 'Platform',
        meta: {
          title: '平台管理',
          noCache: true
        }
      },
      {
        path: 'online',
        component: () => import('@/views/backend/online/index'),
        name: 'Online',
        meta: {
          title: '在线用户'
        }
      },
      {
        path: 'banner',
        component: () => import('@/views/backend/banner/index'),
        name: 'Banner',
        meta: {
          title: '更换Banner',
          noCache: true
        }
      },
/*      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }*/
    ]
  },

  /*  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },*/

  /** when your routing map is too long, you can split it into small modules **/
  /*  componentsRouter,
  chartsRouter,
  nestedRouter,*/

  /*  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },*/

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  /*  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher // reset router
}

export default router
