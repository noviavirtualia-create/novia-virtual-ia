import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  schema?: object;
}

const PRODUCTION_URL = 'https://noviavirtualia-create.github.io/novia-virtual-ia';

export const SEO: React.FC<SEOProps> = ({ 
  title = 'Novia Virtual IA | Conecta con la elegancia de lo digital', 
  description = 'La red social más exclusiva y profesional diseñada para creadores y visionarios. Únete a la élite digital.',
  keywords = 'red social, novia virtual ia, comunidad, compartir, noticias, tecnología, lujo, profesional',
  image = `${PRODUCTION_URL}/logo.svg`,
  url = `${PRODUCTION_URL}/`,
  type = 'website',
  author = 'Novia Virtual IA Team',
  schema
}) => {
  const siteTitle = (title && typeof title === 'string' && title.includes('Novia Virtual IA')) ? title : `${title || 'Novia Virtual IA'} | Novia Virtual IA`;
  
  // Asegurar que la URL canónica y de OG sea siempre la de producción
  const baseProdUrl = url.startsWith('http') && !url.includes('localhost') && !url.includes('.run.app') 
    ? url 
    : PRODUCTION_URL;
    
  const canonicalUrl = baseProdUrl.endsWith('/') ? baseProdUrl : `${baseProdUrl}/`;

  // Usar Cloudinary para renderizar el SVG como PNG para mejor compatibilidad social
  // Forzamos que la URL de origen sea siempre la de producción de GitHub
  const ogImage = `https://res.cloudinary.com/demo/image/fetch/w_1200,h_630,c_pad,b_white/${PRODUCTION_URL}/logo.svg`;

  // Default Organization Schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Novia Virtual IA",
    "url": PRODUCTION_URL,
    "logo": `${PRODUCTION_URL}/logo.svg`,
    "sameAs": [
      "https://twitter.com/noviavirtualia",
      "https://facebook.com/noviavirtualia"
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0f172a" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Novia Virtual IA" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@noviavirtualia" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};
