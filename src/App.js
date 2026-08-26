import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./Components/HomePage/HomePage1/HomePage";
import Jobs from "./Components/HomePage/Jobs/Jobs/Jobs";
import Register from "./Components/Pages/Register/Register";
import CandidateLogin from "./Components/Pages/Login/Candidate/Candidate";
import PostJob from "./Components/Pages/PostJob/PostJob";
import SavedJobs from "./Components/Pages/SavedJob/SavedJob";
import AdminDashboard from "./Components/Pages/AdminDashboard/AdminDashboard";
import JobApplication from "./Components/Pages/JobApplication/JobApplication";
import ForgotPassword from "./Components/Pages/ForgotPassword/ForgotPassword";
import EmployerDashboard from "./Components/Pages/EmployerDashboard/EmployerDashboard";
import Testimonials from "./Components/Pages/Testimonils/Testimonils";
import CompanyPage from "./Components/CompanyPage/CompanyPage";
import MyApplication from "./Components/Pages/MyApplication/MyApplication";
import CompanyDetails from "./Components/Pages/CompanyDetails/CompanyDetails";
import ManageJobs from "./Components/Pages/ManageJobs/ManageJobs";
import InternshipPage from "./Components/Pages/InternshipPage/InternshipPage";
import Internshipjobs from "./Components/Pages/InternshipPage/Internshipjobs/Internshipjobs";
import InternJobsDetailsPage from "./Components/Pages/InternshipPage/InternJobsDetailsPage/InternJobsDetailsPage";
import CandidateDashboard from "./Components/Pages/CandidateDashboard/CandidateDashBoards";
import SuperAdminLayout from "./Components/Pages/SuperAdminDashboard/SuperAdminLayout";
import JobDetailsPage from "./Components/JobDetailsPage/Jobdetailspage";
import CoursesPage from "./Components/Pages/CoursesPage/CoursesPage";
import CourseDetailsPage from "./Components/Pages/CourseDetailsPage/CourseDetailsPage";
import ContactUs from "./Components/Pages/ContactUs/ContactUs";
import ContactSales from "./Components/Pages/ContactSales/ContactSales";
import HelpSupport from "./Components/Pages/HelpSupport/HelpSupport";
import PricingPage from "./Components/Pages/PricingPage/PricingPage";
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy/PrivacyPolicy";
import RecruitmentSolutions from "./Components/Pages/RecruitmentSolutions/RecruitmentSolutions";
import TermsConditions from "./Components/Pages/Terms & Conditions Page/Terms & Conditions Page";
import ChangePassword from "./Components/Pages/ChangePassword/ChangePassword";

import ProtectedRoute from "./Components/Pages/ProtectedRoute/ProtectedRoute";
import AIChatBoard from "./Components/AIChatBoard/AIChatBoard";
import MockInterview from "./Components/MockInterview/MockInterview";
import ResetPassword from "./Components/Pages/ForgotPassword/ResetPassword/ResetPassword";
import BlogsPage from "./Components/Pages/BlogsPage/BlogsPage";
import BlogDetailsPage from "./Components/Pages/BlogsPage/BlogsDetailsPage/BlogsDetailsPage";
import CoursePayment from "./Components/Pages/CoursePayment/CoursePayment";
import VendorManagement from "./Components/Payroll/VendorManagement";
import VendorDashboard from "./Components/Pages/VendorDashboard/VendorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login/candidate" element={<CandidateLogin />} />

        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        <Route path="/Testimonials" element={<Testimonials />} />

        <Route path="/CompanyPage" element={<CompanyPage />} />

        <Route path="/CompanyDetails/:id" element={<CompanyDetails />} />

        <Route path="/InternshipPage" element={<InternshipPage />} />

        <Route path="/internship/:id" element={<InternshipPage />} />

        <Route path="/ij" element={<Internshipjobs />} />

        <Route
          path="/internjobdetails/:id"
          element={<InternJobsDetailsPage />}
        />

        <Route path="/job/:id" element={<JobDetailsPage />} />

        <Route path="/job-details/:id" element={<JobDetailsPage />} />

        <Route path="/course-page" element={<CoursesPage />} />

        <Route path="/course-details/:id" element={<CourseDetailsPage />} />

        <Route
          path="/course-payment/:courseId"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CoursePayment />
            </ProtectedRoute>
          }
        />

        <Route path="/contactus" element={<ContactUs />} />

        <Route path="/blogs" element={<BlogsPage />} />

        <Route path="/blog/:id" element={<BlogDetailsPage />} />

        <Route
          path="/payroll-dashboard/vendors"
          element={<VendorManagement />}
        />

        <Route
          path="/contact-sales"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <ContactSales />
            </ProtectedRoute>
          }
        />

        <Route path="/help-support" element={<HelpSupport />} />

        <Route
          path="/pricing-page"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <PricingPage />
            </ProtectedRoute>
          }
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route
          path="/recruitment-solutions"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <RecruitmentSolutions />
            </ProtectedRoute>
          }
        />

        <Route path="/terms-conditions" element={<TermsConditions />} />

        <Route path="/chatbot" element={<AIChatBoard />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              allowedRoles={[
                "candidate",
                "employee",
                "admin",
                "super_admin",
              ]}
            >
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mock-interview/:id"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <MockInterview />
            </ProtectedRoute>
          }
        />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-application"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <JobApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/MyApplication"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <MyApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/postjob"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ManageJobs"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <ManageJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={false}
        pauseOnHover
        draggable={false}
        theme="light"
      />

      <AIChatBoard />
    </BrowserRouter>
  );
}

export default App;