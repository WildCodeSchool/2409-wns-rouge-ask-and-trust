import ErrorInput from "@/components/ui/ErrorInput"
import { Label } from "@/components/ui/Label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/Select"
import { QuestionUpdate } from "@/types/types"
import { Control, Controller, FieldErrors } from "react-hook-form"

// question : à quel moment on sauvegarde la question ?
// au clic en dehors ?
// un bouton enregister au niveau de la survey ?

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
							Sélectionner le type de la question
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="text">Texte court</SelectItem>
							<SelectItem value="text-area">
								Paragraphe
							</SelectItem>
							<SelectItem value="checkbox">
								Plusieurs réponses
							</SelectItem>
							<SelectItem value="radio">
								Une seule réponse
							</SelectItem>
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
