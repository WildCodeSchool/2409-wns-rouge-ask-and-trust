import ErrorInput from "@/components/ui/ErrorInput"
import { Label } from "@/components/ui/Label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/Select"
import {
	QuestionUpdate,
	TypesOfQuestion,
	TypesOfQuestionLabels,
} from "@/types/types"
import { Control, Controller, FieldErrors } from "react-hook-form"

type QuestionTypeSelectProps = {
	control: Control<QuestionUpdate>
	errors: FieldErrors<QuestionUpdate>
}
export default function QuestionTypeSelect({
	control,
	errors,
}: QuestionTypeSelectProps) {
	return (
		<div>
			<Label htmlFor="question-type" required>
				Type de question
			</Label>
			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<Select onValueChange={field.onChange} value={field.value}>
						<SelectTrigger id="question-type">
							{TypesOfQuestionLabels[
								Object.keys(TypesOfQuestion).find(
									key =>
										TypesOfQuestion[
											key as keyof typeof TypesOfQuestion
										] === field.value
								) as keyof typeof TypesOfQuestion
							] || "Sélectionner le type de la question"}
						</SelectTrigger>
						<SelectContent>
							{Object.entries(TypesOfQuestion).map(
								([key, value]) => (
									<SelectItem key={value} value={value}>
										{
											TypesOfQuestionLabels[
												key as keyof typeof TypesOfQuestion
											]
										}
									</SelectItem>
								)
							)}
						</SelectContent>
					</Select>
				)}
			/>
			{errors?.type?.message && (
				<ErrorInput message={errors.type.message} />
			)}
		</div>
	)
}
