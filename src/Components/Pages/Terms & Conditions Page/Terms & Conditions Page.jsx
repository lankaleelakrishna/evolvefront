import React from "react";
import {
    FaFileContract,
    FaUserShield,
    FaBriefcase,
    FaBan,
    FaEnvelope,
    FaCheckCircle,
} from "react-icons/fa";
import "./Terms & Conditions Page.css";
import Footer from "../../Footer/Footer";
import NavBar from "../../HomePage/NavBar/NavBar";

const TermsConditions = () => {
    const termsData = [
        {
            icon: <FaUserShield />,
            title: "User Account Responsibility",
            desc: "Users must provide accurate information while creating an account and are responsible for keeping login details secure.",
        },
        {
            icon: <FaBriefcase />,
            title: "Job Listings & Applications",
            desc: "AfterGraduate connects candidates and employers but does not guarantee job selection, interview calls, or employer responses.",
        },
        {
            icon: <FaBan />,
            title: "Prohibited Activities",
            desc: "Users must not post fake jobs, false applications, spam content, abusive messages, or misuse the platform.",
        },
    ];

    return (
        <>
        <NavBar></NavBar>
        <div className="termsPage">
            <div className="termsHero">
                <div className="termsHeroBadge">
                    <FaFileContract />
                    Legal Information
                </div>

                <h1>Terms & Conditions</h1>
                <p>
                    Please read these Terms & Conditions carefully before using the
                    Evolve Job Portal.
                </p>

                <span>Last Updated: April 2026</span>
            </div>

            <div className="termsContainer">
                <div className="termsIntroCard">
                    <h2>Welcome to EVOLVE</h2>
                    <p>
                        By accessing or using <strong>EVOLVE</strong>, you agree to
                        follow these Terms & Conditions. These terms explain your rights,
                        responsibilities, and the rules for using our job portal platform.
                    </p>
                </div>

                <div className="termsCards">
                    {termsData.map((item, index) => (
                        <div className="termsCard" key={index}>
                            <div className="termsIcon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="termsContent">
                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By registering, browsing, applying for jobs, posting jobs, or using
                            any feature of Evolve, you agree to comply with these Terms
                            & Conditions. If you do not agree, you should stop using the
                            platform.
                        </p>
                    </section>

                    <section>
                        <h2>2. Eligibility</h2>
                        <ul>
                            <li>You must be at least 18 years old to use this platform.</li>
                            <li>You must provide true, complete, and updated information.</li>
                            <li>
                                Employers must provide genuine company and job-related details.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Candidate Responsibilities</h2>
                        <ul>
                            <li>Submit only accurate profile, resume, and application data.</li>
                            <li>Do not apply using false identity or fake documents.</li>
                            <li>
                                Keep your profile professional and relevant to job opportunities.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Employer Responsibilities</h2>
                        <ul>
                            <li>Post only genuine job openings and internship opportunities.</li>
                            <li>Do not collect candidate data for unauthorized purposes.</li>
                            <li>
                                Avoid misleading salary, location, company, or job description
                                details.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Job Listings</h2>
                        <p>
                            Evolve provides a platform for job seekers and employers to
                            connect. We do not guarantee that every job listing is accurate,
                            active, or suitable for every candidate. Users are advised to
                            verify job details before proceeding.
                        </p>
                    </section>

                    <section>
                        <h2>6. Prohibited Use</h2>
                        <ul>
                            <li>Posting fake jobs or fake applications.</li>
                            <li>Uploading harmful, abusive, or illegal content.</li>
                            <li>Trying to hack, damage, or misuse the platform.</li>
                            <li>Sending spam messages to candidates or employers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Account Suspension or Termination</h2>
                        <p>
                            Evolve reserves the right to suspend, restrict, or delete
                            any user account if we find misuse, fraud, fake information,
                            harmful activity, or violation of these terms.
                        </p>
                    </section>

                    <section>
                        <h2>8. Privacy & Data Protection</h2>
                        <p>
                            Your personal information will be handled according to our Privacy
                            Policy. By using Evolve, you allow us to process your data
                            for account management, job applications, employer communication,
                            and platform improvement.
                        </p>
                    </section>

                    <section>
                        <h2>9. Limitation of Liability</h2>
                        <p>
                            Evolve is not responsible for job selection results,
                            employer decisions, interview outcomes, fake third-party actions,
                            or losses caused by user negligence.
                        </p>
                    </section>

                    <section>
                        <h2>10. Changes to Terms</h2>
                        <p>
                            We may update these Terms & Conditions whenever required. Updated
                            terms will be posted on this page. Continued use of the platform
                            means you accept the updated terms.
                        </p>
                    </section>
                </div>

                <div className="termsAgreementBox">
                    <FaCheckCircle />
                    <div>
                        <h3>User Agreement</h3>
                        <p>
                            By continuing to use Evolve, you confirm that you have read,
                            understood, and accepted these Terms & Conditions.
                        </p>
                    </div>
                </div>

                <div className="termsContactBox">
                    <FaEnvelope />
                    <div>
                        <h3>Need Help?</h3>
                        <p>
                            For questions about these Terms & Conditions, contact our support
                            team.
                        </p>
                        <a href="mailto:hirenex5@gmail.com">
                            hirenex5@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    <Footer></Footer>
        </>
  );
        
};

export default TermsConditions;