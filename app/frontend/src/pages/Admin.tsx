import { withSEO } from "@/components/hoc/withSEO"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer"
import UserTableContainer from "@/components/sections/dashboard/UserTableContainer"
import TabSwitch from "@/components/ui/TabSwitch"
import { useState } from "react"

function AdminPage() {
	const [tab, setTab] = useState<"surveys" | "users">("surveys")

	const tabOptions = [
		{ value: "surveys", label: "Voir toutes les enquêtes" },
		{ value: "users", label: "Voir tous les utilisateurs" },
	]

	return (
		<section className="flex flex-col items-center gap-10 p-5 max-md:pb-[calc(var(--footer-height)+20px)] md:min-h-[calc(100vh_-_var(--header-height))] lg:px-20 lg:py-10">
			<h1 className="text-2xl font-semibold">Administration</h1>
			<TabSwitch
				options={tabOptions}
				value={tab}
				onChange={value => setTab(value as "surveys" | "users")}
				ariaLabel="Sections d'administration"
			/>
			<div className="flex w-full flex-col gap-12">
				{tab === "surveys" ? (
					<SurveyTableContainer mode="admin" />
				) : (
					<UserTableContainer />
				)}
			</div>
		</section>
	)
}

const AdminWithSEO = withSEO(AdminPage, "admin")
export default AdminWithSEO
