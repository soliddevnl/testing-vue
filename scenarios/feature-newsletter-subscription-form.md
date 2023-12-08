---
outline: deep
---

# Developing a feature with TDD

## The newsletter subscribe feature

For this guide, I want users to stay up to date easily, so I want them to be able to subscribe to my newsletter. 
I want to make sure that the user can enter their email address, and that they see a success message when they have subscribed.

The form has a few requirements:

- The user should be able to enter their email address
- The user should see an error message when the email address is invalid
- The user should see a loading indicator when the form is submitting
- The user should see a success message when the form is submitted

### Step zero - thinking about the first test
How should the first test for this feature look like?

The simplest thing we can test for this feature, is that a newsletter subscribe form 
exists somewhere on the page.

So let's write a test for that.
