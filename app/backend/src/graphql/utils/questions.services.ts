import { Questions } from "../../database/entities/survey/questions"
import { Survey } from "../../database/entities/survey/survey"
import { QuestionType } from "../../types/types"
import { AnswerObject } from "../inputs/create/survey/create-questions-input"

export type QuestionsRequiredFields = {
	title: string
	type: QuestionType
	answers: AnswerObject[]
	survey: Survey
}

export function createQuestionInstance(
	data: QuestionsRequiredFields
): Questions {
	return Object.assign(new Questions(), data)
}
