import { SUCCESS_CODE } from '@/constants'

const timeout = 1000

const testList = [
  {
    path: '/index',
    component: '#',
    redirect: '/index/welcome',
    name: 'Index',
    meta: {
      title: 'router.dashboard',
    },
    children: [
      {
        path: 'welcome',
        component: 'views/Welcome/Welcome',
        name: 'Welcome',
        meta: {
          title: 'router.welcome',
          icon: 'material-symbols:home-outline',
          noCache: true,
          affix: true
        }
      }
    ]
  },
  {
    path: '/authorization/algorithm',
    component: 'views/Authorization/Algorithm/Algorithm',
    name: 'Algorithm',
    meta: {
      title: 'router.algorithm',
      noCache: true,
      icon: 'tabler:math',
    },
  },
  {
    path: '/authorization',
    component: '#',
    name: 'Authorization',
    meta: {
      title: 'router.authorization',
      icon: 'vi-eos-icons:role-binding',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'algorithm',
        component: 'views/Authorization/Algorithm/Algorithm',
        name: 'Algorithm',
        meta: {
          title: 'router.algorithm'
        }
      }
    ]
  },
  {
    path: '/lida',
    component: '#',
    redirect: '/lida/index',
    name: 'Lida',
    meta: {
      title: 'router.dashboard',
    },
    children: [
      {
        path: 'index',
        component: 'views/Lida/Lida',
        name: 'Lida',
        meta: {
          title: 'router.lida',
          icon: 'eos-icons:edge-computing-outlined',
          noCache: true,
        }
      }
    ]
  },
  {
    path: '/problem',
    component: '#',
    redirect: '/problem/index',
    name: 'Problem',
    meta: {
      title: 'router.problem',
    },
    children: [
      {
        path: 'index',
        component: 'views/Problem/Problem',
        name: 'Problem',
        meta: {
          title: 'router.problem',
          icon: 'fluent:person-feedback-16-regular',
          noCache: true,
        }
      }
    ]
  },
  {
    path: '/notify',
    component: '#',
    redirect: '/notify/index',
    name: 'Notify',
    meta: {
      title: 'router.notify',
    },
    children: [
      {
        path: 'index',
        component: 'views/Notify/Notify',
        name: 'Notify',
        meta: {
          title: 'router.notify',
          icon: 'ic:outline-message',
          noCache: true,
        }
      }
    ]
  },
]

const adminList = [
  {
    path: '/index',
    component: '#',
    redirect: '/index/show',
    name: 'Index',
    meta: {
      title: 'router.dashboard'
    },
    children: [
      {
        path: 'show',
        component: 'views/Show/Show',
        name: 'Show',
        meta: {
          title: 'router.dashboard',
          icon: 'material-symbols:home-outline',
          noCache: true,
          affix: true
        }
      },
      {
        path: 'lab-charts',
        component: 'views/LabCharts/LabCharts',
        name: 'LabCharts',
        meta: {
          title: 'router.view',
          icon: 'ph:chart-line',
          nocache: true,
          hidden: true
        }
      }
    ]
  },
  {
    path: '/authorization/user',
    component: 'views/Authorization/User/User',
    name: 'User',
    meta: {
      title: 'router.user',
      icon: "mdi:user"
    }
  },
  {
    path: '/authorization/lab',
    component: 'views/Authorization/Lab/Lab',
    name: 'Lab',
    meta: {
      title: 'router.lab',
      icon: "icomoon-free:lab"
    }
  },
  {
    path: '/authorization/container',
    component: 'views/Authorization/Container/Container',
    name: 'Container',
    meta: {
      title: 'router.container',
      icon: "mdi:docker"
    }
  },
  {
    path: '/authorization/message',
    component: 'views/Authorization/Message/Message',
    name: 'Message',
    meta: {
      title: 'router.message',
      icon: "ic:outline-message"
    }
  },
  {
    path: '/authorization',
    component: '#',
    name: 'Authorization',
    meta: {
      title: 'router.authorization',
      icon: 'vi-eos-icons:role-binding',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: 'lab',
        component: 'views/Authorization/Lab/Lab',
        name: 'Lab',
        meta: {
          title: 'router.lab',
          icon: "icomoon-free:lab"
        }
      },
      {
        path: 'container',
        component: 'views/Authorization/Container/Container',
        name: 'Container',
        meta: {
          title: 'router.container',
          icon: "mdi:docker"
        }
      },
      {
        path: 'user',
        component: 'views/Authorization/User/User',
        name: 'User',
        meta: {
          title: 'router.user',
          icon: "mdi:user"
        }
      },
      {
        path: 'message',
        component: 'views/Authorization/Message/Message',
        name: 'Message',
        meta: {
          title: 'router.message',
          icon: "ic:outline-message"
        }
      }
    ]
  }
]

const List: any[] = []

const roleNames = ['管理员', '普通用户']

roleNames.forEach(roleName => {
  List.push({ roleName })
})

export default [
  // 列表接口
  {
    url: '/mock/role/adminlist',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: adminList
      }
    }
  },
  // 列表接口
  {
    url: '/mock/role/testlist',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: testList
      }
    }
  },
  {
    url: '/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List,
          total: 2
        }
      }
    }
  }
]
