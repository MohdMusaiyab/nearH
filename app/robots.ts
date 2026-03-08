import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/", "/superadmin/"],
    },
    sitemap: "https://nearh-beta.vercel.app/sitemap.xml",
  };
}
