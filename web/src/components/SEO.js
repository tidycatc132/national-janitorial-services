import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

const SearchEngineOptimization = ({
  title,
  description,
  pathname,
  openGraphImage,
  article = false,
  lang,
  keywords,
  noIndex,
  meta,
  jsonLd,
}) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          defaultTitle: title
          defaultDescription: description
          siteUrl
          defaultImage: image
          twitterUsername
          author
        }
      }
    }
  `);

  const metaTitle = title || site?.siteMetadata?.defaultTitle || "Commercial Cleaning Services";
  const metaDescription = description || site?.siteMetadata?.defaultDescription || "";
  const siteUrl = site?.siteMetadata?.siteUrl || "";
  const canonicalUrl = pathname ? `${siteUrl}${pathname}` : siteUrl;

  const imageUrl = openGraphImage
    ? openGraphImage.startsWith("http")
      ? openGraphImage
      : `${siteUrl}${openGraphImage}`
    : site?.siteMetadata?.defaultImage
    ? `${siteUrl}${site?.siteMetadata?.defaultImage}`
    : "";

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={metaTitle}
      titleTemplate="%s"
      link={canonicalUrl ? [{ rel: "canonical", href: canonicalUrl }] : []}
      meta={[
        { name: `description`, content: metaDescription },

        // Open Graph
        { property: `og:title`, content: metaTitle },
        { property: `og:description`, content: metaDescription },
        { property: `og:type`, content: article ? `article` : `website` },
        { property: `og:url`, content: canonicalUrl },
        ...(imageUrl ? [{ property: `og:image`, content: imageUrl }] : []),

        // Twitter
        { name: `twitter:card`, content: `summary_large_image` },
        { name: `twitter:title`, content: metaTitle },
        { name: `twitter:description`, content: metaDescription },
        ...(site?.siteMetadata?.twitterUsername || site?.siteMetadata?.author
          ? [
              {
                name: `twitter:creator`,
                content: site?.siteMetadata?.twitterUsername || site?.siteMetadata?.author,
              },
            ]
          : []),
        ...(imageUrl ? [{ name: `twitter:image`, content: imageUrl }] : []),
      ]}
    >
      {/* Optional Keywords & NoIndex */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(`, `)} />
      )}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* JSON-LD Schema Markup */}
      {[].concat(jsonLd || []).map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

SearchEngineOptimization.defaultProps = {
  lang: `en`,
  keywords: [],
  meta: [],
  noIndex: false,
};

SearchEngineOptimization.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pathname: PropTypes.string,
  openGraphImage: PropTypes.string,
  article: PropTypes.bool,
  lang: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  noIndex: PropTypes.bool,
  meta: PropTypes.array,
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default SearchEngineOptimization;
