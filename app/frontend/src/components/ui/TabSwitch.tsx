type TabOption = {
	value: string
	label: string
}

type TabSwitchProps = {
	options: TabOption[]
	value: string
	onChange: (value: string) => void
	ariaLabel?: string
}

export default function TabSwitch({
	options,
	value,
	onChange,
	ariaLabel = "Onglets",
}: TabSwitchProps) {
	return (
		<div
			role="tablist"
			aria-label={ariaLabel}
			className="bg-primary-100 w-full rounded-xl p-2"
		>
			<div className="flex gap-2">
				{options.map(option => (
					<button
						key={option.value}
						role="tab"
						aria-selected={value === option.value}
						className={`text-primary-700 flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition-colors ${
							value === option.value
								? "bg-primary-400"
								: "bg-transparent"
						}`}
						onClick={() => onChange(option.value)}
					>
						{option.label}
					</button>
				))}
			</div>
		</div>
	)
}
