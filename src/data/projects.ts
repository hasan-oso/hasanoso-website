import type { Locale } from '@/i18n/settings';

/**
 * Static project data for the public work archive.
 *
 * Each project's prose is keyed by locale. The Firestore-backed live edits
 * can later override individual fields, but this file is the source of
 * truth at build time so the static export is always self-contained.
 */
export type Project = {
  slug: string;
  year: number;
  role: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  challenge: Record<Locale, string>;
  approach: Record<Locale, string>;
  outcome: Record<Locale, string>;
  stack: string[];
  accent: 'gold' | 'neon' | 'violet';
  links?: {
    live?: string;
    repo?: string;
  };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'arabic-rag-civic',
    year: 2024,
    accent: 'gold',
    featured: true,
    role: {
      en: 'Lead engineer · Architecture & retrieval',
      ar: 'مهندس قائد · معمارية واسترجاع',
      tr: 'Baş mühendis · Mimari ve erişim',
    },
    title: {
      en: 'Arabic-first RAG for civic data',
      ar: 'RAG عربي أوّلاً للبيانات المدنية',
      tr: 'Sivil veriler için Arapça öncelikli RAG',
    },
    summary: {
      en: 'A retrieval-augmented system tuned for dialectal Arabic and bilingual government documents.',
      ar: 'نظام استرجاع معزّز للجيل، مضبوط للهجة العربية والوثائق الحكومية ثنائية اللغة.',
      tr: 'Lehçeye ve iki dilli resmi belgelere göre ayarlanmış bir RAG sistemi.',
    },
    challenge: {
      en: 'Public-sector documents in Syria and Turkey mix MSA, dialect, French legal terminology, and scanned PDFs. Off-the-shelf embeddings collapse all of this into noise.',
      ar: 'وثائق القطاع العام في سوريا وتركيا تخلط الفصحى واللهجة والمصطلحات الفرنسية وملفات PDF ممسوحة. التضمينات الجاهزة تطمس هذا في ضجيج.',
      tr: 'Suriye ve Türkiye\'deki kamu belgeleri MSA, lehçe, Fransızca hukuk terminolojisi ve taranmış PDF\'leri karıştırır. Hazır embedding\'ler bunu gürültüye indirger.',
    },
    approach: {
      en: 'Two-stage retrieval with an Arabic-tuned dense encoder + a lexical BM25 fallback, plus a custom OCR pipeline that preserves diacritics and table structure.',
      ar: 'استرجاع على مرحلتين بترميز كثيف مضبوط للعربية + احتياط BM25 معجمي، مع خط OCR يحفظ التشكيل وبنية الجداول.',
      tr: 'Arapça\'ya göre ayarlanmış yoğun bir kodlayıcı + sözcüksel BM25 yedeğiyle iki aşamalı erişim, ayrıca harekeleri ve tablo yapısını koruyan özel bir OCR hattı.',
    },
    outcome: {
      en: 'Recall@10 climbed from 41% to 79% on the dialect-heavy eval set. Now in pilot with two civil-society partners.',
      ar: 'Recall@10 ارتفع من 41% إلى 79% على مجموعة تقييم غنية باللهجة. الآن في تجربة مع شريكين من المجتمع المدني.',
      tr: 'Lehçe ağırlıklı değerlendirme setinde Recall@10 %41\'den %79\'a çıktı. Şu anda iki sivil toplum ortağıyla pilot aşamada.',
    },
    stack: ['Python', 'PyTorch', 'FAISS', 'BM25', 'Tesseract'],
  },
  {
    slug: 'ondevice-llm-toolkit',
    year: 2024,
    accent: 'neon',
    featured: true,
    role: {
      en: 'Solo · Engineering',
      ar: 'منفرد · هندسة',
      tr: 'Tek başına · Mühendislik',
    },
    title: {
      en: 'On-device LLM toolkit',
      ar: 'صندوق أدوات LLM على الجهاز',
      tr: 'Cihaz içi LLM araç seti',
    },
    summary: {
      en: 'A scaffolding library for running tiny instruct-tuned models on low-end Android phones.',
      ar: 'مكتبة سقالات لتشغيل نماذج صغيرة مضبوطة للتعليمات على هواتف Android منخفضة المواصفات.',
      tr: 'Düşük seviyeli Android telefonlarda küçük talimat-ayarlı modelleri çalıştırmak için bir iskelet kütüphanesi.',
    },
    challenge: {
      en: 'Connectivity in northern Syria is intermittent. Most useful tools require cloud round-trips. Phones are often ARM with <4GB RAM.',
      ar: 'الاتصال في شمال سوريا متقطع. معظم الأدوات النافعة تتطلب جولات إلى السحابة. الهواتف عادةً ARM بأقل من 4GB RAM.',
      tr: 'Kuzey Suriye\'de bağlantı kesintilidir. Çoğu yararlı araç buluta gidip gelmeyi gerektirir. Telefonlar genellikle 4GB RAM altında ARM\'dır.',
    },
    approach: {
      en: 'Ship quantised <1B-param models with a streaming token pipeline and aggressive context trimming. Cache on-device by intent rather than raw prompt.',
      ar: 'شحن نماذج مكمّمة بأقل من مليار باراميتر مع خط تدفق رموز وقصّ سياق صارم. تخزين على الجهاز حسب القصد لا المُدخل الخام.',
      tr: 'Akış token hattı ve agresif bağlam kırpma ile 1 milyar parametrenin altında nicelleştirilmiş modelleri yayınla. Ham istemden değil, niyetten cihazda önbellekle.',
    },
    outcome: {
      en: 'A reference build runs first-token latency under 800ms on a $90 phone. Used inside a partner NGO\'s field app.',
      ar: 'بِنية مرجعية تُحقّق زمن أول رمز أقل من 800 مللي ثانية على هاتف بـ90$. تُستخدم داخل تطبيق ميداني لمنظمة شريكة.',
      tr: 'Referans bir derleme, 90$\'lık bir telefonda ilk token gecikmesini 800ms altına indiriyor. Bir ortak STK\'nın saha uygulamasında kullanılıyor.',
    },
    stack: ['Rust', 'GGML', 'Kotlin', 'JNI'],
    links: { repo: 'https://github.com/hasanoso/ondevice-llm-toolkit' },
  },
  {
    slug: 'reconstruction-data-layer',
    year: 2023,
    accent: 'violet',
    role: {
      en: 'Co-lead · Schema & API',
      ar: 'قائد مشارك · مخطط البيانات وواجهة API',
      tr: 'Eş yönetici · Şema ve API',
    },
    title: {
      en: 'Reconstruction data layer',
      ar: 'طبقة بيانات إعادة الإعمار',
      tr: 'Yeniden yapılanma veri katmanı',
    },
    summary: {
      en: 'An open API and schema for cross-organisation reporting on rebuilding projects in Syria.',
      ar: 'API ومخطط بيانات مفتوح للإبلاغ بين المنظمات عن مشاريع إعادة الإعمار في سوريا.',
      tr: 'Suriye\'deki yeniden inşa projeleri hakkında kuruluşlar arası raporlama için açık API ve şema.',
    },
    challenge: {
      en: 'Every NGO uses a different spreadsheet. There\'s no shared vocabulary for project status, location precision, or beneficiary categories — so cross-cutting analysis is impossible.',
      ar: 'كل منظمة تستخدم جدولاً مختلفاً. لا قاموس مشترك لحالة المشروع أو دقة الموقع أو فئات المستفيدين — فيستحيل التحليل العابر.',
      tr: 'Her STK farklı bir elektronik tablo kullanıyor. Proje durumu, konum hassasiyeti veya yararlanıcı kategorileri için ortak bir kelime yok — yani kesişen analiz imkânsız.',
    },
    approach: {
      en: 'A shared JSON schema with optional fields and conservative coordinate precision, plus a thin reference server that lets organisations import and export without coupling.',
      ar: 'مخطط JSON مشترك بحقول اختيارية ودقة إحداثيات محافظة، مع خادم مرجعي خفيف يُتيح للمنظمات الاستيراد والتصدير دون اقتران.',
      tr: 'İsteğe bağlı alanlara ve muhafazakâr koordinat hassasiyetine sahip ortak bir JSON şeması, ayrıca kuruluşların eşleşme olmadan içeri/dışarı aktarmasını sağlayan ince bir referans sunucu.',
    },
    outcome: {
      en: 'Adopted by three partners. Released under a permissive licence with a small bilingual specification.',
      ar: 'اعتمده ثلاثة شركاء. صدر بترخيص متساهل مع مواصفة صغيرة ثنائية اللغة.',
      tr: 'Üç ortak tarafından benimsendi. Küçük iki dilli bir özellikle hoşgörülü bir lisans altında yayınlandı.',
    },
    stack: ['TypeScript', 'JSON Schema', 'Postgres', 'Hono'],
  },
  {
    slug: 'dialect-aware-stt',
    year: 2023,
    accent: 'gold',
    role: {
      en: 'ML engineer · Data & fine-tuning',
      ar: 'مهندس ML · بيانات وضبط دقيق',
      tr: 'ML mühendisi · Veri ve ince ayar',
    },
    title: {
      en: 'Dialect-aware Arabic STT',
      ar: 'تحويل كلام عربي إلى نص يراعي اللهجة',
      tr: 'Lehçeye duyarlı Arapça STT',
    },
    summary: {
      en: 'Fine-tuned a speech recogniser to handle Levantine dialect inside MSA-trained baselines.',
      ar: 'ضبط دقيق لمتعرّف كلام يتعامل مع اللهجة الشامية داخل خطوط أساس مدرّبة على الفصحى.',
      tr: 'Levanten lehçesini MSA tabanlı temellerin içinde işlemek için bir konuşma tanıyıcının ince ayarı.',
    },
    challenge: {
      en: 'MSA-only STT misreads dialect by 30–50% WER. Field interviews are almost entirely dialect.',
      ar: 'STT الفصيح فقط يخطئ في اللهجة بمعدل 30–50% WER. المقابلات الميدانية باللهجة بالكامل تقريباً.',
      tr: 'Yalnız MSA için eğitilmiş STT lehçeyi %30–50 WER ile yanlış okur. Saha röportajları neredeyse tamamen lehçedir.',
    },
    approach: {
      en: 'Curated a small dialect corpus, LoRA-fine-tuned a multilingual base, and shipped a streaming inference layer.',
      ar: 'تنسيق مجموعة لهجة صغيرة، ضبط LoRA على نموذج متعدد اللغات، وشحن طبقة استدلال بالتدفق.',
      tr: 'Küçük bir lehçe külliyatı derlendi, çok dilli bir taban LoRA ile ince ayarlandı ve bir akış çıkarım katmanı yayınlandı.',
    },
    outcome: {
      en: 'WER dropped to under 18% on the dialect eval. Now used in two interview-archival projects.',
      ar: 'WER هبط إلى أقل من 18% على تقييم اللهجة. يُستخدم الآن في مشروعَي أرشفة مقابلات.',
      tr: 'WER, lehçe değerlendirmesinde %18\'in altına düştü. Şimdi iki röportaj arşivleme projesinde kullanılıyor.',
    },
    stack: ['Python', 'Whisper', 'LoRA', 'PyTorch'],
  },
  {
    slug: 'syria-open-map',
    year: 2022,
    accent: 'neon',
    role: {
      en: 'Solo · Tiles & UI',
      ar: 'منفرد · خرائط وواجهة',
      tr: 'Tek başına · Karolar ve arayüz',
    },
    title: {
      en: 'Syria open-map experiment',
      ar: 'تجربة خرائط مفتوحة لسوريا',
      tr: 'Suriye açık harita deneyi',
    },
    summary: {
      en: 'A research tool for browsing locally-hosted OSM tiles with bilingual labels.',
      ar: 'أداة بحث لتصفح بلاطات OSM مستضافة محلياً بتسميات ثنائية اللغة.',
      tr: 'İki dilli etiketlerle yerel olarak barındırılan OSM karolarına göz atmak için bir araştırma aracı.',
    },
    challenge: {
      en: 'Mainstream tile providers either lack Arabic names or treat them as a secondary label. Field workers need an offline-first map that shows real toponymy.',
      ar: 'مزودو البلاطات الرئيسيون إما يفتقدون الأسماء العربية أو يعاملونها كتسمية ثانوية. العاملون الميدانيون يحتاجون خريطة تعمل دون اتصال أولاً تعرض الأسماء الحقيقية.',
      tr: 'Ana akım karo sağlayıcıları ya Arapça adlardan yoksundur ya da onları ikincil etiket olarak görür. Saha çalışanlarının önce çevrimdışı çalışan, gerçek yer adlarını gösteren bir haritaya ihtiyacı var.',
    },
    approach: {
      en: 'Built a tile pipeline that prefers Arabic names with English fallback and ships as a small static bundle.',
      ar: 'بناء خط بلاطات يفضّل الأسماء العربية مع احتياط إنجليزي، ويُشحن كحزمة ثابتة صغيرة.',
      tr: 'Önce Arapça adları tercih eden, küçük bir statik paket olarak teslim edilen bir karo hattı kuruldu.',
    },
    outcome: {
      en: 'Used internally by partner organisations as an offline mapping reference.',
      ar: 'يُستخدم داخلياً لدى منظمات شريكة كمرجع خرائط دون اتصال.',
      tr: 'Ortak kuruluşlar tarafından çevrimdışı harita referansı olarak dahili kullanımda.',
    },
    stack: ['TypeScript', 'MapLibre', 'PostGIS'],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function featuredProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
