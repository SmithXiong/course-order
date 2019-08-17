import Mock from 'mockjs'

const List = [];
const count = 100;
const Random = Mock.Random;

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3';

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: Random.first(),
    address: Random.url('http'),
    platformId: Random.integer(1,1000).toString(),
    pushInterval: '@integer(300, 5000)',
    coursePrice: '@float(1, 100, 2, 2)',
    unitPrice: '@float(1, 10, 2, 2)',
    unitQuery: Random.boolean(),
    allowinput: Random.boolean(),
    DelayPush: Random.boolean(),
    announcement: '@title(5, 15)',
    updateAt: '@datetime'
  }))
}

export default [
  {
    url: '/platforms',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, pageSize = 10, sort } = config.query;

      /*let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false;
        if (type && item.type !== type) return false;
        if (title && item.title.indexOf(title) < 0) return false;
        return true
      });

      if (sort === '-id') {
        mockList = mockList.reverse()
      }*/

      const pageList = List.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1));

      return {
        code: 20000,
        message: "success",
        data: {
          pageInfo: {
            total: List.length,
            page: page,
            pageSize: pageSize,
            totalPage: parseInt(List.length/pageSize)
          },
          list: pageList
        }
      }
    }
  },

  {
    url: '/platforms/:id',
    type: 'get',
    response: config => {
      const { id } = config.query;
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/platforms',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/platforms',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

