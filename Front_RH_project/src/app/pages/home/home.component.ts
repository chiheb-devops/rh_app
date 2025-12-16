import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // HR Management Products
  products = [
    {
      title: 'Smart Recruitment',
      desc: 'Automate your hiring pipeline with AI-driven candidate matching and tracking.',
      icon: '🤝'
    },
    {
      title: 'Payroll & Benefits',
      desc: 'Seamless, error-free payroll processing with integrated benefits management.',
      icon: '💳'
    },
    {
      title: 'Talent Growth',
      desc: 'Boost retention with performance reviews, goal tracking, and upskilling paths.',
      icon: '📈'
    }
  ];

  // HR Professional Reviews
  reviews = [
    {
      name: 'Sarra',
      role: 'HR Director, GlobalCorp',
      comment: 'Mine revolutionized our onboarding process. We reduced paperwork by 80% in the first month.',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      name: 'Ahmed',
      role: 'Head of People, TechStart',
      comment: 'Finally, an HR tool that employees actually love using. The UI is intuitive and modern.',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
      name: 'Asma',
      role: 'Recruitment Manager',
      comment: 'The AI candidate matching is a game changer. We are finding better talent, faster.',
      avatar: 'https://i.pravatar.cc/150?img=9'
    }
  ];

}