export type Language = 'en' | 'ur' | 'roman_urdu' | 'sindhi' | 'pashto';

export const languageNames: Record<Language, string> = {
  en: 'English',
  ur: 'اردو',
  roman_urdu: 'Roman Urdu',
  sindhi: 'سنڌي',
  pashto: 'پښتو',
};

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Onboarding
    welcome: 'Welcome!',
    letsSetup: "Let's set up your shop",
    shopName: 'Shop Name',
    enterShopName: 'Enter your shop name...',
    ownerName: 'Owner Name',
    enterOwnerName: 'Enter your name...',
    phoneNumber: 'Phone Number',
    enterPhone: '03XX-XXXXXXX',
    chooseLanguage: 'Choose Language',
    next: 'Next',
    start: 'Start',
    skip: 'Skip',
    
    // Navigation
    home: 'Home',
    customers: 'Customers',
    products: 'Products',
    earnings: 'Earnings',
    settings: 'Settings',
    
    // Dashboard
    totalUdhaar: 'Total Credit',
    todayEarning: "Today's Earning",
    totalCustomers: 'Customers',
    addCustomer: 'Add Customer',
    addUdhaar: 'Add Credit',
    addPayment: 'Add Payment',
    addProduct: 'Add Product',
    addEarning: 'Add Earning',
    recentCustomers: 'Recent Customers',
    viewAll: 'View All',
    
    // Customer
    newCustomer: 'New Customer',
    searchCustomer: 'Search...',
    noCustomers: 'No customers yet',
    addFirstCustomer: 'Add your first customer',
    balance: 'Balance',
    paid: 'Paid',
    due: 'Due',
    
    // Udhaar
    newUdhaar: 'New Credit',
    amount: 'Amount',
    description: 'Description',
    optional: 'optional',
    save: 'Save',
    
    // Payment
    newPayment: 'New Payment',
    receivedPayment: 'Payment Received',
    
    // Products
    productName: 'Product Name',
    price: 'Price',
    quantity: 'Quantity',
    supplier: 'Supplier',
    soldOut: 'Sold Out',
    markSoldOut: 'Mark Sold',
    
    // Earnings
    todayProfit: "Today's Profit",
    monthlyEarnings: 'Monthly Earnings',
    addExpense: 'Add Expense',
    expenses: 'Expenses',
    
    // Settings
    shopSettings: 'Shop Settings',
    address: 'Address',
    qrCode: 'Payment QR Code',
    language: 'Language',
    saveSettings: 'Save',
    settingsSaved: 'Saved!',
    
    // Common
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    rs: 'Rs.',
    today: 'Today',
    
    // AI Helper
    aiHelper: 'AI Helper',
    aiHelperDesc: 'Get smart insights about your shop based on your data',
    popularProducts: 'Best Selling',
    todayTips: "Today's Tips",
    noProductsForAI: 'Add products first to get AI insights',
    aiError: 'Could not get AI advice. Try again.',
    rateLimitError: 'Too many requests. Try again later.',
    creditsError: 'AI credits finished. Contact support.',
    
    // Slip
    slip: 'Slip',
    shareWhatsApp: 'Share on WhatsApp',
    downloadSlip: 'Download Slip',
    selectContact: 'Select Contact',
    sendToCustomer: 'Send to Customer',
    
    // Calculator
    calculator: 'Calculator',
    addToBalance: 'Add to Balance',
    enterAmount: 'Enter Amount',
    enterValidAmount: 'Please enter a valid amount',
    earningsAdded: 'Added!',
    addedToBalance: 'added to balance',
    expenseAdded: 'Expense Added!',
    expenseRecorded: 'recorded',
    selectCategory: 'Select Category',
    monthlySummary: 'Summary',
    income: 'Income',
    netProfit: 'Net Profit',
    
    // Expense Categories
    expStock: 'Stock Purchase',
    expElectricity: 'Electricity',
    expRent: 'Rent',
    expSalary: 'Salary',
    expMaintenance: 'Maintenance',
    expOther: 'Other',
  },
  
  ur: {
    // Onboarding
    welcome: 'خوش آمدید!',
    letsSetup: 'آئیے اپنی دکان بنائیں',
    shopName: 'دکان کا نام',
    enterShopName: 'دکان کا نام لکھیں...',
    ownerName: 'مالک کا نام',
    enterOwnerName: 'اپنا نام لکھیں...',
    phoneNumber: 'فون نمبر',
    enterPhone: '03XX-XXXXXXX',
    chooseLanguage: 'زبان منتخب کریں',
    next: 'آگے',
    start: 'شروع کریں',
    skip: 'چھوڑیں',
    
    // Navigation
    home: 'ہوم',
    customers: 'گاہک',
    products: 'سامان',
    earnings: 'کمائی',
    settings: 'ترتیبات',
    
    // Dashboard
    totalUdhaar: 'کل اُدھار',
    todayEarning: 'آج کی کمائی',
    totalCustomers: 'گاہک',
    addCustomer: 'نیا گاہک',
    addUdhaar: 'اُدھار لکھیں',
    addPayment: 'ادائیگی لکھیں',
    addProduct: 'نیا سامان',
    addEarning: 'کمائی لکھیں',
    recentCustomers: 'حالیہ گاہک',
    viewAll: 'سب دیکھیں',
    
    // Customer
    newCustomer: 'نیا گاہک',
    searchCustomer: 'تلاش کریں...',
    noCustomers: 'ابھی کوئی گاہک نہیں',
    addFirstCustomer: 'پہلا گاہک شامل کریں',
    balance: 'بقایا',
    paid: 'ادا شدہ',
    due: 'واجب',
    
    // Udhaar
    newUdhaar: 'نیا اُدھار',
    amount: 'رقم',
    description: 'تفصیل',
    optional: 'اختیاری',
    save: 'محفوظ کریں',
    
    // Payment
    newPayment: 'نئی ادائیگی',
    receivedPayment: 'ادائیگی موصول',
    
    // Products
    productName: 'سامان کا نام',
    price: 'قیمت',
    quantity: 'مقدار',
    supplier: 'سپلائر',
    soldOut: 'ختم ہوگیا',
    markSoldOut: 'ختم کریں',
    
    // Earnings
    todayProfit: 'آج کا نفع',
    monthlyEarnings: 'ماہانہ کمائی',
    addExpense: 'خرچہ لکھیں',
    expenses: 'اخراجات',
    
    // Settings
    shopSettings: 'دکان کی ترتیبات',
    address: 'پتہ',
    qrCode: 'ادائیگی QR',
    language: 'زبان',
    saveSettings: 'محفوظ کریں',
    settingsSaved: 'محفوظ ہوگیا!',
    
    // Common
    cancel: 'منسوخ',
    delete: 'حذف',
    edit: 'ترمیم',
    back: 'واپس',
    rs: 'روپے',
    today: 'آج',
    
    // AI Helper
    aiHelper: 'AI مددگار',
    aiHelperDesc: 'اپنی دکان کے ڈیٹا سے سمارٹ مشورے حاصل کریں',
    popularProducts: 'زیادہ بکنے والا',
    todayTips: 'آج کا مشورہ',
    noProductsForAI: 'پہلے سامان شامل کریں',
    aiError: 'مشورہ نہیں مل سکا۔ دوبارہ کوشش کریں۔',
    rateLimitError: 'بہت زیادہ درخواستیں۔ بعد میں کوشش کریں۔',
    creditsError: 'AI کریڈٹ ختم۔ سپورٹ سے رابطہ کریں۔',
    
    // Slip
    slip: 'پرچی',
    shareWhatsApp: 'واٹس ایپ پر بھیجیں',
    downloadSlip: 'پرچی ڈاؤنلوڈ کریں',
    selectContact: 'رابطہ منتخب کریں',
    sendToCustomer: 'گاہک کو بھیجیں',
    
    // Calculator
    calculator: 'کیلکولیٹر',
    addToBalance: 'بیلنس میں شامل کریں',
    enterAmount: 'رقم درج کریں',
    enterValidAmount: 'درست رقم درج کریں',
    earningsAdded: 'شامل ہوگیا!',
    addedToBalance: 'بیلنس میں شامل',
    expenseAdded: 'خرچہ شامل!',
    expenseRecorded: 'درج ہوگیا',
    selectCategory: 'قسم منتخب کریں',
    monthlySummary: 'خلاصہ',
    income: 'آمدنی',
    netProfit: 'خالص نفع',
    
    // Expense Categories
    expStock: 'مال خریداری',
    expElectricity: 'بجلی',
    expRent: 'کرایہ',
    expSalary: 'تنخواہ',
    expMaintenance: 'مرمت',
    expOther: 'دیگر',
  },
  
  roman_urdu: {
    // Onboarding
    welcome: 'Khush Aamdeed!',
    letsSetup: 'Aao apni dukaan banayein',
    shopName: 'Dukaan Ka Naam',
    enterShopName: 'Dukaan ka naam likhein...',
    ownerName: 'Maalik Ka Naam',
    enterOwnerName: 'Apna naam likhein...',
    phoneNumber: 'Phone Number',
    enterPhone: '03XX-XXXXXXX',
    chooseLanguage: 'Zubaan Chunein',
    next: 'Aagay',
    start: 'Shuru Karein',
    skip: 'Chhorein',
    
    // Navigation
    home: 'Home',
    customers: 'Gaahak',
    products: 'Saamaan',
    earnings: 'Kamaai',
    settings: 'Settings',
    
    // Dashboard
    totalUdhaar: 'Kul Udhaar',
    todayEarning: 'Aaj Ki Kamaai',
    totalCustomers: 'Gaahak',
    addCustomer: 'Naya Gaahak',
    addUdhaar: 'Udhaar Likhein',
    addPayment: 'Wapsi Likhein',
    addProduct: 'Naya Saamaan',
    addEarning: 'Kamaai Likhein',
    recentCustomers: 'Haalia Gaahak',
    viewAll: 'Sab Dekhein',
    
    // Customer
    newCustomer: 'Naya Gaahak',
    searchCustomer: 'Dhundein...',
    noCustomers: 'Abhi koi gaahak nahi',
    addFirstCustomer: 'Pehla gaahak daalein',
    balance: 'Baaki',
    paid: 'Ada',
    due: 'Baaki',
    
    // Udhaar
    newUdhaar: 'Naya Udhaar',
    amount: 'Raqam',
    description: 'Tafseel',
    optional: 'ikhtiari',
    save: 'Save Karein',
    
    // Payment
    newPayment: 'Nayi Wapsi',
    receivedPayment: 'Raqam Mili',
    
    // Products
    productName: 'Saamaan Ka Naam',
    price: 'Qeemat',
    quantity: 'Tadaad',
    supplier: 'Supplier',
    soldOut: 'Khatam',
    markSoldOut: 'Khatam Karein',
    
    // Earnings
    todayProfit: 'Aaj Ka Nafa',
    monthlyEarnings: 'Maahana Kamaai',
    addExpense: 'Kharcha Likhein',
    expenses: 'Kharche',
    
    // Settings
    shopSettings: 'Dukaan Ki Settings',
    address: 'Pata',
    qrCode: 'Payment QR',
    language: 'Zubaan',
    saveSettings: 'Save Karein',
    settingsSaved: 'Saved!',
    
    // Common
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Wapis',
    rs: 'Rs.',
    today: 'Aaj',
    
    // AI Helper
    aiHelper: 'AI Madadgar',
    aiHelperDesc: 'Apni dukaan ke data se smart mashware lein',
    popularProducts: 'Zyada Biknay Wala',
    todayTips: 'Aaj Ka Mashwara',
    noProductsForAI: 'Pehle saamaan daalein',
    aiError: 'Mashwara nahi mil saka. Dobara try karein.',
    rateLimitError: 'Bohat zyada requests. Baad mein try karein.',
    creditsError: 'AI credits khatam. Support se contact karein.',
    
    // Slip
    slip: 'Parchi',
    shareWhatsApp: 'WhatsApp Par Bhejein',
    downloadSlip: 'Parchi Download',
    selectContact: 'Contact Chunein',
    sendToCustomer: 'Gaahak Ko Bhejein',
    
    // Calculator
    calculator: 'Calculator',
    addToBalance: 'Balance Mein Daalein',
    enterAmount: 'Raqam Likhein',
    enterValidAmount: 'Sahi raqam likhein',
    earningsAdded: 'Shaamil Hogaya!',
    addedToBalance: 'balance mein daal diya',
    expenseAdded: 'Kharcha Shaamil!',
    expenseRecorded: 'darj hogaya',
    selectCategory: 'Qism Chunein',
    monthlySummary: 'Khulasa',
    income: 'Aamdani',
    netProfit: 'Saf Nafa',
    
    // Expense Categories
    expStock: 'Maal Kharidi',
    expElectricity: 'Bijli',
    expRent: 'Kiraya',
    expSalary: 'Tankhwah',
    expMaintenance: 'Marammat',
    expOther: 'Doosra',
  },
  
  sindhi: {
    // Onboarding
    welcome: 'ڀلي ڪري آيا!',
    letsSetup: 'اچو پنهنجي دڪان ٺاهيون',
    shopName: 'دڪان جو نالو',
    enterShopName: 'دڪان جو نالو لکو...',
    ownerName: 'مالڪ جو نالو',
    enterOwnerName: 'پنهنجو نالو لکو...',
    phoneNumber: 'فون نمبر',
    enterPhone: '03XX-XXXXXXX',
    chooseLanguage: 'ٻولي چونڊيو',
    next: 'اڳيان',
    start: 'شروع ڪريو',
    skip: 'ڇڏيو',
    
    // Navigation
    home: 'گهر',
    customers: 'گراهڪ',
    products: 'سامان',
    earnings: 'ڪمائي',
    settings: 'سيٽنگون',
    
    // Dashboard
    totalUdhaar: 'ڪُل اُڌار',
    todayEarning: 'اڄ جي ڪمائي',
    totalCustomers: 'گراهڪ',
    addCustomer: 'نئون گراهڪ',
    addUdhaar: 'اُڌار لکو',
    addPayment: 'ادائگي لکو',
    addProduct: 'نئون سامان',
    addEarning: 'ڪمائي لکو',
    recentCustomers: 'تازا گراهڪ',
    viewAll: 'سڀ ڏسو',
    
    // Customer
    newCustomer: 'نئون گراهڪ',
    searchCustomer: 'ڳولھو...',
    noCustomers: 'اڃا ڪو گراهڪ ناهي',
    addFirstCustomer: 'پهريون گراهڪ شامل ڪريو',
    balance: 'باقي',
    paid: 'ڏنل',
    due: 'واجب',
    
    // Udhaar
    newUdhaar: 'نئون اُڌار',
    amount: 'رقم',
    description: 'تفصيل',
    optional: 'اختياري',
    save: 'محفوظ ڪريو',
    
    // Payment
    newPayment: 'نئين ادائگي',
    receivedPayment: 'ادائگي ملي',
    
    // Products
    productName: 'سامان جو نالو',
    price: 'قيمت',
    quantity: 'مقدار',
    supplier: 'سپلائر',
    soldOut: 'ختم',
    markSoldOut: 'ختم ڪريو',
    
    // Earnings
    todayProfit: 'اڄ جو نفعو',
    monthlyEarnings: 'مهيني جي ڪمائي',
    addExpense: 'خرچو لکو',
    expenses: 'خرچا',
    
    // Settings
    shopSettings: 'دڪان جون سيٽنگون',
    address: 'پتو',
    qrCode: 'ادائگي QR',
    language: 'ٻولي',
    saveSettings: 'محفوظ ڪريو',
    settingsSaved: 'محفوظ ٿيو!',
    
    // Common
    cancel: 'منسوخ',
    delete: 'ختم',
    edit: 'ترميم',
    back: 'واپس',
    rs: 'روپيا',
    today: 'اڄ',
    
    // AI Helper
    aiHelper: 'AI مددگار',
    aiHelperDesc: 'پنھنجي دڪان جي ڊيٽا مان سمارٽ صلاح وٺو',
    popularProducts: 'وڌيڪ وڪرو',
    todayTips: 'اڄ جي صلاح',
    noProductsForAI: 'پھريائين سامان شامل ڪريو',
    aiError: 'صلاح نه ملي سگھي. ٻيهر ڪوشش ڪريو.',
    rateLimitError: 'تمام گھڻيون درخواستون. بعد ۾ ڪوشش ڪريو.',
    creditsError: 'AI ڪريڊٽ ختم. سپورٽ سان رابطو ڪريو.',
    
    // Slip
    slip: 'پرچي',
    shareWhatsApp: 'واٽس ايپ تي موڪليو',
    downloadSlip: 'پرچي ڊائونلوڊ',
    selectContact: 'رابطو چونڊيو',
    sendToCustomer: 'گراهڪ کي موڪليو',
    
    // Calculator
    calculator: 'ڪيلڪوليٽر',
    addToBalance: 'بيلنس ۾ شامل ڪريو',
    enterAmount: 'رقم لکو',
    enterValidAmount: 'صحيح رقم لکو',
    earningsAdded: 'شامل ٿي ويو!',
    addedToBalance: 'بيلنس ۾ شامل',
    expenseAdded: 'خرچو شامل!',
    expenseRecorded: 'درج ٿيو',
    selectCategory: 'قسم چونڊيو',
    monthlySummary: 'خلاصو',
    income: 'آمدني',
    netProfit: 'صاف نفعو',
    
    // Expense Categories
    expStock: 'مال خريداري',
    expElectricity: 'بجلي',
    expRent: 'ڪرايو',
    expSalary: 'تنخواہ',
    expMaintenance: 'مرمت',
    expOther: 'ٻيو',
  },
  
  pashto: {
    // Onboarding
    welcome: 'ښه راغلاست!',
    letsSetup: 'راځئ خپل دوکان جوړ کړو',
    shopName: 'دوکان نوم',
    enterShopName: 'دوکان نوم ولیکئ...',
    ownerName: 'مالک نوم',
    enterOwnerName: 'خپل نوم ولیکئ...',
    phoneNumber: 'فون نمبر',
    enterPhone: '03XX-XXXXXXX',
    chooseLanguage: 'ژبه وټاکئ',
    next: 'وړاندې',
    start: 'پیل کړئ',
    skip: 'پریږدئ',
    
    // Navigation
    home: 'کور',
    customers: 'پیرودونکي',
    products: 'توکي',
    earnings: 'کمائي',
    settings: 'ترتیبات',
    
    // Dashboard
    totalUdhaar: 'ټول پور',
    todayEarning: 'نن کمائي',
    totalCustomers: 'پیرودونکي',
    addCustomer: 'نوی پیرودونکی',
    addUdhaar: 'پور ولیکئ',
    addPayment: 'ورکړه ولیکئ',
    addProduct: 'نوی توکی',
    addEarning: 'کمائي ولیکئ',
    recentCustomers: 'تازه پیرودونکي',
    viewAll: 'ټول وګورئ',
    
    // Customer
    newCustomer: 'نوی پیرودونکی',
    searchCustomer: 'لټون...',
    noCustomers: 'تر اوسه پیرودونکی نشته',
    addFirstCustomer: 'لومړی پیرودونکی اضافه کړئ',
    balance: 'پاتې',
    paid: 'ورکړل',
    due: 'پور',
    
    // Udhaar
    newUdhaar: 'نوی پور',
    amount: 'رقم',
    description: 'تفصیل',
    optional: 'اختیاري',
    save: 'خوندي کړئ',
    
    // Payment
    newPayment: 'نوې ورکړه',
    receivedPayment: 'ورکړه ترلاسه شوه',
    
    // Products
    productName: 'توکي نوم',
    price: 'بیه',
    quantity: 'مقدار',
    supplier: 'سپلایر',
    soldOut: 'پای',
    markSoldOut: 'ختم کړئ',
    
    // Earnings
    todayProfit: 'نن ګټه',
    monthlyEarnings: 'میاشتنۍ کمائي',
    addExpense: 'لګښت ولیکئ',
    expenses: 'لګښتونه',
    
    // Settings
    shopSettings: 'دوکان ترتیبات',
    address: 'پته',
    qrCode: 'ورکړه QR',
    language: 'ژبه',
    saveSettings: 'خوندي کړئ',
    settingsSaved: 'خوندي شو!',
    
    // Common
    cancel: 'لغوه',
    delete: 'ړنګول',
    edit: 'سمون',
    back: 'شاته',
    rs: 'روپۍ',
    today: 'نن',
    
    // AI Helper
    aiHelper: 'AI مرستندوی',
    aiHelperDesc: 'د خپل دوکان ډیټا څخه سمارټ مشوره ترلاسه کړئ',
    popularProducts: 'ډیر خرڅیدونکی',
    todayTips: 'نن مشوره',
    noProductsForAI: 'لومړی توکي اضافه کړئ',
    aiError: 'مشوره نشي ترلاسه کیدی. بیا هڅه وکړئ.',
    rateLimitError: 'ډیرې غوښتنې. وروسته هڅه وکړئ.',
    creditsError: 'AI کریډیټ پای ته ورسید. ملاتړ سره اړیکه ونیسئ.',
    
    // Slip
    slip: 'پرچی',
    shareWhatsApp: 'واټس اپ کې واستوئ',
    downloadSlip: 'پرچی ډاونلوډ',
    selectContact: 'اړیکه وټاکئ',
    sendToCustomer: 'پیرودونکي ته ولیږئ',
    
    // Calculator
    calculator: 'کیلکولیټر',
    addToBalance: 'بیلنس کې اضافه کړئ',
    enterAmount: 'رقم ولیکئ',
    enterValidAmount: 'سمه رقم ولیکئ',
    earningsAdded: 'اضافه شو!',
    addedToBalance: 'بیلنس کې اضافه شو',
    expenseAdded: 'لګښت اضافه شو!',
    expenseRecorded: 'ثبت شو',
    selectCategory: 'ډول وټاکئ',
    monthlySummary: 'لنډیز',
    income: 'عاید',
    netProfit: 'خالص ګټه',
    
    // Expense Categories
    expStock: 'توکي پیرود',
    expElectricity: 'بریښنا',
    expRent: 'کرایه',
    expSalary: 'معاش',
    expMaintenance: 'ترمیم',
    expOther: 'نور',
  },
};

export const getTranslation = (language: Language, key: string): string => {
  return translations[language]?.[key] || translations.en[key] || key;
};

export const isRTL = (language: Language): boolean => {
  return ['ur', 'sindhi', 'pashto'].includes(language);
};
