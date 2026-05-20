import type { Locale } from '@/i18n/settings';

export type ProjectStatus = 'active' | 'archived' | 'academic' | 'research';

export interface ProjectTranslation {
  name: string;
  tagline: string;
  teaser: string;
  overview: string;
  problem: string;
  approach: string;
  outcome: string;
  lessons?: string;
}

export interface Project {
  slug: string;
  status: ProjectStatus;
  year: string;
  repoStatus: 'public' | 'private';
  repoUrl?: string;
  privacyReason?: Record<Locale, string>;
  tech: string[];
  featured: boolean;
  displayOrder: number;
  translations: Record<Locale, ProjectTranslation>;
}

export const projects: Project[] = [
  {
    slug: 'neuralcheck',
    status: 'active',
    year: '2025 — 2026',
    repoStatus: 'private',
    privacyReason: {
      en: 'Repository is private during active commercial development. Code will be shared selectively after launch.',
      ar: 'المستودع خاص خلال مرحلة التطوير التجاري النشط. سيتم مشاركة الكود بشكل انتقائي بعد الإطلاق.',
      tr: 'Aktif ticari geliştirme sırasında depo özeldir. Kod, lansmandan sonra seçici olarak paylaşılacaktır.',
    },
    tech: [
      'Kotlin',
      'Jetpack Compose',
      'Firebase',
      'Cloud Functions',
      'Claude API',
      'DeepSeek V4',
      'Gemini 2.5 Flash',
    ],
    featured: true,
    displayOrder: 1,
    translations: {
      en: {
        name: 'NeuralCheck',
        tagline: 'AI-powered smartphone diagnostics for the Syrian market',
        teaser:
          'A diagnostic app that helps phone traders check used devices before buying. Built for Aleppo, launching August 2026.',
        overview:
          'NeuralCheck is a diagnostic application that uses artificial intelligence to evaluate used smartphones. The first launch targets phone shops in Azaz, Syria, in August 2026 — the start of a B2B-first market entry.',
        problem:
          'Phone traders in Syria buy and sell hundreds of used devices each month. Most checks happen manually: a quick visual inspection, a battery test, a screen check. This misses real problems — battery aging, motherboard issues, hidden water damage. Mistakes cost traders 20—40% margin on bad units.',
        approach:
          'I built a two-layer system. The first layer is deterministic code in Kotlin: it runs hardware diagnostics across 13 dimensions — battery health, CPU thermal behavior, GPU performance, sensors, cameras. The second layer is AI: it takes the raw measurements and writes a clear report in Arabic, explaining what is good, what is concerning, and what to negotiate down. The AI never decides scores — only explains them.',
        outcome:
          'Field testing with phone shops in Azaz starts in May 2026. The first paying customers will be 5—10 shops who join the early access program. The architecture is designed to scale to Damascus, Aleppo, and eventually the broader Gulf market.',
        lessons:
          'The hardest part is not the AI — it is the deterministic measurement layer. Hardware sensors behave differently across manufacturers. HyperOS hides data that AOSP exposes. Real-world diagnostic engineering taught me more than any course on machine learning.',
      },
      ar: {
        name: 'NeuralCheck',
        tagline: 'تشخيص الهواتف المدعوم بالذكاء الاصطناعي للسوق السوري',
        teaser:
          'تطبيق تشخيصي يساعد تجار الهواتف على فحص الأجهزة المستعملة قبل الشراء. مصمم لحلب، الإطلاق في آب 2026.',
        overview:
          'NeuralCheck تطبيق تشخيصي يستخدم الذكاء الاصطناعي لتقييم الهواتف الذكية المستعملة. الإطلاق الأول يستهدف محلات الهواتف في إعزاز، سوريا، في آب 2026 — بداية استراتيجية دخول للسوق تبدأ من قطاع الأعمال.',
        problem:
          'تجار الهواتف في سوريا يبيعون ويشترون مئات الأجهزة المستعملة شهرياً. معظم الفحوصات تتم يدوياً: فحص بصري سريع، اختبار للبطارية، فحص للشاشة. هذا يفوّت مشاكل حقيقية — تقادم البطارية، مشاكل اللوحة الأم، أضرار مياه مخفية. الأخطاء تكلف التجار 20—40% من هامش الربح على الأجهزة السيئة.',
        approach:
          'بنيت نظاماً من طبقتين. الطبقة الأولى كود حتمي بـ Kotlin: يجري تشخيصات للأجهزة عبر 13 بُعداً — صحة البطارية، السلوك الحراري للمعالج، أداء كرت الشاشة، الحساسات، الكاميرات. الطبقة الثانية ذكاء اصطناعي: تأخذ القياسات الخام وتكتب تقريراً واضحاً بالعربية، يشرح ما هو جيد، وما هو مقلق، وما يجب التفاوض عليه. الذكاء الاصطناعي لا يقرر التقييمات — فقط يشرحها.',
        outcome:
          'الاختبار الميداني مع محلات الهواتف في إعزاز يبدأ في أيار 2026. أول العملاء الدافعين سيكونون 5—10 محلات تنضم لبرنامج الوصول المبكر. البنية مصممة للتوسع إلى دمشق، حلب، وفي النهاية سوق الخليج الأوسع.',
        lessons:
          'الجزء الأصعب ليس الذكاء الاصطناعي — بل طبقة القياس الحتمية. حساسات الأجهزة تتصرف بشكل مختلف بين المصنّعين. HyperOS يخفي بيانات يكشفها AOSP. هندسة التشخيص في الواقع علّمتني أكثر من أي دورة عن تعلم الآلة.',
      },
      tr: {
        name: 'NeuralCheck',
        tagline: 'Suriye pazarı için yapay zekâ destekli akıllı telefon tanısı',
        teaser:
          "Telefon satıcılarının almadan önce ikinci el cihazları kontrol etmesine yardımcı olan tanı uygulaması. Halep için yapıldı, Ağustos 2026'da lansman.",
        overview:
          "NeuralCheck, ikinci el akıllı telefonları değerlendirmek için yapay zekâ kullanan bir tanı uygulamasıdır. İlk lansman, Ağustos 2026'da Suriye'nin Azez şehrindeki telefon dükkanlarını hedefliyor — B2B öncelikli pazara girişin başlangıcı.",
        problem:
          "Suriye'deki telefon satıcıları her ay yüzlerce ikinci el cihaz alıp satıyor. Çoğu kontrol elle yapılıyor: hızlı bir görsel inceleme, pil testi, ekran kontrolü. Bu, gerçek sorunları kaçırıyor — pil yaşlanması, anakart sorunları, gizli su hasarı. Hatalar, satıcılara kötü cihazlar üzerinde %20—40 kâr marjına mal oluyor.",
        approach:
          "İki katmanlı bir sistem inşa ettim. İlk katman Kotlin'de deterministik koddur: 13 boyutta donanım tanısı çalıştırır — pil sağlığı, CPU termal davranışı, GPU performansı, sensörler, kameralar. İkinci katman yapay zekâdır: ham ölçümleri alır ve net bir rapor yazar, neyin iyi olduğunu, neyin endişe verici olduğunu ve neyin pazarlık edilmesi gerektiğini açıklar. Yapay zekâ asla puan vermez — sadece açıklar.",
        outcome:
          "Azaz'daki telefon dükkanlarıyla saha testi Mayıs 2026'da başlar. İlk ödeme yapan müşteriler erken erişim programına katılan 5—10 mağaza olacak. Mimari Şam, Halep ve sonunda daha geniş Körfez pazarına ölçeklenmek üzere tasarlandı.",
        lessons:
          "En zor kısım yapay zekâ değil — deterministik ölçüm katmanıdır. Donanım sensörleri üreticiler arasında farklı davranır. HyperOS, AOSP'nin açığa çıkardığı verileri gizler. Gerçek dünya tanı mühendisliği bana makine öğrenimi üzerine herhangi bir kurstan daha fazla şey öğretti.",
      },
    },
  },

  {
    slug: 'etma',
    status: 'research',
    year: '2024',
    repoStatus: 'private',
    privacyReason: {
      en: 'Repository is private as this contains architectural patterns being refined for future open-source release.',
      ar: 'المستودع خاص لأنه يحتوي على أنماط معمارية يتم صقلها لإصدار مفتوح المصدر مستقبلي.',
      tr: 'Depo özeldir çünkü gelecekteki açık kaynak sürüm için iyileştirilen mimari kalıpları içerir.',
    },
    tech: [
      'Python 3.11',
      'Tree-sitter',
      'Ollama',
      'AST Parsing',
      'Custom Data Structures',
    ],
    featured: false,
    displayOrder: 2,
    translations: {
      en: {
        name: 'ETMA',
        tagline:
          'Edge-Managed Topological Memory Architecture for AI coding sessions',
        teaser:
          'A research architecture to keep AI context windows small even in large codebases. Built after hitting token limits one too many times.',
        overview:
          'ETMA (Edge-Managed Topological Memory Architecture, version 3.2) is a system for maintaining O(1) token budgets in long AI-assisted coding sessions. It addresses a practical problem: as projects grow, AI assistants lose context, repeat work, or hit context window limits.',
        problem:
          "When working with AI coding assistants on Android projects, I kept running into the same issue. The codebase was large. The AI's context window was small. Either I sent too little context and got bad suggestions, or I sent too much and hit token limits. There had to be a middle path.",
        approach:
          'ETMA introduces three core ideas: (1) Git-Diff-driven updates — only changed code enters context, not full files. (2) Tree-sitter AST parsing — structure is compressed semantically, not syntactically. (3) Topological Folding — distant code is summarized, nearby code is expanded. The result: O(1) memory usage regardless of project size.',
        outcome:
          'The system runs locally with Ollama. It is 7 Python files, total ~2000 lines. In my own workflow, it cut context usage by 60—80% while maintaining suggestion quality. It is not production software — it is research that informed my thinking about long-running AI sessions.',
        lessons:
          "Sometimes the right answer is not a bigger model — it is a smarter pipeline. ETMA showed me that thoughtful architecture beats brute force, especially when working with constrained resources. This lesson directly influenced NeuralCheck's design.",
      },
      ar: {
        name: 'ETMA',
        tagline: 'بنية ذاكرة طوبولوجية مُدارة عند الحافة لجلسات البرمجة بالذكاء الاصطناعي',
        teaser:
          'بنية بحثية لإبقاء نوافذ سياق الذكاء الاصطناعي صغيرة حتى في الأكواد الكبيرة. بُنيت بعد الاصطدام بحدود الرموز مرات كثيرة.',
        overview:
          'ETMA (بنية الذاكرة الطوبولوجية المُدارة عند الحافة، الإصدار 3.2) نظام للحفاظ على ميزانيات رموز O(1) في جلسات البرمجة الطويلة بمساعدة الذكاء الاصطناعي. يعالج مشكلة عملية: مع نمو المشاريع، يفقد مساعدو الذكاء الاصطناعي السياق، يكررون العمل، أو يصطدمون بحدود نافذة السياق.',
        problem:
          'عند العمل مع مساعدي البرمجة بالذكاء الاصطناعي على مشاريع أندرويد، كنت أواجه نفس المشكلة باستمرار. الكود كبير. نافذة السياق للذكاء الاصطناعي صغيرة. إما أن أرسل سياقاً قليلاً جداً فأحصل على اقتراحات سيئة، أو أرسل كثيراً جداً فأصطدم بحدود الرموز. لا بد من طريق وسط.',
        approach:
          'تقدم ETMA ثلاث أفكار جوهرية: (1) تحديثات مدفوعة بـ Git-Diff — فقط الكود المتغير يدخل السياق، لا الملفات الكاملة. (2) تحليل AST عبر Tree-sitter — البنية مضغوطة دلالياً، لا نحوياً. (3) الطي الطوبولوجي — الكود البعيد يُلخّص، والقريب يُوسّع. النتيجة: استخدام ذاكرة O(1) بغض النظر عن حجم المشروع.',
        outcome:
          'النظام يعمل محلياً مع Ollama. هو 7 ملفات بايثون، إجمالاً ~2000 سطر. في سير عملي الخاص، قلّل استخدام السياق بنسبة 60—80% مع الحفاظ على جودة الاقتراحات. ليس برنامجاً إنتاجياً — هو بحث أثّر على تفكيري في جلسات الذكاء الاصطناعي الطويلة.',
        lessons:
          'أحياناً الجواب الصحيح ليس نموذجاً أكبر — بل خط أنابيب أذكى. علّمتني ETMA أن البنية المدروسة تتغلب على القوة الغاشمة، خاصة عند العمل بموارد محدودة. هذا الدرس أثّر مباشرة على تصميم NeuralCheck.',
      },
      tr: {
        name: 'ETMA',
        tagline: 'AI kodlama oturumları için Edge-Managed Topological Memory Architecture',
        teaser:
          'Büyük kod tabanlarında bile AI bağlam pencerelerini küçük tutmak için bir araştırma mimarisi. Token limitlerine çok kez çarptıktan sonra inşa edildi.',
        overview:
          'ETMA (Edge-Managed Topological Memory Architecture, sürüm 3.2), uzun AI destekli kodlama oturumlarında O(1) token bütçelerini korumak için bir sistemdir. Pratik bir sorunu ele alır: projeler büyüdükçe, AI asistanları bağlamı kaybeder, işi tekrarlar veya bağlam penceresi limitlerine çarpar.',
        problem:
          "Android projeleri üzerinde AI kodlama asistanlarıyla çalışırken sürekli aynı sorunla karşılaşıyordum. Kod tabanı büyüktü. AI'nın bağlam penceresi küçüktü. Ya çok az bağlam gönderiyordum ve kötü öneriler alıyordum, ya da çok fazla gönderiyordum ve token limitlerine çarpıyordum. Bir orta yol olmalıydı.",
        approach:
          'ETMA üç temel fikir sunar: (1) Git-Diff güdümlü güncellemeler — yalnızca değişen kod bağlama girer, tüm dosyalar değil. (2) Tree-sitter AST analizi — yapı söz dizimsel olarak değil, anlamsal olarak sıkıştırılır. (3) Topolojik Katlama — uzak kod özetlenir, yakın kod genişletilir. Sonuç: proje boyutundan bağımsız O(1) bellek kullanımı.',
        outcome:
          'Sistem yerel olarak Ollama ile çalışır. 7 Python dosyasıdır, toplam ~2000 satır. Kendi iş akışımda, öneri kalitesini korurken bağlam kullanımını %60—80 azalttı. Üretim yazılımı değil — uzun süreli AI oturumları hakkındaki düşüncemi şekillendiren bir araştırmadır.',
        lessons:
          "Bazen doğru cevap daha büyük bir model değil — daha akıllı bir pipeline'dır. ETMA bana, özellikle kısıtlı kaynaklarla çalışırken, düşünceli mimarinin kaba kuvvete üstün geldiğini gösterdi. Bu ders NeuralCheck'in tasarımını doğrudan etkiledi.",
      },
    },
  },

  {
    slug: 'molguard',
    status: 'academic',
    year: '2024',
    repoStatus: 'public',
    repoUrl: 'https://github.com/hasanoso/molguard',
    tech: [
      'Python',
      'PyTorch Geometric',
      'Graph Neural Networks',
      'NumPy',
      'Pandas',
    ],
    featured: false,
    displayOrder: 3,
    translations: {
      en: {
        name: 'MolGuard',
        tagline: 'Drug safety analysis using Graph Neural Networks',
        teaser:
          'Academic deep learning project comparing GNN architectures across four molecular datasets. Built to learn, not deploy.',
        overview:
          'MolGuard is an academic project that uses Graph Neural Networks to predict drug safety properties from molecular structures. The goal was educational: understanding how GNNs actually work in practice, across multiple datasets and architectures.',
        problem:
          'Modern drug discovery generates vast amounts of molecular data. Traditional machine learning struggles with molecules because they are graphs, not vectors. The question I wanted to explore: can graph-based neural networks predict safety properties more accurately than traditional approaches?',
        approach:
          'I implemented three GNN architectures — GCN, GAT, and GIN — and tested them on four datasets covering different molecular property prediction tasks. Each architecture was evaluated across consistent metrics: accuracy, ROC-AUC, and inference time. The project was deliberately rigorous — I wanted to understand every component, not just produce working code.',
        outcome:
          'The full comparative study is on GitHub with detailed results. GAT performed best on smaller datasets; GIN showed strongest generalization on larger ones. More importantly, I now understand GNNs at a level where I can apply them to other domains — including potential future applications in NeuralCheck.',
        lessons:
          'Academic projects taught me to value the journey over the destination. The point was not to deploy a drug safety system — it was to understand graphs as a representation of structured knowledge. That mental model is now part of how I think about every AI problem.',
      },
      ar: {
        name: 'MolGuard',
        tagline: 'تحليل سلامة الأدوية باستخدام الشبكات العصبية الرسومية',
        teaser:
          'مشروع تعلم عميق أكاديمي يقارن بين بنى GNN عبر أربع مجموعات بيانات جزيئية. بُني للتعلم، لا للنشر.',
        overview:
          'MolGuard مشروع أكاديمي يستخدم الشبكات العصبية الرسومية للتنبؤ بخصائص سلامة الأدوية من البنى الجزيئية. كان الهدف تعليمياً: فهم كيفية عمل GNNs فعلياً في الممارسة، عبر مجموعات بيانات متعددة وبنى مختلفة.',
        problem:
          'يولّد اكتشاف الأدوية الحديث كميات هائلة من البيانات الجزيئية. تعلم الآلة التقليدي يعاني مع الجزيئات لأنها رسوم، وليست متّجهات. السؤال الذي أردت استكشافه: هل يمكن للشبكات العصبية القائمة على الرسوم أن تتنبأ بخصائص السلامة بدقة أعلى من المقاربات التقليدية؟',
        approach:
          'نفّذتُ ثلاث بنى GNN — GCN و GAT و GIN — واختبرتها على أربع مجموعات بيانات تغطي مهام مختلفة للتنبؤ بالخصائص الجزيئية. تم تقييم كل بنية عبر مقاييس متسقة: الدقة، ROC-AUC، وزمن الاستدلال. كان المشروع صارماً عن قصد — أردت فهم كل مكون، لا مجرد إنتاج كود يعمل.',
        outcome:
          'الدراسة المقارنة الكاملة على GitHub مع نتائج تفصيلية. GAT كان الأفضل على مجموعات البيانات الأصغر؛ GIN أظهر أقوى تعميم على الأكبر. والأهم، أفهم الآن GNNs على مستوى يمكنني تطبيقها على مجالات أخرى — بما في ذلك تطبيقات مستقبلية محتملة في NeuralCheck.',
        lessons:
          'علّمتني المشاريع الأكاديمية أن أقدّر الرحلة فوق الوجهة. لم تكن النقطة نشر نظام لسلامة الأدوية — بل فهم الرسوم كتمثيل للمعرفة المُهيكلة. هذا النموذج الذهني صار جزءاً من تفكيري في كل مشكلة ذكاء اصطناعي.',
      },
      tr: {
        name: 'MolGuard',
        tagline: 'Grafik Sinir Ağları kullanarak ilaç güvenliği analizi',
        teaser:
          'Dört moleküler veri seti üzerinde GNN mimarilerini karşılaştıran akademik derin öğrenme projesi. Dağıtmak için değil öğrenmek için inşa edildi.',
        overview:
          'MolGuard, moleküler yapılardan ilaç güvenliği özelliklerini tahmin etmek için Grafik Sinir Ağlarını kullanan akademik bir projedir. Amaç eğitseldi: GNN’lerin pratikte nasıl çalıştığını, birden fazla veri seti ve mimari boyunca anlamak.',
        problem:
          'Modern ilaç keşfi büyük miktarda moleküler veri üretir. Geleneksel makine öğrenimi moleküllerle mücadele eder çünkü onlar vektör değil, grafiktir. Keşfetmek istediğim soru: grafik tabanlı sinir ağları, güvenlik özelliklerini geleneksel yaklaşımlardan daha doğru tahmin edebilir mi?',
        approach:
          'Üç GNN mimarisi uyguladım — GCN, GAT ve GIN — ve bunları farklı moleküler özellik tahmin görevlerini kapsayan dört veri seti üzerinde test ettim. Her mimari tutarlı metrikler boyunca değerlendirildi: doğruluk, ROC-AUC ve çıkarım süresi. Proje kasıtlı olarak titizdi — her bileşeni anlamak istedim, sadece çalışan kod üretmek değil.',
        outcome:
          "Tam karşılaştırmalı çalışma ayrıntılı sonuçlarla GitHub'da. GAT küçük veri kümelerinde en iyi performansı gösterdi; GIN büyük olanlarda en güçlü genellemeyi gösterdi. Daha da önemlisi, artık GNN'leri başka alanlara uygulayabileceğim bir seviyede anlıyorum — NeuralCheck'teki olası gelecekteki uygulamalar dahil.",
        lessons:
          'Akademik projeler bana hedeften çok yolculuğa değer vermeyi öğretti. Amaç bir ilaç güvenliği sistemi dağıtmak değildi — yapılandırılmış bilginin bir temsili olarak grafikleri anlamaktı. Bu zihinsel model artık her AI sorunu hakkında nasıl düşündüğümün bir parçası.',
      },
    },
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const ordered = getAllProjects();
  const idx = ordered.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? (ordered[idx - 1] ?? null) : null,
    next: idx >= 0 && idx < ordered.length - 1 ? (ordered[idx + 1] ?? null) : null,
  };
}
