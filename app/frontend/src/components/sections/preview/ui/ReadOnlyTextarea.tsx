import { Textarea } from "@/components/ui/Textarea"

export function ReadOnlyTextarea({
	value,
	placeholder = "—",
}: {
	value?: string
	placeholder?: string
}) {
	return (
		<Textarea
			value={value ?? ""}
			placeholder={placeholder}
			disabled
			readOnly
			className="resize-none"
		/>
	)
}
