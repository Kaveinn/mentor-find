// =====================================================
// DATA DEFAULT MENTORS
// =====================================================
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

// =====================================================
// FUNGSI LOCAL STORAGE
// =====================================================
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

// =====================================================
// FUNGSI NOTIFIKASI
// =====================================================
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
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3500);
}

// =====================================================
// FUNGSI UPDATE NAVBAR (INI YANG PENTING)
// =====================================================
function updateNavbar() {
    const navLinks = document.getElementById("mainNavLinks");
    const navActions = document.getElementById("mainNavActions");

    if (!navLinks || !navActions) {
        console.warn("Navbar elements not found. Pastikan id='mainNavLinks' dan id='mainNavActions' ada di HTML.");
        return;
    }

    const user = getCurrentUser();

    // ====================
    // KONDISI 1: BELUM LOGIN
    // ====================
    if (!user) {
        navLinks.innerHTML = `
            <a href="index.html" class="active">Beranda</a>
            <a href="search.html">Cari Pemateri</a>
            <a href="how-it-works.html">Cara Kerja</a>
            <a href="about.html">Tentang</a>
        `;

        navActions.innerHTML = `
            <a class="btn btn-ghost" href="login.html">Masuk</a>
            <a class="btn btn-primary" href="register.html">Daftar</a>
            <a class="btn btn-primary" href="become-mentor.html">Menjadi Pemateri</a>
        `;
        return;
    }

    // ====================
    // KONDISI 2: LOGIN SEBAGAI PEMATERI / MENTOR
    // ====================
    if (user.role === "mentor" || user.isMentor === true) {
        // Menu Tengah: Dashboard Pemateri disisipkan SETELAH Beranda
        navLinks.innerHTML = `
            <a href="index.html">Beranda</a>
            <a href="mentor-dashboard.html" class="active">Dashboard Pemateri</a>
            <a href="search.html">Cari Pemateri</a>
            <a href="how-it-works.html">Cara Kerja</a>
            <a href="about.html">Tentang</a>
        `;

        // Menu Kanan: HANYA Profil dan Tombol Keluar
        navActions.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">${getInitials(user.name)}</div>
                <div class="user-info">
                    <strong>${user.name}</strong>
                    <span>Pemateri</span>
                </div>
            </div>
            <button class="btn btn-ghost" onclick="logout()">Keluar</button>
        `;
        return;
    }

    // ====================
    // KONDISI 3: LOGIN SEBAGAI USER BIASA
    // ====================
    navLinks.innerHTML = `
        <a href="index.html" class="active">Beranda</a>
        <a href="search.html">Cari Pemateri</a>
        <a href="how-it-works.html">Cara Kerja</a>
        <a href="about.html">Tentang</a>
    `;

    navActions.innerHTML = `
        <div class="user-profile">
            <div class="user-avatar">${getInitials(user.name)}</div>
            <div class="user-info">
                <strong>${user.name}</strong>
                <span>Pengguna</span>
            </div>
        </div>
        <a class="btn btn-primary" href="become-mentor.html">Menjadi Pemateri</a>
        <button class="btn btn-ghost" onclick="logout()">Keluar</button>
    `;
}

// =====================================================
// FUNGSI AUTH (LOGIN & REGISTER)
// =====================================================
function handleAuthSubmit(event, type) {
    if (event) event.preventDefault();

    if (type === "login") {
        const root = event && event.target && event.target.tagName === "FORM" ? event.target : document;

        const emailInput =
            root.querySelector('#loginEmail') ||
            root.querySelector('input[type="email"]') ||
            root.querySelector('input[name="email"]');

        const passwordInput =
            root.querySelector('#loginPassword') ||
            root.querySelector('input[type="password"]') ||
            root.querySelector('input[name="password"]');

        const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            showNotification("Email dan password harus diisi.", "warning");
            return;
        }

        const users = getUsers();
        const user = users.find(
            item =>
                item.email &&
                item.email.toLowerCase() === email &&
                item.password === password
        );

        if (!user) {
            showNotification("Email atau password salah.", "error");
            return;
        }

        saveCurrentUser(user);
        showNotification("Login berhasil.", "success");

        setTimeout(() => {
            if (user.role === "mentor" || user.isMentor === true) {
                window.location.href = "mentor-dashboard.html";
            } else {
                window.location.href = "index.html";
            }
        }, 700);

        return;
    }

    if (type === "register") {
        handleRegister(event);
    }
}

function handleRegister(event) {
    if (event) event.preventDefault();

    let form = null;
    if (event && event.target) {
        if (event.target.tagName === "FORM") {
            form = event.target;
        } else {
            form = event.target.closest("form");
        }
    }
    if (!form) form = document.querySelector("form");
    if (!form) {
        showNotification("Formulir tidak ditemukan!", "error");
        return;
    }

    const nameInput = form.querySelector('#registerName') || form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('#registerEmail') || form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('#registerPassword') || form.querySelector('input[name="password"]') || form.querySelector('input[type="password"]');
    const roleSelect = form.querySelector('#registerRole') || form.querySelector('select[name="role"]') || form.querySelector("select");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    let roleValue = "user";
    if (roleSelect) {
        roleValue = roleSelect.value ? roleSelect.value.toLowerCase() : "";
        if (!roleValue && roleSelect.selectedIndex >= 0) {
            const selectedText = roleSelect.options[roleSelect.selectedIndex].text.toLowerCase();
            if (selectedText.includes("pemateri") || selectedText.includes("mentor")) {
                roleValue = "mentor";
            }
        }
    }

    const isMentor = roleValue.includes("mentor") || roleValue.includes("pemateri");

    if (!name) { showNotification("Nama Lengkap harus diisi.", "warning"); return; }
    if (!email) { showNotification("Email harus diisi.", "warning"); return; }
    if (!password) { showNotification("Password harus diisi.", "warning"); return; }

    const users = getUsers();
    const existingUser = users.find(u => u.email && u.email.toLowerCase() === email);

    if (existingUser) {
        showNotification("Email sudah terdaftar.", "error");
        return;
    }

    const userId = Date.now();
    const newUser = {
        id: userId,
        name: name,
        email: email,
        password: password,
        role: isMentor ? "mentor" : "user",
        isMentor: isMentor
    };

    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);

    if (isMentor) {
        const mentors = getSavedMentors();
        mentors.push({
            id: "mentor-" + userId,
            name: name,
            initials: getInitials(name),
            role: "Pemateri Baru",
            location: "Indonesia",
            city: "Indonesia",
            category: "Umum",
            exp: 1,
            rating: 5,
            skills: ["Pemateri"],
            desc: "Profil pemateri terdaftar.",
            portfolio: "Portofolio belum diisi.",
            userId: userId
        });
        saveMentors(mentors);
    }

    showNotification("Pendaftaran berhasil!", "success");

    setTimeout(() => {
        if (isMentor) {
            window.location.href = "mentor-dashboard.html";
        } else {
            window.location.href = "index.html";
        }
    }, 800);
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

// =====================================================
// FUNGSI PROTEKSI HALAMAN
// =====================================================
function protectPages() {
    const path = window.location.pathname.toLowerCase();

    const isLoginPage = path.includes("login.html") || path.endsWith("/login");
    const isRegisterPage = path.includes("register.html") || path.endsWith("/register");
    const isSearchPage = path.includes("search.html");
    const isBecomeMentorPage = path.includes("become-mentor.html");
    const isDashboardPage = path.includes("mentor-dashboard.html");
    const isHowItWorksPage = path.includes("how-it-works.html");
    const isAboutPage = path.includes("about.html");

    const user = getCurrentUser();

    // Halaman yang MEMBUTUHKAN login: search, become-mentor, dashboard
    if ((isSearchPage || isBecomeMentorPage || isDashboardPage) && !user) {
        window.location.href = "login.html";
        return;
    }

    // Halaman dashboard hanya untuk mentor
    if (isDashboardPage && user) {
        const isUserMentor = user.role === "mentor" || user.isMentor === true;
        if (!isUserMentor) {
            window.location.href = "index.html";
            return;
        }
    }

    // Halaman login/register: jika sudah login, redirect ke halaman sesuai role
    if ((isLoginPage || isRegisterPage) && user) {
        if (user.role === "mentor" || user.isMentor === true) {
            window.location.href = "mentor-dashboard.html";
        } else {
            window.location.href = "index.html";
        }
        return;
    }

    // Halaman how-it-works dan about: TIDAK butuh login, jadi tidak ada redirect
    // Halaman index: TIDAK butuh login
}

function protectSearchPage() {
    if (!isAuthenticated()) window.location.href = "login.html";
}

function protectBecomeMentorPage() {
    if (!isAuthenticated()) window.location.href = "login.html";
}

function protectMentorDashboard() {
    const user = getCurrentUser();
    if (!user) { window.location.href = "login.html"; return; }
    if (user.role !== "mentor" && user.isMentor !== true) window.location.href = "index.html";
}

// =====================================================
// FUNGSI MENTOR SUBMIT
// =====================================================
function handleMentorSubmit(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        showNotification("Silakan login terlebih dahulu.", "warning");
        return;
    }

    const role = document.getElementById("mentorRole")?.value || document.querySelector('[name="role"]')?.value || "";
    const location = document.getElementById("mentorLocation")?.value || document.querySelector('[name="location"]')?.value || "";
    const category = document.getElementById("mentorCategory")?.value || document.querySelector('[name="category"]')?.value || "";
    const experience = document.getElementById("mentorExperience")?.value || document.querySelector('[name="experience"]')?.value || 0;
    const description = document.getElementById("mentorDescription")?.value || document.querySelector('[name="description"]')?.value || "";
    const portfolio = document.getElementById("mentorPortfolio")?.value || document.querySelector('[name="portfolio"]')?.value || "";

    if (!role || !location || !category) {
        showNotification("Lengkapi data pemateri terlebih dahulu.", "warning");
        return;
    }

    const mentor = {
        id: "mentor-" + Date.now(),
        name: user.name,
        initials: getInitials(user.name),
        role: role,
        location: location,
        city: location,
        category: category,
        exp: Number(experience) || 0,
        rating: 5,
        skills: [],
        desc: description,
        portfolio: portfolio,
        userId: user.id
    };

    const mentors = getSavedMentors();
    mentors.push(mentor);
    saveMentors(mentors);

    user.role = "mentor";
    user.isMentor = true;
    saveCurrentUser(user);

    const users = getUsers();
    const index = users.findIndex(item => item.id === user.id);
    if (index !== -1) {
        users[index] = user;
        saveUsers(users);
    }

    showNotification("Profil pemateri berhasil dibuat.", "success");

    setTimeout(() => {
        window.location.href = "mentor-dashboard.html";
    }, 700);
}

// =====================================================
// FUNGSI FILTER & RENDER MENTOR
// =====================================================
function applyFilters() {
    const keyword = document.getElementById("searchKeyword")?.value.trim().toLowerCase() || "";
    const location = document.getElementById("filterLocation")?.value || "";
    const category = document.getElementById("filterCategory")?.value || "";
    const experience = Number(document.getElementById("filterExperience")?.value) || 0;
    const rating = Number(document.getElementById("filterRating")?.value) || 0;

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
        ].join(" ").toLowerCase();

        return (
            (!keyword || searchText.includes(keyword)) &&
            (!location || mentor.city === location) &&
            (!category || mentor.category === category) &&
            mentor.exp >= experience &&
            mentor.rating >= rating
        );
    });

    current = [...result];
    mentorsData = mentors;
    renderMentors();
}

function resetFilters() {
    document.querySelectorAll(".filter-panel input, .filter-panel select").forEach(element => {
        element.value = "";
    });

    mentorsData = getAllMentors();
    current = [...mentorsData];
    renderMentors();
}

let mentorsData = getAllMentors();
let current = [...mentorsData];

function renderMentors() {
    const grid = document.getElementById("mentorGrid");
    if (!grid) return;

    grid.innerHTML = "";

    current.forEach(mentor => {
        const index = mentorsData.findIndex(item => item.id === mentor.id);

        grid.innerHTML += `
            <article class="mentor-card" onclick="showProfile(${index})">
                <div class="mentor-head">
                    <div class="avatar avatar-sm">${mentor.initials}</div>
                    <div class="mentor-info">
                        <h3>${mentor.name}</h3>
                        <p>${mentor.role}</p>
                    </div>
                    <span class="verified-badge">✓ Verif</span>
                </div>
                <div class="mentor-location">⌖ ${mentor.location}, Indonesia</div>
                <div class="mentor-desc">${mentor.desc}</div>
                <div class="mentor-skills">
                    ${(mentor.skills || []).map(skill => `<span>${skill}</span>`).join("")}
                </div>
                <div class="mentor-meta">
                    <span>★ ${mentor.rating}</span>
                    <span>💼 ${mentor.exp} tahun pengalaman</span>
                </div>
            </article>
        `;
    });

    const resultCount = document.getElementById("resultCount");
    if (resultCount) {
        resultCount.textContent = `${current.length} pemateri ditemukan`;
    }
}

function showProfile(index) {
    if (!isAuthenticated()) {
        showNotification("Silakan login terlebih dahulu.", "warning");
        return;
    }

    const user = getCurrentUser();
    if (user.role === "mentor" || user.isMentor === true) {
        showNotification("Pemateri tidak dapat mencari pemateri lain.", "warning");
        return;
    }

    const mentor = mentorsData[index];
    if (!mentor) return;

    const profileContent = document.getElementById("profileContent");
    if (!profileContent) return;

    profileContent.innerHTML = `
        <div class="profile-detail">
            <div class="avatar">${mentor.initials}</div>
            <div>
                <span class="verified-badge">✓ Terverifikasi</span>
                <h2>${mentor.name}</h2>
                <p class="muted">${mentor.role}</p>
                <p class="muted">⌖ ${mentor.location} &nbsp; · &nbsp; ★ ${mentor.rating}</p>
            </div>
        </div>
        <div class="detail-label">KOMPETENSI</div>
        <div class="detail-list">
            ${(mentor.skills || []).map(skill => `<span>${skill}</span>`).join("")}
        </div>
        <div class="detail-label">PENGALAMAN</div>
        <p class="muted">${mentor.exp} tahun pengalaman profesional.</p>
        <div class="portfolio">
            <h4>Portofolio</h4>
            <p>${mentor.portfolio}</p>
        </div>
    `;

    openModal("profileModal");
}

// =====================================================
// FUNGSI MODAL & MENU
// =====================================================
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

function switchModal(closeId, openId) {
    closeModal(closeId);
    openModal(openId);
}

function toggleMenu() {
    const nav = document.querySelector(".nav-links");
    const menuButton = document.querySelector(".mobile-menu");
    if (!nav) return;

    const isOpen = nav.classList.toggle("active");

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.innerHTML = isOpen ? "✕" : "☰";
    }
}

// =====================================================
// FUNGSI HERO SEARCH
// =====================================================
function handleHeroSearch(event) {
    const keyword = document.getElementById("heroKeyword")?.value.trim() || "";
    const location = document.getElementById("heroLocation")?.value.trim() || "";
    const url = `search.html?q=${encodeURIComponent(keyword)}&loc=${encodeURIComponent(location)}`;
    window.location.href = url;
    return false;
}

function handlePopularClick(keyword) {
    window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
}

// =====================================================
// DOMCONTENTLOADED (INI YANG MENJALANKAN SEMUANYA)
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
    // Tambahkan tombol mobile menu jika belum ada
    const navbar = document.querySelector(".navbar");
    if (navbar && !navbar.querySelector(".mobile-menu")) {
        const menuButton = document.createElement("button");
        menuButton.className = "mobile-menu";
        menuButton.type = "button";
        menuButton.setAttribute("aria-label", "Buka menu");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.innerHTML = "☰";
        menuButton.addEventListener("click", toggleMenu);
        navbar.appendChild(menuButton);
    } else if (navbar && navbar.querySelector(".mobile-menu")) {
        navbar.querySelector(".mobile-menu").addEventListener("click", toggleMenu);
    }

    // Jalankan proteksi halaman dan update navbar
    protectPages();
    updateNavbar(); // <--- INI YANG MEMBUAT NAVBAR BERUBAH

    // Render mentor jika ada grid
    if (document.getElementById("mentorGrid")) {
        const user = getCurrentUser();
        if (!user || (user.role !== "mentor" && user.isMentor !== true)) {
            mentorsData = getAllMentors();
            current = [...mentorsData];
            renderMentors();
        }
    }
});

window.addEventListener("click", event => {
    if (event.target.classList.contains("modal")) {
        closeModal(event.target.id);
    }
});