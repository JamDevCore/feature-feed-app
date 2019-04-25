const build = (element, attributes, text) => {
  const ele = document.createElement(element);
  if(attributes && attributes.length > 0) {
    attributes.forEach((att) => {
      if(att.name && att.value) {
        ele.setAttribute(att.name, att.value)
      }
    })
  }
  if(text) ele.innerHTML = text;
  return ele;
}

export default build;
