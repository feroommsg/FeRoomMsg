import { getContactInfo } from "@/actions"
import { ContactContent } from "@/components/page-content"

export default async function ContactPage() {
  const res = await getContactInfo()

  return (
    <ContactContent
      contact={res.success ? (res.data as Record<string, any>) ?? null : null}
    />
  )
}
