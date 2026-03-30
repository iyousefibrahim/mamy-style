import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return { title: "الشحن والتوصيل | مامي ستايل" }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="wrapper py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">الشحن والتوصيل</h1>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">مناطق التوصيل</h2>
          <p>
            نوصّل لجميع محافظات مصر. التوصيل لمنطقة بلطيم يتم في نفس اليوم أو في أقرب وقت ممكن.
            التوصيل لباقي المحافظات يتم عن طريق شركات الشحن المعتمدة.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">رسوم الشحن</h2>
          <ul className="space-y-2">
            <li>• بلطيم: 20 جنيه</li>
            <li>• باقي المحافظات: 100 جنيه</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">مدة التوصيل</h2>
          <p>
            من 2 إلى 5 أيام عمل حسب المنطقة. سيتم التواصل معك لتأكيد الطلب قبل الشحن.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">تتبع الطلب</h2>
          <p>
            يمكنك متابعة حالة طلبك من صفحة &quot;طلباتي&quot; في حسابك على الموقع.
          </p>
        </section>
      </div>
    </div>
  )
}
