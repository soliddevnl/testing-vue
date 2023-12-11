import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/newsletter", () => {
    return HttpResponse.json({ message: "Thank you for subscribing!" });
  }),
];
