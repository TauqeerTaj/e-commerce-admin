"use client";

import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

export default function ApiLoadingBar() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let activeRequests = 0;

    // Listen for fetch events
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      // Only show loading for API calls
      if (typeof args[0] === "string" && args[0].includes("/api/")) {
        activeRequests++;
        setIsLoading(true);
        setProgress(30);

        try {
          const response = await originalFetch(...args);
          setProgress(70);
          return response;
        } finally {
          activeRequests--;
          if (activeRequests === 0) {
            setProgress(100);
            setTimeout(() => {
              setIsLoading(false);
              setProgress(0);
            }, 300);
          }
        }
      }

      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <LoadingBar
      color="#3b82f6"
      progress={progress}
      height={3}
      waitingTime={400}
      transitionTime={200}
      loaderSpeed={500}
    />
  );
}
