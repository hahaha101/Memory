//创建按钮回调事件（回调函数所在脚本的挂载节点，回调函数所在脚本的名字，回调函数的名字，自定义回调数据）
var CREATE_EVENT_HANDLER = function(target, component, handler, customEventData){
    var eventHandler = new cc.Component.EventHandler();
    if(target instanceof cc.Node){
        eventHandler.target = target;
    }else{
        cc.error("GLOBAL_DEF.js: method 'CREATE_EVENT_HANDLER' param 'target' must be a cc.Node!");
    }

    if(typeof component == "string"){
        eventHandler.component = component;
    }else{
        cc.error("GLOBAL_DEF.js: method 'CREATE_EVENT_HANDLER' param 'component' must be a string!");
    }

    if(typeof handler == "string"){
        eventHandler.handler = handler;

    }else{
        cc.error("GLOBAL_DEF.js: method 'CREATE_EVENT_HANDLER' param 'handler' must be a string!");
    }

    if(typeof customEventData != "undefined"){
        eventHandler.customEventData = customEventData;
    }
    return eventHandler;
};