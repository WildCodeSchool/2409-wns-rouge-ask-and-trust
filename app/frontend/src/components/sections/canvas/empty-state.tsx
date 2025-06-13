export const EmptyState = () => {
	return (
		<div className="flex flex-col items-center justify-center text-center">
			<div className="relative mb-6 h-64 w-64">
				{/* // Image is missing */}
				<img
					src="/placeholder.svg?height=256&width=256"
					alt="Empty form"
					width={256}
					height={256}
					className="opacity-70"
				/>
			</div>
			<h2 className="text-primary-800 mb-2 text-2xl font-semibold">
				Votre formulaire est vide
			</h2>
			<p className="text-black-400">
				Cliquez sur le bouton ci-dessous pour ajouter une question.
			</p>
		</div>
	)
}
