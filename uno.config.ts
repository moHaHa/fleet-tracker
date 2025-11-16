// uno.config.ts
import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(), // optional
    presetIcons({
      // optional
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
  shortcuts: [
    // your custom shortcuts here
    { btn: 'py-2 px-4 font-semibold rounded-lg shadow-md' },
    { 'btn-primary': 'bg-blue-500 text-white hover:bg-blue-700' },
  ],
})
