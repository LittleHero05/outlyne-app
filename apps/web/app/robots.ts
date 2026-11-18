import type { MetadataRoute } from "next";
import { SITE } from "@outlyne/core";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cards", "/sign-in"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
