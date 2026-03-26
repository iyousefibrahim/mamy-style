export type Governorate = {
  id: number
  name_en: string
  name_ar: string
}

export type City = {
  id: number
  governorate_id: number
  name_en: string
  name_ar: string
  is_local_delivery: boolean
}

export const governorates: Governorate[] = [
  { id: 1,  name_en: "Cairo",          name_ar: "القاهرة"       },
  { id: 2,  name_en: "Alexandria",     name_ar: "الإسكندرية"    },
  { id: 3,  name_en: "Giza",           name_ar: "الجيزة"        },
  { id: 4,  name_en: "Dakahlia",       name_ar: "الدقهلية"      },
  { id: 5,  name_en: "Beheira",        name_ar: "البحيرة"       },
  { id: 6,  name_en: "Kafr El-Sheikh", name_ar: "كفر الشيخ"    },
  { id: 7,  name_en: "Gharbia",        name_ar: "الغربية"       },
  { id: 8,  name_en: "Menofia",        name_ar: "المنوفية"      },
  { id: 9,  name_en: "Qalyubia",       name_ar: "القليوبية"     },
  { id: 10, name_en: "Damietta",       name_ar: "دمياط"         },
  { id: 11, name_en: "Sharkia",        name_ar: "الشرقية"       },
  { id: 12, name_en: "Ismailia",       name_ar: "الإسماعيلية"   },
  { id: 13, name_en: "Port Said",      name_ar: "بورسعيد"       },
  { id: 14, name_en: "Suez",           name_ar: "السويس"        },
  { id: 15, name_en: "North Sinai",    name_ar: "شمال سيناء"   },
  { id: 16, name_en: "South Sinai",    name_ar: "جنوب سيناء"   },
  { id: 17, name_en: "Faiyum",         name_ar: "الفيوم"        },
  { id: 18, name_en: "Beni Suef",      name_ar: "بني سويف"     },
  { id: 19, name_en: "Minya",          name_ar: "المنيا"        },
  { id: 20, name_en: "Assiut",         name_ar: "أسيوط"         },
  { id: 21, name_en: "Sohag",          name_ar: "سوهاج"         },
  { id: 22, name_en: "Qena",           name_ar: "قنا"           },
  { id: 23, name_en: "Luxor",          name_ar: "الأقصر"        },
  { id: 24, name_en: "Aswan",          name_ar: "أسوان"         },
  { id: 25, name_en: "Red Sea",        name_ar: "البحر الأحمر"  },
  { id: 26, name_en: "New Valley",     name_ar: "الوادي الجديد" },
  { id: 27, name_en: "Matrouh",        name_ar: "مطروح"         },
]

