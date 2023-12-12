---
outline: deep
---

# The newsletter subscription form

I created this website to help Vue.js developers learn how to use TDD in Vue.js.
Using real-world scenarios, I will show you how to use TDD to build out features.

The first feature we will build is the newsletter subscription form for this website.

## Acceptance criteria

For the newsletter subscription form, I came up with the following acceptance criteria:

- The form should show where to enter the first name and email. With concise labels and a prominently displayed "
  Subscribe" button.
- The form should validate that the first name and email are required and that the email has the right format. The user
  should see clear error messages.
- The form should submit the data to our API and display a success message.
- The form should display an error message when the API returns an error. The user should be able to retry.
- The form should not allow multiple submissions in a row.

## Implementing the first acceptance criteria

"The form should show where to enter the first name and email. With concise labels and a prominently displayed "
Subscribe" button."

::: code-group

```typescript [newsletter-subscription.spec.ts]
import {afterEach, describe, it} from "vitest";
import {render, screen, cleanup} from "@testing-library/vue";
import TheFooter from "../../components/TheFooter.vue";

describe("Newsletter subscribe feature", () => {
  afterEach(() => {
    cleanup();
  });

  it("should show the first name and email fields with a Subscribe button", async () => {
    render(TheFooter);

    await screen.getByLabelText(/first name/i);
    await screen.getByLabelText(/email/i);
    await screen.getByRole("button", {name: /subscribe/i});
  });
});
```

```vue [Footer.vue]

<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name"/>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email"/>
        </div>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </footer>
</template>
```

:::

::: info
Notice that we are using `screen.getByLabelText`.
This has at least 2 benefits:

- It asserts that our input has a label. This is good for accessibility.
- It is more robust, because it does not rely on the text of the label.

