require("dotenv").config({ path: `${__dirname}/.env` })

module.exports = {
  siteMetadata: {
    title: `LoginRadius Engineering`,
    titleTemplate: "%s · LoginRadius Engineering",
    description:
      "LoginRadius empowers businesses to deliver a delightful customer experience and win customer trust. Using the LoginRadius Identity Platform, companies can offer a streamlined login process while protecting customer accounts and complying with data privacy regulations.",
    siteUrl: "https://www.loginradius.com",
    feedUrl: "https://www.loginradius.com/blog/async",
    image: "/engineering-blog.svg",
    owner: "LoginRadius",
    menuLinks: [
      {
        name: "Developers",
        slug: "https://www.loginradius.com/identity-experience-framework/",
      },
      {
        name: "Docs",
        slug: "https://www.loginradius.com/docs/developer",
      },
      {
        name: "Our Blogs",
        slug: "https://www.loginradius.com/blog/",
      },
      {
        name: "Open Source",
        slug: "https://github.com/LoginRadius/",
      },
      {
        name: "Write for Us",
        slug: "https://www.loginradius.com/blog/async/page/guest-blog",
      },
    ],
    footerLinks: [
      {
        name: "Privacy Policy",
        slug: "https://www.loginradius.com/privacy-policy",
      },
      {
        name: "Terms",
        slug: "https://www.loginradius.com/terms/",
      },
      {
        name: "Security Policy",
        slug: "https://www.loginradius.com/security-policy/",
      },
      {
        name: "Site Map",
        slug: "https://www.loginradius.com/site-map/",
      },
    ],
    socialLinks: [
      {
        name: "twitter",
        slug: "https://twitter.com/LoginRadius",
      },
      {
        name: "linkedin",
        slug: "https://www.linkedin.com/company/loginradius/",
      },
      {
        name: "youtube",
        slug: "https://www.youtube.com/user/LoginRadius",
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `content`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          { resolve: "gatsby-remark-copy-linked-files" },
          {
            resolve: `gatsby-remark-relative-images`,
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 768,
            },
          },
          {
            resolve: `gatsby-remark-vscode`,
            options: {
              theme: "Dark+ (default dark)",
              languageAliases: {
                html: "js",
              },
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GA_TRACKING_ID,
        head: true,
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: process.env.GOOGLE_TAGMANAGER_ID,

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        //defaultDataLayer: { platform: "gatsby" },

        // Specify optional GTM environment details.
        //gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        //gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        //dataLayerName: "YOUR_DATA_LAYER_NAME",

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        //routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `LoginRadius Engineering`,
        short_name: `LR Blog`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/lr-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        // Fields to index
        fields: [`title`, `tags`],
        // How to resolve each field`s value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields` values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tags,
            path: node => node.fields.slug,
          },
        },
        // Optional filter to limit indexed nodes
        filter: (node, getNode) => node.frontmatter.tags !== "exempt",
      },
    },
    `gatsby-transformer-yaml`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                feedUrl,
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  title: edge.node.frontmatter.title,
                  url: site.siteMetadata.feedUrl + edge.node.fields.slug,
                  pubDate: edge.node.frontmatter.date,
                  author: edge.node.frontmatter.author.id,
                  categories: edge.node.frontmatter.tags,
                  enclosure: {
                    url:
                      site.siteMetadata.siteUrl +
                      edge.node.frontmatter.coverImage.childImageSharp.fluid
                        .src,
                    type: "image/jpeg",
                    size: 768,
                  },
                  custom_elements: [
                    {
                      "content:encoded": `<p> ${
                        edge.node.frontmatter.description || edge.node.excerpt
                      } </p> <br/>  <a href="${
                        site.siteMetadata.feedUrl + edge.node.fields.slug
                      }">Read On</a>`,
                    },
                    {
                      authorImage: edge.node.frontmatter.author.github
                        ? `https://github.com/${edge.node.frontmatter.author.github}.png?size=100v=40`
                        : `https://ui-avatars.com/api/?name=${edge.node.frontmatter.author.id}&size=100`,
                    },
                  ],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000
                  filter: { fileAbsolutePath: { regex: "//content//" } }
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 280)
                      fields { slug }
                      frontmatter {
                        title
                        description
                        date(formatString: "MMMM DD, YYYY")
                        coverImage {
                          publicURL,
                          childImageSharp {
                            fluid {
                              src
                            }
                          }
                        }
                        author {
                          id
                          github
                        }
                        tags
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "LoginRadius Engineering Blog",
            feed_url: "https://www.loginradius.com/blog/async/rss.xml",
            site_url: "https://www.loginradius.com/blog/async/",
            description:
              "Company Updates, Technology Articles from LoginRadius",
            language: "en-us",
          },
        ],
      },
    },
  ],
  mapping: {
    "MarkdownRemark.frontmatter.author": `AuthorYaml`,
  },
  pathPrefix: `/blog/async`,
}