export const cities: City[] = [
  // Cairo (1)
  { id: 101, governorate_id: 1, name_en: "Cairo City",       name_ar: "مدينة القاهرة",  is_local_delivery: false },
  { id: 102, governorate_id: 1, name_en: "Nasr City",        name_ar: "مدينة نصر",       is_local_delivery: false },
  { id: 103, governorate_id: 1, name_en: "Heliopolis",       name_ar: "مصر الجديدة",     is_local_delivery: false },
  { id: 104, governorate_id: 1, name_en: "Maadi",            name_ar: "المعادي",         is_local_delivery: false },
  { id: 105, governorate_id: 1, name_en: "Shoubra",          name_ar: "شبرا",            is_local_delivery: false },
  { id: 106, governorate_id: 1, name_en: "New Cairo",        name_ar: "القاهرة الجديدة", is_local_delivery: false },
  { id: 107, governorate_id: 1, name_en: "15th of May City", name_ar: "مدينة 15 مايو",   is_local_delivery: false },

  // Alexandria (2)
  { id: 201, governorate_id: 2, name_en: "Alexandria City",  name_ar: "مدينة الإسكندرية", is_local_delivery: false },
  { id: 202, governorate_id: 2, name_en: "Abu Qir",          name_ar: "أبو قير",          is_local_delivery: false },
  { id: 203, governorate_id: 2, name_en: "Borg El Arab",     name_ar: "برج العرب",        is_local_delivery: false },
  { id: 204, governorate_id: 2, name_en: "El Agami",         name_ar: "العجمي",           is_local_delivery: false },

  // Giza (3)
  { id: 301, governorate_id: 3, name_en: "Giza City",        name_ar: "مدينة الجيزة",  is_local_delivery: false },
  { id: 302, governorate_id: 3, name_en: "6th of October",   name_ar: "السادس من أكتوبر", is_local_delivery: false },
  { id: 303, governorate_id: 3, name_en: "Sheikh Zayed",     name_ar: "الشيخ زايد",    is_local_delivery: false },
  { id: 304, governorate_id: 3, name_en: "Dokki",            name_ar: "الدقي",         is_local_delivery: false },
  { id: 305, governorate_id: 3, name_en: "Imbaba",           name_ar: "إمبابة",        is_local_delivery: false },
  { id: 306, governorate_id: 3, name_en: "Badrasheen",       name_ar: "البدرشين",      is_local_delivery: false },

  // Dakahlia (4)
  { id: 401, governorate_id: 4, name_en: "Mansoura",         name_ar: "المنصورة",     is_local_delivery: false },
  { id: 402, governorate_id: 4, name_en: "Talkha",           name_ar: "طلخا",         is_local_delivery: false },
  { id: 403, governorate_id: 4, name_en: "Mit Ghamr",        name_ar: "ميت غمر",      is_local_delivery: false },
  { id: 404, governorate_id: 4, name_en: "Aga",              name_ar: "أجا",          is_local_delivery: false },
  { id: 405, governorate_id: 4, name_en: "Manzala",          name_ar: "المنزلة",      is_local_delivery: false },
  { id: 406, governorate_id: 4, name_en: "Beni Obeid",       name_ar: "بني عبيد",     is_local_delivery: false },

  // Beheira (5)
  { id: 501, governorate_id: 5, name_en: "Damanhour",        name_ar: "دمنهور",       is_local_delivery: false },
  { id: 502, governorate_id: 5, name_en: "Kafr El-Dawwar",   name_ar: "كفر الدوار",   is_local_delivery: false },
  { id: 503, governorate_id: 5, name_en: "Rashid",           name_ar: "رشيد",         is_local_delivery: false },
  { id: 504, governorate_id: 5, name_en: "Abu El-Matamir",   name_ar: "أبو المطامير", is_local_delivery: false },
  { id: 505, governorate_id: 5, name_en: "Shubrakhit",       name_ar: "شبراخيت",      is_local_delivery: false },
  { id: 506, governorate_id: 5, name_en: "Itay El-Barud",    name_ar: "إيتاي البارود", is_local_delivery: false },

  // Kafr El-Sheikh (6) — Baltim is here
  { id: 601, governorate_id: 6, name_en: "Kafr El-Sheikh",   name_ar: "كفر الشيخ",   is_local_delivery: false },
  { id: 602, governorate_id: 6, name_en: "Baltim",           name_ar: "بلطيم",        is_local_delivery: true  },
  { id: 603, governorate_id: 6, name_en: "Desouk",           name_ar: "دسوق",         is_local_delivery: false },
  { id: 604, governorate_id: 6, name_en: "Fuwwah",           name_ar: "فوه",          is_local_delivery: false },
  { id: 605, governorate_id: 6, name_en: "Sidi Salem",       name_ar: "سيدي سالم",    is_local_delivery: false },
  { id: 606, governorate_id: 6, name_en: "Qallin",           name_ar: "قلين",         is_local_delivery: false },
  { id: 607, governorate_id: 6, name_en: "Beila",            name_ar: "بيلا",         is_local_delivery: false },
  { id: 608, governorate_id: 6, name_en: "Metoubes",         name_ar: "مطوبس",        is_local_delivery: false },
  { id: 609, governorate_id: 6, name_en: "Hamoul",           name_ar: "الحامول",      is_local_delivery: false },
  { id: 610, governorate_id: 6, name_en: "Burullus",         name_ar: "برلس",         is_local_delivery: false },
  { id: 611, governorate_id: 6, name_en: "Sidi Ghazi",       name_ar: "سيدي غازي",    is_local_delivery: false },

  // Gharbia (7)
  { id: 701, governorate_id: 7, name_en: "Tanta",            name_ar: "طنطا",         is_local_delivery: false },
  { id: 702, governorate_id: 7, name_en: "El-Mahalla El-Kubra", name_ar: "المحلة الكبرى", is_local_delivery: false },
  { id: 703, governorate_id: 7, name_en: "Kafr El-Zayat",    name_ar: "كفر الزيات",   is_local_delivery: false },
  { id: 704, governorate_id: 7, name_en: "Zifta",            name_ar: "زفتى",         is_local_delivery: false },
  { id: 705, governorate_id: 7, name_en: "Santa",            name_ar: "سنطة",         is_local_delivery: false },

  // Menofia (8)
  { id: 801, governorate_id: 8, name_en: "Shebin El-Kom",    name_ar: "شبين الكوم",   is_local_delivery: false },
  { id: 802, governorate_id: 8, name_en: "Menouf",           name_ar: "منوف",         is_local_delivery: false },
  { id: 803, governorate_id: 8, name_en: "Ashmoun",          name_ar: "أشمون",        is_local_delivery: false },
  { id: 804, governorate_id: 8, name_en: "Quesna",           name_ar: "قويسنا",       is_local_delivery: false },
  { id: 805, governorate_id: 8, name_en: "Sadat City",       name_ar: "مدينة السادات", is_local_delivery: false },

  // Qalyubia (9)
  { id: 901, governorate_id: 9, name_en: "Banha",            name_ar: "بنها",         is_local_delivery: false },
  { id: 902, governorate_id: 9, name_en: "Qaliub",           name_ar: "قليوب",        is_local_delivery: false },
  { id: 903, governorate_id: 9, name_en: "Shubra El-Kheima", name_ar: "شبرا الخيمة",  is_local_delivery: false },
  { id: 904, governorate_id: 9, name_en: "Khanka",           name_ar: "الخانكة",      is_local_delivery: false },
  { id: 905, governorate_id: 9, name_en: "Obour City",       name_ar: "مدينة العبور", is_local_delivery: false },

  // Damietta (10)
  { id: 1001, governorate_id: 10, name_en: "Damietta City",  name_ar: "مدينة دمياط",  is_local_delivery: false },
  { id: 1002, governorate_id: 10, name_en: "New Damietta",   name_ar: "دمياط الجديدة", is_local_delivery: false },
  { id: 1003, governorate_id: 10, name_en: "Faraskour",      name_ar: "فارسكور",      is_local_delivery: false },
  { id: 1004, governorate_id: 10, name_en: "Ras El-Bar",     name_ar: "رأس البر",     is_local_delivery: false },
  { id: 1005, governorate_id: 10, name_en: "Kafr Saad",      name_ar: "كفر سعد",      is_local_delivery: false },

  // Sharkia (11)
  { id: 1101, governorate_id: 11, name_en: "Zagazig",        name_ar: "الزقازيق",     is_local_delivery: false },
  { id: 1102, governorate_id: 11, name_en: "Belbeis",        name_ar: "بلبيس",        is_local_delivery: false },
  { id: 1103, governorate_id: 11, name_en: "Abu Kebir",      name_ar: "أبو كبير",     is_local_delivery: false },
  { id: 1104, governorate_id: 11, name_en: "10th of Ramadan", name_ar: "العاشر من رمضان", is_local_delivery: false },
  { id: 1105, governorate_id: 11, name_en: "Hihya",          name_ar: "ههيا",         is_local_delivery: false },

  // Ismailia (12)
  { id: 1201, governorate_id: 12, name_en: "Ismailia City",  name_ar: "مدينة الإسماعيلية", is_local_delivery: false },
  { id: 1202, governorate_id: 12, name_en: "Fayed",          name_ar: "فايد",         is_local_delivery: false },
  { id: 1203, governorate_id: 12, name_en: "Abu Suwair",     name_ar: "أبو صوير",     is_local_delivery: false },

  // Port Said (13)
  { id: 1301, governorate_id: 13, name_en: "Port Said City", name_ar: "مدينة بورسعيد", is_local_delivery: false },
  { id: 1302, governorate_id: 13, name_en: "Port Fouad",     name_ar: "بور فؤاد",     is_local_delivery: false },

  // Suez (14)
  { id: 1401, governorate_id: 14, name_en: "Suez City",      name_ar: "مدينة السويس", is_local_delivery: false },
  { id: 1402, governorate_id: 14, name_en: "Attaqa",         name_ar: "عتاقة",        is_local_delivery: false },

  // North Sinai (15)
  { id: 1501, governorate_id: 15, name_en: "Arish",          name_ar: "العريش",       is_local_delivery: false },
  { id: 1502, governorate_id: 15, name_en: "Sheikh Zuweid",  name_ar: "الشيخ زويد",   is_local_delivery: false },
  { id: 1503, governorate_id: 15, name_en: "Rafah",          name_ar: "رفح",          is_local_delivery: false },

  // South Sinai (16)
  { id: 1601, governorate_id: 16, name_en: "El-Tor",         name_ar: "الطور",        is_local_delivery: false },
  { id: 1602, governorate_id: 16, name_en: "Sharm El-Sheikh", name_ar: "شرم الشيخ",   is_local_delivery: false },
  { id: 1603, governorate_id: 16, name_en: "Dahab",          name_ar: "دهب",          is_local_delivery: false },
  { id: 1604, governorate_id: 16, name_en: "Nuweiba",        name_ar: "نويبع",        is_local_delivery: false },

  // Faiyum (17)
  { id: 1701, governorate_id: 17, name_en: "Faiyum City",    name_ar: "مدينة الفيوم", is_local_delivery: false },
  { id: 1702, governorate_id: 17, name_en: "Sinnuris",       name_ar: "سنورس",        is_local_delivery: false },
  { id: 1703, governorate_id: 17, name_en: "Ibshaway",       name_ar: "إبشواي",       is_local_delivery: false },

  // Beni Suef (18)
  { id: 1801, governorate_id: 18, name_en: "Beni Suef City", name_ar: "مدينة بني سويف", is_local_delivery: false },
  { id: 1802, governorate_id: 18, name_en: "El-Fashn",       name_ar: "الفشن",        is_local_delivery: false },
  { id: 1803, governorate_id: 18, name_en: "Nasser City",    name_ar: "مدينة ناصر",   is_local_delivery: false },

  // Minya (19)
  { id: 1901, governorate_id: 19, name_en: "Minya City",     name_ar: "مدينة المنيا", is_local_delivery: false },
  { id: 1902, governorate_id: 19, name_en: "Mallawi",        name_ar: "ملوي",         is_local_delivery: false },
  { id: 1903, governorate_id: 19, name_en: "Abu Qurqas",     name_ar: "أبو قرقاص",    is_local_delivery: false },
  { id: 1904, governorate_id: 19, name_en: "Samalut",        name_ar: "سمالوط",       is_local_delivery: false },

  // Assiut (20)
  { id: 2001, governorate_id: 20, name_en: "Assiut City",    name_ar: "مدينة أسيوط",  is_local_delivery: false },
  { id: 2002, governorate_id: 20, name_en: "Dairut",         name_ar: "ديروط",        is_local_delivery: false },
  { id: 2003, governorate_id: 20, name_en: "Manfalut",       name_ar: "منفلوط",       is_local_delivery: false },
  { id: 2004, governorate_id: 20, name_en: "Qusiya",         name_ar: "القوصية",      is_local_delivery: false },

  // Sohag (21)
  { id: 2101, governorate_id: 21, name_en: "Sohag City",     name_ar: "مدينة سوهاج",  is_local_delivery: false },
  { id: 2102, governorate_id: 21, name_en: "Akhmim",         name_ar: "أخميم",        is_local_delivery: false },
  { id: 2103, governorate_id: 21, name_en: "Girga",          name_ar: "جرجا",         is_local_delivery: false },
  { id: 2104, governorate_id: 21, name_en: "Tahta",          name_ar: "طهطا",         is_local_delivery: false },

  // Qena (22)
  { id: 2201, governorate_id: 22, name_en: "Qena City",      name_ar: "مدينة قنا",    is_local_delivery: false },
  { id: 2202, governorate_id: 22, name_en: "Nag Hammadi",    name_ar: "نجع حمادي",    is_local_delivery: false },
  { id: 2203, governorate_id: 22, name_en: "Qus",            name_ar: "قوص",          is_local_delivery: false },

  // Luxor (23)
  { id: 2301, governorate_id: 23, name_en: "Luxor City",     name_ar: "مدينة الأقصر", is_local_delivery: false },
  { id: 2302, governorate_id: 23, name_en: "Esna",           name_ar: "إسنا",         is_local_delivery: false },
  { id: 2303, governorate_id: 23, name_en: "Armant",         name_ar: "أرمنت",        is_local_delivery: false },

  // Aswan (24)
  { id: 2401, governorate_id: 24, name_en: "Aswan City",     name_ar: "مدينة أسوان",  is_local_delivery: false },
  { id: 2402, governorate_id: 24, name_en: "Edfu",           name_ar: "إدفو",         is_local_delivery: false },
  { id: 2403, governorate_id: 24, name_en: "Kom Ombo",       name_ar: "كوم أمبو",     is_local_delivery: false },
  { id: 2404, governorate_id: 24, name_en: "Abu Simbel",     name_ar: "أبو سمبل",     is_local_delivery: false },

  // Red Sea (25)
  { id: 2501, governorate_id: 25, name_en: "Hurghada",       name_ar: "الغردقة",      is_local_delivery: false },
  { id: 2502, governorate_id: 25, name_en: "Safaga",         name_ar: "سفاجا",        is_local_delivery: false },
  { id: 2503, governorate_id: 25, name_en: "Marsa Alam",     name_ar: "مرسى علم",     is_local_delivery: false },

  // New Valley (26)
  { id: 2601, governorate_id: 26, name_en: "Kharga",         name_ar: "الخارجة",      is_local_delivery: false },
  { id: 2602, governorate_id: 26, name_en: "Dakhla",         name_ar: "الداخلة",      is_local_delivery: false },
  { id: 2603, governorate_id: 26, name_en: "Farafra",        name_ar: "الفرافرة",     is_local_delivery: false },

  // Matrouh (27)
  { id: 2701, governorate_id: 27, name_en: "Mersa Matruh",   name_ar: "مرسى مطروح",   is_local_delivery: false },
  { id: 2702, governorate_id: 27, name_en: "Siwa",           name_ar: "سيوة",         is_local_delivery: false },
  { id: 2703, governorate_id: 27, name_en: "Sallum",         name_ar: "السلوم",       is_local_delivery: false },
]

export function getCities(governorateId: number): City[] {
  return cities.filter((c) => c.governorate_id === governorateId)
}

export const LOCAL_SHIPPING_FEE = 20
export const NATIONAL_SHIPPING_FEE = 100
export const FREE_SHIPPING_THRESHOLD = 2000
