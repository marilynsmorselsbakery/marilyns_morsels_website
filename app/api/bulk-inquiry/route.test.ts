import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { resendSend } = vi.hoisted(() => ({
  resendSend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

describe("POST /api/bulk-inquiry", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    resendSend.mockReset();
    resendSend.mockResolvedValue({ data: { id: "email_123" }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("emails a valid inquiry before reporting success", async () => {
    const { POST } = await import("./route");
    const response = await POST(
      new NextRequest("https://marilynsmorsels.com/api/bulk-inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Jamie Customer",
          company: "Acme Events",
          email: "jamie@example.com",
          phone: "614-555-0123",
          details: "120 cookies for August 15",
          notes: "Chocolate chip",
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(resendSend).toHaveBeenCalledTimes(1);
    expect(resendSend.mock.calls[0][0]).toMatchObject({
      to: "marilynsmorselsbakery@gmail.com",
      replyTo: "jamie@example.com",
    });
  });
});
