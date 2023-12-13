---
outline: deep
---

# How to test and implement double submission prevention in Vue 3

When it comes to preventing double submissions in your form, there are various approaches to consider. These methods
include:

1. Disabling the submit button.
2. Hiding the submit button.
3. Removing the submit button from the HTML.
4. Exploring other potential solutions.

In order to create tests that are easy to maintain and not tightly coupled to the specific implementation, it's best to
focus on verifying user-visible behaviors.
This approach ensures that your tests remain effective even as the implementation evolves.

## Writing the test

```typescript [double-submit-prevention.spec.ts]
import {describe, it, expect} from "vitest";
import {render, screen} from "@testing-library/vue";

import NewsletterSubscriptionForm from "../../components/NewsletterSubscriptionForm.vue";
import {server} from "../../mocks/node";

import {userEvent} from "@testing-library/user-event";
import {http, HttpResponse} from "msw";

it("should prevent double form submissions", async () => {
  const user = userEvent.setup();

  let callCount = 0;
  server.use(
    http.post("/api/newsletter", async () => {
      callCount++;
      // small delay to give the subscribe button time to be disabled
      await new Promise((resolve) => setTimeout(resolve, 10));
      return HttpResponse.json();
    }),
  );

  render(NewsletterSubscriptionForm);

  await user.type(screen.getByLabelText(/first name/i), "John");
  await user.type(screen.getByLabelText(/email/i), "john@doe.com");
  await user.click(screen.getByRole("button", {name: /subscribe/i}));
  await user.click(screen.getByRole("button", {name: /subscribe/i}));

  expect(callCount).toBe(1);
});
```

This test only observes the user-visible behavior of the form.
It doesn't care about the implementation details of how the double submission is prevented.
This means that the test will not have to change when the implementation changes.

But what does it actually test? Let's break it down.

- It sets up a mock server that will intercept requests to `/api/newsletter` and return an empty 200 response to signal that the request was successful.
- Inside the mock server handler, we increment a `callCount` variable to track how many times the handler was called.
- We render the `NewsletterSubscriptionForm` component.
- Then we use the `userEvent` library to simulate the user typing in the form fields and clicking the submit button twice.
- Finally, we assert that the `callCount` is `1` to verify that the form was only submitted once.


## Implementing the solution

```vue [NewsletterSubscriptionForm.vue]

<template>
  ... the form fields
  <button type="submit" :disabled="submitting" @click.prevent="submitForm">
    Subscribe
  </button>
  ...
</template>
<script setup lang="ts">
import { ref } from "vue";
const submitting = ref(false);

async function submitForm() {
  submitting.value = true;
  await fetch("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.value,
      email: email.value,
    }),
  });
  submitting.value = false;
}
</script>
```

We added a `submitting` ref to track whether the form is currently being submitted.
Inside the submit handler we set `submitting` to `true` before making the request
and set it back to `false` after the request completes.

We can then use the `submitting` ref to disable the submit button.

## Conclusion

Imagine your colleague comes along and decides to use a different approach to prevent double submissions.
Instead of disabling the submit button, they decide to hide it.
With the current test, this change would not break the test.
That means that you can safely refactor your code without having to worry about breaking the test.

Happy testing!


