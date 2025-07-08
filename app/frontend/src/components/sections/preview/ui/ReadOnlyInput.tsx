import { Input } from "@/components/ui/Input"

export function ReadOnlyInput({ value, placeholder = "—" }: { value?: string; placeholder?: string }) {
  return (
    <Input
      type="text"
      value={value ?? ""}
      placeholder={placeholder}
      disabled
      errorMessage={undefined}
      readOnly
    />
  )
} 