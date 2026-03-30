import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return { title: "الاسترجاع والاستبدال | مامي ستايل" }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="wrapper py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">الاسترجاع والاستبدال</h1>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">سياسة الاسترجاع</h2>
          <p>
            يمكن استرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط أن يكون المنتج في حالته الأصلية
            دون استخدام أو غسيل، مع وجود التغليف الأصلي.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">شروط الاسترجاع</h2>
          <ul className="space-y-2">
            <li>• المنتج لم يُستخدم أو يُغسل</li>
            <li>• التغليف الأصلي محفوظ</li>
            <li>• خلال 7 أيام من الاستلام</li>
            <li>• مع الفاتورة أو رقم الطلب</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">الاستبدال</h2>
          <p>
            يمكن استبدال المنتج بمقاس أو لون مختلف حسب التوفر. تواصل معنا عبر
            واتساب لترتيب عملية الاستبدال.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">كيفية التواصل</h2>
          <p>
            تواصل معنا على واتساب أو صفحة فيسبوك مع ذكر رقم الطلب وسبب الاسترجاع.
          </p>
        </section>
      </div>
    </div>
  )
}
