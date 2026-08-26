import React from "react";
import "./PrivacyPolicy.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";

const PrivacyPolicy = () => {
    return (
        <>
            <NavBar />

            <div className="privacyPage">
                <div className="privacyContainer">
                    <h1>Privacy Policy</h1>
                    <p className="lastUpdated">Last Updated: April 2026</p>

                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to <strong>EVOLVE</strong>. We value your privacy and
                            are committed to protecting your personal information. This Privacy
                            Policy explains how we collect, use, and safeguard your data when
                            you use our job portal platform.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <ul>
                            <li>Personal details (Name, Email, Phone Number)</li>
                            <li>Resume and profile information</li>
                            <li>Job application data</li>
                            <li>Login credentials</li>
                            <li>Usage data (pages visited, interactions)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <ul>
                            <li>To provide job recommendations</li>
                            <li>To allow employers to view your profile</li>
                            <li>To improve our platform and user experience</li>
                            <li>To communicate updates and notifications</li>
                            <li>To ensure security and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Sharing of Information</h2>
                        <p>
                            We do not sell your personal data. Your information may be shared
                            with employers when you apply for jobs or make your profile visible.
                        </p>
                    </section>

                    <section>
                        <h2>5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your
                            data from unauthorized access, misuse, or disclosure.
                        </p>
                    </section>

                    <section>
                        <h2>6. Your Rights</h2>
                        <ul>
                            <li>You can update your profile anytime</li>
                            <li>You can delete your account</li>
                            <li>You can opt out of communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Cookies</h2>
                        <p>
                            We use cookies to enhance user experience and analyze website
                            traffic. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2>8. Changes to Policy</h2>
                        <p>
                            We may update this policy from time to time. Changes will be posted
                            on this page with updated dates.
                        </p>
                    </section>

                    <section>
                        <h2>9. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact
                            us at:
                        </p>
                        <p className="contactInfo">
                            📧 hirenex5@gmail.com <br />
                            📞 +91 63014 08578
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PrivacyPolicy;