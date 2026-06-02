import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { Member, CommitteeMember, EventLog, NewsLog, DonationLog, Volunteer, GalleryItem } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Set up __dirname and __filename in ES Module environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB Path
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directories and files exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper to load/save JSON DB
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    // Generate beautiful Seed Data
    const seed = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, resetting to seed data', err);
    const seed = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Seed Data Generator
function generateSeedData() {
  const committee: CommitteeMember[] = [
    // Executive Committee
    {
      id: "C-001",
      name: "Dr. Md. Ashraful Islam",
      nameBn: "ডাঃ মোঃ আশরাফুল ইসলাম",
      designation: "President",
      designationBn: "সভাপতি",
      phone: "+8801711223344",
      email: "president@baliakandisociety.org",
      village: "Baliakandi Sadar",
      villageBn: "বালিয়াকান্দি সদর",
      presentAddress: "Dhanmondi, Dhaka",
      presentAddressBn: "ধানমন্ডি, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
      sortOrder: 1,
      type: "Executive"
    },
    {
      id: "C-002",
      name: "Al-Haj Engr. Shafiqul Rahman",
      nameBn: "আলহাজ্ব ইঞ্জিনিয়ার শফিকুল রহমান",
      designation: "General Secretary",
      designationBn: "সাধারণ সম্পাদক",
      phone: "+8801811556677",
      email: "gs@baliakandisociety.org",
      village: "Baharpur",
      villageBn: "বহরপুর ইউনিয়ন",
      presentAddress: "Uttara, Dhaka",
      presentAddressBn: "উত্তরা, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      sortOrder: 2,
      type: "Executive"
    },
    {
      id: "C-003",
      name: "Advocate Mustafizur Rahman",
      nameBn: "এডভোকেট মুস্তাফিজুর রহমান",
      designation: "Vice President",
      designationBn: "সহ-সভাপতি",
      phone: "+8801911334455",
      email: "vp@baliakandisociety.org",
      village: "Jamalpur",
      villageBn: "জামালপুর ইউনিয়ন",
      presentAddress: "Mirpur, Dhaka",
      presentAddressBn: "মিরপুর, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      sortOrder: 3,
      type: "Executive"
    },
    {
      id: "C-004",
      name: "Md. Kamrul Islam, FCA",
      nameBn: "মোঃ কামরুল ইসলাম, এফসিএ",
      designation: "Treasurer",
      designationBn: "অর্থ সম্পাদক",
      phone: "+8801511667788",
      email: "treasurer@baliakandisociety.org",
      village: "Nawabpur",
      villageBn: "নবাবপুর ইউনিয়ন",
      presentAddress: "Gulshan, Dhaka",
      presentAddressBn: "গুলশান, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      sortOrder: 4,
      type: "Executive"
    },
    {
      id: "C-005",
      name: "Md. Farooq Hossain",
      nameBn: "মোঃ ফারুক হোসেন",
      designation: "Joint General Secretary",
      designationBn: "যুগ্ম সাধারণ সম্পাদক",
      village: "Narua",
      villageBn: "নারুয়া ইউনিয়ন",
      presentAddress: "Banani, Dhaka",
      presentAddressBn: "বনানী, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
      sortOrder: 5,
      type: "Executive"
    },
    {
      id: "C-006",
      name: "Md. Mofizuddin Khan",
      nameBn: "মোঃ মফিজুদ্দিন খান",
      designation: "Organizing Secretary",
      designationBn: "সাংগঠনিক সম্পাদক",
      village: "Narua",
      villageBn: "নারুয়া ইউনিয়ন",
      presentAddress: "Basundhara, Dhaka",
      presentAddressBn: "বসুন্ধরা, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&auto=format&fit=crop&q=80",
      sortOrder: 6,
      type: "Executive"
    },
    {
      id: "C-007",
      name: "Tariqul Islam",
      nameBn: "তরিকুল ইসলাম",
      designation: "Publicity Secretary",
      designationBn: "প্রচার ও প্রকাশনা সম্পাদক",
      village: "Islampur",
      villageBn: "ইসলামপুর ইউনিয়ন",
      presentAddress: "Mohammadpur, Dhaka",
      presentAddressBn: "মোহাম্মদপুর, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80",
      sortOrder: 7,
      type: "Executive"
    },
    {
      id: "C-008",
      name: "Dr. Farhana Yasmin",
      nameBn: "ডাঃ ফারহানা ইয়াসমিন",
      designation: "Women's Welfare Secretary",
      designationBn: "মহিলা ও শিশু কল্যাণ সম্পাদক",
      village: "Jamalpur",
      villageBn: "জামালপুর ইউনিয়ন",
      presentAddress: "Baridhara, Dhaka",
      presentAddressBn: "বারিধারা, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      sortOrder: 8,
      type: "Executive"
    },
    {
      id: "C-009",
      name: "Md. Aminul Haq",
      nameBn: "মোঃ আমিনুল হক",
      designation: "Social Welfare Secretary",
      designationBn: "সমাজকল্যাণ ও দূর্যোগ ব্যবস্থাপনা সম্পাদক",
      village: "Jangal",
      villageBn: "জঙ্গল ইউনিয়ন",
      presentAddress: "Jatrabari, Dhaka",
      presentAddressBn: "যাত্রাবাড়ী, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&auto=format&fit=crop&q=80",
      sortOrder: 9,
      type: "Executive"
    },
    // Advisory Committee
    {
      id: "A-001",
      name: "Al-Haj Md. Abdul Wahab",
      nameBn: "আলহাজ্ব মোঃ আব্দুল ওয়াহাব",
      designation: "Chief Adviser (Retd. Secretary)",
      designationBn: "প্রধান উপদেষ্টা (অবসরপ্রাপ্ত সচিব)",
      village: "Jangal",
      villageBn: "জঙ্গল ইউনিয়ন",
      presentAddress: "Gulshan, Dhaka",
      presentAddressBn: "গুলশান, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&auto=format&fit=crop&q=80",
      sortOrder: 1,
      type: "Advisory"
    },
    {
      id: "A-002",
      name: "Prof. Dr. Abu Bakar Siddique",
      nameBn: "অধ্যাপক ডাঃ আবু বকর সিদ্দিক",
      designation: "Adviser (Ex-VC)",
      designationBn: "উপদেষ্টা (সাবেক ভিসি)",
      village: "Baliakandi Sadar",
      villageBn: "বালিয়াকান্দি সদর",
      presentAddress: "Dhanmondi, Dhaka",
      presentAddressBn: "ধানমন্ডি, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
      sortOrder: 2,
      type: "Advisory"
    },
    {
      id: "A-003",
      name: "Begum Rokeya",
      nameBn: "বেগম রোকেয়া",
      designation: "Adviser",
      designationBn: "উপদেষ্টা (সমাজসেবক)",
      village: "Baharpur",
      villageBn: "বহরপুর ইউনিয়ন",
      presentAddress: "Banani, Dhaka",
      presentAddressBn: "বনানী, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      sortOrder: 3,
      type: "Advisory"
    },
    {
      id: "A-004",
      name: "Al-Haj Md. Yunus Ali",
      nameBn: "আলহাজ্ব মোঃ ইউনুস আলী",
      designation: "Adviser (Industrialist)",
      designationBn: "উপদেষ্টা (বিশিষ্ট শিল্পপতি)",
      village: "Islampur",
      villageBn: "ইসলামপুর ইউনিয়ন",
      presentAddress: "Baridhara, Dhaka",
      presentAddressBn: "বারিধারা, ঢাকা",
      photoUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&auto=format&fit=crop&q=80",
      sortOrder: 4,
      type: "Advisory"
    }
  ];

  const members: Member[] = [
    {
      id: "BUSD-2026-0001",
      name: "Md. Tanvir Rahman",
      nameBn: "মোঃ তানভীর রহমান",
      fatherName: "Md. Aminul Islam",
      fatherNameBn: "মোঃ আমিনুল ইসলাম",
      motherName: "Salma Begum",
      motherNameBn: "সালমা বেগম",
      phone: "+8801700112233",
      email: "tanvir@gmail.com",
      category: "Life",
      union: "Baharpur",
      village: "Baharpur Bazar",
      villageBn: "বহরপুর বাজার",
      presentAddress: "Mirpur-10, Dhaka",
      presentAddressBn: "মিরপুর-১০, ঢাকা",
      permanentAddress: "Vill: Baharpur, Upazila: Baliakandi, Rajbari",
      permanentAddressBn: "গ্রাম: বহরপুর, উপজেলা: বালিয়াকান্দি, রাজবাড়ী",
      occupation: "Software Engineer",
      occupationBn: "সফটওয়্যার প্রকৌশলী",
      workplace: "Tech Solutions Ltd",
      workplaceBn: "টেক সলিউশন্স লিমিটেড",
      profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
      status: "Approved",
      bio: "Proud to be a resident of Baliakandi, working as a developer in Dhaka.",
      bioBn: "বালিয়াকান্দির সন্তান হিসেবে ঢাকায় সফটওয়্যার ডেভেলপমেন্টে রত আছি। সমিতির প্রগতি কামনা করি।",
      registeredAt: "2026-01-10T10:30:00Z",
      approvedAt: "2026-01-12T15:00:00Z",
      bloodGroup: "A+"
    },
    {
      id: "BUSD-2026-0002",
      name: "Dr. Sabiha Tasnim",
      nameBn: "ডাঃ সাবিহা তাসনিম",
      fatherName: "Md. Abdul Latif",
      fatherNameBn: "মোঃ আব্দুল লতিফ",
      motherName: "Rahima Khatun",
      motherNameBn: "রাহিমা খাতুন",
      phone: "+8801800112244",
      email: "sabiha@doctor.com",
      category: "Donor",
      union: "Baliakandi Sadar",
      village: "Sadar Hospital Road",
      villageBn: "সদর হাসপাতাল রোড",
      presentAddress: "Dhanmondi, Dhaka",
      presentAddressBn: "ধানমন্ডি, ঢাকা",
      permanentAddress: "Vill: Sadar, Upazila: Baliakandi, Rajbari",
      permanentAddressBn: "গ্রাম: সদর বালিয়াকান্দি, উপজেলা: বালিয়াকান্দি, রাজবাড়ী",
      occupation: "Medical Officer",
      occupationBn: "মেডিকেল অফিসার",
      workplace: "Birdem Hospital",
      workplaceBn: "বারডেম হাসপাতাল",
      profilePhoto: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=300&auto=format&fit=crop&q=80",
      status: "Approved",
      bio: "Dedicated to providing health camps in Baliakandi Upazila.",
      bioBn: "বালিয়াকান্দি সমিতির সকল চিকিৎসা ক্যাম্পে সহযোগিতা করতে আমি আনন্দিত।",
      registeredAt: "2026-01-15T08:22:00Z",
      approvedAt: "2026-01-18T12:45:00Z",
      bloodGroup: "O+"
    },
    {
      id: "BUSD-2026-0003",
      name: "Mohammad Rashedul Alom",
      nameBn: "মোহাম্মদ রাশেদুল আলম",
      fatherName: "Haji Nurul Alom",
      fatherNameBn: "হাজী নুরুল আলম",
      motherName: "Fatema Begum",
      motherNameBn: "ফাতেমা বেগম",
      phone: "+8801912998877",
      email: "rashed@merchant.com",
      category: "General",
      union: "Jamalpur",
      village: "Khola Baria",
      villageBn: "খোলাবাড়িয়া",
      presentAddress: "Kawran Bazar, Dhaka",
      presentAddressBn: "কাওরান বাজার, ঢাকা",
      permanentAddress: "Vill: Khola Baria, PO: Jamalpur, Baliakandi, Rajbari",
      permanentAddressBn: "গ্রাম: খোলাবাড়িয়া, ডাকঘর: জামালপুর, বালিয়াকান্দি, রাজবাড়ী",
      occupation: "Exporter",
      occupationBn: "রপ্তানিকারক ব্যবসায়ী",
      workplace: "Alom Exports",
      workplaceBn: "আলম এক্সপোর্টস",
      profilePhoto: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=300&auto=format&fit=crop&q=80",
      status: "Approved",
      registeredAt: "2026-02-01T14:10:00Z",
      approvedAt: "2026-02-05T09:00:00Z",
      bloodGroup: "B+"
    }
  ];

  const events: EventLog[] = [
    {
      id: "E-001",
      title: "Annual General Meeting (AGM) & Cultural Festival 2026",
      titleBn: "বার্ষিক সাধারণ সভা ও সাংস্কৃতিক উৎসব ২০২৬",
      date: "2026-07-20",
      time: "10:00 AM - 08:00 PM",
      timeBn: "সকাল ১০:০০ টা - রাত ০৮:০০ টা",
      venue: "Institution of Engineers, Bangladesh (IEB) Hall, Ramna, Dhaka",
      venueBn: "রমনা ইঞ্জিনিয়ার্স ইনস্টিটিউশন হলরুম, ঢাকা",
      description: "We are delighted to bring together all the residents of Baliakandi living in Dhaka under one roof. The event features interactive town halls, student reward distributions, traditional lunch, and local Baul performances from Rajbari.",
      descriptionBn: "ঢাকায় বসবাসরত বালিয়াকান্দিবাসীদের সর্ববৃহৎ মিলনমেলা। এই আয়োজনে রয়েছে বার্ষিক পর্যালোচনা, কৃতি শিক্ষার্থীদের সংবর্ধনা ও রাজবাড়ীর ঐতিহ্যবাহী শিল্পীদের নিয়ে মনোজ্ঞ বাউল সঙ্গীতানুষ্ঠান ও মধাহ্নভোজ।",
      fee: 1000,
      bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80",
      status: "Upcoming",
      attendeesCount: 145,
      attendees: ["tanvir@gmail.com", "sabiha@doctor.com", "rashed@merchant.com"]
    },
    {
      id: "E-002",
      title: "Free Eye Care Clinic & Health Shield 2026",
      titleBn: "বিনামূল্যে চক্ষু চিকিৎসা ক্যাম্প ও হেলথ শিল্ড ২০২৬",
      date: "2026-06-25",
      time: "09:00 AM - 05:00 PM",
      timeBn: "সকাল ০৯:০০ টা - বিকাল ০৫:০০ টা",
      venue: "Baliakandi Government Pilot High School Premises, Rajbari",
      venueBn: "বালিয়াকান্দি সরকারি পাইলট উচ্চ বিদ্যালয় প্রাঙ্গণ, রাজবাড়ী",
      description: "Our committee team of senior doctors from Dhaka DMCH & BSMMU are traveling back to our local village roots to hold a mega free eye surgery consultation, medicine distribution, and diabetes screenings for needy people.",
      descriptionBn: "ঢাকা মেডিকেল কলেজ ও পিজি হাসপাতালের অভিজ্ঞ চিকিৎসকদের অধীনে আমাদের জন্মভূমি বালিয়াকান্দিতে বিনামূল্যে চক্ষু ছানি অপারেশন, চোখের পাওয়ার পরীক্ষা ও বিনামূল্যে হৃদরোগ/ডায়াবেটিস পরীক্ষা ও ঔষুধ বিতরণ ক্যাম্প।",
      fee: 0,
      bannerUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&auto=format&fit=crop&q=80",
      status: "Upcoming",
      attendeesCount: 312,
      attendees: ["sabiha@doctor.com"]
    },
    {
      id: "E-003",
      title: "Merit Student Scholarship Distribution 2025",
      titleBn: "মেধাবী শিক্ষার্থীদের বৃত্তি ও শিক্ষা উপকরণ বিতরণ উৎসব ২০২৫",
      date: "2025-11-15",
      time: "11:00 AM",
      timeBn: "সকাল ১১:০০ টা",
      venue: "Upazila Auditorium, Baliakandi, Rajbari",
      venueBn: "উপজেলা অডিটোরিয়াম, বালিয়াকান্দি, রাজবাড়ী",
      description: "Distribution of stipend money, textbooks, and computer equipment to top performing SSC and HSC students of families in distress in Narua and Baharpur unions.",
      descriptionBn: "বালিয়াকান্দি উপজেলার বিভিন্ন ইউনিয়নের শীতার্ত ও দরিদ্র পরিবারের কৃতি এসএসসি ও এইচএসসি শিক্ষার্থীদের মাঝে ক্যরিয়ার কাউন্সেলিং, আর্থিক শিক্ষাবৃত্তি ও ল্যাপটপ-কম্পিউটার বিতরণ কর্মসূচী সম্পন্ন।",
      fee: 0,
      bannerUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80",
      status: "Past",
      attendeesCount: 420,
      attendees: []
    }
  ];

  const news: NewsLog[] = [
    {
      id: "N-001",
      title: "Annual General Assembly Registration Form is Officially Open!",
      titleBn: "বাৎসরিক সাধারণ সভা ও পুনর্মিলনীর নিবন্ধন উন্মুক্ত করা হয়েছে!",
      date: "2026-05-28",
      category: "Notice",
      categoryBn: "বিজ্ঞপ্তি",
      summary: "Register online via member portal for the grand gala reunion on July 20. Tickets available until July 10.",
      summaryBn: "আগামী ২০ জুলাই ২০২৬ তারিখে অনুষ্ঠিতব্য মহতী পুনর্মিলনী উৎসবের অনলাইন বুথ এবং রেজিস্ট্রেশন সুবিধা এখন মেম্বার পোর্টালে লাইভ।",
      details: "Members can easily pay the subscription fee of BDT 1,000 online using bKash, Nagad, or credit card and download their automatic RSVP digital ticket with a secure gate pass QR code. Contact Office Secretary for any manual cash collections.",
      detailsBn: "সকল সাধারণ, দাতা ও আজীবন সদস্যদের মেম্বার পোর্টাল থেকে অনলাইন ফি পরিশোধের মাধ্যমে বুকিং সম্পন্ন করার সুযোগ দেয়া হয়েছে। পেমেন্ট শেষ হলে মুহূর্তেই ডিজিটাল গেট পাস কিউআর কোড যুক্ত ইনভাইট ডাউনলোড করতে পারবেন।",
      isFeatured: true,
      pdfUrl: "#"
    },
    {
      id: "N-002",
      title: "Merit Scholarship and Welfare Application 2026 Guidelines",
      titleBn: "কৃতি শিক্ষার্থীদের কল্যাণে মেধাবৃত্তি কার্যক্রম ২০২৬ নীতিমালা",
      date: "2026-05-15",
      category: "Scholarship",
      categoryBn: "মেধাবৃত্তি ও অনুদান",
      summary: "Applications are invited from resident students of Baliakandi studying in public universities or target colleges.",
      summaryBn: "বালিয়াকান্দি উপজেলার স্থায়ী বাসিন্দা ও বিভিন্ন ঢাকা বিশ্ববিদ্যালয়/মেডিকেল/বুয়েট পড়ুয়া অস্বচ্ছল শিক্ষার্থীদের জন্য সমিতির মেধাবৃত্তি আবেদন পত্র আহ্বান।",
      details: "The Welfare Committee is offering 50 high-value monthly stipends to rural students who achieved distinction in HSC. Apply online or download the PDF application guidelines.",
      detailsBn: "বছরের বিশেষ উচ্চশিক্ষা তহবিল থেকে মেধাবী ও গরিব শিক্ষার্থীদের জন্য এই বৃত্তির ব্যবস্থা করা হয়েছে। আবেদনপত্রের শর্তাবলী এবং তথ্যের জন্য বিস্তারিত ফাইল ডাউনলোড করুন বা অফিসে ফরম জমা দিন।",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
      id: "N-003",
      title: "Warm Blanket and Relief Materials Distribution Project",
      titleBn: "উপজেলার প্রত্যন্ত চরাঞ্চলে শীতবস্ত্র ও কম্বল বিতরণ কর্মসূচী সম্পন্ন",
      date: "2026-01-20",
      category: "EventReport",
      categoryBn: "কার্যক্রম রিপোর্ট",
      summary: "Over 2,000 soft blankets and medical emergency aid kits distributed in Nawabpur, Narua and Jangle",
      summaryBn: "উপজেলা সমিতির সমাজকল্যাণ তহবিলের মাধ্যমে নবাবপুর, নারুয়া ও জঙ্গল ইউনিয়নের নদী ভাঙন চরাঞ্চলে কম্বল ও জরুরী ঔষধ বিতরণ সম্পন্ন হয়েছে।",
      details: "Our Executive Committee volunteers traveled directly to remote riverbank areas of Padma and distributed emergency supplies. We express deep gratitude to our donor members for their prompt financial contributions.",
      detailsBn: "আমাদের সভাপতি মহোদয় ও সাধারণ সম্পাদকের উপস্থিতিতে জঙ্গল ও নারুয়া চরে স্বশরীরে গিয়ে ২,০০০ শীতার্ত মানুষের মাঝে সাহায্য বিতরণ নিশ্চিত করা হয়েছে। তহবিল প্রদানকারী সকল আজীবন সদস্যদের অনেক ধন্যবাদ।",
      isFeatured: false
    }
  ];

  const donations: DonationLog[] = [
    {
      id: "D-001",
      name: "Dr. Md. Ashraful Islam",
      phone: "+8801711223344",
      email: "president@baliakandisociety.org",
      amount: 100000,
      paymentMethod: "Bank",
      date: "2026-05-01",
      isAnonymous: false,
      message: "Contributing for the high school student scholarship fund."
    },
    {
      id: "D-002",
      name: "Al-Haj Engr. Shafiqul Rahman",
      phone: "+8801811556677",
      email: "gs@baliakandisociety.org",
      amount: 50000,
      paymentMethod: "Bank",
      date: "2026-05-02",
      isAnonymous: false,
      message: "For medical camp medicine supplies."
    },
    {
      id: "D-003",
      name: "S. K. Chowdhury (Adviser)",
      phone: "01720202020",
      email: "skc@gmail.com",
      amount: 75000,
      paymentMethod: "Bank",
      date: "2026-05-10",
      isAnonymous: false,
      message: "In memory of my late father, for social welfare."
    },
    {
      id: "D-004",
      name: "A Generous Wellwisher",
      phone: "+8801700000000",
      email: "anonymous@donor.org",
      amount: 25000,
      paymentMethod: "bKash",
      date: "2026-05-25",
      isAnonymous: true,
      message: "May Allah bless the operations of Baliakandi Upazila Samiti."
    }
  ];

  const volunteers: Volunteer[] = [
    {
      id: "V-001",
      name: "Arifur Rahman",
      nameBn: "আরিফুর রহমান",
      phone: "01822334411",
      email: "arif@gmail.com",
      skills: ["Event Management", "First Aid Support"],
      message: "Eager to help in the upcoming Free Medical Clinic in Baliakandi Sadar.",
      status: "Accepted",
      registeredAt: "2026-05-15T09:00:00Z"
    }
  ];

  const gallery: GalleryItem[] = [
    {
      id: "G-001",
      title: "Welfare Relief Distribution 2025",
      titleBn: "পণ্য ও খাদ্য বিতরণ কর্মসূচী ২৫",
      type: "photo",
      url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80",
      category: "Social Welfare",
      categoryBn: "সমাজকল্যাণ",
      date: "2025-10-12"
    },
    {
      id: "G-002",
      title: "Annual Cultural Get-Together Photo",
      titleBn: "বার্ষিক গুণীজন সংবর্ধনা অনুষ্ঠান",
      type: "photo",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
      category: "Reunion Event",
      categoryBn: "পুনর্মিলনী",
      date: "2025-08-04"
    },
    {
      id: "G-003",
      title: "Baliakandi Upazila Aerial View Landscape",
      titleBn: "বালিয়াকান্দি উপজিলা মনোরম দৃশ্য",
      type: "photo",
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
      category: "Upazila Landscape",
      categoryBn: "উপজেলা ল্যান্ডস্কেপ",
      date: "2025-05-01"
    },
    {
      id: "G-004",
      title: "Inaugural Speech of President at AGM",
      titleBn: "বার্ষিক সম্মেলনে সভাপতির উদ্বোধনী ভাষণ",
      type: "photo",
      url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
      category: "AGM Sessions",
      categoryBn: "বার্ষিক সম্মেলন",
      date: "2025-08-03"
    },
    {
      id: "G-005",
      title: "BUSD Medical Camp YouTube Showcase",
      titleBn: "সমিতির ফ্রী মেডিকেল চিকিৎসা প্রামাণ্যচিত্র",
      type: "video",
      url: "dQw4w9WgXcQ", // Rickroll as a fallback or mock youtube ID
      category: "Documentary",
      categoryBn: "প্রামাণ্যচিত্র",
      date: "2025-11-20"
    }
  ];

  const auditLogs = [
    { id: "L-001", message: "System initialized with primary seed data", timestamp: "2026-06-02T12:00:00Z" }
  ];

  return {
    committee,
    members,
    events,
    news,
    donations,
    volunteers,
    gallery,
    auditLogs
  };
}

