interface CompanyBoxProps {
	name: string
}

const CompanyBox: React.FC<CompanyBoxProps> = ({ name }) => {
	return (
		<div className="company-box-name flex items-center justify-center">
			<h4 className="text-2xl font-bold">{name}</h4>
		</div>
	)
}

export default CompanyBox
