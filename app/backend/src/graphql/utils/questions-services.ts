import { Questions } from "../../database/entities/survey/questions"
import { Survey } from "../../database/entities/survey/survey"
import { AppError } from "../../middlewares/error-handler"
import { QuestionType, TypesOfQuestion } from "../../types/types"
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

/**
 * Validate and normalize answers based on question type.
 *
 * @param type - question's type (text, boolean, etc.)
 * @param answers - provided answers
 * @returns cleaned answers array
 * @throws AppError if validation fails
 */
export function validateAndNormalizeAnswers(
	type: QuestionType,
	answers: AnswerObject[] | undefined
): AnswerObject[] {
	if (!answers || answers.length === 0) {
		return []
	}

	if (type === TypesOfQuestion.Boolean && answers.length !== 2) {
		throw new AppError(
			"A Boolean question must have exactly 2 answers",
			400,
			"ValidationError"
		)
	}

	if (type === TypesOfQuestion.Text || type === TypesOfQuestion.TextArea) {
		// Text questions should not have predefined answers
		return []
	}

	return answers
}
