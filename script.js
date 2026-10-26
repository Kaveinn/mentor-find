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
// KONFIGURASI FIREBASE (Asumsi db sudah diinisialisasi di HTML)
// =====================================================

// =====================================================
// FUNGSI FIRESTORE (PENGGANTI LOCALSTORAGE)
// =====================================================

async function getUsers() {
    try {
        const snapshot = await db.collection("users").get();
        const users = [];
        snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        console.error("Error getUsers:", error);
        return [];
    }
}

async function saveUsers(users) {
    try {
        const batch = db.batch();
        const snapshot = await db.collection("users").get();
        snapshot.forEach(doc => batch.delete(doc.ref));
        
        users.forEach(user => {
            const ref = db.collection("users").doc(String(user.id));
            batch.set(ref, user);
        });
        
        await batch.commit();
    } catch (error) {
        console.error("Error saveUsers:", error);
    }
}

// =====================================================
// FUNGSI SESSION (SINKRON - TIDAK PAKAI ASYNC)
// =====================================================
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("bicara_user"));
}

async function saveCurrentUser(user) {
    localStorage.setItem("bicara_user", JSON.stringify(user));
    if (user && user.id) {
        try {
            await db.collection("users").doc(String(user.id)).set(user);
        } catch (error) {
            console.error("Error saveCurrentUser:", error);
        }
    }
}

// =====================================================
// FUNGSI MENTOR
// =====================================================
async function getSavedMentors() {
    try {
        const snapshot = await db.collection("mentors").get();
        const mentors = [];
        snapshot.forEach(doc => mentors.push({ id: doc.id, ...doc.data() }));
        return mentors;
    } catch (error) {
        console.error("Error getSavedMentors:", error);
        return [];
    }
}

async function saveMentors(mentors) {
    try {
        const batch = db.batch();
        const snapshot = await db.collection("mentors").get();
        snapshot.forEach(doc => batch.delete(doc.ref));
        
        mentors.forEach(mentor => {
            const ref = db.collection("mentors").doc(String(mentor.id));
            batch.set(ref, mentor);
        });
        
        await batch.commit();
    } catch (error) {
        console.error("Error saveMentors:", error);
    }
}

