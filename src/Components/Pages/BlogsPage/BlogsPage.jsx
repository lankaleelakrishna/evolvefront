import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaArrowRight,
    FaClock,
} from "react-icons/fa";

import "./BlogsPage.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../Footer/Footer";

const categories = [
    "All",
    "Resume Building",
    "Interview Tips",
    "Frontend",
    "Backend",
    "Career Guidance",
    "Internships",
];

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/blogs");
            setBlogs(res.data || []);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReadBlog = (blogId) => {
        if (!blogId) {
            alert("Blog id not found");
            return;
        }

        navigate(`/blog/${String(blogId)}`);
    };

    const filteredBlogs = useMemo(() => {
        return blogs.filter((blog) => {
            const matchesSearch = blog.title
                ?.toLowerCase()
                .includes(search.toLowerCase());

            const matchesCategory =
                selectedCategory === "All"
                    ? true
                    : blog.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [blogs, search, selectedCategory]);

    const featuredBlog = filteredBlogs[0];

    return (
        <>
        <NavBar/>
        <div className="blogsPage">
            <div className="blogsHero">
                <div className="blogsHeroContent">
                    <span className="blogsHeroBadge">
                        Career Growth Platform
                    </span>

                    <h1>Career Blogs & Professional Insights</h1>

                    <p>
                        Explore interview preparation, resume building,
                        internships, career growth, placement tips and latest
                        hiring trends from industry experts.
                    </p>

                    <div className="blogsSearchBox">
                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="blogsMainContainer">
                <div className="blogsCategoryWrapper">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={
                                selectedCategory === category
                                    ? "blogCategoryBtn activeBlogCategory"
                                    : "blogCategoryBtn"
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {featuredBlog && (
                    <div className="featuredBlogCard">
                        <div className="featuredBlogImage">
                            <img
                                src={featuredBlog.imageUrl}
                                alt={featuredBlog.title}
                            />

                            <div className="featuredOverlay" />
                        </div>

                        <div className="featuredBlogContent">
                            <span className="featuredTag">
                                Featured Article
                            </span>

                            <h2>{featuredBlog.title}</h2>

                            <p>{featuredBlog.shortDescription}</p>

                            <div className="featuredMeta">
                                <span>By {featuredBlog.author}</span>

                                <span>
                                    {featuredBlog.createdAt
                                        ? new Date(
                                              featuredBlog.createdAt
                                          ).toLocaleDateString()
                                        : ""}
                                </span>

                                <span>
                                    <FaClock />
                                    5 min read
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    handleReadBlog(featuredBlog.id)
                                }
                            >
                                Read Article
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                <div className="blogsSectionHeader">
                    <div>
                        <h2>Latest Blogs</h2>
                        <p>
                            Explore the latest articles and career insights.
                        </p>
                    </div>

                    <span>{filteredBlogs.length} Articles</span>
                </div>

                <div className="blogsContainer">
                    {loading ? (
                        <div className="blogsLoading">
                            Loading blogs...
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog) => (
                            <div className="blogCard" key={blog.id}>
                                <div className="blogImageWrapper">
                                    <img
                                        src={blog.imageUrl}
                                        alt={blog.title}
                                    />

                                    <span className="blogCategory">
                                        {blog.category}
                                    </span>
                                </div>

                                <div className="blogCardContent">
                                    <h2>{blog.title}</h2>

                                    <p>{blog.shortDescription}</p>

                                    <div className="blogMeta">
                                        <span>By {blog.author}</span>

                                        <span>
                                            {blog.createdAt
                                                ? new Date(
                                                      blog.createdAt
                                                  ).toLocaleDateString()
                                                : ""}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleReadBlog(blog.id)
                                        }
                                    >
                                        Read More
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="blogsLoading">
                            No blogs available
                        </div>
                    )}
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default BlogsPage;