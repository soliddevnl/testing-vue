import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/vue";
import UserList from "./UserList.vue";
import { server } from "../../mocks/node";
import { http } from "msw";

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

    await waitFor(async () => {
      const firstName = await screen.getByText("Clementine Bauch");
      const secondName = await screen.getByText("Ervin Howell");

      // 4 means the second element is after the first one
      expect(firstName.compareDocumentPosition(secondName)).toBe(4);
    });
  });
});
