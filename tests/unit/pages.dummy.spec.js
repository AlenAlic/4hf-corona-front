import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);
import { shallowMount } from "@vue/test-utils";
import Dummy from "../../src/pages/Dummy";

describe("Dummy.vue", () => {
  const message = "new message";
  const $route = { name: "test_route" };
  test("Renders props.message", () => {
    const wrapper = shallowMount(Dummy, {
      propsData: { message },
      mocks: {
        $route
      }
    });
    expect(wrapper.text()).toMatch(message);
  });
  test("Renders $route.name ", () => {
    const wrapper = shallowMount(Dummy, {
      mocks: {
        $route
      }
    });
    expect(wrapper.text()).toMatch($route.name);
  });
});
