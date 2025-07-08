import { useSurvey } from "@/hooks/useSurvey"
import { mockSurvey, SurveyPreview } from "./mockSurvey"
import { useState } from "react"

interface SurveySelectorProps {
	onSelect: (survey: SurveyPreview) => void
}

export default function SurveySelector({ onSelect }: SurveySelectorProps) {
	const { surveys } = useSurvey()
	// Combine mock and backend surveys (if available)
	const allSurveys = [
		mockSurvey,
		...surveys.map(s => ({
			...s,
			questions: [],
			// Keep category as is (object or string)
		})),
	]
	const [selectedIndex, setSelectedIndex] = useState(0)

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const idx = Number(e.target.value)
		setSelectedIndex(idx)
		onSelect(allSurveys[idx])
	}

	return (
		<div className="mb-4">
			<label htmlFor="survey-select" className="mb-1 block font-medium">
				Choisir un formulaire :
			</label>
			<select
				id="survey-select"
				className="w-full rounded border px-3 py-2"
				value={selectedIndex}
				onChange={handleChange}
			>
				{allSurveys.map((s, i) => (
					<option key={i} value={i}>
						{s.title}
					</option>
				))}
			</select>
		</div>
	)
}
