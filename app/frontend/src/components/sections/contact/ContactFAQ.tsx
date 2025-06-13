import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { faq } from "@/components/sections/contact/mockContact"

export function ContactFAQ() {
  return (
    <section className="mt-16">
      <h2 className="mb-12 text-center text-3xl font-bold">Questions Fréquentes</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {faq.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 