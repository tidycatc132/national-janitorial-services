// Load variables from `.env` as soon as possible
require("dotenv").config({
   path: `.env.${process.env.NODE_ENV || "development"}`,
});

const clientConfig = require("./client-config");

const isProd = process.env.NODE_ENV === "production";
// const previewEnabled =
//   (process.env.GATSBY_IS_PREVIEW || "false").toLowerCase() === "true";
const previewEnabled = true;

const {
   NODE_ENV,
   URL: NETLIFY_SITE_URL = "https://longbeachjanitorial.com/",
   DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
   CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === "production";
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

module.exports = {
   siteMetadata: {
      siteUrl,
      author: `Long Beach Janitorial`,
   },
   plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-advanced-sitemap`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-transition-link`,
      {
         resolve: `gatsby-plugin-sharp`,
         options: {
            defaults: {
               placeholder: `blurred`,
               quality: 100,
               breakpoints: [640, 768, 1024, 1280, 1536],
            },
         },
      },
      {
         resolve: "gatsby-plugin-robots-txt",
         options: {
            resolveEnv: () => NETLIFY_ENV,
            env: {
               production: {
                  policy: [{ userAgent: "*" }],
               },
               "branch-deploy": {
                  policy: [{ userAgent: "*", disallow: ["/"] }],
                  sitemap: null,
                  host: null,
               },
               "deploy-preview": {
                  policy: [{ userAgent: "*", disallow: ["/"] }],
                  sitemap: null,
                  host: null,
               },
            },
         },
      },
      {
         resolve: "gatsby-plugin-anchor-links",
         options: {
            offset: -100,
         },
      },
      {
         resolve: `gatsby-source-filesystem`,
         options: {
            path: `${__dirname}/static/images`,
            name: `uploads`,
         },
      },      
      {
         resolve: `gatsby-source-filesystem`,
         options: {
            path: `${__dirname}/src/images`,
            name: `uploads`,
         },
      },
      {
         resolve: `gatsby-plugin-styled-components`,
         options: {
            displayName: false,
         },
      },
      {
         resolve: `gatsby-plugin-sass`,
         options: {
            postCssPlugins: [require("tailwindcss")("./tailwind.config.js")],
         },
      },
      {
         resolve: `gatsby-plugin-purgecss`,
         options: {
            // develop: true,
            tailwind: true,
            purgeOnly: ["node_modules/@fortawesome/fontawesome-pro/css/all.min.css"],
         },
      },
      {
         resolve: "gatsby-source-sanity",
         options: {
            ...clientConfig.sanity,
            token: process.env.SANITY_READ_TOKEN,
            watchMode: !isProd, // watchMode only in dev mode
            overlayDrafts: !isProd || previewEnabled, // drafts in dev & Gatsby Cloud Preview
         },
      },
      {
         resolve: "gatsby-plugin-sanity-image",
         options: {
            ...clientConfig.sanity,
            defaultImageConfig: {
               quality: 100,
               fit: "max",
               auto: "format",
            },
         },
      },
      {
         resolve: `gatsby-plugin-manifest`,
         options: {
            name: `Long Beach Janitorial`,
            short_name: `LBJ`,
            start_url: `/`,
            background_color: `#53AF3B`,
            theme_color: `#53AF3B`,
            display: `standalone`,
            icon: `static/images/favicon.svg`,
         },
      },
      {
         resolve: "gatsby-plugin-google-tagmanager",
         options: {
            id: "GTM-MBHDMZMS",
            includeInDevelopment: false,
         },
      },
   ],
};
