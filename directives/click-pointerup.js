export default {
  bind (el, binding, vnode) {
    el.pointerUpOutsideEvent = function (event) {
      // here I check that pointerup was outside the el and his children
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression]?.(event)
      }
    }
    document.body.addEventListener('pointerup', el.pointerUpOutsideEvent)
  },
  unbind (el) {
    document.body.removeEventListener('pointerup', el.pointerUpOutsideEvent)
  }
}
