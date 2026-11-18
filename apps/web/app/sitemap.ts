import type { MetadataRoute } from "next";
import { SITE } from "@outlyne/core";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/generate", "/privacy", "/terms"].map((path) => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
