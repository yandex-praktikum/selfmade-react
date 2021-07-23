import { h } from 'snabbdom';

const createElement = (type, props = {}, ...children) => {
  // Превращаем массив children в плоский список
  // Это необходимо для корректного мапинга todos.map(todo => <p>{todo}</p>) работал в jsx
  // [['1'], ['2', '3']] -> ['1', '2', '3']
  children = children.flat();

  // Если children является классовым компонентом:
  // 1. Создаем новый инстанс переданного класса
  // 2. Вызываем метод render у этого инстанса
  if (type.prototype && type.prototype.isReactClassComponent) {
    const componentInstance = new type(props);

    // Присваиваем текущий экземпляр vNode
    componentInstance.__vNode = componentInstance.render();

    // Добавляем хук к вирутальной ноде snabbdom при создании этой ноды в реальном DOM
    componentInstance.__vNode.data.hook = {
      create: () => {
        componentInstance.componentDidMount()
      }
    }

    return componentInstance.__vNode;
  }
  // Если children является функцией, то просто возвращаем результат этой функции
  if (typeof (type) == 'function') {
    return type(props);
  }

  props = props || {};
  let dataProps = {};
  let eventProps = {};

  // Этот блок кода нужен для разделения атрибутов на пропсы и обработчики событий
  for(let propKey in props) {
    // Обработчики событий всегда начинаются с on, например: onClick, onChange и тд.
    if (propKey.startsWith('on')) {
      // превращаем onClick -> click
      const event = propKey.substring(2).toLowerCase();

      eventProps[event] = props[propKey];
    }
    else {
      dataProps[propKey] = props[propKey];
    }
  }

  // props -> пропсы передаём в пропсы snabbdom
  // on -> обработчики событий передаём в snabbdom в качестве обработчиков событий
  return h(type, { props: dataProps, on: eventProps }, children);
};

// Классовый компонент
class Component {
  constructor() { }

  componentDidMount() { }

  setState(partialState) {
    // Обновляем состояние, сохранив первый уровень вложенности предыдущего состояния
    this.state = {
      ...this.state,
      ...partialState
    }
    // Вызываем метод __updater, которая назначается в ReactDom
    React.__updater(this);
  }

  render() { }
}

// Добавим статическое свойство, чтобы различать классовые и функциональные компоненты
Component.prototype.isReactClassComponent = true;

// Экспортируем как React.createElement и React.Component
const React = {
  createElement,
  Component
};

export default React;
