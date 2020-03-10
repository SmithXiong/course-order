import { asyncRoutes, constantRoutes } from '@/router'
import {fetchPlatformList} from '@/api/platform'

let constants = constantRoutes;

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  });

  return res
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constants.concat(routes)
  }
};

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      fetchPlatformList({
        page: 1,
        pageSize: 100
      }).then(response => {
        let list = response.data.list || [];
        let platRoutes = list.map((o,i) => ({
          path: `order/${o.course_platform_id}/${encodeURIComponent(o.name)}`,
          component: () => import('@/views/course/order'),
          name: `CourseOrder${i}`,
          meta: {
            title: o.name,
            noCache: true
          }
        }));
        let child = constants[6].children;
        constants[6].children = [child[0],child[1],...platRoutes]
      }).finally(() => {
        let accessedRoutes;
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        commit('SET_ROUTES', accessedRoutes);
        resolve(accessedRoutes)
      })
    })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
