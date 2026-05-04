export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  nameBn: string;
  mass: number;
  group: number; // 1-18, 0 for lanthanides/actinides row positioning
  period: number;
  category: string;
  config: string;
  state: 'solid' | 'liquid' | 'gas' | 'unknown';
  melt: number | null; // K
  boil: number | null; // K
  description: string;
  isotopes?: { mass: number; abundance: string }[];
}

// First 36 elements with full data (covers HSC syllabus well)
export const ELEMENTS: ElementData[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', nameBn: 'হাইড্রোজেন', mass: 1.008, group: 1, period: 1, category: 'nonmetal', config: '1s¹', state: 'gas', melt: 14, boil: 20, description: 'The lightest and most abundant element in the universe.', isotopes: [{ mass: 1, abundance: '99.98%' }, { mass: 2, abundance: '0.02%' }] },
  { number: 2, symbol: 'He', name: 'Helium', nameBn: 'হিলিয়াম', mass: 4.0026, group: 18, period: 1, category: 'noble', config: '1s²', state: 'gas', melt: 1, boil: 4, description: 'A noble gas, used in balloons and cooling systems.' },
  { number: 3, symbol: 'Li', name: 'Lithium', nameBn: 'লিথিয়াম', mass: 6.94, group: 1, period: 2, category: 'alkali', config: '[He] 2s¹', state: 'solid', melt: 454, boil: 1603, description: 'A soft, silvery alkali metal used in batteries.' },
  { number: 4, symbol: 'Be', name: 'Beryllium', nameBn: 'বেরিলিয়াম', mass: 9.0122, group: 2, period: 2, category: 'alkaline', config: '[He] 2s²', state: 'solid', melt: 1560, boil: 2742, description: 'A hard, lightweight metal.' },
  { number: 5, symbol: 'B', name: 'Boron', nameBn: 'বোরন', mass: 10.81, group: 13, period: 2, category: 'metalloid', config: '[He] 2s² 2p¹', state: 'solid', melt: 2349, boil: 4200, description: 'A metalloid essential for plant growth.' },
  { number: 6, symbol: 'C', name: 'Carbon', nameBn: 'কার্বন', mass: 12.011, group: 14, period: 2, category: 'nonmetal', config: '[He] 2s² 2p²', state: 'solid', melt: 3823, boil: 4098, description: 'The basis of all known life on Earth.' },
  { number: 7, symbol: 'N', name: 'Nitrogen', nameBn: 'নাইট্রোজেন', mass: 14.007, group: 15, period: 2, category: 'nonmetal', config: '[He] 2s² 2p³', state: 'gas', melt: 63, boil: 77, description: 'Makes up 78% of Earth\'s atmosphere.' },
  { number: 8, symbol: 'O', name: 'Oxygen', nameBn: 'অক্সিজেন', mass: 15.999, group: 16, period: 2, category: 'nonmetal', config: '[He] 2s² 2p⁴', state: 'gas', melt: 54, boil: 90, description: 'The Breath of Life — essential for respiration and combustion.' },
  { number: 9, symbol: 'F', name: 'Fluorine', nameBn: 'ফ্লোরিন', mass: 18.998, group: 17, period: 2, category: 'halogen', config: '[He] 2s² 2p⁵', state: 'gas', melt: 53, boil: 85, description: 'The most reactive non-metal.' },
  { number: 10, symbol: 'Ne', name: 'Neon', nameBn: 'নিয়ন', mass: 20.180, group: 18, period: 2, category: 'noble', config: '[He] 2s² 2p⁶', state: 'gas', melt: 24, boil: 27, description: 'A noble gas famous for glowing signs.' },
  { number: 11, symbol: 'Na', name: 'Sodium', nameBn: 'সোডিয়াম', mass: 22.990, group: 1, period: 3, category: 'alkali', config: '[Ne] 3s¹', state: 'solid', melt: 371, boil: 1156, description: 'A soft alkali metal, key to table salt.' },
  { number: 12, symbol: 'Mg', name: 'Magnesium', nameBn: 'ম্যাগনেসিয়াম', mass: 24.305, group: 2, period: 3, category: 'alkaline', config: '[Ne] 3s²', state: 'solid', melt: 923, boil: 1363, description: 'A lightweight metal used in alloys.' },
  { number: 13, symbol: 'Al', name: 'Aluminium', nameBn: 'অ্যালুমিনিয়াম', mass: 26.982, group: 13, period: 3, category: 'metal', config: '[Ne] 3s² 3p¹', state: 'solid', melt: 933, boil: 2792, description: 'A versatile, corrosion-resistant metal.' },
  { number: 14, symbol: 'Si', name: 'Silicon', nameBn: 'সিলিকন', mass: 28.085, group: 14, period: 3, category: 'metalloid', config: '[Ne] 3s² 3p²', state: 'solid', melt: 1687, boil: 3538, description: 'The backbone of modern electronics.' },
  { number: 15, symbol: 'P', name: 'Phosphorus', nameBn: 'ফসফরাস', mass: 30.974, group: 15, period: 3, category: 'nonmetal', config: '[Ne] 3s² 3p³', state: 'solid', melt: 317, boil: 553, description: 'Essential for DNA and bones.' },
  { number: 16, symbol: 'S', name: 'Sulfur', nameBn: 'সালফার', mass: 32.06, group: 16, period: 3, category: 'nonmetal', config: '[Ne] 3s² 3p⁴', state: 'solid', melt: 388, boil: 717, description: 'A bright yellow non-metal.' },
  { number: 17, symbol: 'Cl', name: 'Chlorine', nameBn: 'ক্লোরিন', mass: 35.45, group: 17, period: 3, category: 'halogen', config: '[Ne] 3s² 3p⁵', state: 'gas', melt: 171, boil: 239, description: 'A halogen used to disinfect water.' },
  { number: 18, symbol: 'Ar', name: 'Argon', nameBn: 'আর্গন', mass: 39.948, group: 18, period: 3, category: 'noble', config: '[Ne] 3s² 3p⁶', state: 'gas', melt: 84, boil: 87, description: 'A noble gas used in light bulbs.' },
  { number: 19, symbol: 'K', name: 'Potassium', nameBn: 'পটাশিয়াম', mass: 39.098, group: 1, period: 4, category: 'alkali', config: '[Ar] 4s¹', state: 'solid', melt: 337, boil: 1032, description: 'Vital for nerve function in living organisms.' },
  { number: 20, symbol: 'Ca', name: 'Calcium', nameBn: 'ক্যালসিয়াম', mass: 40.078, group: 2, period: 4, category: 'alkaline', config: '[Ar] 4s²', state: 'solid', melt: 1115, boil: 1757, description: 'Essential for bones and teeth.' },
  { number: 21, symbol: 'Sc', name: 'Scandium', nameBn: 'স্ক্যান্ডিয়াম', mass: 44.956, group: 3, period: 4, category: 'transition', config: '[Ar] 3d¹ 4s²', state: 'solid', melt: 1814, boil: 3109, description: 'A rare transition metal.' },
  { number: 22, symbol: 'Ti', name: 'Titanium', nameBn: 'টাইটানিয়াম', mass: 47.867, group: 4, period: 4, category: 'transition', config: '[Ar] 3d² 4s²', state: 'solid', melt: 1941, boil: 3560, description: 'Strong, lightweight, and corrosion-resistant.' },
  { number: 23, symbol: 'V', name: 'Vanadium', nameBn: 'ভ্যানাডিয়াম', mass: 50.942, group: 5, period: 4, category: 'transition', config: '[Ar] 3d³ 4s²', state: 'solid', melt: 2183, boil: 3680, description: 'Used to strengthen steel alloys.' },
  { number: 24, symbol: 'Cr', name: 'Chromium', nameBn: 'ক্রোমিয়াম', mass: 51.996, group: 6, period: 4, category: 'transition', config: '[Ar] 3d⁵ 4s¹', state: 'solid', melt: 2180, boil: 2944, description: 'Provides the shine in chrome plating.' },
  { number: 25, symbol: 'Mn', name: 'Manganese', nameBn: 'ম্যাঙ্গানিজ', mass: 54.938, group: 7, period: 4, category: 'transition', config: '[Ar] 3d⁵ 4s²', state: 'solid', melt: 1519, boil: 2334, description: 'Used in steel production.' },
  { number: 26, symbol: 'Fe', name: 'Iron', nameBn: 'লোহা', mass: 55.845, group: 8, period: 4, category: 'transition', config: '[Ar] 3d⁶ 4s²', state: 'solid', melt: 1811, boil: 3134, description: 'The most-used metal; core of Earth.' },
  { number: 27, symbol: 'Co', name: 'Cobalt', nameBn: 'কোবাল্ট', mass: 58.933, group: 9, period: 4, category: 'transition', config: '[Ar] 3d⁷ 4s²', state: 'solid', melt: 1768, boil: 3200, description: 'Used in high-strength alloys and batteries.' },
  { number: 28, symbol: 'Ni', name: 'Nickel', nameBn: 'নিকেল', mass: 58.693, group: 10, period: 4, category: 'transition', config: '[Ar] 3d⁸ 4s²', state: 'solid', melt: 1728, boil: 3186, description: 'A silvery-white lustrous metal.' },
  { number: 29, symbol: 'Cu', name: 'Copper', nameBn: 'তামা', mass: 63.546, group: 11, period: 4, category: 'transition', config: '[Ar] 3d¹⁰ 4s¹', state: 'solid', melt: 1358, boil: 2835, description: 'Excellent conductor of electricity.' },
  { number: 30, symbol: 'Zn', name: 'Zinc', nameBn: 'জিঙ্ক', mass: 65.38, group: 12, period: 4, category: 'transition', config: '[Ar] 3d¹⁰ 4s²', state: 'solid', melt: 693, boil: 1180, description: 'Used to galvanize steel.' },
  { number: 31, symbol: 'Ga', name: 'Gallium', nameBn: 'গ্যালিয়াম', mass: 69.723, group: 13, period: 4, category: 'metal', config: '[Ar] 3d¹⁰ 4s² 4p¹', state: 'solid', melt: 303, boil: 2477, description: 'Melts in your hand!' },
  { number: 32, symbol: 'Ge', name: 'Germanium', nameBn: 'জার্মেনিয়াম', mass: 72.630, group: 14, period: 4, category: 'metalloid', config: '[Ar] 3d¹⁰ 4s² 4p²', state: 'solid', melt: 1211, boil: 3106, description: 'Used in semiconductors and fiber optics.' },
  { number: 33, symbol: 'As', name: 'Arsenic', nameBn: 'আর্সেনিক', mass: 74.922, group: 15, period: 4, category: 'metalloid', config: '[Ar] 3d¹⁰ 4s² 4p³', state: 'solid', melt: 1090, boil: 887, description: 'A toxic metalloid.' },
  { number: 34, symbol: 'Se', name: 'Selenium', nameBn: 'সেলেনিয়াম', mass: 78.971, group: 16, period: 4, category: 'nonmetal', config: '[Ar] 3d¹⁰ 4s² 4p⁴', state: 'solid', melt: 494, boil: 958, description: 'Essential trace mineral.' },
  { number: 35, symbol: 'Br', name: 'Bromine', nameBn: 'ব্রোমিন', mass: 79.904, group: 17, period: 4, category: 'halogen', config: '[Ar] 3d¹⁰ 4s² 4p⁵', state: 'liquid', melt: 266, boil: 332, description: 'One of two liquid elements at room temperature.' },
  { number: 36, symbol: 'Kr', name: 'Krypton', nameBn: 'ক্রিপ্টন', mass: 83.798, group: 18, period: 4, category: 'noble', config: '[Ar] 3d¹⁰ 4s² 4p⁶', state: 'gas', melt: 116, boil: 120, description: 'A noble gas used in some lighting.' },
];

// Most common neutron count = round(mass) - protons
export const neutronsFor = (e: ElementData) => Math.round(e.mass) - e.number;

export const categoryColor = (cat: string): string => {
  switch (cat) {
    case 'alkali': return 'hsl(346 77% 60%)';
    case 'alkaline': return 'hsl(25 95% 60%)';
    case 'transition': return 'hsl(199 89% 60%)';
    case 'metal': return 'hsl(217 91% 60%)';
    case 'metalloid': return 'hsl(160 84% 50%)';
    case 'nonmetal': return 'hsl(142 71% 55%)';
    case 'halogen': return 'hsl(280 80% 65%)';
    case 'noble': return 'hsl(190 95% 55%)';
    default: return 'hsl(220 15% 50%)';
  }
};