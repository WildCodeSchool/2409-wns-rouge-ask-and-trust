import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
	contactMethods,
	supportOptions,
} from "@/components/sections/contact/mockContact"

export function ContactInfo() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Informations de contact</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{contactMethods.map((method, index) => (
						<div key={index} className="flex items-start space-x-3">
							<method.icon className="text-primary mt-1 h-5 w-5" />
							<div className="flex-1">
								<h3 className="font-medium">{method.title}</h3>
								<p className="text-muted-foreground mb-1 text-sm">
									{method.description}
								</p>
								{method.action ? (
									<a
										href={method.action}
										className="text-primary text-sm whitespace-pre-line hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										{method.value}
									</a>
								) : (
									<p className="text-sm whitespace-pre-line">
										{method.value}
									</p>
								)}
							</div>
						</div>
					))}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Options de support</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{supportOptions.map((option, index) => (
						<div
							key={index}
							className="flex items-center justify-between rounded-lg border p-3"
						>
							<div className="flex items-center space-x-3">
								<option.icon className="text-primary h-5 w-5" />
								<div>
									<h3 className="text-sm font-medium">
										{option.title}
									</h3>
									<p className="text-muted-foreground text-xs">
										{option.description}
									</p>
								</div>
							</div>
							<Button
								size="sm"
								variant="outline"
								ariaLabel={option.title}
							>
								{option.action.includes("@") ? (
									<a href={`mailto:${option.action}`}>
										{option.action.includes("@")
											? "Écrire"
											: option.action}
									</a>
								) : (
									option.action
								)}
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	)
}
