import { describe, it, beforeAll, afterEach, afterAll } from "vitest";
import { render, screen } from "@testing-library/vue";

import TheFooter from "../../components/TheFooter.vue";
import { server } from "../../mocks/node";

import { userEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

describe("Newsletter subscribe feature", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should show the first name and email fields with a Subscribe button", async () => {
    render(TheFooter);

    await screen.getByLabelText(/first name/i);
    await screen.getByLabelText(/email/i);
    await screen.getByRole("button", { name: /subscribe/i });
  });

  it("should show an error message when the first name is not entered", async () => {
    const user = userEvent.setup();

    render(TheFooter);

    await user.clear(screen.getByLabelText(/first name/i));
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/first name is required/i);
  });

  it("should show an error message when the email is not entered", async () => {
    const user = userEvent.setup();

    render(TheFooter);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.clear(screen.getByLabelText(/email/i));
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/email is required/i);
  });

  it("should show an error message when the email is invalid", async () => {
    const user = userEvent.setup();

    render(TheFooter);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/email/i), "john");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/Email is invalid/i);
  });

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
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/Thank you for subscribing/i);
  });
});
