class Drag {
    /**
     * 构造方法
     * @param wrapper  		 外层Dom的id
     * @param item	   		 拖拽dom的class
     * @param sort_direction 拖拽方向
     * @param sort_data     排序数据
     */
    constructor(wrapper, item, sort_direction = false, sort_data = false) {
      this.init(wrapper, item, sort_direction, sort_data);
    }
  
    init(wrapper, item, sort_direction, sort_data) {
      if (typeof wrapper !== 'string' || typeof item !== 'string') {
        throw new Error('参数错误, 外层dom的id和拖拽dom的class为必填');
      }
      this.start = null;
      this.target = null;
      this.callback = {};
      this.start_pos = null;
      this.wrapper = wrapper;
      this.item = item;
      this.sort_direction = sort_direction;
      this.sort_data = false;
      this.options = {};                // 配置项
      this.is_drag_out_wrapper = false; // 标记元素是否被拖拽出主区域
      this.relevance = [];
      this.relevance_element_id = null;
  
      if (sort_data !== false) {
        if (sort_data.__proto__.constructor !== Array) {
          throw new Error(`sort_data需要一个数组，得到一个${typeof sort_data}`);
        }
        this.sort_data = JSON.parse(JSON.stringify(sort_data));
      }
  
      this.wrapper_position = {};
      if (!this.wrapper_array) {
        this.wrapper_array = [];
      }
      this.initEventListener();
    }
  
    reset(wrapper, item, sort_direction = false, sort_data = false) {
      this.init(wrapper, item, sort_direction, sort_data);
    }
    /**
     * 设置选项
     * @param options {object}
     */
    setOptions(options) {
      if (typeof options !== 'object') {
        throw new Error(`options需要一个对象，得到的一个:${typeof options}`);
      }
      this.options = options;
      if (options.relevance) {
        if (options.relevance.__proto__.constructor !== Array) {
          throw new Error(`relevance must be an array`);
        }
        this.relevance = options.relevance;
        this.setRelevanceEventListener();
      }
    }
  
    /**
     * 完成排序，移除拖拽dom的draggable属性
     */
    finishSort() {
      let item_wrapper = document.getElementById(this.wrapper);
      if (! item_wrapper) {
        throw new Error(`未获取到id为:${this.wrapper}的dom`);
      }
      let item_list = item_wrapper.querySelectorAll('.' + this.item);
      for (let i = 0, j = item_list.length; i < j; i++) {
        if (item_list[i].getAttribute('draggable')) {
          item_list[i].removeAttribute('draggable');
        }
      }
    }
  
    /**
     * 初始化事件绑定，通过事件委托实现
     */
    initEventListener() {
      let item_wrapper = document.getElementById(this.wrapper);
      if (! item_wrapper) {
        throw new Error(`未获取到id为:${this.wrapper}的dom`);
      }
      let item_list = item_wrapper.querySelectorAll('.' + this.item);
      if (item_list.length === 0) {
        throw new Error(`未获取到class位:${this.item}的dom`);
      }
  
      if (this.hasClass(item_wrapper, this.item)) {
        throw new Error(`外层dom不能含有和拖拽dom相同的class: ${this.item}`);
      }
  
      let item_length = item_list.length;
      if (this.sort_data !== false && item_length !== this.sort_data.length) {
        throw new Error(`排序数组长度与拖拽dom数量不符`);
      }
      for (let i = 0, j = item_length; i < j; i++) {
        if (! item_list[i].getAttribute('draggable')) {
          item_list[i].setAttribute('draggable', true);
        }
      }
      if (this.sort_direction) {
        this.wrapper_position.offsetLeft = item_wrapper.parentNode.offsetLeft;
      } else {
        this.wrapper_position.offsetTop = item_wrapper.parentNode.offsetTop;
      }
  
      if (this.wrapper_array.indexOf(this.wrapper) === -1) {
        this.setEventListener(item_wrapper);
        this.wrapper_array.push(this.wrapper);
      }
    }
  
    /**
     * 判断dom元素是否存在指定class值
     * @param el
     * @param class_name
     * @returns {boolean}
     */
    hasClass(el, class_name) {
      let reg = new RegExp('(^|\\s)' + class_name + '(\\s|$)');
      return reg.test(el.className);
    }
  
    /**
     * 给dom元素添加class
     * @param el
     * @param class_name
     * @returns {boolean}
     */
    addClass(el, class_name) {
      if (this.hasClass(el, class_name)) {
        return false;
      }
  
      let new_class = el.className.split(' ');
      new_class.push(class_name);
      el.className = new_class.join(' ')
    }
  
    /**
     * 获取被拖拽元素正在经过的元素
     * @param el
     * @returns {*}
     */
    getCoveredItem(el) {
      if (this.hasClass(el, this.item)) {
        return el;
      } else {
        if (el.querySelector('.' + this.item)) {  // 确保在wrapper内进行查找
          return false;
        }
        return this.getCoveredItem(el.parentNode);
      }
    }
  
