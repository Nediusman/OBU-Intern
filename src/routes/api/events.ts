import { adminEmitter, EVENTS } from "../../backend/events";

export const GET = ({ request }: { request: Request }) => {
  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(c) {
      controller = c;

      const sendEvent = () => {
        try {
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`),
          );
        } catch (e) {
          console.error("Failed to enqueue SSE event", e);
        }
      };

      // Listen to the backend emitter
      adminEmitter.on(EVENTS.CONTENT_UPDATED, sendEvent);

      // Keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"));
        } catch (e) {
          console.error("Failed to enqueue heartbeat", e);
        }
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        adminEmitter.off(EVENTS.CONTENT_UPDATED, sendEvent);
      });
    },
    cancel() {
      // cleanup if stream is cancelled
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
};
