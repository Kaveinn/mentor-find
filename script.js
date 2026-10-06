const defaultMentors = [
    {
        id: "mentor-001",
        name: "Andi Saputra",
        initials: "AS",
        role: "Web Development & Software",
        location: "Malang",
        city: "Malang",
        category: "Teknologi",
        exp: 6,
        rating: 4.9,
        skills: ["JavaScript", "React", "Node.js"],
        desc: "Praktisi software dan mentor pengembangan aplikasi web modern.",
        portfolio: "Membangun platform e-commerce dan sistem informasi kampus.",
        userId: null
    },
    {
        id: "mentor-002",
        name: "Nadia Putri",
        initials: "NP",
        role: "UI/UX & Product Design",
        location: "Surabaya",
        city: "Surabaya",
        category: "Desain",
        exp: 5,
        rating: 4.8,
        skills: ["UI/UX", "Figma", "Design Thinking"],
        desc: "Designer yang berfokus pada pengalaman pengguna dan produk digital.",
        portfolio: "Merancang aplikasi edukasi dan dashboard layanan publik.",
        userId: null
    },
    {
        id: "mentor-003",
        name: "Rizky Pratama",
        initials: "RP",
        role: "IoT & Elektronika",
        location: "Malang",
        city: "Malang",
        category: "Elektronika",
        exp: 4,
        rating: 4.9,
        skills: ["Arduino", "IoT", "ESP32"],
        desc: "Pengembang perangkat IoT untuk monitoring dan otomasi berbasis sensor.",
        portfolio: "Prototype smart chiller dan sistem monitoring energi.",
        userId: null
    },
    {
        id: "mentor-004",
        name: "Salsa Maharani",
        initials: "SM",
        role: "Digital Marketing",
        location: "Jakarta",
        city: "Jakarta",
        category: "Marketing",
        exp: 7,
        rating: 4.7,
        skills: ["SEO", "Social Media", "Analytics"],
        desc: "Konsultan pemasaran digital untuk brand, UMKM, dan organisasi.",
        portfolio: "Kampanye digital untuk beberapa brand lokal dan startup.",
        userId: null
    },
    {
        id: "mentor-005",
        name: "Fajar Ramadhan",
        initials: "FR",
        role: "Business & Entrepreneurship",
        location: "Yogyakarta",
        city: "Yogyakarta",
        category: "Bisnis",
        exp: 9,
        rating: 4.8,
        skills: ["Startup", "Business", "Pitching"],
        desc: "Mentor bisnis dengan fokus pada validasi ide dan pengembangan startup.",
        portfolio: "Mendampingi program inkubasi dan workshop kewirausahaan.",
        userId: null
    },
    {
        id: "mentor-006",
        name: "Dina Lestari",
        initials: "DL",
        role: "Pendidikan & Public Speaking",
        location: "Bandung",
        city: "Bandung",
        category: "Pendidikan",
        exp: 10,
        rating: 4.9,
        skills: ["Public Speaking", "Teaching", "Leadership"],
        desc: "Fasilitator pelatihan dengan pengalaman mengajar dan berbicara di berbagai forum.",
        portfolio: "Pelatihan komunikasi, kepemimpinan, dan pengembangan diri.",
        userId: null
    }
];

