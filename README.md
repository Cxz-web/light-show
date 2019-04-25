# 📋 light-show  

 		---------------------- 🎈🎈🎈🎈🎈🎈🎈🎈， 不如一起来写PPT ？

### 简介

+ 一个vue框架下的轻量级的ppt编辑器和阅读器。
+ 国际惯例，先上demo，看看效果是否所需。
  +  效果演示地址： www.cxzweb.club/light-show/read
  + 编辑器展示地址： www.cxzweb.club/light-show/edit
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

### EidtSlide组件

+ 使用

~~~html
// 引入组件标签

<edit-slide @upload="upload" @saveData="saveData" ref="lightShow"></edit-slide>
~~~

该组件详情如下：

##### edit-slide组件派发的事件

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
            if(type === 'img') {
                this.$refs.slide.createImgDom(path)
            }else if(type === 'bacImg') {
                this.$refs.slide.createBacImgDom(path)
            }
        }
    }
    /* 其它代码 */
}
~~~



#####  组件的内部方法

+ **initData(stringData `string|undefined` )**
  + 初始化编辑器的的数据。
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



+ **createBacImgDom( path `string `)**
  + 生成背景图像节点
  + path `string`  ： 图片的地址。
  + 示例：`this.$refs.lightShow.createImgDom(path)` ， 父组件调用子组件的方法。
+ **createImgDom( path `string`)**
  + 生成图片节点

### 结语

+ 做这个的原因其中一点是自己不怎么熟练使用ppt软件， 感觉很麻烦，所以想自己弄个比较简单的，基本功能满足需求的编辑器来，应付年终总结呀什么的。

+ 该项目会一直维护下去， 有bug一定会火速修复，欢迎提问，大家一起交流，一起学习 😁。
+ 后续的目标：
  + 各种动画可以增加自定义功能
  + 现在可以依靠后台生成简单的ppt，打算研究直接从前端生成ppt文件，不知道有没小伙伴有经验呢?指教指教我😊😊😊😊。
  + 完成更加细粒度的展示， 但是前提还是以简单就能出效果为主。
