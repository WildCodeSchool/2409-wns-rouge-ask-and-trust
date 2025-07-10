import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { SwitchProps } from "@/types/types"
import { Controller } from "react-hook-form"

export default function SwitchPublic({ control, errors }: SwitchProps) {
	return (
		<>
			<Controller
				control={control}
				name="public"
				render={({ field }) => (
					<div className="flex flex-col gap-1">
						<Label htmlFor="public" required>
							Enquête publique
						</Label>
						<Switch
							id="public"
							checked={field.value}
							onCheckedChange={field.onChange}
						/>
					</div>
				)}
			/>
			{errors.root && (
				<div className="text-destructive-medium mb-4">
					{errors.root.message}
				</div>
			)}
		</>
	)
}
