---
outline: deep
---

# How to test a method in a Vue component?

I saw this question on StackOverflow: "How to Unit Test a Method in a Vue.js Component using jest?".

I am going to ignore the Jest part here, as this question appears for other testing frameworks as well.

The given answer used `vue-test-utils` to mount the component and then called the method on the component instance, like:

```typescript
wrapper.vm.doSomeWork()
```

::: warning
This is not a good way to test a method in a Vue component.
:::

## Why not?

1. It tests implementation details, not user-visible behavior. It will break when the implementation changes.
2. It's not how a user would interact with the component. Users interact with your component by clicking around, not by calling methods on the component instance.
3. It skips the Vue component lifecycle and reactivity. Your test might pass, but the component might not work as expected in the browser.

## A better way

### 1. Find out what triggers the method.

What is the user-observable behavior of the method that you want to test?

Is it a method that is triggered by a click handler on a button or some other HTML element?

Is it a method that is triggered by a lifecycle hook, or a prop, or a reactive variable?

Find out what triggers the method. 

If you can't find out what triggers the method, then you delete it. It's dead code.

### 2. Interact with the element like a user would do

Render the component with `testing-library/vue`. It uses `vue-test-utils` under the hood, but it provides a better API
that encourages you to test user-visible behavior.

If the method is triggered by a click handler on a button, click the button.

If the method is triggered by a lifecycle hook, then trigger the lifecycle hook.

Is it triggered by a prop, then change the prop.

### 3. Assert behavior like a user would do

Assert that the user-visible behavior is happening as expected.

This is where you can test your method.

Does it populate a list? Then assert that the list is properly showing the data.

Does it call an API? Then assert that the API is called with the correct parameters.

## Example

Let's say we have a component that fetches a list of users from an API and renders them in a list.

```vue [UserList.vue]
<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";

export default {
  setup() {
    const users = ref([]);

    onMounted(async () => {
      const response = await fetch("/api/users");
      users.value = await response.json();
    });

    return { users };
  },
};

</script>
```

We want to test that the component fetches the users from the API and renders them in a list.

### 1. Find out what triggers the method.

The method is triggered by the `onMounted` lifecycle hook.

### 2. Interact with the element like a user would do

A user would interact with the component by viewing it in the browser.

So we will render the component to the DOM.

This will trigger the `onMounted` lifecycle hook, which will fetch the users from the API.

```typescript
describe("UserList", () => {
  beforeAll(() => server.listen());

  it("should render the fetched users in alphabetical order", async () => {
    server.use(
      http.get("https://jsonplaceholder.typicode.com/users", () => {
        return Response.json([
          { id: 1, name: "Leanne Graham" },
          { id: 2, name: "Ervin Howell" },
          { id: 3, name: "Clementine Bauch" },
        ]);
      }),
    );

    render(UserList);

    // ...
  });
});
```

### 3. Assert behavior like a user would do

How would a user use this component?

They would look at the list of users and would expect `Clementine` to come before `Ervin`.

That's exactly what this test does.

```typescript
describe("UserList", () => {
  it("should render the fetched users in alphabetical order", async () => {
    // ...

    render(UserList);

    await waitFor(async () => {
      const firstName = await screen.getByText("Clementine Bauch");
      const secondName = await screen.getByText("Ervin Howell");

      // 4 means that the first node is before the second node
      expect(firstName.compareDocumentPosition(secondName)).toBe(4);
    });
  });
});
```
