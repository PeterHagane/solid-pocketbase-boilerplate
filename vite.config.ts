import { defineConfig, loadEnv } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const plugins = [solid()]

  const environmentVars = {
    'process.env.API_URI': JSON.stringify(env.API_URI),
    'process.env.APP_IS_DEV': JSON.stringify(env.APP_IS_DEV),
    'process.env.API_KEY': JSON.stringify(env.API_KEY),
    'process.env.API_PASSWORD': JSON.stringify(env.API_PASSWORD)
  }

  const port = env.APP_IS_DEV === "true" ? 5998 : 5999;

  return {
    define: environmentVars,
    plugins: plugins,
    server: {
      port: port
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    }
  }
}
)