import Toast from "./Toast.vue";

function init(Vue, globalOptions = {}) {
  let component = null;
  const queue = [];

  function createComponent(options) {
    const component = new Vue(Toast);
    const componentOptions = { ...Vue.prototype.$toast.globalOptions, ...options };

    Object.assign(component, componentOptions);
    document.body.appendChild(component.$mount().$el);

    return component;
  }

  function show(message, options = {}) {
    if (component) {
      queue.push({ message, options });
      return;
    }

    options.message = message;
    component = createComponent(options);
    component.$on("statusChange", (isActive, wasActive) => {
      if (wasActive && !isActive) {
        component.$nextTick(() => {
          component.$destroy();
          component = null;

          if (queue.length) {
            const toast = queue.shift();
            show(toast.message, toast.options);
          }
        });
      }
    });
  }

  function shorthands() {
    const colors = ["success", "info", "error", "warning"];
    const methods = {};

    colors.forEach(color => {
      methods[color] = (message, options) => show(message, { color, ...options });
    });

    return methods;
  }

  function getComponent() {
    return component;
  }

  function clearQueue() {
    return queue.splice(0, queue.length);
  }

  Vue.prototype.$toast = Object.assign(show, {
    globalOptions,
    getComponent,
    clearQueue,
    ...shorthands(globalOptions)
  });
}

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(init);
}

export default init;