async function getAllMentors() {
    const savedMentors = await getSavedMentors();
    return [...defaultMentors, ...savedMentors];
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

function isMentorProfileComplete(mentor) {
    if (!mentor) return false;
    if (mentor.userId === null || mentor.userId === undefined) return true;

    const hasPhone = mentor.phone && String(mentor.phone).replace(/\D/g, "").length >= 10;
    const hasSkills = mentor.skills && mentor.skills.length > 0;
    const hasCV = mentor.cv && mentor.cv !== "null" && mentor.cv !== "";

    return hasPhone && hasSkills && hasCV;
}

async function updateStatistics() {
    const allMentors = await getAllMentors(); 
    const validMentors = allMentors.filter(mentor => isMentorProfileComplete(mentor));

    const totalMentors = validMentors.length;
    
    const allSkills = new Set();
    validMentors.forEach(mentor => {
        (mentor.skills || []).forEach(skill => {
            if (skill && skill.trim() !== "") allSkills.add(skill.toLowerCase().trim());
        });
    });
    const totalSkills = allSkills.size;

    const allLocations = new Set();
    validMentors.forEach(mentor => {
        if (mentor.location) allLocations.add(mentor.location.toLowerCase().trim());
    });
    const totalLocations = allLocations.size;

    let totalRating = 0;
    validMentors.forEach(mentor => {
        totalRating += (mentor.rating || 0);
    });
    const avgRating = totalMentors > 0 ? (totalRating / totalMentors) : 0;

    const elMentors = document.getElementById("statMentors");
    if (elMentors) elMentors.textContent = `${totalMentors}+`;

    const elSkills = document.getElementById("statSkills");
    if (elSkills) elSkills.textContent = `${totalSkills}+`;

    const elLocations = document.getElementById("statLocations");
    if (elLocations) elLocations.textContent = `${totalLocations}+`;

    const elRating = document.getElementById("statRating");
    if (elRating) elRating.textContent = `${avgRating.toFixed(1)}/5`;
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
// FUNGSI NAVBAR (MENGGUNAKAN getCurrentUser SINKRON)
// =====================================================
function updateNavbar() {
    const navLinks = document.getElementById("mainNavLinks");
    const navActions = document.getElementById("mainNavActions");

    if (!navLinks || !navActions) return;

    const user = getCurrentUser(); // SINKRON, tidak pakai await

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
        `;
        return;
    }

    if (user.role === "mentor" || user.isMentor === true) {
        navLinks.innerHTML = `
            <a href="index.html">Beranda</a>
            <a href="mentor-dashboard.html" class="active">Dashboard Pemateri</a>
            <a href="search.html">Cari Pemateri</a>
            <a href="how-it-works.html">Cara Kerja</a>
            <a href="about.html">Tentang</a>
        `;

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
        <button class="btn btn-ghost" onclick="logout()">Keluar</button>
    `;
}

// =====================================================
// FUNGSI AUTH (LOGIN & REGISTER)
// =====================================================
async function handleAuthSubmit(event, type) {
    if (event) event.preventDefault();

    if (type === "login") {
        const root = event && event.target && event.target.tagName === "FORM" ? event.target : document;

        const emailInput = root.querySelector('#loginEmail') || root.querySelector('input[type="email"]');
        const passwordInput = root.querySelector('#loginPassword') || root.querySelector('input[type="password"]');

        const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            showNotification("Email dan password harus diisi.", "warning");
            return;
        }

        const users = await getUsers(); 
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

        await saveCurrentUser(user); 
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

async function handleRegister(event) {
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
    if (password.length < 6) {
        showNotification("Password minimal 6 karakter.", "warning");
        return;
    }

    const users = await getUsers(); 
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
        phone: "",
        role: isMentor ? "mentor" : "user",
        isMentor: isMentor,
        profileCompleted: false
    };

    users.push(newUser);
    await saveUsers(users); 
    await saveCurrentUser(newUser); 

    if (isMentor) {
        showNotification("Pendaftaran berhasil! Silakan lengkapi profil Anda.", "success");
    } else {
        showNotification("Pendaftaran berhasil!", "success");
    }

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
    localStorage.removeItem("bicara_user");
    localStorage.removeItem("bicara_active_user");
    document.body.style.overflow = "";
    window.location.href = "index.html";
}

// =====================================================
// FUNGSI PROTEKSI HALAMAN (MENGGUNAKAN getCurrentUser SINKRON)
// =====================================================
function protectPages() {
    const path = window.location.pathname.toLowerCase();

    const isLoginPage = path.includes("login.html") || path.endsWith("/login");
    const isRegisterPage = path.includes("register.html") || path.endsWith("/register");
    const isSearchPage = path.includes("search.html");
    const isBecomeMentorPage = path.includes("become-mentor.html");
    const isDashboardPage = path.includes("mentor-dashboard.html");

    const user = getCurrentUser(); // SINKRON

    if ((isSearchPage || isBecomeMentorPage || isDashboardPage) && !user) {
        window.location.href = "login.html";
        return;
    }

    if (isDashboardPage && user) {
        const isUserMentor = user.role === "mentor" || user.isMentor === true;
        if (!isUserMentor) {
            window.location.href = "index.html";
            return;
        }
    }

    if ((isLoginPage || isRegisterPage) && user) {
        if (user.role === "mentor" || user.isMentor === true) {
            window.location.href = "mentor-dashboard.html";
        } else {
            window.location.href = "index.html";
        }
        return;
    }
}

// =====================================================
// FUNGSI FILTER & RENDER MENTOR
// =====================================================
async function applyFilters() {
    const keyword = document.getElementById("searchKeyword")?.value.trim().toLowerCase() || "";
    const location = document.getElementById("filterLocation")?.value || "";
    const category = document.getElementById("filterCategory")?.value || "";
    const experience = Number(document.getElementById("filterExperience")?.value) || 0;
    const rating = Number(document.getElementById("filterRating")?.value) || 0;

    const mentors = await getAllMentors(); 

    const result = mentors.filter(mentor => {
        if (!isMentorProfileComplete(mentor)) return false;

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
    await renderMentors(); 
}

async function resetFilters() {
    document.querySelectorAll(".filter-panel input, .filter-panel select").forEach(element => {
        element.value = "";
    });

    mentorsData = await getAllMentors(); 
    current = [...mentorsData];
    await renderMentors(); 
}

let mentorsData = []; 
let current = [];

async function renderMentors() {
    const grid = document.getElementById("mentorGrid");
    if (!grid) return;

    grid.innerHTML = "";

    const validMentors = current.filter(mentor => isMentorProfileComplete(mentor));

    if (validMentors.length === 0) {
        grid.innerHTML = `
            <div class="empty">
                <div>🔍</div>
                <p>Belum ada pemateri yang cocok dengan kriteria Anda.</p>
            </div>
        `;
    } else {
        validMentors.forEach(mentor => {
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
    }

    const resultCount = document.getElementById("resultCount");
    if (resultCount) {
        resultCount.textContent = `${validMentors.length} pemateri ditemukan`;
    }
}

function showProfile(index) {
    if (!isAuthenticated()) {
        showNotification("Silakan login terlebih dahulu.", "warning");
        return;
    }

    const user = getCurrentUser(); // SINKRON
    if (user.role === "mentor" || user.isMentor === true) {
        showNotification("Pemateri tidak dapat mencari pemateri lain.", "warning");
        return;
    }

    const mentor = mentorsData[index];
    if (!mentor) return;

    const profileContent = document.getElementById("profileContent");
    if (!profileContent) return;

    let waNumber = mentor.phone ? mentor.phone.replace(/\D/g, "") : "";
    if (waNumber.startsWith("0")) {
        waNumber = "62" + waNumber.substring(1);
    }

    const waMessage = encodeURIComponent(
        `Halo ${mentor.name}, saya menemukan profil Anda di BICARA. Saya tertarik untuk mengundang Anda sebagai pemateri.`
    );

    const waLink = waNumber
        ? `https://wa.me/${waNumber}?text=${waMessage}`
        : "#";

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

        ${mentor.photo ? `
            <div class="detail-label">FOTO PORTOFOLIO</div>
            <img src="${mentor.photo}" alt="Portofolio ${mentor.name}" 
                 style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin-top: 8px;">
        ` : ""}

        <div class="portfolio">
            <h4>Portofolio</h4>
            <p>${mentor.portfolio}</p>
            ${mentor.cv ? `
                <a href="${mentor.cv}" download="CV-${mentor.name}.pdf" 
                   class="btn btn-ghost" 
                   style="margin-top: 10px; display: inline-flex; align-items: center; gap: 6px;">
                    📄 Download CV
                </a>
            ` : ""}
        </div>

        <div class="contact-section">
            <h4>Hubungi Pemateri</h4>
            <p class="muted">Diskusikan kebutuhan acara Anda langsung dengan pemateri.</p>
            ${waNumber ? `
                <a class="btn btn-primary full btn-wa" href="${waLink}" target="_blank" rel="noopener">
                    💬 Hubungi via WhatsApp
                </a>
            ` : `
                <p class="muted" style="text-align:center; padding: 10px; background: #f5f5fa; border-radius: 8px;">
                    Nomor WhatsApp belum tersedia.
                </p>
            `}
        </div>
    `;

    openModal("profileModal");
}

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

function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    const menuButton = document.querySelector(".mobile-menu");

    if (!navLinks) return;

    const isOpen = navLinks.classList.toggle("active");

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.innerHTML = isOpen ? "✕" : "☰";
    }
}

document.addEventListener("click", function (event) {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;

    if (event.target.closest(".nav-links a")) {
        navLinks.classList.remove("active");
        const menuButton = document.querySelector(".mobile-menu");
        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.innerHTML = "☰";
        }
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
        const navLinks = document.querySelector(".nav-links");
        const menuButton = document.querySelector(".mobile-menu");
        if (navLinks) navLinks.classList.remove("active");
        if (menuButton) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.innerHTML = "☰";
        }
    }
    
    const openModal = document.querySelector(".modal.show");
    if (!openModal) {
        document.body.style.overflow = ""; 
    }
});

async function openEditProfileModal() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;

    const mentors = await getSavedMentors(); 
    const mentor = mentors.find(item => item.userId === user.id);

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }

    if (mentor) {
        setValue("editRole", mentor.role || "");
        setValue("editLocation", mentor.location || "");
        setValue("editCategory", mentor.category || "Umum");
        setValue("editExperience", mentor.exp || 0);
        setValue("editPhone", mentor.phone || user.phone || "");
    } else {
        setValue("editPhone", user.phone || "");
    }

    openModal("editProfileModal");
}

async function saveMentorProfile() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;

    const role = document.getElementById("editRole").value.trim();
    const location = document.getElementById("editLocation").value.trim();
    const category = document.getElementById("editCategory").value;
    const experience = Number(document.getElementById("editExperience").value) || 0;
    const phone = document.getElementById("editPhone").value.trim();

    if (!role) { showNotification("Bidang keahlian wajib diisi.", "warning"); return; }
    if (!location) { showNotification("Domisili wajib diisi.", "warning"); return; }
    if (!phone) { showNotification("Nomor WhatsApp wajib diisi.", "warning"); return; }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        showNotification("Format nomor WA tidak valid (10-15 digit).", "warning");
        return;
    }

    user.phone = phone;
    user.profileCompleted = true;
    await saveCurrentUser(user); 

    const users = await getUsers(); 
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].phone = phone;
        users[userIndex].profileCompleted = true;
        await saveUsers(users); 
    }

    const mentors = await getSavedMentors(); 
    const mentorIndex = mentors.findIndex(item => item.userId === user.id);
    const existing = mentorIndex !== -1 ? mentors[mentorIndex] : {};

    const mentorData = {
        id: existing.id || "mentor-" + Date.now(),
        name: user.name,
        initials: getInitials(user.name),
        role: role,
        location: location,
        city: location,
        category: category,
        exp: experience,
        rating: existing.rating || 5,
        skills: existing.skills || [],
        desc: existing.desc || "Pemateri terdaftar di BICARA.",
        portfolio: existing.portfolio || "Portofolio belum diisi.",
        phone: phone,
        photo: existing.photo || null,
        cv: existing.cv || null,
        userId: user.id
    };

    if (mentorIndex !== -1) {
        mentors[mentorIndex] = mentorData;
    } else {
        mentors.push(mentorData);
    }

    await saveMentors(mentors); 
    showNotification("Profil berhasil disimpan!", "success");
    
    await updateStatistics(); 

    setTimeout(async () => {
        closeModal("editProfileModal");
        const profileAlert = document.getElementById("profileAlert");
        if (profileAlert) {
            const updatedMentors = await getSavedMentors(); 
            const updatedMentor = updatedMentors.find(m => m.userId === user.id);
            const isComplete = isMentorProfileComplete(updatedMentor);
            profileAlert.style.display = isComplete ? "none" : "block";
        }
        mentorsData = await getAllMentors(); 
        current = [...mentorsData];
    }, 1200);
}

async function openSkillsModal() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;
    const mentors = await getSavedMentors(); 
    const mentor = mentors.find(m => m.userId === user.id);
    const skillsInput = document.getElementById("skillsInput");

    if (mentor && mentor.skills && mentor.skills.length > 0) {
        skillsInput.value = mentor.skills.join(", ");
    } else {
        skillsInput.value = "";
    }
    renderSkillsPreview();
    openModal("skillsModal");
}

function renderSkillsPreview() {
    const input = document.getElementById("skillsInput");
    const preview = document.getElementById("skillsPreview");
    if (!input || !preview) return;

    const skills = input.value.split(",").map(s => s.trim()).filter(s => s.length > 0);

    if (skills.length === 0) {
        preview.innerHTML = `<p class="muted" style="font-size: 11px;">Belum ada keahlian.</p>`;
        return;
    }

    preview.innerHTML = `
        <div class="detail-label" style="margin-top: 10px;">PREVIEW</div>
        <div class="detail-list">
            ${skills.map(s => `<span>${s}</span>`).join("")}
        </div>
    `;
}

document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "skillsInput") {
        renderSkillsPreview();
    }
});

async function saveSkills() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;

    const input = document.getElementById("skillsInput");
    const skillsStr = input ? input.value.trim() : "";
    if (!skillsStr) { showNotification("Minimal isi 1 keahlian.", "warning"); return; }

    const skills = skillsStr.split(",").map(s => s.trim()).filter(s => s.length > 0);
    const mentors = await getSavedMentors(); 
    const mentorIndex = mentors.findIndex(m => m.userId === user.id);

    if (mentorIndex === -1) {
        mentors.push({
            id: "mentor-" + Date.now(),
            name: user.name,
            initials: getInitials(user.name),
            role: "Pemateri Baru",
            location: "Indonesia",
            city: "Indonesia",
            category: "Umum",
            exp: 1,
            rating: 5,
            skills: skills,
            desc: "Profil pemateri terdaftar.",
            portfolio: "Portofolio belum diisi.",
            phone: "",
            userId: user.id
        });
    } else {
        mentors[mentorIndex].skills = skills;
    }

    await saveMentors(mentors); 
    showNotification("Kompetensi berhasil disimpan!", "success");
    
    await updateStatistics(); 

    setTimeout(async () => {
        closeModal("skillsModal");
        const profileAlert = document.getElementById("profileAlert");
        if (profileAlert) {
            const updatedMentors = await getSavedMentors(); 
            const updatedMentor = updatedMentors.find(m => m.userId === user.id);
            const isComplete = isMentorProfileComplete(updatedMentor);
            profileAlert.style.display = isComplete ? "none" : "block";
        }
    }, 1000);
}

async function openPortfolioModal() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;

    const mentors = await getSavedMentors(); 
    const mentor = mentors.find(m => m.userId === user.id);
    const portfolioDesc = document.getElementById("portfolioDesc");
    const photoPreview = document.getElementById("photoPreview");
    const cvPreview = document.getElementById("cvPreview");

    if (photoPreview) photoPreview.innerHTML = "";
    if (cvPreview) cvPreview.innerHTML = "";

    if (mentor) {
        if (portfolioDesc) {
            portfolioDesc.value = mentor.portfolio && mentor.portfolio !== "Portofolio belum diisi." ? mentor.portfolio : "";
        }
        if (mentor.photo && photoPreview) {
            photoPreview.innerHTML = `<img src="${mentor.photo}" alt="Foto Portofolio" style="max-width: 100%; border-radius: 10px; border: 1px solid var(--line);">`;
        }
        if (mentor.cv && cvPreview) {
            cvPreview.innerHTML = `<div style="padding: 10px; background: #f5f5fa; border-radius: 8px; font-size: 12px;">📄 CV sudah diupload. <a href="${mentor.cv}" download="CV-${mentor.name}.pdf" style="color: var(--primary); font-weight: 600;">Download</a></div>`;
        }
    }
    openModal("portfolioModal");
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
        showNotification("Ukuran foto maksimal 500KB.", "warning");
        event.target.value = "";
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById("photoPreview");
        if (preview) preview.innerHTML = `<img src="${e.target.result}" alt="Preview Foto" style="max-width: 100%; border-radius: 10px; border: 1px solid var(--line);">`;
    };
    reader.readAsDataURL(file);
}

function previewCV(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
        showNotification("Ukuran CV maksimal 1MB.", "warning");
        event.target.value = "";
        return;
    }
    const preview = document.getElementById("cvPreview");
    if (preview) preview.innerHTML = `<div style="padding: 10px; background: #f5f5fa; border-radius: 8px; font-size: 12px;">📄 File siap diupload: <strong>${file.name}</strong></div>`;
}

async function savePortfolio() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;

    const photoInput = document.getElementById("portfolioPhoto");
    const cvInput = document.getElementById("portfolioCV");
    const descInput = document.getElementById("portfolioDesc");

    const photoFile = photoInput && photoInput.files[0];
    const cvFile = cvInput && cvInput.files[0];
    const desc = descInput ? descInput.value.trim() : "";

    const mentors = await getSavedMentors(); 
    const mentorIndex = mentors.findIndex(m => m.userId === user.id);

    if (mentorIndex === -1) {
        showNotification("Silakan isi profil terlebih dahulu (Edit Profil).", "warning");
        return;
    }

    const mentor = mentors[mentorIndex];

    async function finishSave(photoData, cvData) {
        if (photoData) mentor.photo = photoData;
        if (cvData) mentor.cv = cvData;
        if (desc) mentor.portfolio = desc;

        await saveMentors(mentors); 
        showNotification("Portofolio & CV berhasil disimpan!", "success");
        
        await updateStatistics(); 

        setTimeout(async () => {
            closeModal("portfolioModal");
            
            const profileAlert = document.getElementById("profileAlert");
            if (profileAlert) {
                const updatedMentors = await getSavedMentors(); 
                const updatedMentor = updatedMentors.find(m => m.userId === user.id);
                const isComplete = isMentorProfileComplete(updatedMentor);
                profileAlert.style.display = isComplete ? "none" : "block";
            }
        }, 1000);
    }

    if (photoFile && cvFile) {
        const photoReader = new FileReader();
        const cvReader = new FileReader();
        let photoData = null;
        let cvData = null;
        photoReader.onload = function (e) {
            photoData = e.target.result;
            cvReader.readAsDataURL(cvFile);
        };
        cvReader.onload = function (e) {
            cvData = e.target.result;
            finishSave(photoData, cvData);
        };
        photoReader.readAsDataURL(photoFile);
    } else if (photoFile) {
        const reader = new FileReader();
        reader.onload = function (e) { finishSave(e.target.result, null); };
        reader.readAsDataURL(photoFile);
    } else if (cvFile) {
        const reader = new FileReader();
        reader.onload = function (e) { finishSave(null, e.target.result); };
        reader.readAsDataURL(cvFile);
    } else {
        finishSave(null, null);
    }
}

document.addEventListener("DOMContentLoaded", async () => { 
    document.body.style.overflow = "";

    protectPages();
    updateNavbar();
    
    await updateStatistics(); 

    if (document.getElementById("mentorName")) {
        const user = getCurrentUser(); // SINKRON
        if (user) {
            document.getElementById("mentorName").textContent = user.name;
            const mentors = await getSavedMentors(); 
            const mentor = mentors.find(m => m.userId === user.id);
            const profileAlert = document.getElementById("profileAlert");

            if (profileAlert) {
                const isComplete = isMentorProfileComplete(mentor);
                profileAlert.style.display = isComplete ? "none" : "block";
            }
        }
    }

    if (document.getElementById("mentorGrid")) {
        mentorsData = await getAllMentors(); 
        current = [...mentorsData];
        await renderMentors(); 
    }
});

function isAuthenticated() {
    return !!getCurrentUser();
}

function showMentorProfile() {
    const user = getCurrentUser(); // SINKRON
    if (!user) return;
    const mentor = mentorsData.find(item => item.userId === user.id);
    if (!mentor) {
        showNotification("Data profil pemateri tidak ditemukan. Silakan isi profil terlebih dahulu.", "warning");
        return;
    }
    showNotification(`Profil ${mentor.name} aktif sebagai pemateri.`, "success");
}

window.addEventListener("click", event => {
    if (event.target.classList.contains("modal")) {
        closeModal(event.target.id);
        document.body.style.overflow = "";
    }
});