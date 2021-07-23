import * as snabbdom from 'snabbdom';
import propsModule from 'snabbdom/modules/props';
import eventListenersModule from 'snabbdom/modules/eventlisteners';
import React from './react';

// propsModule -> отвечает за модификацию текстовых атрибутов
// eventListenersModule -> отвечает за обработку событий на элементах
const reconcile = snabbdom.init([propsModule, eventListenersModule]);

// Переменная, содержащая корневой элемент, который функция render вернула последним
let rootVNode;

// React.render(<App />, document.getElementById('root'));
// el -> <App />
// rootDomElement -> document.getElementById('root')
const render = (el, rootDomElement) => {
  // В этой функции описывается механизм размещения элемента el в указанном узле rootDomElement
  // Например, ReactDom.render(<App />, document.getElementById('root'));

  // Этот блок кода будет вызван при первом вызове функции render
  if (rootVNode == null) {
    rootVNode = rootDomElement;
  }

  // Запоминаем VNode, которую возвращает reconcile
  rootVNode = reconcile(rootVNode, el);
}

// ReactDom указывает React как обновлять DOM
React.__updater = (componentInstance) => {
  // В этом методе описана логика обновления DOM, когда вызывается this.setState в компонентах

  // Получаем текущий элемент oldVNode сохраненный в __vNode
  const oldVNode = componentInstance.__vNode;
  // Присваеваем обновленную версию DOM узла, вызывая метод render у переданного элемента
  const newVNode = componentInstance.render();

  // Обновляем __vNode свойство, заменив oldVNode обновленной версией newVNode
  componentInstance.__vNode = reconcile(oldVNode, newVNode);
}

// Экспортируем функцию, чтоб использовать её как ReactDom.render
const ReactDom = {
  render
};

export default ReactDom;
