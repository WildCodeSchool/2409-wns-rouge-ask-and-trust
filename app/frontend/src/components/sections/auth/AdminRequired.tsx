import { Callout } from "@/components/ui/Callout"

function AdminRequired() {
	return (
		<div className="mx-auto w-full max-w-5xl p-5">
			<Callout type="danger" title="Accès refusé" className="mb-4">
				<p>
					Vous devez disposer des droits administrateur pour accéder à
					cette section.
				</p>
			</Callout>
		</div>
	)
}

export default AdminRequired