You can read more on the details of this library in
the [testing-library/vue documentation](https://testing-library.com/docs/vue-testing-library/intro/).
:::

## Implementing the second acceptance criteria

"The form should validate that the first name and email are required and that the email has the right format. The user
should see clear error messages."

### First name is required

::: code-group

```typescript [newsletter-subscription.spec.ts]
it("should show an error message when the first name is not entered", async () => {
  const user = userEvent.setup();

  render(TheFooter);

  await user.clear(screen.getByLabelText(/first name/i));
  await user.click(screen.getByRole("button", {name: /subscribe/i}));

  await screen.getByText(/first name is required/i);
});
```

```vue [Footer.vue]

<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName"/>
          <div v-if="firstName.length === 0">First name is required</div>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email"/>
        </div>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </footer>
</template>
```

:::

### Email is required

::: code-group

```typescript [newsletter-subscription.spec.ts]
it("should show an error message when the email is not entered", async () => {
  const user = userEvent.setup();

  render(TheFooter);

  await user.type(screen.getByLabelText(/first name/i), "John");
  await user.clear(screen.getByLabelText(/email/i));
  await user.click(screen.getByRole("button", {name: /subscribe/i}));

  await screen.getByText(/email is required/i);
});
```

```vue [Footer.vue]

<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName"/>
          <div v-if="firstName.length === 0">First name is required</div>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email"/>
          <div v-if="email.length === 0">Email is required</div>
        </div>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </footer>
</template>
```

:::

### Email is invalid

::: code-group

```typescript [newsletter-subscription.spec.ts]
it("should show an error message when the email is invalid", async () => {
  const user = userEvent.setup();

  render(TheFooter);

  await user.type(screen.getByLabelText(/first name/i), "John");
  await user.type(screen.getByLabelText(/email/i), "john");
  await user.click(screen.getByRole("button", {name: /subscribe/i}));

  await screen.getByText(/Email is invalid/i);
});
```

```vue [Footer.vue]
<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName"/>
          <div v-if="firstName.length === 0">First name is required</div>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email"/>
          <div v-if="email.length === 0">Email is required</div>
          <div v-else-if="!email.includes('@')">Email is invalid</div>
        </div>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </footer>
</template>
```

:::

## Implementing the third acceptance criteria

"The form should submit the data to our API, displaying success or error messages."

::: code-group

```typescript [newsletter-subscription.spec.ts]
it("should show a success message when the form is submitted", async () => {
  const user = userEvent.setup();

  server.use(
    http.post("/api/newsletter", () => {
      return HttpResponse.json();
    }),
  );

  render(TheFooter);

  await user.type(screen.getByLabelText(/first name/i), "John");
  await user.type(screen.getByLabelText(/email/i), "john@doe.com");
  await user.click(screen.getByRole("button", {name: /subscribe/i}));

  await screen.getByText(/Thank you for subscribing/i);
});
```

```vue [Footer.vue]
<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription" v-if="!subscribeSucceeded">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" />
          <div v-if="firstName.length === 0">First name is required</div>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" />
          <div v-if="email.length === 0">Email is required</div>
          <div v-else-if="!email.includes('@')">Email is invalid</div>
        </div>
        <button type="submit" @click.prevent="submitForm">Subscribe</button>
      </form>
      <div v-else>
        <div class="message">Thank you for subscribing!</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const firstName = ref("");
const email = ref("");
const subscribeSucceeded = ref(false);

async function submitForm() {
  if (
    firstName.value.length === 0 ||
    email.value.length === 0 ||
    !email.value.includes("@")
  ) {
    return;
  }

  const url = new URL("/api/newsletter", window.location.origin);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.value,
      email: email.value,
    }),
  });

  subscribeSucceeded.value = response.ok;
}
</script>
```
:::

## Refactoring - Removing duplication

We have a lot of logic in our component.
There is also duplication of the validation knowledge.
We are now in a good position to refactor, because we have a test suite that will help us to make sure we don't break
the existing functionality. Lets refactor and remove the duplication.

```vue [Footer.vue]

Certainly, here are the code changes in the previous format using `// [!code --]` for removals and `// [!code ++]` for additions:

```vue
<template>
  <div>
    {{ message }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'Removed' // [!code --]
      message: 'Added' // [!code ++]
    }
  }
}
</script>
```

And here's the code changes for your provided code snippet using the same format:

```vue [Footer.vue]
<template>
  <footer class="footer">
    <div class="container">
      <form class="newsletter-subscription" v-if="!subscribeSucceeded">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" />
          <div v-if="firstName.length === 0">First name is required</div> // [!code --]
          <div v-if="errors.has('firstName')"> // [!code ++]
            {{ errors.get("firstName") }} // [!code ++]
          </div> // [!code ++]
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" />
          <div v-if="email.length === 0">Email is required</div> // [!code --]
          <div v-else-if="!email.includes('@')">Email is invalid</div> // [!code --]
          <div v-if="errors.has('email')">{{ errors.get("email") }}</div> // [!code ++]
        </div>
        <button type="submit" @click.prevent="submitForm">Subscribe</button>
      </form>
      <div v-else>
        <div class="message">Thank you for subscribing!</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const firstName = ref("");
const email = ref("");
const subscribeSucceeded = ref(false);
const errors = ref(new Map()); // [!code ++]

async function validateForm() { // [!code ++]
  const newErrors = new Map(); // [!code ++]

  if (firstName.value.length === 0) { // [!code ++]
    newErrors.set("firstName", "First name is required"); // [!code ++]
  } // [!code ++]

  if (email.value.length === 0) { // [!code --]
    newErrors.set("email", "Email is required"); // [!code ++]
  } // [!code ++]

  if (email.value.length > 0 && !email.value.includes("@")) { // [!code --]
    newErrors.set("email", "Email is invalid"); // [!code ++]
  } // [!code ++]

  errors.value = newErrors; // [!code ++]
}

async function submitForm() { // [!code ++]
  await validateForm(); // [!code ++]

  if (errors.value.size > 0) { // [!code ++]
    return; // [!code ++]
  } // [!code ++]

  const url = new URL("/api/newsletter", window.location.origin);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.value,
      email: email.value,
    }),
  });

  subscribeSucceeded.value = response.ok;
}
</script>
```

## Implementing the fourth acceptance criteria

"The form should display an error message when the API returns an error. The user should be able to retry."

```code-group
```typescript [newsletter-subscription.spec.ts]
it("should be possible to submit again, after a failed submission", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/newsletter", async ({ request }) => {
        const body = await request.json();
        if (body.firstName === "Jane") {
          return HttpResponse.json();
        }

        return HttpResponse.json(
          { error: "Something went wrong" },
          { status: 500 },
        );
      }),
    );

    render(TheFooter);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/email/i), "john@doe.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/Something went wrong/i);

    await user.clear(screen.getByLabelText(/first name/i));
    await user.type(screen.getByLabelText(/first name/i), "Jane");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/Thank you for subscribing/i);
  });
```

```vue [Footer.vue]
<template>
  <footer class="footer">
    <div class="container">
      <div class="message">
        {{ formMessage }}
      </div>
      <form class="newsletter-subscription" v-if="!subscribeSucceeded">
        <div>
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" />
          <div v-if="errors.has('firstName')">
            {{ errors.get("firstName") }}
          </div>
        </div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" />
          <div v-if="errors.has('email')">{{ errors.get("email") }}</div>
        </div>
        <button type="submit" @click.prevent="submitForm">Subscribe</button>
      </form>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const firstName = ref("");
const email = ref("");
const subscribeSucceeded = ref(false);
const errors = ref(new Map());
const formMessage = ref("");

async function validateForm() {
  const newErrors = new Map();

  if (firstName.value.length === 0) {
    newErrors.set("firstName", "First name is required");
  }

  if (email.value.length === 0) {
    newErrors.set("email", "Email is required");
  }

  if (email.value.length > 0 && !email.value.includes("@")) {
    newErrors.set("email", "Email is invalid");
  }

  errors.value = newErrors;
}

async function submitForm() {
  await validateForm();

  if (errors.value.size > 0) {
    return;
  }

  const url = new URL("/api/newsletter", window.location.origin);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      firstName: firstName.value,
      email: email.value,
    }),
  });

  subscribeSucceeded.value = response.ok;
  formMessage.value = response.ok
    ? "Thank you for subscribing!"
    : "Something went wrong. Please try again.";
}
</script>
```


