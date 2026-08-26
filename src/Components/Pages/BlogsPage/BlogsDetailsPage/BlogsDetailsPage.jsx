import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../../config/api";
import "./BlogsDetailsPage.css";
import NavBar from "../../../HomePage/NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const BlogDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBlogDetails = async () => {
        try {
            if (!id) {
                setBlog(null);
                return;
            }

            const res = await axios.get(
                `${API_BASE_URL}/api/blogs/details?id=${String(id)}`
            );

            setBlog(res.data);
        } catch (error) {
            console.error("Blog details fetch error:", error);
            setBlog(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="blogDetailsLoading">Loading blog...</div>;
    }

    if (!blog) {
        return <div className="blogDetailsLoading">Blog not found</div>;
    }

    return (
        <>
        <NavBar/>
        <div className="blogDetailsPage">
            <button
                className="blogBackBtn"
                onClick={() => navigate("/blogs")}
            >
                ← Back to Blogs
            </button>

            <div className="blogDetailsCard">
                <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="blogDetailsImage"
                />

                <div className="blogDetailsContent">
                    <span className="blogDetailsCategory">
                        {blog.category}
                    </span>

                    <h1>{blog.title}</h1>

                    <div className="blogDetailsMeta">
                        <span>By {blog.author}</span>

                        <span>
                            {blog.createdAt
                                ? new Date(
                                      blog.createdAt
                                  ).toLocaleDateString()
                                : ""}
                        </span>
                    </div>

                    <p className="blogDetailsShort">
                        {blog.shortDescription}
                    </p>

                    <div className="blogDetailsArticle">
                        {blog.content}
                    </div>
                </div>
            </div>
        </div>

    <Footer/>
    </>
    );
};

export default BlogDetailsPage;