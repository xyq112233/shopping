<template>
  <div class="address">
    <van-nav-bar
      title="地址管理"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <!-- 地址列表 -->
    <div class="address-list">
      <div class="empty" v-if="addressList.length === 0">
        <!-- 替换 van-empty 为自定义空状态 -->
        <div class="empty-state">
          <van-icon name="location-o" size="80" color="#ccc" />
          <p class="empty-text">您还没有收货地址</p>
        </div>
      </div>

      <div class="address-item" v-for="item in addressList" :key="item.address_id">
        <div class="item-content">
          <div class="info">
            <span class="name">{{ item.name }}</span>
            <span class="mobile">{{ item.phone }}</span>
          </div>
          <div class="address">
            {{ getFullAddress(item) }}
          </div>
        </div>
        <div class="item-actions">
          <van-button size="small" @click="editAddress(item)">编辑</van-button>
          <van-button size="small" type="danger" @click="deleteAddress(item.address_id)">删除</van-button>
        </div>
      </div>
    </div>

    <!-- 添加地址按钮 -->
    <div class="footer">
      <van-button type="primary" block @click="addAddress">添加新地址</van-button>
    </div>
  </div>
</template>

<script>
import { getAddressList, deleteAddress, createAddress } from '@/api/address' // 添加 createAddress

export default {
  name: 'AddressIndex',
  data () {
    return {
      addressList: []
    }
  },
  created () {
    this.getAddressList()
  },
  methods: {
    async getAddressList () {
      try {
        const { data: { list } } = await getAddressList()
        this.addressList = list || []
      } catch (error) {
        console.error('获取地址列表失败:', error)
        this.$toast.fail('获取地址失败')
      }
    },

    getFullAddress (item) {
      const region = item.region || {}
      return `${region.province || ''}${region.city || ''}${region.region || ''}${item.detail || ''}`
    },

    addAddress () {
      // 创建真实的地址数据
      const addressData = {
        name: '测试用户',
        phone: '13800138000',
        province: '北京市',
        city: '北京市',
        region: '朝阳区',
        detail: '测试街道123号',
        is_default: 1
      }

      this.$dialog.confirm({
        title: '创建测试地址',
        message: '将创建一个真实的测试地址到服务器'
      }).then(async () => {
        try {
          this.$toast.loading('创建地址中...')
          await createAddress(addressData)
          this.$toast.success('地址创建成功')
          // 重新加载地址列表
          this.getAddressList()
        } catch (error) {
          console.error('创建地址失败:', error)
          this.$toast.fail('创建地址失败: ' + (error.response?.data?.message || '请检查网络'))
        }
      })
    },

    editAddress (item) {
      this.$toast('编辑地址功能待开发')
    },

    async deleteAddress (id) {
      try {
        await deleteAddress(id)
        this.$toast.success('删除成功')
        this.getAddressList()
      } catch (error) {
        this.$toast.fail('删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.address {
  padding-top: 46px;
  padding-bottom: 60px;

  .address-item {
    margin: 10px;
    padding: 15px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);

    .item-content {
      margin-bottom: 10px;

      .info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .name {
          font-weight: bold;
        }
        .mobile {
          color: #666;
        }
      }

      .address {
        color: #666;
        line-height: 1.4;
      }
    }

    .item-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: #fff;
    border-top: 1px solid #eee;
  }

  .empty {
    padding: 50px 20px;
    text-align: center;
    color: #999;

    .empty-state {
      text-align: center;

      .empty-text {
        margin-top: 16px;
        color: #999;
        font-size: 14px;
      }
    }
  }
}
</style>
