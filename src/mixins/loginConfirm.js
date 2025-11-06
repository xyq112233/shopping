export default {
  data () {
    return {
      title: '标题'
    }
  },
  methods: {
    sayHi () {
      console.log('hello')
    },
    loginConfirm () {
      if (!this.$store.getters.token) {
        // console.log('加入购物车')
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            this.$router.replace({
              path: '/login',
              query: {
                redirect: this.$route.fullPath
              }
            })
          })
          .catch(() => {
            console.log('用户点击了取消')
          })
        return true
      }
      return false
    }
  }
}
