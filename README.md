# 📋 light-show  

 		---------------------- 🎈🎈🎈🎈🎈🎈🎈🎈， 不如一起来写PPT ！！！

### 简介

+ 一个vue框架下轻量级的类PPT**演示文稿制作库**, 集合了在线内容编辑和演示的功能。
+ 相较于传统在线文档网页，例如金山的在线ppt，功能足够强大（但是真的有点卡），light-show足够的轻量与流畅，过渡效果酷炫，而且制作简单，足以轻松应付一些应急的场景，要是您不熟悉使用ppt，本插件是您很好的选择！！！
+ 完全重新开发的一套库，和impress.js等其它ppt库不一样的地方是 ，能完全对内容（图片，视频，文字）进行**逐步**展示而不仅仅只能通过换页，并且不需要代码进行构建内容(如插入html或者读取markdown),通过编辑器尽可能还原ppt的基础功能，但操作起来更加的简单。
+ 国际惯例，在线demo。
  +  效果演示地址： https://www.cxzweb.club/#/light-show/read
  + 编辑器展示地址： https://www.cxzweb.club/#/light-show/edit
  + 手机编辑器： https://www.cxzweb.club/#/light-show/mEdit
  + 手机预览： https://www.cxzweb.club/#/light-show/mRead
### 安装

```javascript
npm i -S light-show
```

### 使用

+ main.js中引入

~~~javascript
import LightShow from 'light-show'

import 'light-show/lib/light-show.css'

Vue.use(LightShow)
~~~

这将会在全局注册两个组件 EidtSlide（编辑器），和ReadSlide（阅读器），下面是两个组件的使用方法。

### EidtSlide组件（编辑器）

+ 使用

~~~html
// 引入组件标签

<edit-slide @upload="upload" @saveData="saveData" ref="lightShow"></edit-slide>
~~~

该组件详情如下：

##### edit-slide组件派发出来的事件

+ **saveData事件**

  + 编辑器点击保存按钮时候触发的事件， 父组件订阅可以拿到存储的数据。
  + 事件触发后，能得到保存的数据 `string类型`

  + 让子组件的saveData方法， 当点击保存的时候， 会拿到stringData `string`  ， 按照业务可以存储在服务器或者简单处理存在localStorage。

~~~ javascript
// 父组件如APP.vue， 简单处理存在了本地， 如果ppt内容比较多，建议把stringData传给服务器。

export default {
    /* 其它代码 */
    methods:{
        // 父组件订阅的事件， 保存数据的时候会触发该函数
            saveData(stringData) {
                localStorage.setItem('cxzppt', stringData)
            }
	}
    /* 其它代码 */
}
~~~

+ **upload事件**
+ + 点击图片的时候触发的上传事件， 可以拿到FormData类型对象。
  + 将该类型数据上传到服务器后， 拿到图片地址在生成编辑器节点。
  + 该事件拿到两个参数`FormData类型对象` ， `type`  ,  第一个参数是上传的图片数据， type是生成图片节点还是背景图片，值为string 类型，`img|bacImg` 。

~~~javascript
// 使用了axios网络库
import axios from 'axios'

export default {
    /* 其它代码 */
    methods:{
        async upload(file, type) {
            const options = {
                url: UPLOAD_URL,
                method: 'post',
                headers:{
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: function(progressEvent) {
                    console.log(progressEvent)
                },
                data: file
            }
            const {data} = await axios(options)
            const path = data.path
            this.$refs.slide.createImg(path)
        }
    }
    /* 其它代码 */
}
~~~



#####  组件的内部方法 

+ **initData(stringData `string|undefined` )**
  + 初始化编辑器的的数据， ***初始化编辑器组件的时候必须调用该函数***，可以不传参数。
  + 把saveData 传进这个函数即可， 主动调用初始化编辑器的数据。

~~~ javascript
// 父组件如APP.vue， 简单处理存在了本地， 如果ppt内容比较多，建议把stringData传给服务器。
export default {
    /* 其它代码 */
    methods:{
    	readData(stringData) {
            
            // 例如数据stringData是从本地取的，按照自己业务处理
		localStorage.setItem('cxzppt', stringData)
            
            // edit-slide组件内部方法， 初始化编辑器数据， 可以不传该参数，表示重新开始编辑
        	this.$refs.slide.initData(stringData) 
            
        }
    }
    /* 其它代码 */
}
~~~



+ **createImg( path `string `)**
  + 生成当前页的背景图像
  + path `string`  ： 图片的地址。
  + 示例：`this.$refs.lightShow.createImg(path)` ， 父组件调用子组件的方法。

### ReadSlide组件（阅读器）

##### 阅读器组件派发的事件

+ getPage

~~~javascript

/** 
*  < 父组件订阅的事件， ppt页码切换的时候触发。>
*  @param [currentPage] [当前页码]
*  @param [totalPage] [总页码]
*  @param [step] [当前步骤： 0：表示ppt最初的状态， 1： 表示在演示的过程： 2： 表示已结束]
*/
<template>
    <div class="app">
        <read-slide @getPage="getPage"></read-slide>
    </div>
</template>

export default {
    /* 其它代码 */
    methods:{ 
            getPage(currentPage, totalPage, step) {
                // 自定义一些功能。
            }
	}
    /* 其它代码 */
}
~~~

##### 组件方法

+ initData(data)

~~~ javascript
/**
* < 阅读器初始化数据函数， 必须调用 >
* @param [data] [编辑器保存的数据，直接传进去即可。]
**/
<template>
    <div class="app">
        <read-slide ref="read"></read-slide>
    </div>
</template>

export default {
    /* 其它代码 */
    methods:{
        // 父组件在mounted生命周期调用该函数
        init() {
            let data = getData() // 伪代码， 你获取到的编辑器保存的数据
            this.$refs.read.initData(data)
        },
	}
    /* 其它代码 */
}


~~~



### 该插件还给vue注册了一些函数生成辅助的组件。

+ tip组件

~~~javascript
// 全局生成提示框
this.$tip（{content: '你好呀'}）
~~~

+ waiting组件

~~~ javascript
// 开启loading
this.$waiting.add()

// 取消loading
this.$waiting.close()
~~~

### 最近更新

+ 由于该版本还在功能完善阶段，更新会比较频繁， 后续的变动都会在此处说明。

### 下版本预期更新功能

+ 提供在线服务（免费、免费、免费）， 希望能帮助到一些不想暂时还木有自己服务器的小伙伴或者应急应付个报告什么的。
+ 文字的操作更加丰富
+ 下载成PPT（重点研究这一部分功能）

### 结语

+ 做这个的原因其中一点是自己不怎么熟练使用ppt软件， 感觉很麻烦，所以想自己弄个比较简单的，基本功能满足需求的编辑器来，应付年终总结呀什么的。

+ 该项目会一直维护下去， 有bug一定会火速修复，欢迎提问，大家一起交流，一起学习 😁。
+ 终极目标：
  + 各种动画可以增加自定义功能
  + 现在可以依靠后台生成简单的ppt，打算研究直接从前端生成ppt文件，不知道有没小伙伴有经验呢?指教指教我😊😊😊😊。
  + 完成更加细粒度的展示， 但是前提是操作一定要简单！！！。
