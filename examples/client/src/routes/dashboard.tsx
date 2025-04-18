import { useNavigate } from "react-router";


import { useState } from "react";
const mockUser = {
    name: "Lesly Williams",
    email: "lwilliams.devs@gmail.com",
    photo: "/mock-profile-pic.jpg",
};

const connectedApps = [
    { name: "Google Drive", icon: "📁", permissions: "Read/Write" },
    { name: "Google Calendar", icon: "📅", permissions: "Read only" },
    { name: "Gmail", icon: "✉️", permissions: "Send & read" },
];
const recentLogins = [
    { date: "April 7, 2025", location: "Miami, FL", device: "Chrome on macOS" },
    { date: "April 5, 2025", location: "Mobile", device: "Safari on iOS" },
];

export default function Dashboard() {
    const navigate = useNavigate();


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // add onclick {} to handle logout function on the button
    return (
        <div style={styles.container}>
            <aside style={{ ...styles.sidebar, width: isSidebarOpen ? "230px" : "60px" }}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.toggleButton}>
                    {isSidebarOpen ? "" : ""}
                </button>
                {isSidebarOpen && (
                    <>
                        <img
                            src="https://drive.google.com/uc?export=view&id=1bqy1IIbjP-GW_ba9eStV020NqagvAF5Z"
                            alt="Profile"
                            style={styles.profilePic}
                        />            <div style={styles.userInfo}>
                        <p style={styles.userName}>{mockUser.name}</p>
                        <p style={styles.userEmail}>{mockUser.email}</p>
                    </div>
                        <button style={styles.manageButton}>Manage Google Account</button>
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                        <button onClick={() => navigate("/")} style={styles.logoutButton}>Logout</button>
                    </>
                )}
            </aside>
            <main style={styles.mainContent}>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.topLeftButton}>
                    ☰
                </button>
                <h1 style={styles.title}>Welcome to Your Dashboard!</h1>
                <div style={styles.recentLoginsSection}>
                    <h2 style={styles.recentLoginsTitle}>Recent Logins</h2>
                    <ul style={styles.recentLoginsList}>
                        {recentLogins.map((login, index) => (
                            <li key={index} style={styles.recentLoginItem}>
                                <span style={styles.recentLoginDate}>{login.date}</span>
                                <span style={styles.recentLoginLocation}>{login.location}</span>
                                <span style={styles.recentLoginDevice}>{login.device}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={styles.oauthSection}>
                    <h2 style={styles.oauthTitle}>Connected Apps</h2>
                    <ul style={styles.oauthList}>
                        {connectedApps.map((app, index) => (
                            <li key={index} style={styles.oauthItem}>
                                <span style={styles.oauthIcon}>{app.icon}</span>
                                <span style={styles.oauthName}>{app.name}</span>
                                <span style={styles.oauthPermission}>{app.permissions}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        height: "100vh",
    },
    sidebar: {
        backgroundColor: "#091F40",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        transition: "width 0.3s ease",
    },
    profilePic: {
        width: "90px",
        height: "90px",
        position: "relative",
        top: -30,
        borderRadius: "50%",
        border: '1px solid rgb(0,0,0)',
        marginBottom: "20px",
    },
    manageButton: {
        padding: "10px 15px",
        marginBottom: "auto",
        backgroundColor: "#4285f4",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    logoutButton: {
        padding: "10px 15px",
        backgroundColor: "#d9534f",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    mainContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    title: {
        fontSize: "24px",
        position: "absolute",
        top: 70,
        color: "rgb(255,255,255)",
        marginBottom: "10px",
    },
    toggleButton: {
        background: "none",
        border: "none",
        fontSize: "18px",
        cursor: "pointer",
        marginBottom: "20px",
    },
    topLeftButton: {
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
    },
    userInfo: {
        textAlign: "center",
        marginBottom: "20px",
    },
    userName: {
        fontWeight: "bold",
        margin: "5px 0 0 0",
    },
    userEmail: {
        fontSize: "12px",
        margin: "0",
    },
    oauthSection: {
        marginTop: "40px",
        width: "100%",
        padding: "0 20px",
    },
    oauthTitle: {
        fontSize: "18px",
        marginBottom: "10px",
    },
    oauthList: {
        listStyleType: "none",
        padding: "0",
    },
    oauthItem: {
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #ccc",
    },
    oauthIcon: {
        marginRight: "10px",
        fontSize: "20px",
    },
    oauthName: {
        flex: 1,
        fontWeight: "bold",
    },
    oauthPermission: {
        fontStyle: "italic",
    },
    recentLoginsSection: {
        marginTop: "40px",
        width: "100%",
        padding: "0 20px",
    },
    recentLoginsTitle: {
        fontSize: "18px",
        marginBottom: "10px",
    },
    recentLoginsList: {
        listStyleType: "none",
        padding: "0",
    },
    recentLoginItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #ccc",
    },
    recentLoginDate: {
        flex: 1,
    },
    recentLoginLocation: {
        flex: 1,
    },
    recentLoginDevice: {
        flex: 1,
    },
};