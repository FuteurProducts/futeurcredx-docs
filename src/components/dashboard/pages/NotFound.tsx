import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logger } from "@/utils/logger";

const NotFound = () => {
  const location = useLocation();
  // Preserve /demo/:bankId prefix so 404 links return to the correct dashboard
  const basePath = location.pathname.match(/^\/demo\/[^/]+/)?.[0] || '/dashboard';

  useEffect(() => {
    logger.warn("404: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-[60vh] justify-center items-center px-6">
      <div className="flex flex-col md:flex-row items-center max-w-3xl w-full gap-8 md:gap-16">
        {/* 404 Image */}
        <div className="shrink-0 w-48 md:w-64">
          <img
            className="w-full"
            src="/images/404.png"
            alt="404"
          />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <div className="mb-4 text-[3rem] md:text-[4rem] font-semibold text-foreground leading-none">
            Oops!
          </div>
          <div className="mb-8 text-[1rem] md:text-[1.25rem] text-muted-foreground">
            We couldn't find the page you were looking for
          </div>
          <Link
            to={basePath}
            className="inline-flex items-center gap-3 h-12 px-6 bg-primary text-white rounded-xl font-semibold text-[0.9375rem] hover:bg-primary/90 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
