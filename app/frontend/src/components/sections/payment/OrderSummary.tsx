import { CheckCircle } from "lucide-react"
import { Package } from "@/types/types"

interface OrderSummaryProps {
  selectedPackage: Package
}

export function OrderSummary({ selectedPackage }: OrderSummaryProps) {
  return (
    <div className="sticky top-4 rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold">Récapitulatif</h2>

      {/* Récapitulatif de la sélection - visible uniquement sur desktop */}
      <div className="mb-6 hidden rounded-xl border border-gray-200 p-4 md:block">
        <div className="bg-primary-default mb-4 inline-block rounded-md px-4 py-1 text-white">
          <span className="font-medium">{selectedPackage.name}</span>
        </div>

        <div className="space-y-3">
          {selectedPackage.features.map((feature: string, index: number) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg">
          <span className="font-medium">Total:</span>
          <span className="font-bold">{selectedPackage.price.toFixed(2)} €</span>
        </div>
        <div className="mt-1 text-right text-sm text-gray-500">TVA incluse</div>
      </div>
    </div>
  )
} 