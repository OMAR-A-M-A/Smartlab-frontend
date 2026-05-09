import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-landing-page',
  imports: [CommonModule,RouterModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  heroData = {
    titleStart: 'Your Health, Clarified with',
    highlightedWord: 'EL-NOUR',
    titleEnd: 'Precision.',
    description:
      'Trusted diagnostics and precise laboratory testing, delivering accurate results with care, speed, and confidence for every patient.',
    primaryButton: 'Explore Our Services',
    secondaryButton: 'Book Appointment',
    imageSrc: 'images/home.png',
  };

  // 2. About Us Data
  aboutData = {
    sectionTitle: 'About Us',
    paragraph1:
      'At <strong>El-Nour Lab</strong>, we believe that healthcare starts with clarity. For over 15 years, we have been a cornerstone of diagnostic excellence, combining deep medical expertise with the latest in laboratory automation.',
    paragraph2:
      'Our mission is to empower patients and physicians alike by providing fast, highly accurate results through a seamless digital experience. By integrating advanced technology with compassionate care, we ensure that your journey to better health is informed, secure, and transparent.',
    techTitle: 'Next-Gen Tech',
    techDesc: 'Advanced genomic sequencing and immunoassays',
    yearsNum: '15+',
    yearsText: 'Years Of Experience',
    imgTubes: 'images/about-1.png',
    imgMicroscope: 'images/aboutus.png',
  };

  // 3. Work Process Data
  processData = {
    sectionTitle: 'Our Work Process',
    subtitle: 'From sample to digital result , a seamless journey built for your health',
    steps: [
      {
        id: '01',
        title: 'Seamless Collection',
        description:
          'Visit our lab for a quick and sterile sampling process handled by our expert medical team',
        image: 'images/work-1.png',
      },
      {
        id: '02',
        title: 'The Secure ID',
        description:
          'Receive a unique Patient ID after your visit. This is your gateway to tracking your tests.',
        image: 'images/work-2.png',
      },
      {
        id: '03',
        title: 'Instant Updates',
        description:
          "No more waiting in uncertainty. We'll send you a notification the moment your results are verified and ready.",
        image: 'images/work-3.png',
      },
      {
        id: '04',
        title: 'The Result',
        description: 'Log in with your ID to view your detailed reports through our secure portal.',
        image: 'images/work-4.png',
      },
    ],
  };

  // 4. Booking CTA Data
  bookingData = {
    sectionTitle: 'Ready to take control of your health?',
    description:
      'Schedule your home visit or lab appointment easily through our secure digital booking system. Fast, precise, and at your convenience.',
    buttonText: 'Book Your Appointment Now',
  };


  services = [
    {
      title: 'Clinical Chemistry',
      desc: 'Precision testing for vital organ functions, including blood glucose, lipid profiles, and kidney & liver function tests',
      image: 'images/Clinical.png',
    },
    {
      title: 'Immunology & Serology',
      desc: 'Advanced immune system testing and infectious disease diagnostics',
      image: 'images/Footer.png',
    },
    {
      title: 'Specialized Hormones',
      desc: 'Precise hormone analysis for better health insights',
      image: 'images/Footer.png',
    },
    {
      title: 'Hematology & Blood Banking',
      desc: 'Complete blood analysis and safe blood banking services',
      image: 'images/Footer.png',
    },
  ];

  currentIndex = 0;

  testimonials = [
    {
      name: 'Ahmed Mansour - Toukh',
      text: 'Extremely impressed with the turnaround time...',
    },
    {
      name: 'Mohamed Ali - Cairo',
      text: 'Great service and fast results...',
    },
    {
      name: 'Sara Ahmed - Giza',
      text: 'Very professional lab...',
    },
  ];

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  getPrevIndex() {
    return (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  getNextIndex() {
    return (this.currentIndex + 1) % this.testimonials.length;
  }
}
