import Vue from 'vue'
import {
  ActionSheet,
  Button,
  Cell, // 新增
  CellGroup, // 新增
  Checkbox,
  Dialog,
  Field, // 新增
  Grid,
  GridItem,
  Icon,
  NavBar,
  Popup,
  Rate,
  Search,
  Swipe,
  SwipeItem,
  Switch,
  Tab,
  Tabbar,
  TabbarItem,
  Tabs,
  Toast
} from 'vant'

// 按字母顺序排列，便于查找和维护
const components = [
  ActionSheet,
  Button,
  Cell, // 新增
  CellGroup, // 新增
  Checkbox,
  Dialog,
  Field, // 新增
  Grid,
  GridItem,
  Icon,
  NavBar,
  Popup,
  Rate,
  Search,
  Swipe,
  SwipeItem,
  Switch,
  Tab,
  Tabbar,
  TabbarItem,
  Tabs,
  Toast
]

components.forEach(component => {
  Vue.use(component)
})
