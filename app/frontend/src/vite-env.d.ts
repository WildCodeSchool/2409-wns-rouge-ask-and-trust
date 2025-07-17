/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_NODE_ENV?: string
	readonly MODE: string
	readonly DEV: boolean
	readonly PROD: boolean
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
