import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/hints",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],

  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
  app: {
    head: {
      title: "OSRS Recipe Master",
      meta: [
        {
          name: "description",
          content:
            "Gerencie receitas de itens do Old School RuneScape com facilidade.",
        },
        {
          name: "keywords",
          content: "OSRS, receitas, runescape, gerenciamento, itens, economia",
        },
        { property: "og:title", content: "OSRS Recipe Master" },
        {
          property: "og:description",
          content:
            "Gerencie receitas de itens do Old School RuneScape com facilidade.",
        },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "/og-image.png" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "OSRS Recipe Master" },
        {
          name: "twitter:description",
          content:
            "Gerencie receitas de itens do Old School RuneScape com facilidade.",
        },
        { name: "twitter:image", content: "/og-image.png" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
});
