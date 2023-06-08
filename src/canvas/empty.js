import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

const isReactEle = (HTMLElement) => {
  return React.isValidElement(HTMLElement);
};

/**
 * params {Object} config
 * params {JSX.Element | String} config.content
 * params {Number | String} config.width
 */
export default (config) => {
  const content = config.content;
  const container = config.container[0];
  let width = config.width;

  if (!width) {
    width = '150px';
  }
  
  if (typeof config.width === 'number') {
    width = config.width + 'px';
  }

  let emptyDom = '<div style="width: ' + width + '"></div>';

  if (content) {
    if (isReactEle(content)) {
      emptyDom = ReactDOM.render(content, container);
    } else {
      emptyDom = $(content);
    }
  } else {
    emptyDom = $('<div class="no-data" style="width: ' + width + '"></div>');
    const iconDom = $('<i class="no-data-icon table-build-icon table-build-icon-kongshuju"></i>');
  
    emptyDom.append(iconDom);
  }

  return emptyDom;
};
