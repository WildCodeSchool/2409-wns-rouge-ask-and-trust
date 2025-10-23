import SurveyContentResponseSkeleton from "./SurveyContentResponseSkeleton"
import SurveyHeaderResponseSkeleton from "./SurveyHeaderResponseSkeleton"

export default function SurveyResponsePageSkeleton({
	isPreview,
}: {
	isPreview?: boolean
}) {
	return (
		<div className="bg-black-50 min-h-[calc(100vh_-_var(--header-height))]">
			<SurveyHeaderResponseSkeleton isPreview={isPreview} />
			<SurveyContentResponseSkeleton />
		</div>
	)
}
