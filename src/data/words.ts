import { WordPair } from '../types';

export const CATEGORIES = [
  { id: 'Food & Drinks', en: 'Food & Drinks', bn: 'খাবার ও পানীয়' },
  { id: 'Sports', en: 'Sports', bn: 'খেলাধুলা' },
  { id: 'Football Players', en: 'Football Players', bn: 'ফুটবলার' },
  { id: 'Cricket Players', en: 'Cricket Players', bn: 'ক্রিকেটার' },
  { id: 'Celebrities', en: 'Celebrities', bn: 'তারকা ও সেলিব্রিটি' },
  { id: 'Animals', en: 'Animals', bn: 'প্রাণী' },
  { id: 'Household Items', en: 'Household Items', bn: 'গৃহস্থালি সামগ্রী' },
  { id: 'Technology', en: 'Technology', bn: 'প্রযুক্তি' },
  { id: 'Countries & Cities', en: 'Countries & Cities', bn: 'দেশ ও শহর' },
  { id: 'Movies & Characters', en: 'Movies & Characters', bn: 'মুভি ও চরিত্র' },
  { id: 'Professions', en: 'Professions', bn: 'পেশা' },
  { id: 'Vehicles', en: 'Vehicles', bn: 'যানবাহন' },
  { id: 'Nature', en: 'Nature', bn: 'প্রকৃতি' },
  { id: 'General Knowledge', en: 'General Knowledge', bn: 'সাধারণ জ্ঞান' },
];

/** Pseudo-category used to play user-created word pairs online. */
export const CUSTOM_CATEGORY_ID = 'Custom';

