import {
	PaginationContainer,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from "./PaginationContainer"

type PaginationProps = {
	currentPage: number
	totalCount: number
	perPage: number
	onPageChange: (page: number) => void
	className?: string
}

export default function Pagination({
	currentPage,
	totalCount,
	perPage,
	onPageChange,
	className,
}: PaginationProps) {
	const totalPages = Math.ceil(totalCount / perPage)

	if (totalPages <= 1) return null

	const goToPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page)
		}
	}

	const paginationRange = () => {
		const pages: (number | string)[] = []

		if (totalPages <= 5) {
			// Show all pages if totalPages <= 5
			for (let i = 1; i <= totalPages; i++) pages.push(i)
		} else {
			// Always show the first page
			pages.push(1)

			// Show ellipsis if currentPage is far from the beginning (greater than 3)
			if (currentPage > 3) {
				pages.push("...")
			}

			// Calculate the middle pages to show around the current page
			const startPage = Math.max(2, currentPage - 1)
			const endPage = Math.min(totalPages - 1, currentPage + 1)

			for (let i = startPage; i <= endPage; i++) {
				pages.push(i)
			}

			// Show Ellipsis if currentPage is far from the end (less than totalPages - 2)
			if (currentPage < totalPages - 2) {
				pages.push("...")
			}

			// Always show the last page
			pages.push(totalPages)
		}

		return pages
	}

	const pages = paginationRange()

	return (
		<PaginationContainer className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={() => goToPage(currentPage - 1)}
						aria-disabled={currentPage === 1}
					/>
				</PaginationItem>
				{pages.map((page, index) =>
					page === "..." ? (
						<PaginationItem key={`ellipsis-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={page}>
							<PaginationLink
								href="#"
								isActive={page === currentPage}
								onClick={e => {
									e.preventDefault()
									goToPage(Number(page))
								}}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					)
				)}
				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={() => goToPage(currentPage + 1)}
						aria-disabled={currentPage === totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</PaginationContainer>
	)
}
