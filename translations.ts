
export type Language = 'en' | 'ms' | 'zh' | 'ta';

export interface TranslationStrings {
  navbar: {
    hospitals: string;
    specialists: string;
    emergency: string;
    profile: string;
  };
  hero: {
    title: string;
    subtitle: string;
    symptomsLabel: string;
    placeholder: string;
    button: string;
    analyzing: string;
  };
  steps: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  matching: {
    aiRecommendation: string;
    urgency: string;
    availableDoctors: string;
    exp: string;
    availableOn: string;
    changeSymptoms: string;
  };
  booking: {
    scheduleTitle: string;
    dateLabel: string;
    slotLabel: string;
    selectTime: string;
    remindersTitle: string;
    remindersText: string;
    back: string;
    confirm: string;
    finalizing: string;
  };
  confirmation: {
    title: string;
    reference: string;
    doctorLabel: string;
    dateTimeLabel: string;
    locationLabel: string;
    gettingThere: string;
    liveTraffic: string;
    sourcesLabel: string;
    newInquiry: string;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    navbar: {
      hospitals: "Hospitals",
      specialists: "Specialists",
      emergency: "Emergency",
      profile: "My Profile"
    },
    hero: {
      title: "How are you feeling today?",
      subtitle: "Describe your symptoms and our AI will match you with the right Malaysian specialist.",
      symptomsLabel: "Symptoms or Ailment",
      placeholder: "e.g. Having sharp chest pain when breathing, feeling nauseous for the past 2 days...",
      button: "Find Best Specialist",
      analyzing: "Analyzing Symptoms..."
    },
    steps: {
      step1: "Symptom Check",
      step2: "Specialist Match",
      step3: "Booking",
      step4: "Done"
    },
    matching: {
      aiRecommendation: "AI Recommendation",
      urgency: "Urgency",
      availableDoctors: "Available Doctors Near You",
      exp: "years exp",
      availableOn: "Available",
      changeSymptoms: "← Change Symptoms"
    },
    booking: {
      scheduleTitle: "Schedule with",
      dateLabel: "Preferred Date",
      slotLabel: "Available Slot",
      selectTime: "Select Time",
      remindersTitle: "Smart Reminders",
      remindersText: "We'll automatically set reminders via SMS & Email. You'll be notified 2 hours before the appointment with live traffic updates.",
      back: "Back",
      confirm: "Confirm Appointment",
      finalizing: "Analyzing Traffic & Finalizing..."
    },
    confirmation: {
      title: "Appointment Confirmed!",
      reference: "Your booking reference:",
      doctorLabel: "Doctor",
      dateTimeLabel: "Date & Time",
      locationLabel: "Location",
      gettingThere: "Getting There",
      liveTraffic: "LIVE TRAFFIC STATUS",
      sourcesLabel: "Sources & Live Links",
      newInquiry: "Start New Inquiry"
    }
  },
  ms: {
    navbar: {
      hospitals: "Hospital",
      specialists: "Pakar",
      emergency: "Kecemasan",
      profile: "Profil Saya"
    },
    hero: {
      title: "Apa khabar anda hari ini?",
      subtitle: "Terangkan simptom anda dan AI kami akan memadankan anda dengan pakar Malaysia yang sesuai.",
      symptomsLabel: "Simptom atau Penyakit",
      placeholder: "cth. Sakit dada tajam semasa bernafas, berasa mual sejak 2 hari lalu...",
      button: "Cari Pakar Terbaik",
      analyzing: "Menganalisis Simptom..."
    },
    steps: {
      step1: "Semak Simptom",
      step2: "Padanan Pakar",
      step3: "Tempahan",
      step4: "Selesai"
    },
    matching: {
      aiRecommendation: "Cadangan AI",
      urgency: "Tahap Kecemasan",
      availableDoctors: "Doktor Tersedia Berdekatan Anda",
      exp: "tahun pengalaman",
      availableOn: "Tersedia",
      changeSymptoms: "← Tukar Simptom"
    },
    booking: {
      scheduleTitle: "Jadualkan dengan",
      dateLabel: "Tarikh Pilihan",
      slotLabel: "Slot Tersedia",
      selectTime: "Pilih Masa",
      remindersTitle: "Peringatan Pintar",
      remindersText: "Kami akan menetapkan peringatan secara automatik melalui SMS & E-mel. Anda akan dimaklumkan 2 jam sebelum janji temu dengan kemas kini trafik langsung.",
      back: "Kembali",
      confirm: "Sahkan Janji Temu",
      finalizing: "Menganalisis Trafik & Menyiapkan..."
    },
    confirmation: {
      title: "Janji Temu Disahkan!",
      reference: "Rujukan tempahan anda:",
      doctorLabel: "Doktor",
      dateTimeLabel: "Tarikh & Masa",
      locationLabel: "Lokasi",
      gettingThere: "Panduan ke Sana",
      liveTraffic: "STATUS TRAFIK LANGSUNG",
      sourcesLabel: "Sumber & Pautan Langsung",
      newInquiry: "Mulakan Pertanyaan Baru"
    }
  },
  zh: {
    navbar: {
      hospitals: "医院",
      specialists: "专科医生",
      emergency: "急诊",
      profile: "我的个人资料"
    },
    hero: {
      title: "你今天感觉怎么样？",
      subtitle: "描述您的症状，我们的人工智能将为您匹配合适的马来西亚专科医生。",
      symptomsLabel: "症状或疾病",
      placeholder: "例如：呼吸时感到剧烈胸痛，过去两天感到恶心...",
      button: "寻找最佳专家",
      analyzing: "正在分析症状..."
    },
    steps: {
      step1: "症状检查",
      step2: "专家匹配",
      step3: "预约",
      step4: "完成"
    },
    matching: {
      aiRecommendation: "AI 推荐",
      urgency: "紧急程度",
      availableDoctors: "您附近的可用医生",
      exp: "年经验",
      availableOn: "在职",
      changeSymptoms: "← 更改症状"
    },
    booking: {
      scheduleTitle: "预约医生：",
      dateLabel: "首选日期",
      slotLabel: "可用时段",
      selectTime: "选择时间",
      remindersTitle: "智能提醒",
      remindersText: "我们将通过短信和电子邮件自动设置提醒。您将在预约前 2 小时收到实时交通更新通知。",
      back: "返回",
      confirm: "确认预约",
      finalizing: "正在分析交通并完成预约..."
    },
    confirmation: {
      title: "预约已确认！",
      reference: "您的预约参考号：",
      doctorLabel: "医生",
      dateTimeLabel: "日期和时间",
      locationLabel: "地点",
      gettingThere: "交通指南",
      liveTraffic: "实时交通状态",
      sourcesLabel: "来源和实时链接",
      newInquiry: "开始新的咨询"
    }
  },
  ta: {
    navbar: {
      hospitals: "மருத்துவமனைகள்",
      specialists: "நிபுணர்கள்",
      emergency: "அவசரம்",
      profile: "எனது விவரக்குறிப்பு"
    },
    hero: {
      title: "இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?",
      subtitle: "உங்கள் அறிகுறிகளை விவரிக்கவும், எங்கள் AI உங்களை சரியான மலேசிய நிபுணருடன் இணைக்கும்.",
      symptomsLabel: "அறிகுறிகள் அல்லது நோய்",
      placeholder: "உதாரணம்: சுவாசிக்கும்போது நெஞ்சு வலி, கடந்த 2 நாட்களாக குமட்டல்...",
      button: "சிறந்த நிபுணரைக் கண்டறியவும்",
      analyzing: "அறிகுறிகள் பகுப்பாய்வு செய்யப்படுகின்றன..."
    },
    steps: {
      step1: "அறிகுறி சரிபார்ப்பு",
      step2: "நிபுணர் பொருத்தம்",
      step3: "முன்பதிவு",
      step4: "முடிந்தது"
    },
    matching: {
      aiRecommendation: "AI பரிந்துரை",
      urgency: "அவசரம்",
      availableDoctors: "உங்களுக்கு அருகிலுள்ள மருத்துவர்கள்",
      exp: "ஆண்டுகள் அனுபவம்",
      availableOn: "கிடைக்கும்",
      changeSymptoms: "← அறிகுறிகளை மாற்றவும்"
    },
    booking: {
      scheduleTitle: "இவருடன் முன்பதிவு செய்யுங்கள்:",
      dateLabel: "விருப்பமான தேதி",
      slotLabel: "கிடைக்கும் நேரம்",
      selectTime: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
      remindersTitle: "புத்திசாலித்தனமான நினைவூட்டல்கள்",
      remindersText: "SMS மற்றும் மின்னஞ்சல் மூலம் நினைவூட்டல்களை தானாகவே அமைப்போம். நேரடி போக்குவரத்து தகவல்களுடன் சந்திப்பிற்கு 2 மணிநேரத்திற்கு முன்பே உங்களுக்கு அறிவிக்கப்படும்.",
      back: "பின்னால்",
      confirm: "சந்திப்பை உறுதிப்படுத்தவும்",
      finalizing: "போக்குவரத்தைப் பகுப்பாய்வு செய்து உறுதிப்படுத்துகிறோம்..."
    },
    confirmation: {
      title: "சந்திப்பு உறுதி செய்யப்பட்டது!",
      reference: "உங்கள் முன்பதிவு எண்:",
      doctorLabel: "மருத்துவர்",
      dateTimeLabel: "தேதி மற்றும் நேரம்",
      locationLabel: "இடம்",
      gettingThere: "அங்கு செல்வது எப்படி",
      liveTraffic: "நேரடி போக்குவரத்து நிலை",
      sourcesLabel: "ஆதாரங்கள் மற்றும் இணைப்புகள்",
      newInquiry: "புதிய விசாரணையைத் தொடங்கவும்"
    }
  }
};