// API Routes
app.get('/api/public-data', (req, res) => {
  const db = readDB();
  res.json({
    committee: db.committee,
    events: db.events,
    news: db.news,
    donations: db.donations,
    gallery: db.gallery
  });
});

// GET APPROVED MEMBERS FOR DIRECTORY SEARCH
app.get('/api/members', (req, res) => {
  const db = readDB();
  const approvedMembers = db.members.filter((m: Member) => m.status === 'Approved');
  res.json(approvedMembers);
});

// SUBMIT MEMBER REGISTRATION
app.post('/api/register', (req, res) => {
  try {
    const db = readDB();
    const newMemberData = req.body;

    if (!newMemberData.email || !newMemberData.phone || !newMemberData.password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check duplicate
    const exists = db.members.some((m: Member) => m.email.toLowerCase() === newMemberData.email.toLowerCase() || m.phone === newMemberData.phone);
    if (exists) {
      return res.status(400).json({ error: "A member with this email or phone number already exists" });
    }

    const newMember: Member = {
      id: `PEND-${Date.now().toString().slice(-6)}`, // Temporary ID
      name: newMemberData.name || "Unknown Member",
      nameBn: newMemberData.nameBn || newMemberData.name || "অজ্ঞাত সদস্য",
      fatherName: newMemberData.fatherName || "",
      fatherNameBn: newMemberData.fatherNameBn || "",
      motherName: newMemberData.motherName || "",
      motherNameBn: newMemberData.motherNameBn || "",
      phone: newMemberData.phone,
      email: newMemberData.email.toLowerCase(),
      category: newMemberData.category || "General",
      union: newMemberData.union || "Baliakandi Sadar",
      village: newMemberData.village || "",
      villageBn: newMemberData.villageBn || "",
      presentAddress: newMemberData.presentAddress || "",
      presentAddressBn: newMemberData.presentAddressBn || "",
      permanentAddress: newMemberData.permanentAddress || "",
      permanentAddressBn: newMemberData.permanentAddressBn || "",
      occupation: newMemberData.occupation || "",
      occupationBn: newMemberData.occupationBn || "",
      workplace: newMemberData.workplace || "",
      workplaceBn: newMemberData.workplaceBn || "",
      profilePhoto: newMemberData.profilePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80", // Default avatar
      status: "Pending",
      bio: newMemberData.bio || "",
      bioBn: newMemberData.bioBn || "",
      registeredAt: new Date().toISOString(),
      bloodGroup: newMemberData.bloodGroup || "",
      fbProfile: newMemberData.fbProfile || ""
    };

    // Store password (normally hashed, we store in plain/encoded form since we are in dev mockup sandbox, but let's hash/encode cleanly)
    (newMember as any).passwordEncoded = Buffer.from(newMemberData.password).toString('base64');

    db.members.push(newMember);
    db.auditLogs.unshift({
      id: `L-${Date.now()}`,
      message: `New member registration request submitted from ${newMember.name} (${newMember.phone})`,
      timestamp: new Date().toISOString()
    });

    writeDB(db);

    res.json({ success: true, message: "Registration successful! Placed in dynamic approval queue.", member: newMember });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// MEMBER PROFILE UPDATE (In logged-in dashboard)
app.post('/api/members/update-bio', (req, res) => {
  const { email, bio, bioBn, fbProfile, bloodGroup } = req.body;
  if (!email) return res.status(400).json({ error: "Missing email" });

  const db = readDB();
  const idx = db.members.findIndex((m: Member) => m.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return res.status(404).json({ error: "Member not found" });

  db.members[idx].bio = bio;
  db.members[idx].bioBn = bioBn;
  db.members[idx].fbProfile = fbProfile;
  db.members[idx].bloodGroup = bloodGroup;

  writeDB(db);
  res.json({ success: true, member: db.members[idx] });
});

// LOG IN
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check Admin Login
  if (role === 'admin' || email.toLowerCase() === 'admin@baliakandi.org') {
    if (password === 'admin2026') {
      return res.json({
        success: true,
        user: {
          email: "admin@baliakandi.org",
          name: "Super Administrator",
          role: "admin"
        },
        token: "admin-jwt-simulation-token"
      });
    } else {
      return res.status(401).json({ error: "Invalid Admin Password" });
    }
  }

  // Check Member Login
  const db = readDB();
  const foundMember = db.members.find((m: any) => m.email.toLowerCase() === email.toLowerCase());

  if (!foundMember) {
    return res.status(401).json({ error: "No member found with this email" });
  }

  const encodedProvided = Buffer.from(password).toString('base64');
  const storedPass = foundMember.passwordEncoded || Buffer.from("123456").toString('base64'); // Default 123456 fallback

  if (encodedProvided !== storedPass) {
    return res.status(401).json({ error: "Incorrect password. If this is a new seed member, try '123456'" });
  }

  if (foundMember.status === 'Pending') {
    return res.status(403).json({ error: "Your membership application is currently 'Pending' and awaiting Executive Committee approval." });
  }

  if (foundMember.status === 'Declined') {
    return res.status(403).json({ error: "Your membership application was declined by the committee. Contact support for details." });
  }

  res.json({
    success: true,
    user: {
      email: foundMember.email,
      name: foundMember.name,
      nameBn: foundMember.nameBn,
      id: foundMember.id,
      category: foundMember.category,
      role: "member",
      profilePhoto: foundMember.profilePhoto,
      phone: foundMember.phone,
      union: foundMember.union,
      village: foundMember.village,
      occupation: foundMember.occupation,
      bloodGroup: foundMember.bloodGroup || "",
      bio: foundMember.bio || "",
      bioBn: foundMember.bioBn || "",
      fbProfile: foundMember.fbProfile || ""
    },
    token: `member-token-${foundMember.id}`
  });
});

// SUBMIT VOLUNTEER application
app.post('/api/volunteer', (req, res) => {
  const db = readDB();
  const { name, nameBn, phone, email, skills, message } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "Name, phone and email are required" });
  }

  const newVol: Volunteer = {
    id: `VOL-${Date.now().toString().slice(-4)}`,
    name,
    nameBn: nameBn || name,
    phone,
    email,
    skills: skills || [],
    message: message || "",
    status: 'Pending',
    registeredAt: new Date().toISOString()
  };

  db.volunteers.push(newVol);
  db.auditLogs.unshift({
    id: `L-${Date.now()}`,
    message: `New volunteer application submitted by ${name} (${phone})`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, volunteer: newVol });
});

