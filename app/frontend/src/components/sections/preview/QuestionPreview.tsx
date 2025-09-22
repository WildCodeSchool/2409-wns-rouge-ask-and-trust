import { Question, TypesOfQuestion } from "@/types/types"
import { Label } from "@/components/ui/Label"
import { ReadOnlyInput } from "./ui/ReadOnlyInput"
import { ReadOnlySelect } from "./ui/ReadOnlySelect"
import { ReadOnlySwitch } from "./ui/ReadOnlySwitch"
import { ReadOnlyCheckboxGroup } from "./ui/ReadOnlyCheckboxGroup"

type QuestionPreviewProps = {
	question: Question
}

export default function QuestionPreview({ question }: QuestionPreviewProps) {
	return (
		<div className="border-black-200 rounded-lg border bg-white p-6">
			<Label className="mb-4 block text-lg font-medium">
				{question.title}
			</Label>
			{question.type === TypesOfQuestion.Text && (
				<ReadOnlyInput placeholder="Votre réponse..." />
			)}

			{question.type === TypesOfQuestion.Boolean && (
				<div className="flex items-center gap-4">
					<span>Non</span>
					<ReadOnlySwitch
						checked={false}
						id={`switch-${question.id}`}
					/>
					<span>Oui</span>
				</div>
			)}

			{question.type === TypesOfQuestion.Select && (
				<ReadOnlySelect options={question.answers.map(a => a.value)} />
			)}

			{question.type === TypesOfQuestion.Checkbox && (
				<ReadOnlyCheckboxGroup
					options={question.answers.map(a => a.value)}
				/>
			)}
		</div>
	)
}
