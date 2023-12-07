import { describe, it } from "vitest";
import { render, screen } from "@testing-library/vue";
import Footer from "../../components/Footer.vue";

describe("Newsletter subscribe feature", () => {
  it("should show the newsletter subscribe form in the footer", async () => {
    render(Footer);

    await screen.getByText(/Stay up to date/);
  });
});
