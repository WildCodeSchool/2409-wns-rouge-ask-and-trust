import Pagination from "@/components/ui/Pagination"
import { useResponsivity } from "@/hooks/useResponsivity"

export default function UserTableNav({
	currentPage,
	setCurrentPage,
	totalCount,
	perPage,
}: {
	currentPage: number
	setCurrentPage: (page: number) => void
	totalCount: number
	perPage: number
}) {
	const { rootRef } = useResponsivity(Infinity, 768)

	return (
		<div
			className="flex items-center justify-between max-lg:flex-wrap max-lg:justify-center max-lg:gap-x-10 max-lg:gap-y-5"
			ref={rootRef}
		>
			<Pagination
				className="m-0 w-max max-lg:order-1 max-lg:w-full"
				currentPage={currentPage}
				totalCount={totalCount}
				perPage={perPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	)
}
