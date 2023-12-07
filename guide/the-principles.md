---
outline: deep
---

# The principles of testing Vue apps

## Test behavior, not implementation

When writing tests, you should focus on testing the behavior of your app, not the implementation. This means that you should not test the internal workings of your app, but rather the output of your app.

Let's look at an example of both, so we can compare the differences.

For the example we will use the subscribe form for the newsletter on this site. The form has a few requirements:

- The user should be able to enter their email address
- The user should see an error message when the email address is invalid
- The user should see a loading indicator when the form is submitting
- The user should see a success message when the form is submitted

### Testing the implementation

### Testing the behaviour

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
