interface CompanyBoxProps {
	name: string
}

const CompanyBox: React.FC<CompanyBoxProps> = ({ name }) => {
	return (
		<div className="shadow-default flex h-24 w-44 items-center justify-center rounded-3xl transition-shadow duration-200 ease-in-out hover:shadow-lg">
			<span className="text-xl font-bold">{name}</span>
		</div>
	)
}

export default CompanyBox
