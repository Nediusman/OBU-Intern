import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      eventSource = new EventSource("/api/events");

      eventSource.onopen = () => {
        setIsConnected(true);
        // On successful reconnect, fetch everything to ensure we didn't miss updates
        queryClient.invalidateQueries();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // If we received an actual update (not a heartbeat)
          if (data.timestamp) {
            queryClient.invalidateQueries();
          }
        } catch (err) {
          // It might be a heartbeat starting with ":"
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        if (eventSource) {
          eventSource.close();
        }
        // Fallback polling attempt after 5 seconds
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
      clearTimeout(reconnectTimer);
    };
  }, [queryClient]);

  return { isConnected };
}
