import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { MapPin } from "lucide-react"

export function ContactMap() {
  return (
    <section className="mt-16 relative">
      <Card>
        <CardHeader>
          <CardTitle>Notre Localisation</CardTitle>
          <CardDescription>
            Venez nous rendre visite dans nos bureaux Lyonnais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-muted flex aspect-video w-full items-center justify-center rounded-lg overflow-hidden">
            {/* Background SVG */}
            <img
              src="/img/contact/map.svg"
              alt="Carte stylisée"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
            />
            <div className="relative z-10 text-center">
              <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Carte interactive à intégrer</p>
              <p className="text-muted-foreground mt-2 text-sm">1 Place de l'Hopital, 69002 Lyon, France</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} 