import { describe, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import TheFooter from "../../components/TheFooter.vue";

describe("Newsletter subscribe feature", () => {
  it("should show the newsletter subscribe form in the footer", async () => {
    render(TheFooter);

    await screen.getByText(/Stay up to date/);
  });
});
