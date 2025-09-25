import { Question, TypesOfQuestion } from "@/types/types"
import { Label } from "@/components/ui/Label"
import { ReadOnlyInput } from "@/components/sections/preview/ui/ReadOnlyInput"
import { ReadOnlySelect } from "@/components/sections/preview/ui/ReadOnlySelect"
import { ReadOnlySwitch } from "@/components/sections/preview/ui/ReadOnlySwitch"
import { ReadOnlyCheckboxGroup } from "@/components/sections/preview/ui/ReadOnlyCheckboxGroup"
import { ReadOnlyTextarea } from "@/components/sections/preview/ui/ReadOnlyTextarea"
import { ReadOnlyRadio } from "@/components/sections/preview/ui/ReadOnlyRadio"

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

			{question.type === TypesOfQuestion.TextArea && (
				<ReadOnlyTextarea placeholder="Votre réponse..." />
			)}

			{question.type === TypesOfQuestion.Radio && (
				<ReadOnlyRadio options={question.answers.map(a => a.value)} />
			)}
		</div>
	)
}
