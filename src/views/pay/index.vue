<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址相关 -->
    <div class="address" @click="showAddressModal = true">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>
      <!-- 新增地址弹窗 -->
<van-popup v-model="showAddressModal" position="bottom" round>
  <div class="address-popup">
    <div class="popup-header">
      <h3>添加配送地址</h3>
      <van-icon name="cross" @click="showAddressModal = false" />
    </div>
    <div class="popup-content">
      <van-field v-model="fixedAddress.name" label="收货人" placeholder="请输入收货人姓名" />
      <van-field v-model="fixedAddress.phone" label="手机号" placeholder="请输入手机号码" type="tel" />
      <van-field v-model="fixedAddress.region.province" label="省份" placeholder="请输入省份" />
      <van-field v-model="fixedAddress.region.city" label="城市" placeholder="请输入城市" />
      <van-field v-model="fixedAddress.region.region" label="区县" placeholder="请输入区县" />
      <van-field v-model="fixedAddress.detail" label="详细地址" placeholder="请输入详细地址" type="textarea" />
    </div>
    <div class="popup-footer">
      <van-button type="primary" block @click="saveAddress">保存地址</van-button>
    </div>
  </div>
</van-popup>

      <!-- 修改地址显示逻辑 -->
<div class="info" v-if="selectedAddress && selectedAddress.name">
  <div class="info-content">
    <span class="name">{{ selectedAddress.name }}</span>
    <span class="mobile">{{ selectedAddress.phone }}</span>
  </div>
  <div class="info-address">
    {{ longAddress }}
  </div>
</div>

<div class="info" v-else>
  请选择配送地址
</div>

      <div class="right-icon">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list" v-if="order.goodsList">
      <div class="list">
        <div class="goods-item" v-for="item in order.goodsList" :key="item.goods_id">
            <div class="left">
              <img :src="item.goods_image" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2">
                {{ item.goods_name }}
              </p>
              <p class="info">
                <span class="count">x{{ item.total_num }}</span>
                <span class="price">¥{{ item.total_pay_price }}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{ order.orderTotalNum }} 件商品，合计：</span>
        <span class="money">￥{{ order.orderTotalPrice }}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{ order.orderTotalPrice }}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>

                <div class="pay-cell">
          <span>配送费用：</span>
          <span v-if="!selectedAddress || !selectedAddress.name">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ {{ personal.balance }} 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea v-model="remark" placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{ order.orderTotalPrice }}</span></div>
      <div class="tipsbtn" @click="submitOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
// import { getAddressList } from '@/api/address'
import { checkOrder, submitOrder } from '@/api/order'
import loginConfirm from '@/mixins/loginConfirm'
export default {
  name: 'PayIndex',
  mixins: [loginConfirm],
  data () {
    return {
      addressList: [],
      order: {},
      personal: {},
      remark: '',
      fixedAddress: {
        address_id: 1, // 添加这个
        name: '张三',
        phone: '13800000000',
        region: { province: '北京', city: '北京', region: '东城区' },
        detail: 'xxxx路xx号'
      },
      showAddressModal: false

    }
  },
  computed: {
    selectedAddress () {
    // 优先使用 fixedAddress，如果 fixedAddress 有数据就使用，否则使用接口返回的地址列表中的第一个
      return this.fixedAddress.name ? this.fixedAddress : (this.addressList[0] || {})
    },
    longAddress () {
      if (!this.selectedAddress.region) return ''
      const region = this.selectedAddress.region
      return region.province + region.city + region.region + this.selectedAddress.detail
    },
    mode () {
      return this.$route.query.mode
    },
    cartIds () {
      return this.$route.query.cartIds
    },
    goodsId () {
      return this.$route.query.goodsId
    },
    goodsSkuId () {
      return this.$route.query.goodsSkuId
    },
    goodsNum () {
      return this.$route.query.goodsNum
    }
  },
  created () {
    // this.getAddressList1()
    this.addressList = [{
      address_id: 1,
      name: '张三',
      phone: '13800000000',
      region: { province: '北京', city: '北京', region: '东城区' },
      detail: 'xxxx路xx号'
    }]
    this.getOrderList()
  },
  methods: {
    saveAddress () {
      // 使用 setTimeout 确保在下一个事件循环关闭弹窗
      setTimeout(() => {
        this.showAddressModal = false
      }, 0)
      this.$toast.success('地址保存成功')
    },
    async submitOrder () {
      // 检查是否有选中地址
      if (!this.selectedAddress.name) {
        this.$toast('请先选择配送地址')
        return
      }

      try {
        const submitData = {
          remark: this.remark,
          addressId: this.selectedAddress.address_id || 1 // 使用模拟的地址ID
        }

        if (this.mode === 'cart') {
          Object.assign(submitData, { cartIds: this.cartIds })
        }
        if (this.mode === 'buyNow') {
          Object.assign(submitData, {
            goodsId: this.goodsId,
            goodsSkuId: this.goodsSkuId,
            goodsNum: this.goodsNum
          })
        }

        console.log('提交的数据:', submitData)

        await submitOrder(this.mode, submitData)
        this.$toast.success('支付成功')
        this.$router.replace('/myorder')
      } catch (error) {
        console.error('提交订单错误:', error)
        this.$toast('提交订单失败：' + (error.message || '未知错误'))
      }
    },
    // async getAddressList1 () {
    //   const { data: { list } } = await getAddressList()
    //   this.addressList = list
    // },
    async getOrderList () {
      // 购物车结算
      if (this.mode === 'cart') {
        const { data: { order, personal } } = await checkOrder(this.mode, {
          cartIds: this.cartIds
        })
        this.order = order
        this.personal = personal
      }
      // 立刻购买结算
      if (this.mode === 'buyNow') {
        const { data: { order, personal } } = await checkOrder(this.mode, {
          goodsId: this.goodsId,
          goodsSkuId: this.goodsSkuId,
          goodsNum: this.goodsNum
        })
        this.order = order
        this.personal = personal
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
.address-popup {
  padding: 20px;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .popup-footer {
    margin-top: 20px;
  }
}
</style>
