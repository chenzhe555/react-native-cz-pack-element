import React, { Component } from 'react';
import { View, AppRegistry } from 'react-native';
import StaticContainer from 'static-container';
import PropTypes from 'prop-types';

class Provider extends Component {
    //getChildContext 指定的传递给子组件的属性需要先通过 childContextTypes 来指定，不然会产生错误
    static childContextTypes = {
        store: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired,
        }),
    };

    //指定子组件可以使用的信息
    getChildContext() {
        return { store: this.props.store };
    }

    render() {
        return this.props.children;
    }
}

//每个新增Element对应的唯一ID
let uniqueID = 0;
const elementsArray = [];

class PackElement extends Component{
    /************************** 生命周期 **************************/
    constructor(props) {
        super(props);
        //组件Map
        this.elementsMap = {};
        //Redux Store Map
        this.storesMap = {};
        //要更新的组件Map
        this.updateElementMap = {};
        elementsArray.push(this.handleElement);
    }

    componentWillUnmount() {
        elementsArray.splice(elementsArray.indexOf(this.handleElement), 1);
    }
    /************************** 自定义方法 **************************/
    //对element进行处理
    handleElement = (eid = 0, element = null, callback = null, store = null) => {
        const tempElementMap = {...this.elementsMap};
        const tempStoresMap = {...this.storesMap};
        //如果组件存在，则赋值到组件数组中；如果组件不存在，则认为是删除组件
        if (element && eid > 0) {
            tempElementMap[eid] = element;
            if (store) tempStoresMap[eid] = store;
        } else if (!element && tempElementMap[eid]) {
            delete tempElementMap[eid];
            delete tempStoresMap[eid];
        }
        //标记组件进行更新
        this.updateElementMap[eid] = true;
        //更新相关值
        this.elementsMap = tempElementMap;
        this.storesMap = tempStoresMap;
        //强制render
        this.forceUpdate(callback);
    }
    /************************** Render中方法 **************************/
    render() {
        const { elementsMap, storesMap, updateElementMap } = this;
        const elements = [];
        Object.keys(elementsMap).forEach( (key) => {
            const element = elementsMap[key];
            if (element) {
                //创建组件
                const staticElemenet = (
                    <StaticContainer key={`pack-element-staticcontainer-${key}`} shouldUpdate={!!(updateElementMap[key])}>
                        {element}
                    </StaticContainer>
                );

                //如果存在store,则存储
                const store = storesMap[key];
                if (store) {
                    <Provider store={store} key={`pack-element-provider-${key}`}>
                        {staticElemenet}
                    </Provider>
                } else {
                    elements.push(staticElemenet);
                }
            }
        });
        this.updateElementMap = {};
        return elements;
    }
}

//对AppRegisture的根组件进行包装，加入自定义组件
AppRegistry.setWrapperComponentProvider(function () {
    return function PackElementWrapper(props) {
        return (
            <View style={[{flex: 1}]}>
                {props.children}
                <PackElement></PackElement>
            </View>
        )
    }
});

//对外定义类
export default class PackElementFactory {
    constructor(element, callback = null, store = null) {
        this.eid = ++uniqueID;
        this.updateElement = this.updateElement.bind(this);
        this.destoryElement = this.destoryElement.bind(this);
        this.updateElement(element, callback, store)
    }

    updateElement(element, callback = null, store = null) {
        const { eid } = this;
        elementsArray.forEach( (handleElement) => {
            handleElement(eid, element, callback, store);
        });
    }

    destoryElement(callback) {
        const { eid } = this;
        elementsArray.forEach( (handleElement) => {
            handleElement(eid, null, callback, null);
        });
    }
}

