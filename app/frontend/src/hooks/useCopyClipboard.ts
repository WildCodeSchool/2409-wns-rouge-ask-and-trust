import { useToast } from "./useToast"

export function useCopyClipboard() {
	const { showToast } = useToast()

	async function copyToClipboard(text: string) {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text)
			} else {
				const textarea = document.createElement("textarea")
				textarea.value = text
				textarea.readOnly = true // avoid mobile keyboard
				textarea.style.position = "fixed" // prevent scroll

				document.body.appendChild(textarea)
				textarea.select()
				document.execCommand("copy")
				document.body.removeChild(textarea)
			}

			showToast({
				type: "success",
				title: "Lien copié !",
				description: "Vous pouvez maintenant le partager",
			})
		} catch (err) {
			console.error("Error copying link in clipboard :", err)
			showToast({
				type: "error",
				title: "Impossible de copier le lien",
				description: "Veuillez copier le lien manuellement",
			})
		}
	}

	return { copyToClipboard }
}
