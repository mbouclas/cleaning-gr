import dotenv from "dotenv"
import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import critters from "astro-critters";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import compress from "astro-compress";
import robotsTxt from "astro-robots-txt";
import favicons from "astro-favicons";


import {resolve} from "path";
import {statSync} from "node:fs";
let envPath = '.env';
const env = process.env.ENV ? process.env.ENV : process.env.NODE_ENV || 'development';
try {
  envPath = (statSync(resolve(`.env.${env}`))) ?  `.env.${env}` : '.env';
}
catch (e) {

}

dotenv.config({ path: resolve(process.cwd(), envPath)});
console.log(env, process.env.SITE_BASE_URL)


// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_BASE_URL,
  integrations: [tailwind(), critters(), sitemap(), svelte(), mdx(),
    robotsTxt(),
    compress(),
    favicons({
      masterPicture: "./public/favicon.svg",
      appName: process.env.APP_NAME,
      appShortName: process.env.APP_SHORT_NAME,
      appDescription: process.env.APP_DESCRIPTION,
      background: "#ffffff",
      theme_color: "#ffffff",
      faviconsDarkMode: false,
    })
  ]
});