    /**
     * 返回关联元素的id值
     * @param el
     * @returns {*}
     */
    getRelevanceElementByChild(el) {
      if (! el) {
        return false;
      }
      let id = el.id; // 获取元素的id值，通过id判断被拖拽到哪个关联dom
      if (id && this.relevance.indexOf(id) > -1) {
        return id;
      } else {
        if (el.tagName === 'BODY') {
          return false;
        }
        return this.getRelevanceElementByChild(el.parentNode);
      }
    }
  
    setRelevanceEventListener() {
      if (this.relevance.length > 0) {
        this.relevance.map((item) => {
          let el = document.getElementById(item);
          if (el) {
            console.log('abc');
            this.addEvent(el, 'dragover', (event) => {
              this.is_drag_out_wrapper = true;
              this.relevance_element_id = this.getRelevanceElementByChild(event.srcElement);
              event.stopPropagation();
              event.preventDefault();
            })
          }
        })
      }
    }
  
    setEventListener(item) {
      this.addEvent(item, 'dragstart', (event) => {
        this.start = this.getCoveredItem(event.srcElement);
        this.target = null;
        this.start_pos = this.getItemPosition(this.start);
        this.start_background = this.start.style.background;
  
        this.start.style.background = '#efefef';
  
        event.stopPropagation();
      });
  
      this.addEvent(item, 'dragover', (event) => {
        this.is_drag_out_wrapper = false;
        this.target = this.getCoveredItem(event.srcElement);
        if (this.target && this.target !== this.start) {
          if (this.sort_direction) {
            this.movePosition(this.target.offsetLeft + this.wrapper_position.offsetLeft, this.target.offsetWidth, window.event.screenX);
          } else {
            let doucmentScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            this.movePosition(this.target.offsetTop + this.wrapper_position.offsetTop, this.target.offsetHeight, event.clientY + doucmentScrollTop);
          }
        }
        event.stopPropagation();
        event.preventDefault();
      });
  
      this.addEvent(item, 'dragend', (event) => {
        if (this.is_drag_out_wrapper) { // 元素被拖拽到关联区域
          if (this.draggedout) {    // 是否监听draggedout事件
            this.callback.draggedout(this.relevance_element_id, this.start_pos);
          }
          let relevance_element = document.getElementById(this.relevance_element_id);
          if (relevance_element) {  // 从主区域移除拖拽的dom, append到关联区域
            relevance_element.appendChild(this.start);
          }
        }
        if (this.dragged) {     // 是否监听dragged事件
          let pos = this.getItemPosition(this.start); // dom已操作完成，仍是通过start获取最终位置
          if (this.sort_data !== false) {
            let sorted_data = this.sort(this.sort_data, this.start_pos, pos);
            this.callback.dragged(this.start_pos, pos, sorted_data);
          } else {
            this.callback.dragged(this.start_pos, pos);
          }
        }
  
        this.start.style.background = this.start_background;
        this.start = null;
        this.target = null;
        event.stopPropagation();
        event.preventDefault();
      });
    }
  
    movePosition(offsetLeft, offsetWidth, screenX) {
      if (screenX >= (offsetLeft + offsetWidth / 2)) {
        this.insertAfter(this.start, this.target);
      } else {
        this.insertBefore(this.start, this.target);
      }
    }
  
    insertBefore(newElement, targetElement) {
      let parent = targetElement.parentNode;
      if (parent && newElement && targetElement) {
        parent.insertBefore(newElement, targetElement);
      }
    }
  
    insertAfter(newElement, targetElement) {
      let parent = targetElement.parentNode;
      if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
      } else if (parent && newElement && targetElement) {
        parent.insertBefore(newElement, targetElement.nextSibling);
      }
    }
  
    sort(sort_data, start_index, end_index) {
      let data_length = sort_data.length;
      if (data_length < 2 || start_index === end_index) {
        return sort_data;
      }
  
      if (start_index < end_index) {
        sort_data.splice(end_index + 1, 0, sort_data[start_index]);
        sort_data.splice(start_index, 1);
      } else {
        sort_data.splice(end_index, 0, sort_data[start_index]);
        sort_data.splice(start_index + 1, 1);
      }
  
      return sort_data;
    }
  
    /**
     * 获取当前元素的index
     * @param item
     * @returns {number}
     */
    getItemPosition(item) {
      let item_wrapper = document.getElementById(this.wrapper);
      let drag_item_list = item_wrapper.querySelectorAll('.' + this.item);
  
      return Array.prototype.slice.call(drag_item_list).indexOf(item);
    }
  
    addEvent(element, type, handler) {
      try {
        element.addEventListener(type, handler, false);
      } catch (e) {
        try {
          element.attachEvent('on' + type, handler);
        }
        catch (e) {
          element['on' + type] = handler;
        }
      }
    }
  
    on(type, callback) {
      this[type] = type;
      this.callback[type] = callback;
    }
  }
  
  module.exports = Drag;
  