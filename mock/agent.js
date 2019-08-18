import Mock from 'mockjs'

const List = [];
const count = 100;
const Random = Mock.Random;

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3';

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    name: Random.first(),
    nickName: Random.last(),
    id: Random.string(),
    password: Random.string(),
    balance: Random.integer(1,100),
    level: Random.integer(1,100),
    updateAt: '@datetime'
  }))
}

export default [
  {
    url: '/agentAccounts',
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
    url: '/agentAccount/:id',
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
    url: '/agentAccount',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/agentAccount',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

