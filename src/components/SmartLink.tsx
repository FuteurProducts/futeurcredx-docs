import { Link } from "react-router-dom";
import { getCrossDomainUrl } from "../utils/domainUtils";

interface SmartLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function SmartLink({ to, className, children, onClick }: SmartLinkProps) {
  const currentHostname = window.location.hostname;
  const isLocalhost = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
  
  // Check if we're on a subdomain that needs cross-domain navigation
  const isSubdomain = currentHostname.includes('platform.futeurcredx.com') || 
                     currentHostname.includes('institutions.futeurcredx.com') || 
                     currentHostname.includes('docs.futeurcredx.com');
  
  // Always use React Router for client-side navigation unless we're on a subdomain
  // and the target path is a main domain path (like /business, /lumiq-build, etc.)
  const mainDomainPaths = ['/', '/business', '/lumiq-build', '/credit-journey', '/about', '/faq', '/contact-us', '/privacy-policy', '/terms-of-service'];
  const needsCrossDomain = isSubdomain && mainDomainPaths.includes(to);
  
  // Use React Router for same-domain navigation
  if (isLocalhost || !needsCrossDomain) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  
  // Use getCrossDomainUrl only for cross-domain navigation from subdomains
  return (
    <a href={getCrossDomainUrl(to)} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

