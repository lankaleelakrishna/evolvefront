import React, { useMemo, useState, useEffect } from "react";
import "./NotificationsPage.css";
import axios from "axios";

const NotificationsPage = () => {
    const [search, setSearch] = useState("");
    const [notifications, setNotifications] = useState([]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/notifications",
                getAuthHeaders()
            );

            const formatted = (res.data || []).map((item) => ({
                id: item.id,
                title: item.title || item.type || "Notification",
                message: item.message,
                read: item.read || false,
            }));

            setNotifications(formatted);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const filteredNotifications = useMemo(() => {
        return notifications.filter((item) =>
            `${item.title} ${item.message}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [notifications, search]);

    const markAsRead = async (id) => {
        try {
            await axios.get(
                `http://localhost:8080/api/notifications/seen/${id}`,
                getAuthHeaders()
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, read: true } : item
                )
            );
        } catch (error) {
            console.error("Mark read error:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.get(
                "http://localhost:8080/api/notifications/seen-all",
                getAuthHeaders()
            );

            setNotifications((prev) =>
                prev.map((item) => ({ ...item, read: true }))
            );
        } catch (error) {
            console.error("Mark all read error:", error);
        }
    };

    return (
        <div className="notificationsPageCard">
            <div className="notificationsPageHeader">
                <h2>Notifications</h2>

                <div className="notificationsPageActions">
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        className="notificationsPageSearchInput"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="notificationsPagePrimaryBtn"
                        onClick={markAllAsRead}
                    >
                        Mark All Read
                    </button>
                </div>
            </div>

            <div className="notificationsPageList">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((item) => (
                        <div
                            key={item.id}
                            className={`notificationsPageItem ${
                                item.read ? "read" : "unread"
                            }`}
                        >
                            <div>
                                <h4>{item.title}</h4>
                                <p>{item.message}</p>
                            </div>

                            {!item.read && (
                                <button
                                    className="notificationsPageMiniBtn"
                                    onClick={() => markAsRead(item.id)}
                                >
                                    Mark Read
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="notificationsPageNoData">
                        No notifications found
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;