function getUsers() {
    return JSON.parse(localStorage.getItem("mentorfind_users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("mentorfind_users", JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("mentorfind_user"));
}

function saveCurrentUser(user) {
    localStorage.setItem("mentorfind_user", JSON.stringify(user));
}

function isAuthenticated() {
    return !!getCurrentUser();
}

function getSavedMentors() {
    return JSON.parse(localStorage.getItem("mentorfind_mentors")) || [];
}

function saveMentors(mentors) {
    localStorage.setItem("mentorfind_mentors", JSON.stringify(mentors));
}

function getAllMentors() {
    return [...defaultMentors, ...getSavedMentors()];
}

function getInitials(name) {
    if (!name) return "U";

    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

function showNotification(message, type = "success") {
    let container = document.getElementById("notificationContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "notificationContainer";
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    let icon = "✓";

    if (type === "error") icon = "✕";
    if (type === "warning") icon = "!";

    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">${message}</div>
        <button
            class="notification-close"
            onclick="this.parentElement.remove()"
        >×</button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("hide");

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3500);
}

function updateNavbar() {
    const navActions = document.querySelector(".nav-actions");

    if (!navActions) return;

    const user = getCurrentUser();

    if (!user) {
        navActions.innerHTML = `
            <button
                class="btn btn-ghost"
                onclick="window.location.href='login.html'"
            >
                Masuk
            </button>

            <button
                class="btn btn-primary"
                onclick="window.location.href='register.html'"
            >
                Daftar
            </button>
        `;

        return;
    }

    if (user.role === "mentor" || user.isMentor === true) {
        navActions.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    ${getInitials(user.name)}
                </div>

                <div class="user-info">
                    <strong>${user.name}</strong>
                    <span>Pemateri</span>
                </div>
            </div>

            <a
                class="btn btn-primary"
                href="mentor-dashboard.html"
            >
                Dashboard Pemateri
            </a>

            <button
                class="btn btn-ghost"
                onclick="logout()"
            >
                Keluar
            </button>
        `;

        return;
    }

    navActions.innerHTML = `
        <div class="user-profile">
            <div class="user-avatar">
                ${getInitials(user.name)}
            </div>

            <div class="user-info">
                <strong>${user.name}</strong>
                <span>Pengguna</span>
            </div>
        </div>

        <a
            class="btn btn-primary"
            href="search.html"
        >
            Cari Pemateri
        </a>

        <a
            class="btn btn-ghost"
            href="become-mentor.html"
        >
            Menjadi Pemateri
        </a>

        <button
            class="btn btn-ghost"
            onclick="logout()"
        >
            Keluar
        </button>
    `;
}

function handleAuthSubmit(event, type) {
    event.preventDefault();

    if (type === "login") {
        const emailInput =
            document.getElementById("loginEmail") ||
            document.querySelector('input[type="email"]');

        const passwordInput =
            document.getElementById("loginPassword") ||
            document.querySelector('input[type="password"]');

        const email = emailInput
            ? emailInput.value.trim().toLowerCase()
            : "";

        const password = passwordInput
            ? passwordInput.value
            : "";

        const users = getUsers();

        const user = users.find(
            item =>
                item.email &&
                item.email.toLowerCase() === email &&
                item.password === password
        );

        if (!user) {
            showNotification(
                "Email atau password salah.",
                "error"
            );
            return;
        }

        saveCurrentUser(user);

        showNotification(
            "Login berhasil.",
            "success"
        );

        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);

        return;
    }

    if (type === "register") {
        handleRegister(event);
    }
}

function handleRegister(event) {
    event.preventDefault();

    const nameInput =
        document.getElementById("registerName") ||
        document.querySelector('input[name="name"]');

    const emailInput =
        document.getElementById("registerEmail") ||
        document.querySelector('input[type="email"]');

    const passwordInput =
        document.getElementById("registerPassword") ||
        document.querySelector('input[type="password"]');

    const name = nameInput
        ? nameInput.value.trim()
        : "";

    const email = emailInput
        ? emailInput.value.trim().toLowerCase()
        : "";

    const password = passwordInput
        ? passwordInput.value
        : "";

    if (!name || !email || !password) {
        showNotification(
            "Semua data harus diisi.",
            "warning"
        );
        return;
    }

    const users = getUsers();

    const existingUser = users.find(
        user =>
            user.email &&
            user.email.toLowerCase() === email
    );

    if (existingUser) {
        showNotification(
            "Email sudah terdaftar.",
            "error"
        );
        return;
    }

    const user = {
        id: Date.now(),
        name,
        email,
        password,
        role: "user",
        isMentor: false
    };

    users.push(user);
    saveUsers(users);
    saveCurrentUser(user);

    showNotification(
        "Pendaftaran berhasil.",
        "success"
    );

    setTimeout(() => {
        window.location.href = "index.html";
    }, 700);
}

function handleLogin(event) {
    handleAuthSubmit(event, "login");
}

function logout() {
    localStorage.removeItem("mentorfind_user");
    localStorage.removeItem("mentorfind_active_user");

    window.location.href = "index.html";
}

function handleLogout() {
    logout();
}

function protectPages() {
    const path = window.location.pathname.toLowerCase();

    const isLoginPage =
        path.includes("login.html") ||
        path.endsWith("/login");

    const isRegisterPage =
        path.includes("register.html") ||
        path.endsWith("/register");

    const isSearchPage =
        path.includes("search.html");

    const isBecomeMentorPage =
        path.includes("become-mentor.html");

    const isDashboardPage =
        path.includes("mentor-dashboard.html");

    const user = getCurrentUser();

    if (
        (isSearchPage ||
            isBecomeMentorPage ||
            isDashboardPage) &&
        !user
    ) {
        window.location.href = "login.html";
        return;
    }

    if (
        isDashboardPage &&
        user &&
        user.role !== "mentor" &&
        user.isMentor !== true
    ) {
        window.location.href = "index.html";
        return;
    }

    if (
        (isLoginPage || isRegisterPage) &&
        user
    ) {
        window.location.href = "index.html";
    }
}

function protectSearchPage() {
    if (!isAuthenticated()) {
        window.location.href = "login.html";
    }
}

function protectBecomeMentorPage() {
    if (!isAuthenticated()) {
        window.location.href = "login.html";
    }
}

function protectMentorDashboard() {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (
        user.role !== "mentor" &&
        user.isMentor !== true
    ) {
        window.location.href = "index.html";
    }
}

function handleMentorSubmit(event) {
    event.preventDefault();

    const user = getCurrentUser();

    if (!user) {
        showNotification(
            "Silakan login terlebih dahulu.",
            "warning"
        );
        return;
    }

    const form = event.target;

    const role =
        form.querySelector(
            '[name="role"]'
        )?.value ||
        document.getElementById("mentorRole")?.value ||
        "";

    const location =
        form.querySelector(
            '[name="location"]'
        )?.value ||
        document.getElementById("mentorLocation")?.value ||
        "";

    const category =
        form.querySelector(
            '[name="category"]'
        )?.value ||
        document.getElementById("mentorCategory")?.value ||
        "";

    const experience =
        form.querySelector(
            '[name="experience"]'
        )?.value ||
        document.getElementById("mentorExperience")?.value ||
        0;

    const description =
        form.querySelector(
            '[name="description"]'
        )?.value ||
        document.getElementById("mentorDescription")?.value ||
        "";

    const portfolio =
        form.querySelector(
            '[name="portfolio"]'
        )?.value ||
        document.getElementById("mentorPortfolio")?.value ||
        "";

    if (!role || !location || !category) {
        showNotification(
            "Lengkapi data pemateri terlebih dahulu.",
            "warning"
        );
        return;
    }

    const mentor = {
        id: "mentor-" + Date.now(),
        name: user.name,
        initials: getInitials(user.name),
        role,
        location,
        city: location,
        category,
        exp: Number(experience) || 0,
        rating: 5,
        skills: [],
        desc: description,
        portfolio,
        userId: user.id
    };

    const mentors = getSavedMentors();

    mentors.push(mentor);
    saveMentors(mentors);

    user.role = "mentor";
    user.isMentor = true;

    saveCurrentUser(user);

    const users = getUsers();

    const index = users.findIndex(
        item => item.id === user.id
    );

    if (index !== -1) {
        users[index] = user;
        saveUsers(users);
    }

    showNotification(
        "Profil pemateri berhasil dibuat.",
        "success"
    );

    setTimeout(() => {
        window.location.href =
            "mentor-dashboard.html";
    }, 700);
}

function applyFilters() {
    const keyword =
        document.getElementById("searchKeyword")?.value
            .trim()
            .toLowerCase() || "";

    const location =
        document.getElementById("filterLocation")?.value ||
        "";

    const category =
        document.getElementById("filterCategory")?.value ||
        "";

    const experience =
        Number(
            document.getElementById("filterExperience")?.value
        ) || 0;

    const rating =
        Number(
            document.getElementById("filterRating")?.value
        ) || 0;

    const mentors = getAllMentors();

    const result = mentors.filter(mentor => {
        const searchText = [
            mentor.name,
            mentor.role,
            mentor.location,
            mentor.city,
            mentor.category,
            mentor.desc,
            ...(mentor.skills || [])
        ]
            .join(" ")
            .toLowerCase();

        return (
            (!keyword ||
                searchText.includes(keyword)) &&
            (!location ||
                mentor.city === location) &&
            (!category ||
                mentor.category === category) &&
            mentor.exp >= experience &&
            mentor.rating >= rating
        );
    });

    current = [...result];
    mentorsData = mentors;

    renderMentors();
}

function resetFilters() {
    document
        .querySelectorAll(
            ".filter-panel input, .filter-panel select"
        )
        .forEach(element => {
            element.value = "";
        });

    mentorsData = getAllMentors();
    current = [...mentorsData];

    renderMentors();
}

let mentorsData = getAllMentors();
let current = [...mentorsData];

function renderMentors() {
    const grid =
        document.getElementById("mentorGrid");

    if (!grid) return;

    grid.innerHTML = "";

    current.forEach(mentor => {
        const index =
            mentorsData.findIndex(
                item => item.id === mentor.id
            );

        grid.innerHTML += `
            <article
                class="mentor-card"
                onclick="showProfile(${index})"
            >
                <div class="mentor-head">
                    <div class="avatar avatar-sm">
                        ${mentor.initials}
                    </div>

                    <div class="mentor-info">
                        <h3>${mentor.name}</h3>
                        <p>${mentor.role}</p>
                    </div>

                    <span class="verified-badge">
                        ✓ Verif
                    </span>
                </div>

                <div class="mentor-location">
                    ⌖ ${mentor.location}, Indonesia
                </div>

                <div class="mentor-desc">
                    ${mentor.desc}
                </div>

                <div class="mentor-skills">
                    ${(mentor.skills || [])
                        .map(
                            skill =>
                                `<span>${skill}</span>`
                        )
                        .join("")}
                </div>

                <div class="mentor-meta">
                    <span>
                        ★ ${mentor.rating}
                    </span>

                    <span>
                        💼 ${mentor.exp} tahun pengalaman
                    </span>
                </div>
            </article>
        `;
    });

    const resultCount =
        document.getElementById("resultCount");

    if (resultCount) {
        resultCount.textContent =
            `${current.length} pemateri ditemukan`;
    }
}

function showProfile(index) {
    if (!isAuthenticated()) {
        showNotification(
            "Silakan login terlebih dahulu.",
            "warning"
        );
        return;
    }

    const user = getCurrentUser();

    if (
        user.role === "mentor" ||
        user.isMentor === true
    ) {
        showNotification(
            "Pemateri tidak dapat mencari pemateri lain.",
            "warning"
        );
        return;
    }

    const mentor = mentorsData[index];

    if (!mentor) return;

    const profileContent =
        document.getElementById(
            "profileContent"
        );

    if (!profileContent) return;

    profileContent.innerHTML = `
        <div class="profile-detail">
            <div class="avatar">
                ${mentor.initials}
            </div>

            <div>
                <span class="verified-badge">
                    ✓ Terverifikasi
                </span>

                <h2>${mentor.name}</h2>

                <p class="muted">
                    ${mentor.role}
                </p>

                <p class="muted">
                    ⌖ ${mentor.location}
                    &nbsp; · &nbsp;
                    ★ ${mentor.rating}
                </p>
            </div>
        </div>

        <div class="detail-label">
            KOMPETENSI
        </div>

        <div class="detail-list">
            ${(mentor.skills || [])
                .map(
                    skill =>
                        `<span>${skill}</span>`
                )
                .join("")}
        </div>

        <div class="detail-label">
            PENGALAMAN
        </div>

        <p class="muted">
            ${mentor.exp}
            tahun pengalaman profesional.
        </p>

        <div class="portfolio">
            <h4>Portofolio</h4>

            <p>
                ${mentor.portfolio}
            </p>
        </div>
    `;

    openModal("profileModal");
}

function openModal(id) {
    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("show");
    document.body.style.overflow = "";
}

function switchModal(closeId, openId) {
    closeModal(closeId);
    openModal(openId);
}

/* ================================
   MOBILE MENU - FIX
================================ */

function toggleMenu() {
    const navbar =
        document.querySelector(".navbar");

    if (!navbar) return;

    const nav =
        navbar.querySelector("nav");

    const navLinks =
        navbar.querySelector(".nav-links");

    const navActions =
        navbar.querySelector(".nav-actions");

    const menuButton =
        navbar.querySelector(".mobile-menu");

    const isOpen =
        navbar.classList.toggle(
            "mobile-menu-open"
        );

    if (nav) {
        nav.classList.toggle(
            "mobile-open",
            isOpen
        );
    }

    if (navLinks) {
        navLinks.classList.toggle(
            "mobile-open",
            isOpen
        );
    }

    if (navActions) {
        navActions.classList.toggle(
            "mobile-open",
            isOpen
        );
    }

    if (menuButton) {
        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.innerHTML =
            isOpen ? "✕" : "☰";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const navbar =
            document.querySelector(
                ".navbar"
            );

        if (
            navbar &&
            !navbar.querySelector(
                ".mobile-menu"
            )
        ) {
            const menuButton =
                document.createElement(
                    "button"
                );

            menuButton.className =
                "mobile-menu";

            menuButton.type =
                "button";

            menuButton.setAttribute(
                "aria-label",
                "Buka menu"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.innerHTML =
                "☰";

            menuButton.addEventListener(
                "click",
                toggleMenu
            );

            navbar.appendChild(
                menuButton
            );
        }

        protectPages();
        updateNavbar();

        if (
            document.getElementById(
                "mentorGrid"
            )
        ) {
            const user =
                getCurrentUser();

            if (
                user &&
                user.role !== "mentor" &&
                user.isMentor !== true
            ) {
                mentorsData =
                    getAllMentors();

                current =
                    [...mentorsData];

                renderMentors();
            }
        }
    }
);

window.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {
            closeModal(
                event.target.id
            );
        }
    }
);

document.addEventListener(
    "click",
    event => {

        const link =
            event.target.closest(
                ".nav-links a"
            );

        if (!link) return;

        const navbar =
            document.querySelector(
                ".navbar"
            );

        if (!navbar) return;

        const nav =
            navbar.querySelector(
                "nav"
            );

        const navLinks =
            navbar.querySelector(
                ".nav-links"
            );

        const navActions =
            navbar.querySelector(
                ".nav-actions"
            );

        navbar.classList.remove(
            "mobile-menu-open"
        );

        if (nav) {
            nav.classList.remove(
                "mobile-open"
            );
        }

        if (navLinks) {
            navLinks.classList.remove(
                "mobile-open"
            );
        }

        if (navActions) {
            navActions.classList.remove(
                "mobile-open"
            );
        }

        const menuButton =
            navbar.querySelector(
                ".mobile-menu"
            );

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.innerHTML =
                "☰";
        }
    }
);