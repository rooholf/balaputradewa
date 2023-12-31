import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    // creating a chunk to @open-ish deps. Reducing the vendor chunk size
                    if (id.includes('tslib')) {
                        return 'tslib';
                    }
                    if (id.includes('lodash')) {
                        return 'lodash'
                    }

                    if (id.includes('dayjs')) {
                        return 'dayjs'
                    }
                    if (id.includes('@refinedev/core') ||
                        id.includes('@refinedev/inferencer') ||
                        id.includes('@refinedev/kbar')
                    ) {
                        return '@refinedev/core'
                    }
                    if (id.includes('@refinedev/antd')) {
                        return '@refinedev/antd'
                    }

                    if (id.includes('@ant-design/charts') ||
                        id.includes('@ant-design/graphs') ||
                        id.includes('@ant-design/icons')) {
                        return '@ant-design'
                    }

                    if (id.includes('@emotion/react') ||
                        id.includes('@emotion/styled')) {
                        return '@emotion'
                    }


                    if (id.includes('@refinedev/react-router-v6')) {
                        return '@refinedev/react-router-v6'
                    }

                    if (id.includes('i18next') ||
                        id.includes('i18next-browser-languagedetector') ||
                        id.includes('i18next-xhr-backend') ||
                        id.includes('react-i18next')
                    ) {
                        return '@i18next'
                    }
                    // creating a chunk to react routes deps. Reducing the vendor chunk size
                    if (
                        id.includes('react-router-dom') ||
                        id.includes('react-router')
                    ) {
                        return '@react-router';
                    }
                    if (
                        id.includes('src/components')
                    ) {
                        return 'components'
                    }
                    if (
                        id.includes('@types')
                    ) {
                        return '@types'
                    }
                    if (
                        id.includes('src/pages')
                    ) {
                        return 'pages'
                    }
                },
            },
        },
    },
});
