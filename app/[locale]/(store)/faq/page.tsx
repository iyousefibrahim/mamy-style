import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return { title: "أسئلة شائعة | مامي ستايل" }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const faqs = [
    {
      q: "كيف أتحقق من مقاسي؟",
      a: "يوجد جدول مقاسات على كل صفحة منتج. في حال التردد، تواصل معنا على واتساب وهنساعدك تختاري المقاس المناسب.",
    },
    {
      q: "هل يمكنني الدفع عند الاستلام؟",
      a: "نعم، الدفع عند الاستلام متاح لجميع المناطق.",
    },
    {
      q: "كم تستغرق عملية التوصيل؟",
      a: "بلطيم: في نفس اليوم أو في أقرب وقت. باقي المحافظات: من 2 إلى 5 أيام عمل.",
    },
    {
      q: "هل يمكنني إرجاع المنتج؟",
      a: "نعم، خلال 7 أيام من الاستلام بشرط أن يكون المنتج في حالته الأصلية. راجع صفحة الاسترجاع والاستبدال لمزيد من التفاصيل.",
    },
    {
      q: "كيف أتابع طلبي؟",
      a: "يمكنك متابعة حالة طلبك من صفحة «طلباتي» في حسابك على الموقع.",
    },
    {
      q: "هل المنتجات أصلية؟",
      a: "نعم، جميع منتجاتنا أصلية ومعتمدة. نلتزم بتقديم أفضل جودة لعملائنا.",
    },
  ]

  return (
    <div className="wrapper py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">أسئلة شائعة</h1>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b pb-6 last:border-0">
            <h2 className="text-lg font-semibold mb-2">{faq.q}</h2>
            <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