// SUBMIT DONATION
app.post('/api/donate', (req, res) => {
  try {
    const db = readDB();
    const { 
      name, phone, email, amount, paymentMethod, isAnonymous, message, referenceNo, trxId,
      gateway, cardLast4, cardBrand, bankName, senderAccount 
    } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid donation amount is required" });
    }

    const tId = trxId || `TXN${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    const newDonation: DonationLog & { gateway?: string; cardLast4?: string; cardBrand?: string; bankName?: string; senderAccount?: string } = {
      id: `DON-${Date.now().toString().slice(-4)}`,
      name: isAnonymous ? "An Anonymous Donor" : (name || "Anonymous"),
      phone: phone || "N/A",
      email: email || "N/A",
      amount: Number(amount),
      paymentMethod: paymentMethod || "bKash",
      date: new Date().toISOString().split('T')[0],
      isAnonymous: !!isAnonymous,
      message,
      referenceNo: referenceNo || "Baliakandi Support Fund",
      trxId: tId,
      gateway: gateway || (paymentMethod === 'Card' ? 'Stripe' : 'SSLCommerz'),
      cardLast4,
      cardBrand,
      bankName,
      senderAccount
    };

    db.donations.unshift(newDonation);
    db.auditLogs.unshift({
      id: `L-${Date.now()}`,
      message: `Donation received: BDT ${newDonation.amount} via ${newDonation.paymentMethod} (TrxID: ${tId}) [Gateway: ${newDonation.gateway}]`,
      timestamp: new Date().toISOString()
    });

    writeDB(db);
    res.json({ success: true, donation: newDonation });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH RECEIPT BY TRXID / EMAIL / PHONE
app.get('/api/receipt/search', (req, res) => {
  try {
    const db = readDB();
    const query = String(req.query.q || '').trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ error: "Search query required" });
    }
    const matches = db.donations.filter((d: any) =>
      (d.trxId && d.trxId.toLowerCase() === query) ||
      (d.phone && d.phone.toLowerCase() === query) ||
      (d.phone && d.phone.replace(/[\s+-]/g, '').includes(query.replace(/[\s+-]/g, ''))) ||
      (d.email && d.email.toLowerCase() === query)
    );
    res.json({ success: true, results: matches });
  } catch (err: any) {
    res.status(550).json({ error: err.message });
  }
});

// EVENT RSVP
app.post('/api/rsvp', (req, res) => {
  const db = readDB();
  const { eventId, email } = req.body;

  if (!eventId || !email) {
    return res.status(400).json({ error: "Event ID and User email are required" });
  }

  const idx = db.events.findIndex((e: EventLog) => e.id === eventId);
  if (idx === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (db.events[idx].attendees.includes(email)) {
    return res.status(400).json({ error: "You are already registered for this event." });
  }

  db.events[idx].attendees.push(email);
  db.events[idx].attendeesCount += 1;

  db.auditLogs.unshift({
    id: `L-${Date.now()}`,
    message: `Attendee ${email} RSVP-ed for Event: ${db.events[idx].title}`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, event: db.events[idx] });
});


// ================ ADMIN ENDPOINTS ================

// ADMIN GET PANEL STATS & LOGS
app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  const totalAmount = db.donations.reduce((acc: number, cur: DonationLog) => acc + cur.amount, 0);
  const pendingMembers = db.members.filter((m: Member) => m.status === 'Pending').length;
  const approvedMembers = db.members.filter((m: Member) => m.status === 'Approved').length;

  res.json({
    totalDonations: totalAmount,
    pendingCount: pendingMembers,
    approvedCount: approvedMembers,
    totalEvents: db.events.length,
    volunteersCount: db.volunteers.length,
    newsCount: db.news.length,
    allMembers: db.members,
    volunteers: db.volunteers,
    auditLogs: db.auditLogs.slice(0, 15) // Top 15 logs
  });
});

// ADMIN MEMBER DECISION (APPROVE or DECLINE)
app.post('/api/admin/member-decision', (req, res) => {
  const db = readDB();
  const { memberId, decision } = req.body; // decision can be 'Approved' or 'Declined'

  if (!memberId || !['Approved', 'Declined'].includes(decision)) {
    return res.status(400).json({ error: "Invalid status or ID" });
  }

  const index = db.members.findIndex((m: Member) => m.id === memberId);
  if (index === -1) {
    return res.status(404).json({ error: "Member application not found" });
  }

  const oldId = db.members[index].id;
  const memberName = db.members[index].name;

  db.members[index].status = decision;
  db.members[index].approvedAt = new Date().toISOString();

  if (decision === 'Approved') {
    // Generate an Official Permanent membership ID card serial number
    const serial = String(db.members.filter((m: Member) => m.status === 'Approved' && m.id.startsWith('BUSD-')).length + 1).padStart(4, '0');
    const currentYear = new Date().getFullYear();
    db.members[index].id = `BUSD-${currentYear}-${serial}`;
  }

  db.auditLogs.unshift({
    id: `L-${Date.now()}`,
    message: `Admin ${decision} member application from ${memberName} (Assigned ID: ${db.members[index].id})`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, member: db.members[index] });
});

// ADMIN ADD NEW NEWS/NOTICE
app.post('/api/admin/news/add', (req, res) => {
  const db = readDB();
  const { title, titleBn, summary, summaryBn, details, detailsBn, category, isFeatured, pdfUrl } = req.body;

  if (!title || !titleBn || !details || !detailsBn) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newPost: NewsLog = {
    id: `N-${Date.now().toString().slice(-4)}`,
    title,
    titleBn,
    date: new Date().toISOString().split('T')[0],
    category: category || "Notice",
    categoryBn: category === "Scholarship" ? "মেধাবৃত্তি" : (category === "EventReport" ? "রিপোর্ট" : "বিজ্ঞপ্তি"),
    summary: summary || details.substring(0, 100) + "...",
    summaryBn: summaryBn || detailsBn.substring(0, 100) + "...",
    details,
    detailsBn,
    pdfUrl,
    isFeatured: !!isFeatured
  };

  db.news.unshift(newPost);
  db.auditLogs.unshift({
    id: `L-${Date.now()}`,
    message: `Admin published new article: "${title}"`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, news: newPost });
});

// ADMIN ADD NEW EVENT
app.post('/api/admin/events/add', (req, res) => {
  const db = readDB();
  const { title, titleBn, date, time, timeBn, venue, venueBn, description, descriptionBn, fee, bannerUrl } = req.body;

  if (!title || !titleBn || !date || !venue || !venueBn) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newEvent: EventLog = {
    id: `E-${Date.now().toString().slice(-4)}`,
    title,
    titleBn,
    date,
    time: time || "10:00 AM",
    timeBn: timeBn || "সকাল ১০:০০ টা",
    venue,
    venueBn,
    description: description || "",
    descriptionBn: descriptionBn || "",
    fee: Number(fee) || 0,
    bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80",
    status: "Upcoming",
    attendeesCount: 0,
    attendees: []
  };

  db.events.unshift(newEvent);
  db.auditLogs.unshift({
    id: `L-${Date.now()}`,
    message: `Admin scheduled new Event: "${title}" for ${date}`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, event: newEvent });
});

// ADMIN ADD GALLERY MEDIA
app.post('/api/admin/gallery/add', (req, res) => {
  const db = readDB();
  const { title, titleBn, type, url, category, categoryBn } = req.body;

  if (!title || !titleBn || !url) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newItem: GalleryItem = {
    id: `G-${Date.now().toString().slice(-4)}`,
    title,
    titleBn,
    type: type || "photo",
    url,
    category: category || "Events",
    categoryBn: categoryBn || "অনুষঙ্গ",
    date: new Date().toISOString().split('T')[0]
  };

  db.gallery.unshift(newItem);
  db.auditLogs.unshift({
    id: `L-${Date.now()}`,
    message: `Admin added a new ${type} upload: "${title}"`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, item: newItem });
});


// ================ VITE & PRODUCTION HANDLERS ================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Baliakandi Upazila Samiti Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
