import React from "react";
import "./Testimonils.css";
 
const testimonials = [
    {
        id: 1,
        name: "Rahul Verma",
        role: "Software Developer",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        review:
            "Evolve helped me find verified job openings quickly. The apply process is simple and very useful for freshers.",
    },
    {
        id: 2,
        name: "Ananya Naik",
        role: "UI/UX Designer",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        review:
            "The platform is clean and easy to use. I found good companies, saved jobs and applied without any confusion.",
    },
    {
        id: 3,
        name: "Rohan Iyer",
        role: "Data Analyst",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        review:
            "Evolve gave me better job recommendations and helped me connect with recruiters faster than other portals.",
    },
    {
        id: 4,
        name: "Sneha Desai",
        role: "HR Recruiter",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        review:
            "Posting jobs and managing candidates is simple. It is a professional platform for recruiters and hiring teams.",
    },
];
 
const Testimonials = () => {
    return (
        <section className="jobTestimonials">
            <div className="jobTestimonialsHeader">
                <div className="jobTestimonialsBadge">
                    <span>☆</span> TESTIMONIALS
                </div>
 
                <h2>
                    What Our Users <span>Say's</span>
                </h2>
 
                <p>
                    Real feedback from job seekers and recruiters who use Evolve to
                    find jobs, hire talent and build better career opportunities.
                </p>
            </div>
 
            <div className="jobTestimonialsCards">
                {testimonials.map((item) => (
                    <div className="jobTestimonialCard" key={item.id}>
                        <div className="jobQuoteIcon">”</div>
 
                        <div className="jobStars">★★★★★</div>
 
                        <p className="jobReview">{item.review}</p>
 
                        <div className="jobUserInfo">
                            <img src={item.image} alt={item.name} />
 
                            <div>
                                <h4>{item.name}</h4>
                                <span>{item.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
 
            <div className="jobTestimonialDots">
                <span className="active"></span>
                <span></span>
            </div>
        </section>
    );
};
 
export default Testimonials;
 