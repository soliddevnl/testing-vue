import { describe, it, beforeAll, afterEach, afterAll, expect } from "vitest";
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

  it("should shown an error message when the form submission fails", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/newsletter", () => {
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
  });

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

    expect(screen.queryByText(/Something went wrong/i)).toBeNull();

    await user.type(screen.getByLabelText(/first name/i), "Jane");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await screen.getByText(/Thank you for subscribing/i);
  });

  it("should clear the form message after the firstName is changed", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/newsletter", async () => {
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

    await user.clear(screen.getByLabelText(/first name/i));

    expect(screen.queryByText(/Something went wrong/i)).toBeNull();
  });

  it("should clear the form message after the email is changed", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("/api/newsletter", async () => {
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

    await user.clear(screen.getByLabelText(/email/i));

    expect(screen.queryByText(/Something went wrong/i)).toBeNull();
  });

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

    render(TheFooter);

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/email/i), "john@doe.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(callCount).toBe(1);
  });
});
