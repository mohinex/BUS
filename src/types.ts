/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'bn' | 'en';

export type MembershipCategory = 'Donor' | 'Life' | 'General' | 'Adviser';

export interface Member {
  id: string; // Auto generated e.g. BUSD-2026-0042
  name: string;
  nameBn: string;
  fatherName: string;
  fatherNameBn: string;
  motherName: string;
  motherNameBn: string;
  phone: string;
  email: string;
  category: MembershipCategory;
  union: string; // Union name in Baliakandi: union list below
  village: string;
  villageBn: string;
  presentAddress: string;
  presentAddressBn: string;
  permanentAddress: string;
  permanentAddressBn: string;
  occupation: string;
  occupationBn: string;
  designation?: string;
  designationBn?: string;
  workplace?: string;
  workplaceBn?: string;
  profilePhoto: string; // Base64 data or standard URL
  status: 'Pending' | 'Approved' | 'Declined';
  passwordHash?: string; // Kept secure on server
  bio?: string;
  bioBn?: string;
  registeredAt: string;
  approvedAt?: string;
  bloodGroup?: string;
  fbProfile?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  nameBn: string;
  designation: string; // e.g. President, General Secretary, Joint Secretary, members
  designationBn: string;
  phone?: string;
  email?: string;
  village: string;
  villageBn: string;
  presentAddress: string;
  presentAddressBn: string;
  photoUrl: string;
  sortOrder: number;
  type: 'Executive' | 'Advisory';
}

export interface EventLog {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  time: string;
  timeBn: string;
  venue: string;
  venueBn: string;
  description: string;
  descriptionBn: string;
  fee: number; // 0 for free
  bannerUrl: string;
  status: 'Upcoming' | 'Past';
  attendeesCount: number;
  attendees: string[]; // List of registered member emails / names
}

export interface NewsLog {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  category: 'Notice' | 'News' | 'Scholarship' | 'EventReport';
  categoryBn: string;
  summary: string;
  summaryBn: string;
  details: string;
  detailsBn: string;
  pdfUrl?: string;
  isFeatured?: boolean;
}

export interface DonationLog {
  id: string;
  name: string;
  phone: string;
  email: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Card';
  date: string;
  isAnonymous: boolean;
  message?: string;
  referenceNo?: string;
  trxId?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  email: string;
  skills: string[];
  message: string;
  status: 'Pending' | 'Accepted';
  registeredAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleBn: string;
  type: 'photo' | 'video';
  url: string; // Image URL or YouTube embed video ID
  category: string;
  categoryBn: string;
  date: string;
}
