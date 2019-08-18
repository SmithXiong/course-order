import Mock from 'mockjs'

const List = [];
const count = 100;
const Random = Mock.Random;

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>';
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3';

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    orderNumber: '@integer(300, 5000)',
    'flowInfo|1': ['订单支付','上级充值','管理员充值','下级佣金','开户支出'],
    'flowType|1': ['支出','收入'],
    nickName: Random.first(),
    id: Random.last(),
    balanceBefore: '@float(100, 200, 2, 2)',
    balanceAfter: '@float(1, 100, 2, 2)',
    createAt: '@datetime',
    updateAt: '@datetime'
  }))
}

export default [
  {
    url: '/finance',
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
]

