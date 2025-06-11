import type React from "react"
import Question from "../surveys/buildSurvey/question/Question"
interface Question {
	id: string
	type: string
}

interface CanvasProps {
	className?: string
	questions: Question[]
	onAddQuestion: (type: string) => void
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
	onAddQuestion,
}) => {
	const handleAddQuestion = () => {
		// Default to single-line when using the button
		onAddQuestion("single-line")
	}
	console.log("questions", questions)

	return (
		<div className={`survey-canvas ${className}`}>
			{/* <div className="bg-primary-100 rounded-lg p-8">
				{questions.length === 0 ? (
					// Afficher l'état vide s'il n'y a pas de questions
					<EmptyState onAddQuestion={handleAddQuestion} />
				) : (
					// Afficher les questions s'il y en a
					<div>
						{/* Add logic to render questions - @ArthurVS05*/}
			{/*
                            questions.map(question => (
                            <QuestionManager
                                key={question.id}
                                questionType={question.type}
                                questionText={question.text}
                                {...?Props}
                                onDelete={() => onDeleteQuestion(question.id)}
                            />
                          ))}
                         */}

			{/* {questions.map(question => (
							<div
								key={question.id}
								className="mb-4 rounded-lg bg-white p-4 shadow"
							>
								<h3 className="font-medium">
									{question.type} Question
								</h3>
								<p className="text-black-400">
									Le contenu de la question sera affiché ici
								</p>
							</div>
						))}

						<div className="mt-6 flex justify-center">
							<Button
								onClick={handleAddQuestion}
								ariaLabel="Add Question"
							>
								Ajouter une question
								<span className="text-black-400 ml-2">•••</span>
							</Button>
						</div>
					</div>
				)} */}
			{/* </div> */}
			<Question questionId="10" />
		</div>
	)
}