export const WORD_PAIRS: WordPair[] = [
  // 1. Food & Drinks
  { id: 'fd_1', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Apple Juice', wordABn: 'আপেল জুস', wordB: 'Wine', wordBBn: 'ওয়াইন', difficulty: 'EASY' },
  { id: 'fd_2', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Coffee', wordABn: 'কফি', wordB: 'Tea', wordBBn: 'চা', difficulty: 'EASY' },
  { id: 'fd_3', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Burger', wordABn: 'বার্গার', wordB: 'Sandwich', wordBBn: 'স্যান্ডউইচ', difficulty: 'EASY' },
  { id: 'fd_4', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Pizza', wordABn: 'পিৎজা', wordB: 'Pasta', wordBBn: 'পাস্তা', difficulty: 'EASY' },
  { id: 'fd_5', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Ice Cream', wordABn: 'আইসক্রিম', wordB: 'Frozen Yogurt', wordBBn: 'ফ্রোজেন দই', difficulty: 'MEDIUM' },
  { id: 'fd_6', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Biryani', wordABn: 'বিরিয়ানি', wordB: 'Tehari', wordBBn: 'তেহারি', difficulty: 'MEDIUM' },
  { id: 'fd_7', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Hot Chocolate', wordABn: 'হট চকোলেট', wordB: 'Mocha', wordBBn: 'মোকা', difficulty: 'HARD' },
  { id: 'fd_8', category: 'Food & Drinks', categoryBn: 'খাবার ও পানীয়', wordA: 'Lemonade', wordABn: 'লেবুর শরবত', wordB: 'Mojito', wordBBn: 'মজিতো', difficulty: 'MEDIUM' },

  // 2. Sports
  { id: 'sp_1', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Football', wordABn: 'ফুটবল', wordB: 'Rugby', wordBBn: 'রাগবি', difficulty: 'EASY' },
  { id: 'sp_2', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Cricket', wordABn: 'ক্রিকেট', wordB: 'Baseball', wordBBn: 'বেসবল', difficulty: 'EASY' },
  { id: 'sp_3', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Tennis', wordABn: 'টেনিস', wordB: 'Badminton', wordBBn: 'ব্যাডমিন্টন', difficulty: 'EASY' },
  { id: 'sp_4', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Table Tennis', wordABn: 'টেবিল টেনিস', wordB: 'Squash', wordBBn: 'স্কোয়াশ', difficulty: 'MEDIUM' },
  { id: 'sp_5', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Basketball', wordABn: 'বাস্কেটবল', wordB: 'Volleyball', wordBBn: 'ভলিবল', difficulty: 'MEDIUM' },
  { id: 'sp_6', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Swimming', wordABn: 'সাঁতার', wordB: 'Diving', wordBBn: 'ডাইভিং', difficulty: 'MEDIUM' },
  { id: 'sp_7', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Formula 1', wordABn: 'ফর্মুলা ওয়ান', wordB: 'MotoGP', wordBBn: 'মটোজিপি', difficulty: 'HARD' },
  { id: 'sp_8', category: 'Sports', categoryBn: 'খেলাধুলা', wordA: 'Boxing', wordABn: 'বক্সিং', wordB: 'Kickboxing', wordBBn: 'কিকবক্সিং', difficulty: 'HARD' },

  // 3. Football Players
  { id: 'fp_1', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Lionel Messi', wordABn: 'লিওনেল মেসি', wordB: 'Cristiano Ronaldo', wordBBn: 'ক্রিশ্চিয়ানো রোনালদো', difficulty: 'EASY' },
  { id: 'fp_2', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Kylian Mbappe', wordABn: 'কিলিয়ান এমবাপ্পে', wordB: 'Erling Haaland', wordBBn: 'আর্লিং হালান্ড', difficulty: 'MEDIUM' },
  { id: 'fp_3', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Neymar Jr', wordABn: 'নেইমার জুনিয়র', wordB: 'Vinicius Jr', wordBBn: 'ভিনিসিয়াস জুনিয়র', difficulty: 'MEDIUM' },
  { id: 'fp_4', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Kevin De Bruyne', wordABn: 'কেভিন ডি ব্রুইনা', wordB: 'Luka Modric', wordBBn: 'লুকা মডরিচ', difficulty: 'HARD' },
  { id: 'fp_5', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Zinedine Zidane', wordABn: 'জিনেদিন জিদান', wordB: 'Ronaldinho', wordBBn: 'রোনালদিনহো', difficulty: 'MEDIUM' },
  { id: 'fp_6', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Thibaut Courtois', wordABn: 'কোর্তোয়া', wordB: 'Alisson Becker', wordBBn: 'অ্যালিসন বেকার', difficulty: 'HARD' },
  { id: 'fp_7', category: 'Football Players', categoryBn: 'ফুটবলার', wordA: 'Robert Lewandowski', wordABn: 'লেভানদোভস্কি', wordB: 'Karim Benzema', wordBBn: 'করিম বেনজেমা', difficulty: 'MEDIUM' },

  // 4. Cricket Players
  { id: 'cp_1', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'Virat Kohli', wordABn: 'বিরাট কোহলি', wordB: 'Babar Azam', wordBBn: 'বাবর আজম', difficulty: 'EASY' },
  { id: 'cp_2', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'Shakib Al Hasan', wordABn: 'সাকিব আল হাসান', wordB: 'Ben Stokes', wordBBn: 'বেন স্টোকস', difficulty: 'MEDIUM' },
  { id: 'cp_3', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'Rohit Sharma', wordABn: 'রোহিত শর্মা', wordB: 'David Warner', wordBBn: 'ডেভিড ওয়ার্নার', difficulty: 'MEDIUM' },
  { id: 'cp_4', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'Jasprit Bumrah', wordABn: 'জসপ্রীত বুমরাহ', wordB: 'Shaheen Afridi', wordBBn: 'শাহীন আফ্রিদি', difficulty: 'MEDIUM' },
  { id: 'cp_5', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'MS Dhoni', wordABn: 'মহেন্দ্র সিং ধোনি', wordB: 'Kumar Sangakkara', wordBBn: 'কুমার সাঙ্গাকারা', difficulty: 'HARD' },
  { id: 'cp_6', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'Mustafizur Rahman', wordABn: 'মুস্তাফিজুর রহমান', wordB: 'Lasith Malinga', wordBBn: 'লাসিথ মালিঙ্গা', difficulty: 'HARD' },
  { id: 'cp_7', category: 'Cricket Players', categoryBn: 'ক্রিকেটার', wordA: 'Kane Williamson', wordABn: 'কেন উইলিয়ামসন', wordB: 'Joe Root', wordBBn: 'জো রুট', difficulty: 'HARD' },

  // 5. Celebrities
  { id: 'cl_1', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Shah Rukh Khan', wordABn: 'শাহরুখ খান', wordB: 'Salman Khan', wordBBn: 'সালমান খান', difficulty: 'EASY' },
  { id: 'cl_2', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Leonardo DiCaprio', wordABn: 'লিওনার্দো ডিক্যাপ্রিও', wordB: 'Brad Pitt', wordBBn: 'ব্র্যাড পিট', difficulty: 'MEDIUM' },
  { id: 'cl_3', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Taylor Swift', wordABn: 'টেইলর সুইফট', wordB: 'Selena Gomez', wordBBn: 'সেলেনা গোমেজ', difficulty: 'EASY' },
  { id: 'cl_4', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Tom Cruise', wordABn: 'টম ক্রুজ', wordB: 'Keanu Reeves', wordBBn: 'কিয়ানু রিভস', difficulty: 'MEDIUM' },
  { id: 'cl_5', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Elon Musk', wordABn: 'ইলন মাস্ক', wordB: 'Mark Zuckerberg', wordBBn: 'মার্ক জুকারবার্গ', difficulty: 'EASY' },
  { id: 'cl_6', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Bill Gates', wordABn: 'বিল গেটস', wordB: 'Steve Jobs', wordBBn: 'স্টিভ জবস', difficulty: 'MEDIUM' },
  { id: 'cl_7', category: 'Celebrities', categoryBn: 'তারকা ও সেলিব্রিটি', wordA: 'Arijit Singh', wordABn: 'অরিজিৎ সিং', wordB: 'Atif Aslam', wordBBn: 'আতিফ আসলাম', difficulty: 'MEDIUM' },

  // 6. Animals
  { id: 'an_1', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Lion', wordABn: 'সিংহ', wordB: 'Tiger', wordBBn: 'বাঘ', difficulty: 'EASY' },
  { id: 'an_2', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Crocodile', wordABn: 'কুমির', wordB: 'Alligator', wordBBn: 'অ্যালিগেটর', difficulty: 'MEDIUM' },
  { id: 'an_3', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Rabbit', wordABn: 'খরগোশ', wordB: 'Hare', wordBBn: 'বুনো খরগোশ', difficulty: 'HARD' },
  { id: 'an_4', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Dolphin', wordABn: 'ডলফিন', wordB: 'Whale', wordBBn: 'তিমি', difficulty: 'EASY' },
  { id: 'an_5', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Leopard', wordABn: 'চিতাবাঘ', wordB: 'Cheetah', wordBBn: 'চিতা', difficulty: 'MEDIUM' },
  { id: 'an_6', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Horse', wordABn: 'ঘোড়া', wordB: 'Zebra', wordBBn: 'জেব্রা', difficulty: 'EASY' },
  { id: 'an_7', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Eagle', wordABn: 'ঈগল', wordB: 'Falcon', wordBBn: 'বাজপাখি', difficulty: 'HARD' },
  { id: 'an_8', category: 'Animals', categoryBn: 'প্রাণী', wordA: 'Frog', wordABn: 'ব্যাঙ', wordB: 'Toad', wordBBn: 'কুনোব্যাঙ', difficulty: 'HARD' },

  // 7. Household Items
  { id: 'hi_1', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Bed', wordABn: 'খাট / বিছানা', wordB: 'Sofa', wordBBn: 'সোফা', difficulty: 'EASY' },
  { id: 'hi_2', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Fan', wordABn: 'ফ্যান', wordB: 'Air Conditioner', wordBBn: 'এয়ার কন্ডিশনার', difficulty: 'EASY' },
  { id: 'hi_3', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Refrigerator', wordABn: 'ফ্রিজ', wordB: 'Freezer', wordBBn: 'ডিপ ফ্রিজ', difficulty: 'MEDIUM' },
  { id: 'hi_4', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Microwave', wordABn: 'মাইক্রোওয়েভ ওভেন', wordB: 'Toaster', wordBBn: 'টোস্টার', difficulty: 'MEDIUM' },
  { id: 'hi_5', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Mirror', wordABn: 'আয়না', wordB: 'Window Glass', wordBBn: 'জানালার কাচ', difficulty: 'MEDIUM' },
  { id: 'hi_6', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Broom', wordABn: 'ঝাড়ু', wordB: 'Vacuum Cleaner', wordBBn: 'ভ্যাকুয়াম ক্লিনার', difficulty: 'MEDIUM' },
  { id: 'hi_7', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Blanket', wordABn: 'কম্বল', wordB: 'Quilt', wordBBn: 'লেপ', difficulty: 'HARD' },
  { id: 'hi_8', category: 'Household Items', categoryBn: 'গৃহস্থালি সামগ্রী', wordA: 'Curtain', wordABn: 'পর্দা', wordB: 'Blinds', wordBBn: 'ব্লাইন্ডস', difficulty: 'HARD' },

  // 8. Technology
  { id: 'tc_1', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Laptop', wordABn: 'ল্যাপটপ', wordB: 'Desktop', wordBBn: 'ডেস্কটপ', difficulty: 'EASY' },
  { id: 'tc_2', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Smartphone', wordABn: 'স্মার্টফোন', wordB: 'Tablet', wordBBn: 'ট্যাবলেট', difficulty: 'EASY' },
  { id: 'tc_3', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Keyboard', wordABn: 'কীবোর্ড', wordB: 'Mouse', wordBBn: 'মাউস', difficulty: 'EASY' },
  { id: 'tc_4', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Earphones', wordABn: 'ইয়ারফোন', wordB: 'Headphones', wordBBn: 'হেডফোন', difficulty: 'MEDIUM' },
  { id: 'tc_5', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Smartwatch', wordABn: 'স্মার্টওয়াচ', wordB: 'Fitness Band', wordBBn: 'ফিটনেস ব্যান্ড', difficulty: 'HARD' },
  { id: 'tc_6', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Wi-Fi', wordABn: 'ওয়াই-ফাই', wordB: 'Mobile Data', wordBBn: 'মোবাইল ডাটা', difficulty: 'MEDIUM' },
  { id: 'tc_7', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'USB Drive', wordABn: 'পেনড্রাইভ', wordB: 'External Hard Drive', wordBBn: 'এক্সটার্নাল হার্ডড্রাইভ', difficulty: 'HARD' },
  { id: 'tc_8', category: 'Technology', categoryBn: 'প্রযুক্তি', wordA: 'Television', wordABn: 'টেলিভিশন', wordB: 'Projector', wordBBn: 'প্রজেক্টর', difficulty: 'MEDIUM' },

  // 9. Countries & Cities
  { id: 'cc_1', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'London', wordABn: 'লন্ডন', wordB: 'Paris', wordBBn: 'প্যারিস', difficulty: 'EASY' },
  { id: 'cc_2', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'Dhaka', wordABn: 'ঢাকা', wordB: 'Chittagong', wordBBn: 'চট্টগ্রাম', difficulty: 'EASY' },
  { id: 'cc_3', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'New York', wordABn: 'নিউইয়র্ক', wordB: 'Los Angeles', wordBBn: 'লস অ্যাঞ্জেলেস', difficulty: 'MEDIUM' },
  { id: 'cc_4', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'Dubai', wordABn: 'দুবাই', wordB: 'Doha', wordBBn: 'দোহা', difficulty: 'MEDIUM' },
  { id: 'cc_5', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'Japan', wordABn: 'জাপান', wordB: 'South Korea', wordBBn: 'দক্ষিণ কোরিয়া', difficulty: 'MEDIUM' },
  { id: 'cc_6', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'Sydney', wordABn: 'সিডনি', wordB: 'Melbourne', wordBBn: 'মেলবোর্ন', difficulty: 'HARD' },
  { id: 'cc_7', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'India', wordABn: 'ভারত', wordB: 'Pakistan', wordBBn: 'পাকিস্তান', difficulty: 'EASY' },
  { id: 'cc_8', category: 'Countries & Cities', categoryBn: 'দেশ ও শহর', wordA: 'Rome', wordABn: 'রোম', wordB: 'Athens', wordBBn: 'এথেন্স', difficulty: 'HARD' },

  // 10. Movies & Characters
  { id: 'mc_1', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Batman', wordABn: 'ব্যাটম্যান', wordB: 'Iron Man', wordBBn: 'আয়রন ম্যান', difficulty: 'EASY' },
  { id: 'mc_2', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Superman', wordABn: 'সুপারম্যান', wordB: 'Spider-Man', wordBBn: 'স্পাইডারম্যান', difficulty: 'EASY' },
  { id: 'mc_3', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Harry Potter', wordABn: 'হ্যারি পটার', wordB: 'Lord Voldemort', wordBBn: 'লর্ড ভলডেমর্ট', difficulty: 'MEDIUM' },
  { id: 'mc_4', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Joker', wordABn: 'জোকার', wordB: 'Riddler', wordBBn: 'রিডলার', difficulty: 'HARD' },
  { id: 'mc_5', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Sherlock Holmes', wordABn: 'শার্লক হোমস', wordB: 'Hercule Poirot', wordBBn: 'হারকিউল পোয়ারো', difficulty: 'HARD' },
  { id: 'mc_6', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Avengers', wordABn: 'অ্যাভেঞ্জার্স', wordB: 'Justice League', wordBBn: 'জাস্টিস লিগ', difficulty: 'MEDIUM' },
  { id: 'mc_7', category: 'Movies & Characters', categoryBn: 'মুভি ও চরিত্র', wordA: 'Captain America', wordABn: 'ক্যাপ্টেন আমেরিকা', wordB: 'Thor', wordBBn: 'থর', difficulty: 'MEDIUM' },

  // 11. Professions
  { id: 'pr_1', category: 'Professions', categoryBn: 'পেশা', wordA: 'Doctor', wordABn: 'ডাক্তার', wordB: 'Nurse', wordBBn: 'নার্স', difficulty: 'EASY' },
  { id: 'pr_2', category: 'Professions', categoryBn: 'পেশা', wordA: 'Pilot', wordABn: 'পাইলট', wordB: 'Flight Attendant', wordBBn: 'ফ্লাইট স্টুয়ার্ড', difficulty: 'MEDIUM' },
  { id: 'pr_3', category: 'Professions', categoryBn: 'পেশা', wordA: 'Police Officer', wordABn: 'পুলিশ অফিসার', wordB: 'Security Guard', wordBBn: 'সিকিউরিটি গার্ড', difficulty: 'MEDIUM' },
  { id: 'pr_4', category: 'Professions', categoryBn: 'পেশা', wordA: 'Software Engineer', wordABn: 'সফটওয়্যার ইঞ্জিনিয়ার', wordB: 'Web Designer', wordBBn: 'ওয়েব ডিজাইনার', difficulty: 'MEDIUM' },
  { id: 'pr_5', category: 'Professions', categoryBn: 'পেশা', wordA: 'Judge', wordABn: 'বিচারক', wordB: 'Lawyer', wordBBn: 'আইনজীবী', difficulty: 'MEDIUM' },
  { id: 'pr_6', category: 'Professions', categoryBn: 'পেশা', wordA: 'Teacher', wordABn: 'শিক্ষক', wordB: 'Professor', wordBBn: 'প্রফেসর', difficulty: 'HARD' },
  { id: 'pr_7', category: 'Professions', categoryBn: 'পেশা', wordA: 'Chef', wordABn: 'শেফ / বাবুর্চি', wordB: 'Baker', wordBBn: 'বেকার', difficulty: 'HARD' },

  // 12. Vehicles
  { id: 'vh_1', category: 'Vehicles', categoryBn: 'যানবাহন', wordA: 'Car', wordABn: 'গাড়ি', wordB: 'Motorcycle', wordBBn: 'মোটরসাইকেল', difficulty: 'EASY' },
  { id: 'vh_2', category: 'Vehicles', categoryBn: 'যানবাহন', wordA: 'Bus', wordABn: 'বাস', wordB: 'Train', wordBBn: 'ট্রেন', difficulty: 'EASY' },
  { id: 'vh_3', category: 'Vehicles', categoryBn: 'যানবাহন', wordA: 'Helicopter', wordABn: 'হেলিকপ্টার', wordB: 'Airplane', wordBBn: 'উড়োজাহাজ', difficulty: 'MEDIUM' },
  { id: 'vh_4', category: 'Vehicles', categoryBn: 'যানবাহন', wordA: 'Boat', wordABn: 'নৌকা', wordB: 'Submarine', wordBBn: 'সাবমেরিন', difficulty: 'MEDIUM' },
  { id: 'vh_5', category: 'Vehicles', categoryBn: 'যানবাহন', wordA: 'Bicycle', wordABn: 'সাইকেল', wordB: 'Electric Scooter', wordBBn: 'ইলেকট্রিক স্কুটার', difficulty: 'MEDIUM' },
  { id: 'vh_6', category: 'Vehicles', categoryBn: 'যানবাহন', wordA: 'Cruise Ship', wordABn: 'প্রমোদতরী', wordB: 'Cargo Ship', wordBBn: 'মালবাহী জাহাজ', difficulty: 'HARD' },

  // 13. Nature
  { id: 'nt_1', category: 'Nature', categoryBn: 'প্রকৃতি', wordA: 'Sun', wordABn: 'সূর্য', wordB: 'Moon', wordBBn: 'চাঁদ', difficulty: 'EASY' },
  { id: 'nt_2', category: 'Nature', categoryBn: 'প্রকৃতি', wordA: 'River', wordABn: 'নদী', wordB: 'Ocean', wordBBn: 'মহাসমুদ্র', difficulty: 'EASY' },
  { id: 'nt_3', category: 'Nature', categoryBn: 'প্রকৃতি', wordA: 'Mountain', wordABn: 'পাহাড় / পর্বত', wordB: 'Hill', wordBBn: 'টিলা', difficulty: 'MEDIUM' },
  { id: 'nt_4', category: 'Nature', categoryBn: 'প্রকৃতি', wordA: 'Rain', wordABn: 'বৃষ্টি', wordB: 'Snowfall', wordBBn: 'তুষারপাত', difficulty: 'MEDIUM' },
  { id: 'nt_5', category: 'Nature', categoryBn: 'প্রকৃতি', wordA: 'Forest', wordABn: 'বন / জঙ্গল', wordB: 'Park', wordBBn: 'পার্ক', difficulty: 'MEDIUM' },
  { id: 'nt_6', category: 'Nature', categoryBn: 'প্রকৃতি', wordA: 'Desert', wordABn: 'মরুভূমি', wordB: 'Beach', wordBBn: 'সমুদ্রসৈকত', difficulty: 'HARD' },

  // 14. General Knowledge
  { id: 'gk_1', category: 'General Knowledge', categoryBn: 'সাধারণ জ্ঞান', wordA: 'Gold', wordABn: 'স্বর্ণ / সোনা', wordB: 'Silver', wordBBn: 'রুপা', difficulty: 'EASY' },
  { id: 'gk_2', category: 'General Knowledge', categoryBn: 'সাধারণ জ্ঞান', wordA: 'Diamond', wordABn: 'হীরা', wordB: 'Ruby', wordBBn: 'চুনি / রুবি', difficulty: 'MEDIUM' },
  { id: 'gk_3', category: 'General Knowledge', categoryBn: 'সাধারণ জ্ঞান', wordA: 'Oxygen', wordABn: 'অক্সিজেন', wordB: 'Carbon Dioxide', wordBBn: 'কার্বন ডাইঅক্সাইড', difficulty: 'HARD' },
  { id: 'gk_4', category: 'General Knowledge', categoryBn: 'সাধারণ জ্ঞান', wordA: 'School', wordABn: 'স্কুল', wordB: 'University', wordBBn: 'বিশ্ববিদ্যালয়', difficulty: 'EASY' },
  { id: 'gk_5', category: 'General Knowledge', categoryBn: 'সাধারণ জ্ঞান', wordA: 'Library', wordABn: 'লাইব্রেরি', wordB: 'Bookstore', wordBBn: 'বইয়ের দোকান', difficulty: 'MEDIUM' },
  { id: 'gk_6', category: 'General Knowledge', categoryBn: 'সাধারণ জ্ঞান', wordA: 'Cinema Hall', wordABn: 'সিনেমা হল', wordB: 'Theatre Stage', wordBBn: 'নাট্যমঞ্চ', difficulty: 'HARD' },
];

export const AVATARS = [
  '🕵️‍♂️', '🕵️‍♀️', '🥷', '🦊', '🎭', '🐺', '🐱', '🦁',
  '🐼', '🦉', '🎩', '🕶️', '🚀', '⚡', '🔥', '👑',
  '💎', '🎯', '🦄', '👾', '🐸', '🐯', '🐨', '🐵',
  '🐙', '🦋', '🐝', '🦖', '🐲', '👽', '🤖', '🧙',
  '🧛', '🧟', '🦸', '🦹', '🌙', '⭐', '🌈', '🎮'
];
