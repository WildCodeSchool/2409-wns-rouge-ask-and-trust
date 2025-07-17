import { Switch } from "@/components/ui/Switch"

export function ReadOnlySwitch({
	checked,
	id,
}: {
	checked: boolean
	id: string
}) {
	return (
		<Switch checked={checked} onCheckedChange={() => {}} disabled id={id} />
	)
}
