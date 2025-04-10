interface CompanyBoxProps {
	name: string
}

const CompanyBox: React.FC<CompanyBoxProps> = ({ name }) => {
	return (
		<div className="company-box-name flex items-center justify-center">
			<p className="text-xl font-bold">{name}</p>
		</div>
	)
}

export default CompanyBox
