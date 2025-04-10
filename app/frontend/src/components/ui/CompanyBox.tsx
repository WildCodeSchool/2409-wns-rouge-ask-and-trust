interface CompanyBoxProps {
	name: string
}

const CompanyBox: React.FC<CompanyBoxProps> = ({ name }) => {
	return (
		<div className="flex h-[92px] w-[183px] items-center justify-center rounded-3xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
			<span className="text-xl font-bold">{name}</span>
		</div>
	)
}

export default CompanyBox
