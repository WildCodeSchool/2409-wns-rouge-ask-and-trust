import { Questions } from "../../database/entities/survey/questions"
import { Survey } from "../../database/entities/survey/survey"
import { TypesOfQuestion } from "../../types/types"
import { CREATE_QUESTION } from "../api/question"
import { assert, getTestContext, TestArgsType } from "../setup.test"
import * as authService from "../../services/auth-service"

/**
 * QuestionResolverTest.ts
 *
 * Integration test suite for question creation GraphQL resolver.
 *
 * Purpose:
 *  - Ensure that authenticated users can create questions in their surveys.
 *  - Verify validation for question title, type, and answers.
 *  - Validate JSON structure for answers field.
 *
 * Methodology:
 *  - Use Jest to mock `authService.whoami` for simulating logged-in users.
 *  - Execute GraphQL operations via `ApolloServer.executeOperation`.
 *  - Assert API responses and validate database entries.
 *  - Use pre-created authenticated user and test survey.
 *
 * Scenarios tested:
 *  1. Create a text question → should succeed.
 *  2. Create a radio question with answers → should succeed.
 *  3. Create a checkbox question with multiple answers → should succeed.
 *  4. Attempt to create question with empty title → should fail.
 *  5. Attempt to create question with title too long → should fail.
 *  6. Attempt to create question with invalid type → should fail.
 *  7. Attempt to create question for non-existent survey → should fail.
 *
 * @param testArgs - Shared test arguments including Apollo server, database, and test users.
 */
export function QuestionResolverTest(testArgs: TestArgsType) {
	let testSurvey: Survey

	beforeEach(() => {
		jest.restoreAllMocks()
	})

	// Setup: Create a test survey before running question tests
	beforeAll(async () => {
		// Create a category for the test survey
		const category = await testArgs.datasource.query(
			`INSERT INTO category (name) VALUES ('Test Category Questions') RETURNING id`
		)

		testSurvey = await Survey.create({
			title: "Test Survey for Questions",
			description: "Survey used for testing questions",
			status: "draft",
			public: true,
			user: testArgs.data.user!,
			category: { id: category[0].id },
			estimatedDuration: 10,
			availableDuration: 30,
		}).save()
	})

	it("should create a text question", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "What is your name?",
						type: TypesOfQuestion.Text,
						answers: [],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		// Check API response
		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()

		const question = response.body.singleResult.data?.createQuestion
		expect(question).toBeDefined()
		expect(question?.id).toBeDefined()
		expect(question?.title).toBe("What is your name?")
		expect(question?.type).toBe(TypesOfQuestion.Text)
		expect(question?.answers).toEqual([])
		expect(question?.survey.id).toBe(String(testSurvey.id))
		expect(question?.survey.title).toBe("Test Survey for Questions")

		// Verify in database
		const questionFromDb = await Questions.findOne({
			where: { id: question!.id },
			relations: ["survey"],
		})

		expect(questionFromDb).toBeDefined()
		expect(questionFromDb?.title).toBe("What is your name?")
		expect(questionFromDb?.type).toBe(TypesOfQuestion.Text)
		expect(questionFromDb?.survey.id).toBe(testSurvey.id)
	})

	it("should create a radio question with answers", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "What is your favorite color?",
						type: TypesOfQuestion.Radio,
						answers: [
							{ value: "Red" },
							{ value: "Blue" },
							{ value: "Green" },
						],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()

		const question = response.body.singleResult.data?.createQuestion
		expect(question).toBeDefined()
		expect(question?.id).toBeDefined()
		expect(question?.title).toBe("What is your favorite color?")
		expect(question?.type).toBe(TypesOfQuestion.Radio)
		expect(question?.answers).toHaveLength(3)
		expect(question?.answers[0].value).toBe("Red")
		expect(question?.answers[1].value).toBe("Blue")
		expect(question?.answers[2].value).toBe("Green")

		// Verify in database
		const questionFromDb = await Questions.findOneBy({
			id: question!.id,
		})

		expect(questionFromDb).toBeDefined()
		expect(questionFromDb?.answers).toHaveLength(3)
		expect(questionFromDb?.answers[0].value).toBe("Red")
	})

	it("should create a checkbox question with multiple answers", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "Which programming languages do you know?",
						type: TypesOfQuestion.Checkbox,
						answers: [
							{ value: "JavaScript" },
							{ value: "TypeScript" },
							{ value: "Python" },
							{ value: "Java" },
						],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()

		const question = response.body.singleResult.data?.createQuestion
		expect(question).toBeDefined()
		expect(question?.id).toBeDefined()
		expect(question?.title).toBe("Which programming languages do you know?")
		expect(question?.type).toBe(TypesOfQuestion.Checkbox)
		expect(question?.answers).toHaveLength(4)

		// Verify in database
		const questionFromDb = await Questions.findOneBy({
			id: question!.id,
		})

		expect(questionFromDb).toBeDefined()
		expect(questionFromDb?.type).toBe(TypesOfQuestion.Checkbox)
		expect(questionFromDb?.answers).toHaveLength(4)
	})

	it("should create a textarea question", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "Please describe your experience",
						type: TypesOfQuestion.TextArea,
						answers: [],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()

		const question = response.body.singleResult.data?.createQuestion
		expect(question).toBeDefined()
		expect(question?.title).toBe("Please describe your experience")
		expect(question?.type).toBe(TypesOfQuestion.TextArea)
	})

	it("should create a boolean question", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "Do you agree with the terms?",
						type: TypesOfQuestion.Boolean,
						answers: [],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()

		const question = response.body.singleResult.data?.createQuestion
		expect(question).toBeDefined()
		expect(question?.title).toBe("Do you agree with the terms?")
		expect(question?.type).toBe(TypesOfQuestion.Boolean)
	})

	it("should create a select question with options", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "Select your country",
						type: TypesOfQuestion.Select,
						answers: [
							{ value: "France" },
							{ value: "Germany" },
							{ value: "Spain" },
							{ value: "Italy" },
						],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()

		const question = response.body.singleResult.data?.createQuestion
		expect(question).toBeDefined()
		expect(question?.title).toBe("Select your country")
		expect(question?.type).toBe(TypesOfQuestion.Select)
		expect(question?.answers).toHaveLength(4)
	})

	it("should NOT create a question with empty title", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "",
						type: TypesOfQuestion.Text,
						answers: [],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
	})

	it("should NOT create a question with title too long", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const longTitle = "a".repeat(1001) // Exceeds 1000 char limit

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: longTitle,
						type: TypesOfQuestion.Text,
						answers: [],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
	})

	it("should NOT create a question with invalid type", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "Valid question?",
						type: "INVALID_TYPE",
						answers: [],
						surveyId: testSurvey.id,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
	})

	it("should NOT create a question for non-existent survey", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate authenticated user
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createQuestion: Questions
		}>(
			{
				query: CREATE_QUESTION,
				variables: {
					data: {
						title: "Orphan question?",
						type: TypesOfQuestion.Text,
						answers: [],
						surveyId: 99999, // Non-existent survey
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
	})
}
