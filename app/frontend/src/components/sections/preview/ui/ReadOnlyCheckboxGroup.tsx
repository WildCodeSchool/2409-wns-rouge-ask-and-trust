export function ReadOnlyCheckboxGroup({
	options,
	checkedValues = [],
}: {
	options: string[]
	checkedValues?: string[]
}) {
	return (
		<div className="flex flex-col gap-2">
			{options.map(opt => (
				<label key={opt} className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={checkedValues.includes(opt)}
						disabled
					/>{" "}
					{opt}
				</label>
			))}
		</div>
	)
}
