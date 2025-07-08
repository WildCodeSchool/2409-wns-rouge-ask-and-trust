import { useSurvey } from "@/hooks/useSurvey"
import { mockSurvey, SurveyPreview } from "./mockSurvey"
import { useState } from "react"

interface SurveySelectorProps {
  onSelect: (survey: SurveyPreview) => void
}

export default function SurveySelector({ onSelect }: SurveySelectorProps) {
  const { surveys } = useSurvey()
  // On combine le mock et les surveys du backend (si disponibles)
  const allSurveys = [
    mockSurvey,
    ...surveys.map(s => ({
      ...s,
      questions: [],
      // On garde category tel quel (objet ou string)
    }))
  ]
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value)
    setSelectedIndex(idx)
    onSelect(allSurveys[idx])
  }

  return (
    <div className="mb-4">
      <label htmlFor="survey-select" className="block mb-1 font-medium">Choisir un formulaire :</label>
      <select
        id="survey-select"
        className="w-full rounded border px-3 py-2"
        value={selectedIndex}
        onChange={handleChange}
      >
        {allSurveys.map((s, i) => (
          <option key={i} value={i}>{s.title}</option>
        ))}
      </select>
    </div>
  )
}
