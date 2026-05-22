import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.NEON_DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL is required to seed the database")
}

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) })

async function main() {
  console.log("Seeding database...")

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@elgedada.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@2024!"
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
    },
  })

  // Site settings
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      brandNameEn: "EL GEDADA",
      brandNameAr: "الجـدادة",
      brandSmallEn: "Engineering Works",
      brandSmallAr: "أعمال هندسية ومقاولات",
    },
  })

  // Home content
  await prisma.homeContent.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heroBadgeEn: "International Standard Engineering Portfolio",
      heroBadgeAr: "بورتفوليو هندسي بمعايير احترافية",
      heroTitleEn: "Engineering Precision. Contracting Excellence.",
      heroTitleAr: "دقة هندسية. تنفيذ احترافي.",
      heroTextEn:
        "A premium portfolio website for an engineering workshop and contracting company, designed to present completed work, fabrication capabilities, material expertise, partners, and professional execution standards.",
      heroTextAr:
        "موقع بورتفوليو احترافي لورشة هندسية وشركة مقاولات، يعرض الأعمال المنفذة، قدرات التصنيع، خبرة اختيار الخامات، الشركاء، ومعايير التنفيذ بدون حجوزات أو فورم طلبات.",
      overviewTitleEn: "A portfolio designed to show execution strength.",
      overviewTitleAr: "بورتفوليو مصمم ليعرض قوة التنفيذ.",
      overviewTextEn:
        "The home page is not only an introduction. It works as a professional entry point that quickly explains the company, highlights credibility metrics, introduces work areas, and opens every major section as a dedicated page.",
      overviewTextAr:
        "الصفحة الرئيسية هنا مش مجرد واجهة، لكنها مدخل احترافي يعرف الزائر على الشركة بسرعة، يعرض أرقام الثقة، يوضح مجالات العمل، ويفتح كل قسم في صفحة مستقلة بتفاصيله.",
      overviewText2En:
        "The website is suitable for an engineering workshop or contracting company that wants to present its work to design offices, real estate developers, retail brands, and companies looking for a reliable execution partner.",
      overviewText2Ar:
        "الموقع مناسب لورشة هندسية أو شركة مقاولات تريد عرض أعمالها أمام مكاتب تصميم، مطورين عقاريين، براندات تجارية، وشركات تبحث عن شريك تنفيذ موثوق.",
    },
  })

  // Metrics
  const metrics = [
    { value: "+80", labelEn: "Projects Delivered", labelAr: "مشروع منفذ", sortOrder: 0 },
    { value: "+12", labelEn: "Business Sectors", labelAr: "قطاع عمل", sortOrder: 1 },
    { value: "+25", labelEn: "Material Categories", labelAr: "تصنيف خامات", sortOrder: 2 },
    { value: "360°", labelEn: "Execution Scope", labelAr: "نطاق تنفيذ متكامل", sortOrder: 3 },
  ]

  for (const metric of metrics) {
    await prisma.metric.create({ data: metric })
  }

  // Trust items
  const trustItems = [
    { labelEn: "Execution Focused", labelAr: "تركيز على التنفيذ", icon: "BadgeCheck", sortOrder: 0 },
    { labelEn: "Site Supervision", labelAr: "إشراف موقعي", icon: "HardHat", sortOrder: 1 },
    { labelEn: "Technical Accuracy", labelAr: "دقة فنية", icon: "Ruler", sortOrder: 2 },
    { labelEn: "Premium Finishing", labelAr: "تشطيب فاخر", icon: "Award", sortOrder: 3 },
  ]

  for (const item of trustItems) {
    await prisma.trustItem.create({ data: item })
  }

  // Capabilities
  const capabilities = [
    {
      titleEn: "Contracting Works",
      titleAr: "أعمال المقاولات",
      descriptionEn: "Execution for commercial, residential, administrative, retail, and industrial projects.",
      descriptionAr: "تنفيذ مشاريع تجارية، سكنية، إدارية، محلات، ومساحات صناعية.",
      icon: "Building2",
      sortOrder: 0,
    },
    {
      titleEn: "Workshop Fabrication",
      titleAr: "تصنيع داخل الورشة",
      descriptionEn: "Metal, wood, acrylic, glass, display units, booths, and custom structures.",
      descriptionAr: "أعمال معدنية، خشبية، أكريليك، زجاج، وحدات عرض، بوثات، وهياكل خاصة.",
      icon: "Factory",
      sortOrder: 1,
    },
    {
      titleEn: "Material Expertise",
      titleAr: "خبرة في الخامات",
      descriptionEn: "Material selection based on durability, budget, visual quality, and execution feasibility.",
      descriptionAr: "اختيار خامات بناء على المتانة، الميزانية، الشكل النهائي، وسهولة التنفيذ.",
      icon: "Layers3",
      sortOrder: 2,
    },
    {
      titleEn: "Quality Control",
      titleAr: "مراقبة الجودة",
      descriptionEn: "Site management, production control, installation checks, and final handover quality.",
      descriptionAr: "إدارة الموقع، متابعة الإنتاج، مراجعة التركيب، وضمان جودة التسليم النهائي.",
      icon: "ShieldCheck",
      sortOrder: 3,
    },
  ]

  for (const cap of capabilities) {
    await prisma.capability.create({ data: cap })
  }

  // Sectors
  const sectors = [
    { nameEn: "Corporate Offices", nameAr: "مكاتب إدارية", sortOrder: 0 },
    { nameEn: "Retail Stores", nameAr: "محلات ومعارض بيع", sortOrder: 1 },
    { nameEn: "Restaurants & Cafes", nameAr: "مطاعم وكافيهات", sortOrder: 2 },
    { nameEn: "Residential Units", nameAr: "وحدات سكنية", sortOrder: 3 },
    { nameEn: "Exhibition Booths", nameAr: "بوثات ومعارض", sortOrder: 4 },
    { nameEn: "Factories & Warehouses", nameAr: "مصانع ومخازن", sortOrder: 5 },
    { nameEn: "Administrative Buildings", nameAr: "مباني إدارية", sortOrder: 6 },
    { nameEn: "Hospitality Spaces", nameAr: "مساحات ضيافة وفندقة", sortOrder: 7 },
  ]

  for (const sector of sectors) {
    await prisma.sector.create({ data: sector })
  }

  // Projects
  const projects = [
    {
      titleEn: "Corporate Headquarters Fit-Out",
      titleAr: "تشطيب مقر إداري",
      categoryEn: "Commercial Interiors",
      categoryAr: "تشطيبات تجارية",
      locationEn: "Cairo, Egypt",
      locationAr: "القاهرة، مصر",
      year: "2026",
      size: "1,850 m²",
      summaryEn:
        "Turnkey execution for a premium administrative workspace including partitions, ceilings, flooring, lighting, metal details, and custom joinery.",
      summaryAr:
        "تنفيذ متكامل لمساحة إدارية تشمل القواطيع، الأسقف، الأرضيات، الإضاءة، التفاصيل المعدنية، والأعمال الخشبية المخصصة.",
      imageUrl:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 0,
    },
    {
      titleEn: "Retail Display Structure",
      titleAr: "هيكل عرض تجاري",
      categoryEn: "Fabrication & Installation",
      categoryAr: "تصنيع وتركيب",
      locationEn: "New Cairo",
      locationAr: "القاهرة الجديدة",
      year: "2025",
      size: "420 m²",
      summaryEn:
        "Custom engineered display systems with steel, wood, acrylic, and premium finishing for high-traffic retail use.",
      summaryAr:
        "تصنيع وحدات عرض مخصصة باستخدام المعدن، الخشب، الأكريليك، وتشطيبات قوية مناسبة للاستخدام التجاري.",
      imageUrl:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      titleEn: "Residential Finishing Works",
      titleAr: "تشطيب وحدة سكنية",
      categoryEn: "Residential Contracting",
      categoryAr: "مقاولات سكنية",
      locationEn: "Heliopolis",
      locationAr: "مصر الجديدة",
      year: "2025",
      size: "310 m²",
      summaryEn:
        "Complete finishing package from site preparation to final delivery with coordinated materials, lighting, doors, floors, and wall treatments.",
      summaryAr:
        "باقة تشطيب كاملة من تجهيز الموقع حتى التسليم النهائي مع تنسيق الخامات، الإضاءة، الأبواب، الأرضيات، ومعالجات الحوائط.",
      imageUrl:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      sortOrder: 2,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({ data: project })
  }

  // Materials
  const materials = [
    {
      nameEn: "Architectural Metal",
      nameAr: "الأعمال المعدنية المعمارية",
      descriptionEn:
        "Steel, stainless steel, aluminum, and powder-coated systems for structures, decorative elements, frames, railings, and custom installations.",
      descriptionAr:
        "استخدام الحديد، الاستانلس ستيل، الألومنيوم، والدهانات الحرارية في الهياكل، التفاصيل الديكورية، الفريمات، الدرابزين، والتركيبات الخاصة.",
      applicationsEn: JSON.stringify(["Retail structures", "Stair details", "Display frames", "Industrial elements"]),
      applicationsAr: JSON.stringify(["هياكل تجارية", "تفاصيل سلالم", "فريمات عرض", "عناصر صناعية"]),
      imageUrl:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1400&auto=format&fit=crop",
      sortOrder: 0,
    },
    {
      nameEn: "Joinery & Wood Systems",
      nameAr: "الأعمال الخشبية والنجارة",
      descriptionEn:
        "MDF, HPL, veneer, melamine, and natural wood finishes used for counters, cabinets, wall cladding, storage, and custom furniture.",
      descriptionAr:
        "استخدام MDF وHPL والقشرة الطبيعية والميلامين والخشب الطبيعي في الكاونترات، الدواليب، تكسيات الحوائط، ووحدات الأثاث المخصصة.",
      applicationsEn: JSON.stringify(["Reception counters", "Cabinets", "Wall cladding", "Office furniture"]),
      applicationsAr: JSON.stringify(["كاونترات استقبال", "دواليب", "تكسيات حوائط", "أثاث مكتبي"]),
      imageUrl:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop",
      sortOrder: 1,
    },
    {
      nameEn: "Glass, Acrylic & Signage",
      nameAr: "الزجاج والأكريليك واللافتات",
      descriptionEn:
        "Clean modern finishes for partitions, display units, branding elements, transparent barriers, and architectural detailing.",
      descriptionAr:
        "تشطيبات حديثة للقواطيع، وحدات العرض، عناصر البراندنج، الحواجز الشفافة، والتفاصيل المعمارية.",
      applicationsEn: JSON.stringify(["Partitions", "Signage", "Display boxes", "Decorative panels"]),
      applicationsAr: JSON.stringify(["قواطيع", "لافتات", "صناديق عرض", "بانوهات ديكورية"]),
      imageUrl:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
      sortOrder: 2,
    },
    {
      nameEn: "Finishing Packages",
      nameAr: "باقات التشطيب",
      descriptionEn:
        "Flooring, paints, gypsum board, ceilings, lighting integration, doors, hardware, and final decorative finishes.",
      descriptionAr:
        "الأرضيات، الدهانات، الجبس بورد، الأسقف، دمج الإضاءة، الأبواب، الإكسسوارات، والتشطيبات النهائية.",
      applicationsEn: JSON.stringify(["Turnkey finishing", "Renovation", "Commercial interiors", "Final handover"]),
      applicationsAr: JSON.stringify(["تشطيب متكامل", "تجديد", "مساحات تجارية", "تسليم نهائي"]),
      imageUrl:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop",
      sortOrder: 3,
    },
  ]

  for (const material of materials) {
    await prisma.material.create({ data: material })
  }

  // Catalog items
  const catalogItems = [
    {
      titleEn: "Metal Works",
      titleAr: "الأعمال المعدنية",
      categoryEn: "Workshop Production",
      categoryAr: "تصنيع داخل الورشة",
      imageUrl:
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1400&auto=format&fit=crop",
      showOverlay: true,
      sortOrder: 0,
    },
    {
      titleEn: "Wood & Joinery",
      titleAr: "النجارة والأعمال الخشبية",
      categoryEn: "Interior Production",
      categoryAr: "تصنيع داخلي",
      imageUrl:
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop",
      showOverlay: true,
      sortOrder: 1,
    },
    {
      titleEn: "Finishing Systems",
      titleAr: "أنظمة التشطيب",
      categoryEn: "Contracting Works",
      categoryAr: "أعمال مقاولات",
      imageUrl:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1400&auto=format&fit=crop",
      showOverlay: true,
      sortOrder: 2,
    },
    {
      titleEn: "Retail & Display Units",
      titleAr: "وحدات العرض التجاري",
      categoryEn: "Commercial Fabrication",
      categoryAr: "تصنيع تجاري",
      imageUrl:
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1400&auto=format&fit=crop",
      showOverlay: true,
      sortOrder: 3,
    },
    {
      titleEn: "Booths & Exhibition Work",
      titleAr: "بوثات ومعارض",
      categoryEn: "Events & Activations",
      categoryAr: "فعاليات وتنشيطات",
      imageUrl:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1400&auto=format&fit=crop",
      showOverlay: true,
      sortOrder: 4,
    },
    {
      titleEn: "Renovation & Maintenance",
      titleAr: "تجديد وصيانة",
      categoryEn: "Site Services",
      categoryAr: "خدمات موقع",
      imageUrl:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1400&auto=format&fit=crop",
      showOverlay: true,
      sortOrder: 5,
    },
  ]

  for (const item of catalogItems) {
    await prisma.catalogItem.create({ data: item })
  }

  // Partners
  const partners = [
    { nameEn: "Architectural Studios", nameAr: "مكاتب معمارية", type: "text", sortOrder: 0 },
    { nameEn: "Interior Design Offices", nameAr: "مكاتب تصميم داخلي", type: "text", sortOrder: 1 },
    { nameEn: "Real Estate Developers", nameAr: "مطورو عقارات", type: "text", sortOrder: 2 },
    { nameEn: "Retail & F&B Brands", nameAr: "براندات تجارية ومطاعم", type: "text", sortOrder: 3 },
    { nameEn: "Corporate Clients", nameAr: "عملاء شركات", type: "text", sortOrder: 4 },
    { nameEn: "Event & Exhibition Agencies", nameAr: "وكالات فعاليات ومعارض", type: "text", sortOrder: 5 },
  ]

  for (const partner of partners) {
    await prisma.partner.create({ data: partner })
  }

  // Contact info
  await prisma.contactInfo.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      phone: "+20 000 000 0000",
      email: "info@elgedadaworks.com",
      locationEn: "Cairo, Egypt",
      locationAr: "القاهرة، مصر",
      addressEn: "Cairo, Egypt",
      addressAr: "القاهرة، مصر",
    },
  })

  // SEO settings
  await prisma.seoSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      titleEn: "EL GEDADA | Engineering Works & Contracting",
      titleAr: "الجـدادة | أعمال هندسية ومقاولات",
      descriptionEn:
        "EL GEDADA is a premium engineering workshop and contracting company. View our portfolio of completed projects, fabrication capabilities, and professional execution standards.",
      descriptionAr:
        "الجـدادة ورشة هندسية وشركة مقاولات محترفة. تصفح بورتفوليو المشاريع المنفذة، قدرات التصنيع، ومعايير التنفيذ الاحترافية.",
      keywordsEn: "engineering, contracting, fabrication, metal works, joinery, finishing, construction, Egypt",
      keywordsAr: "هندسة، مقاولات، تصنيع، أعمال معدنية، نجارة، تشطيبات، بناء، مصر",
    },
  })

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
