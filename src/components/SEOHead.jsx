import { Helmet } from 'react-helmet-async';
import { BRAND_NAME, SITE_URL } from '../config.js';

export default function SEOHead({ title, description, image, url, type = 'website' }) {
  const fullTitle = title ? `${title} | ${BRAND_NAME}` : BRAND_NAME;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image || `${SITE_URL}/og-default.jpg`;
  const desc = description || 'Quality laptops. Fair prices. Browse the latest laptops for students, professionals, gamers and engineers.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={BRAND_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}