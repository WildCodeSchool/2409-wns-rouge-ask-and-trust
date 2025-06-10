import { Helmet } from "react-helmet"
import SurveyForm from "@/components/sections/surveys/SurveyForm"
import { useSurvey } from "@/hooks/useSurvey"
import { useNavigate } from "react-router-dom"
import { CreateSurveyInput } from "@/types/types"

function SurveyCreate() {
  const { addSurvey } = useSurvey()
  const navigate = useNavigate()

  const handleCreate = async (form: CreateSurveyInput) => {
    const survey = await addSurvey({
      ...form,
      category: typeof form.category === "string" ? Number(form.category) : form.category
    })
    if (survey && survey.id) {
      navigate(`/surveys/build/${survey.id}`)
    }
  }

  return (
    <>
      <Helmet>
        <title>Créer une enquête</title>
        <meta name="description" content="Page de création d'une nouvelle enquête." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Créer une enquête" />
        <meta property="og:description" content="Page de création d'une nouvelle enquête." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Créer une enquête" />
        <meta name="twitter:description" content="Page de création d'une nouvelle enquête." />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
				<header className="bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
						<h1 className="text-2xl font-semibold text-gray-900">
            Créer une enquête
						</h1>
					</div>
				</header>

        <main className="mx-auto py-6 sm:px-6 lg:px-8">
          <SurveyForm onSubmit={handleCreate} />
        </main>
      </div>
    </>
  )
}

export default SurveyCreate
