// components/tabs/tabs.js
Component({
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },
  data: {

  },
  
  methods: {
    // 点击事件
    handleTabsTap(event){
      const {index} = event.currentTarget.dataset;
      //创建一个自定义的触发事件（名为tabsItemChange,并传递一个参数index)==>父组件
      this.triggerEvent("tabsItemChange",{index});
    }
  }
})
