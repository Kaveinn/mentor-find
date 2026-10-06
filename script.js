// ======================================================
// MENTORFIND - MAIN JAVASCRIPT
// ======================================================


// ======================================================
// DATABASE PEMATERI DEFAULT
// ======================================================

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
        skills: [
            "JavaScript",
            "React",
            "Node.js"
        ],
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
        skills: [
            "UI/UX",
            "Figma",
            "Design Thinking"
        ],
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
        skills: [
            "Arduino",
            "IoT",
            "ESP32"
        ],
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
        skills: [
            "SEO",
            "Social Media",
            "Analytics"
        ],
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
        skills: [
            "Startup",
            "Business",
            "Pitching"
        ],
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
        skills: [
            "Public Speaking",
            "Teaching",
            "Leadership"
        ],
        desc: "Fasilitator pelatihan dengan pengalaman mengajar dan berbicara di berbagai forum.",
        portfolio: "Pelatihan komunikasi, kepemimpinan, dan pengembangan diri.",
        userId: null
    }

];


// ======================================================
// LOCAL STORAGE
// ======================================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("mentorfind_users")
    ) || [];

}


function saveUsers(users) {

    localStorage.setItem(
        "mentorfind_users",
        JSON.stringify(users)
    );

}


function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("mentorfind_user")
    );

}


function saveCurrentUser(user) {

    localStorage.setItem(
        "mentorfind_user",
        JSON.stringify(user)
    );

}


function isAuthenticated() {

    return !!getCurrentUser();

}


function getSavedMentors() {

    return JSON.parse(
        localStorage.getItem("mentorfind_mentors")
    ) || [];

}


function saveMentors(mentors) {

    localStorage.setItem(
        "mentorfind_mentors",
        JSON.stringify(mentors)
    );

}


function getAllMentors() {

    return [
        ...defaultMentors,
        ...getSavedMentors()
    ];

}


// ======================================================
// NOTIFICATION
// ======================================================

function showNotification(
    message,
    type = "success"
) {

    let container =
        document.getElementById(
            "notificationContainer"
        );


    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "notificationContainer";

        document.body.appendChild(
            container
        );

    }


    const notification =
        document.createElement("div");


    notification.className =
        `notification ${type}`;


    let icon = "✓";


    if (type === "error") {
        icon = "✕";
    }


    if (type === "warning") {
        icon = "!";
    }


    notification.innerHTML = `

        <div class="notification-icon">
            ${icon}
        </div>

        <div class="notification-content">
            ${message}
        </div>

        <button
            class="notification-close"
            onclick="this.parentElement.remove()"
        >
            ×
        </button>

    `;


    container.appendChild(
        notification
    );


    setTimeout(
        () => {

            notification.classList.add(
                "hide"
            );


            setTimeout(
                () => {

                    notification.remove();

                },
                300
            );

        },
        3500
    );

}


// ======================================================
// UPDATE NAVBAR
// ======================================================

function updateNavbar() {

    const navActions =
        document.querySelector(
            ".nav-actions"
        );


    if (!navActions) return;


    const user =
        getCurrentUser();


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


    if (
        user.role === "mentor" ||
        user.isMentor === true
    ) {

        navActions.innerHTML = `

            <div class="user-profile">

                <div class="user-avatar">
                    ${getInitials(user.name)}
                </div>

                <div class="user-info">

                    <strong>
                        ${user.name}
                    </strong>

                    <span>
                        Pemateri
                    </span>

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

                <strong>
                    ${user.name}
                </strong>

                <span>
                    Pengguna
                </span>

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


// ======================================================
// INITIAL USER
// ======================================================

function getInitials(name) {

    if (!name) {
        return "U";
    }


    return name
        .split(" ")
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


// ======================================================
// AUTHENTICATION
// LOGIN & REGISTER
// ======================================================

function handleAuthSubmit(
    event,
    type
) {

    event.preventDefault();


    // ==================================================
    // LOGIN
    // ==================================================

    if (type === "login") {

        const emailInput =
            document.getElementById("loginEmail") ||
            document.querySelector(
                'input[type="email"]'
            );


        const passwordInput =
            document.getElementById("loginPassword") ||
            document.querySelector(
                'input[type="password"]'
            );


        const email =
            emailInput
                ? emailInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const password =
            passwordInput
                ? passwordInput.value
                : "";


        if (!email) {

            showNotification(
                "Email belum diisi.",
                "error"
            );

            return;
        }


        if (!password) {

            showNotification(
                "Password belum diisi.",
                "error"
            );

            return;
        }


        const users =
            getUsers();


        const user =
            users.find(
                item =>
                    item.email === email
            );


        if (!user) {

            showNotification(
                "Akun dengan email tersebut tidak ditemukan.",
                "error"
            );

            return;
        }


        if (
            user.password !==
            password
        ) {

            showNotification(
                "Password yang kamu masukkan salah.",
                "error"
            );

            return;
        }


        const currentUser = {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role,

            isMentor:
                user.isMentor || false

        };


        saveCurrentUser(
            currentUser
        );


        showNotification(
            `Selamat datang kembali, ${user.name}!`,
            "success"
        );


        setTimeout(
            () => {

                if (
                    user.role === "mentor" ||
                    user.isMentor === true
                ) {

                    window.location.href =
                        "mentor-dashboard.html";

                } else {

                    window.location.href =
                        "search.html";

                }

            },
            800
        );


        return;
    }


    // ==================================================
    // REGISTER
    // ==================================================

    if (type === "register") {

        const nameInput =
            document.getElementById("regName") ||
            document.querySelector(
                'input[name="name"]'
            ) ||
            document.querySelector(
                'input[placeholder*="Nama"]'
            );


        const emailInput =
            document.getElementById("regEmail") ||
            document.querySelector(
                'input[type="email"]'
            );


        const passwordInput =
            document.getElementById("regPassword") ||
            document.querySelector(
                'input[type="password"]'
            );


        const roleInput =
            document.getElementById("regRole");


        const name =
            nameInput
                ? nameInput.value.trim()
                : "";


        const email =
            emailInput
                ? emailInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const password =
            passwordInput
                ? passwordInput.value
                : "";


        /*
         * Role dari form tidak langsung digunakan
         * untuk memberikan status mentor.
         *
         * User baru selalu dimulai sebagai user.
         */
        const selectedRole =
            roleInput
                ? roleInput.value
                : "Pencari Pemateri";


        if (!name) {

            showNotification(
                "Nama lengkap belum diisi.",
                "error"
            );

            return;
        }


        if (!email) {

            showNotification(
                "Email belum diisi.",
                "error"
            );

            return;
        }


        if (!password) {

            showNotification(
                "Password belum diisi.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showNotification(
                "Password minimal 6 karakter.",
                "error"
            );

            return;
        }


        const users =
            getUsers();


        const existingUser =
            users.find(
                user =>
                    user.email === email
            );


        if (existingUser) {

            showNotification(
                "Email sudah terdaftar. Silakan login.",
                "warning"
            );

            return;
        }


        const newUser = {

            id:
                "user-" +
                Date.now(),

            name:
                name,

            email:
                email,

            password:
                password,

            role:
                "user",

            accountType:
                selectedRole,

            isMentor:
                false,

            createdAt:
                new Date().toISOString()

        };


        users.push(
            newUser
        );


        saveUsers(
            users
        );


        saveCurrentUser({

            id:
                newUser.id,

            name:
                newUser.name,

            email:
                newUser.email,

            role:
                "user",

            isMentor:
                false

        });


        showNotification(
            "Akun berhasil dibuat!",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "search.html";

            },
            800
        );

    }

}


// ======================================================
// COMPATIBILITY FUNCTION
// Untuk form yang menggunakan:
// onsubmit="handleRegister(event)"
// ======================================================

function handleRegister(event) {

    handleAuthSubmit(
        event,
        "register"
    );

}


// ======================================================
// COMPATIBILITY FUNCTION
// Untuk form yang menggunakan:
// onsubmit="handleLogin(event)"
// ======================================================

function handleLogin(event) {

    handleAuthSubmit(
        event,
        "login"
    );

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "mentorfind_user"
    );


    showNotification(
        "Kamu berhasil keluar dari akun.",
        "success"
    );


    setTimeout(
        () => {

            window.location.href =
                "index.html";

        },
        800
    );

}


function handleLogout() {

    logout();

}


// ======================================================
// PROTEKSI HALAMAN
// ======================================================

function protectPages() {

    const page =
        window.location.pathname
            .split("/")
            .pop();


    const user =
        getCurrentUser();


    // ==============================================
    // SEARCH
    // ==============================================

    if (
        page === "search.html"
    ) {

        if (!user) {

            showNotification(
                "Silakan login terlebih dahulu untuk mencari pemateri.",
                "warning"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                800
            );


            return;
        }


        if (
            user.role === "mentor" ||
            user.isMentor === true
        ) {

            showNotification(
                "Akun pemateri memiliki halaman khusus.",
                "warning"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "mentor-dashboard.html";

                },
                800
            );


            return;
        }

    }


    // ==============================================
    // BECOME MENTOR
    // ==============================================

    if (
        page === "become-mentor.html"
    ) {

        if (!user) {

            showNotification(
                "Silakan login terlebih dahulu.",
                "warning"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                800
            );


            return;
        }


        if (
            user.role === "mentor" ||
            user.isMentor === true
        ) {

            showNotification(
                "Kamu sudah menjadi pemateri.",
                "warning"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "mentor-dashboard.html";

                },
                800
            );


            return;
        }

    }


    // ==============================================
    // MENTOR DASHBOARD
    // ==============================================

    if (
        page === "mentor-dashboard.html"
    ) {

        if (!user) {

            showNotification(
                "Silakan login terlebih dahulu.",
                "warning"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                800
            );


            return;
        }


        if (
            user.role !== "mentor" &&
            user.isMentor !== true
        ) {

            showNotification(
                "Halaman ini khusus untuk pemateri.",
                "error"
            );


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                800
            );


            return;
        }

    }

}


// ======================================================
// ALIAS LAMA
// Jika ada kode HTML lama yang memanggil:
// protectSearchPage()
// protectBecomeMentorPage()
// protectMentorDashboard()
// semuanya tetap bekerja.
// ======================================================

function protectSearchPage() {
    protectPages();
}


function protectBecomeMentorPage() {
    protectPages();
}


function protectMentorDashboard() {
    protectPages();
}


// ======================================================
// MENJADI PEMATERI
// ======================================================

function handleMentorSubmit(event) {

    event.preventDefault();


    const user =
        getCurrentUser();


    if (!user) {

        showNotification(
            "Kamu harus login terlebih dahulu.",
            "warning"
        );


        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            800
        );


        return;
    }


    if (
        user.role === "mentor" ||
        user.isMentor === true
    ) {

        showNotification(
            "Kamu sudah terdaftar sebagai pemateri.",
            "warning"
        );


        return;
    }


    const roleInput =
        document.querySelector(
            'input[name="role"]'
        ) ||
        document.querySelector(
            'input[placeholder*="Kompetensi"]'
        ) ||
        document.querySelector(
            'input[placeholder*="Keahlian"]'
        );


    const locationInput =
        document.querySelector(
            'input[name="location"]'
        ) ||
        document.querySelector(
            'input[placeholder*="Domisili"]'
        );


    const experienceInput =
        document.querySelector(
            'input[name="experience"]'
        ) ||
        document.querySelector(
            'input[placeholder*="Pengalaman"]'
        );


    const descriptionInput =
        document.querySelector(
            'textarea[name="description"]'
        ) ||
        document.querySelector(
            'textarea[placeholder*="Deskripsi"]'
        );


    const portfolioInput =
        document.querySelector(
            'textarea[name="portfolio"]'
        ) ||
        document.querySelector(
            'textarea[placeholder*="Portofolio"]'
        );


    const role =
        roleInput
            ? roleInput.value.trim()
            : "";


    const location =
        locationInput
            ? locationInput.value.trim()
            : "";


    const experience =
        experienceInput
            ? Number(
                experienceInput.value
            )
            : 0;


    const description =
        descriptionInput
            ? descriptionInput.value.trim()
            : "";


    const portfolio =
        portfolioInput
            ? portfolioInput.value.trim()
            : "";


    if (!role) {

        showNotification(
            "Kompetensi belum diisi.",
            "error"
        );

        return;
    }


    if (!location) {

        showNotification(
            "Domisili belum diisi.",
            "error"
        );

        return;
    }


    if (!experience) {

        showNotification(
            "Pengalaman belum diisi.",
            "error"
        );

        return;
    }


    if (!description) {

        showNotification(
            "Deskripsi diri belum diisi.",
            "error"
        );

        return;
    }


    const savedMentors =
        getSavedMentors();


    const skills =
        role
            .split(",")
            .map(
                item =>
                    item.trim()
            )
            .filter(
                item =>
                    item !== ""
            );


    const newMentor = {

        id:
            "mentor-" +
            Date.now(),

        userId:
            user.id,

        name:
            user.name,

        initials:
            getInitials(
                user.name
            ),

        role:
            role,

        location:
            location,

        city:
            location,

        category:
            "Lainnya",

        exp:
            experience,

        rating:
            5.0,

        skills:
            skills,

        desc:
            description,

        portfolio:
            portfolio ||
            "Belum ada portofolio.",

        createdAt:
            new Date().toISOString()

    };


    savedMentors.push(
        newMentor
    );


    saveMentors(
        savedMentors
    );


    const users =
        getUsers();


    const userIndex =
        users.findIndex(
            item =>
                item.id ===
                user.id
        );


    if (userIndex !== -1) {

        users[userIndex].role =
            "mentor";

        users[userIndex].isMentor =
            true;

        saveUsers(
            users
        );

    }


    user.role =
        "mentor";


    user.isMentor =
        true;


    saveCurrentUser(
        user
    );


    showNotification(
        "Selamat! Kamu sekarang menjadi pemateri.",
        "success"
    );


    setTimeout(
        () => {

            window.location.href =
                "mentor-dashboard.html";

        },
        1000
    );

}


// ======================================================
// SEARCH
// ======================================================

function applyFilters() {

    const user =
        getCurrentUser();


    if (!user) {

        showNotification(
            "Silakan login terlebih dahulu untuk mencari pemateri.",
            "warning"
        );


        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            800
        );


        return;
    }


    if (
        user.role === "mentor" ||
        user.isMentor === true
    ) {

        showNotification(
            "Pemateri tidak dapat mencari pemateri lain.",
            "warning"
        );


        setTimeout(
            () => {

                window.location.href =
                    "mentor-dashboard.html";

            },
            800
        );


        return;
    }


    const mentors =
        getAllMentors();


    const keywordElement =
        document.getElementById(
            "keyword"
        );


    const locationElement =
        document.getElementById(
            "location"
        );


    const categoryElement =
        document.getElementById(
            "category"
        );


    const experienceElement =
        document.getElementById(
            "experience"
        );


    const ratingElement =
        document.getElementById(
            "rating"
        );


    const keyword =
        keywordElement
            ? keywordElement.value
                .toLowerCase()
                .trim()
            : "";


    const location =
        locationElement
            ? locationElement.value
            : "";


    const category =
        categoryElement
            ? categoryElement.value
            : "";


    const experience =
        experienceElement
            ? Number(
                experienceElement.value || 0
            )
            : 0;


    const rating =
        ratingElement
            ? Number(
                ratingElement.value || 0
            )
            : 0;


    const result =
        mentors.filter(
            mentor => {

                const searchText =
                    (
                        mentor.name +
                        " " +
                        mentor.role +
                        " " +
                        mentor.skills.join(" ")
                    )
                        .toLowerCase();


                return (

                    (
                        !keyword ||
                        searchText.includes(
                            keyword
                        )
                    )

                    &&

                    (
                        !location ||
                        mentor.city ===
                        location
                    )

                    &&

                    (
                        !category ||
                        mentor.category ===
                        category
                    )

                    &&

                    mentor.exp >=
                    experience

                    &&

                    mentor.rating >=
                    rating

                );

            }
        );


    current =
        [...result];


    mentorsData =
        mentors;


    renderMentors();

}


// ======================================================
// RESET FILTER
// ======================================================

function resetFilters() {

    document
        .querySelectorAll(
            ".filter-panel input, .filter-panel select"
        )
        .forEach(
            element => {

                element.value = "";

            }
        );


    mentorsData =
        getAllMentors();


    current =
        [...mentorsData];


    renderMentors();

}


// ======================================================
// DATA GLOBAL
// ======================================================

let mentorsData =
    getAllMentors();


let current =
    [...mentorsData];


// ======================================================
// RENDER MENTOR
// ======================================================

function renderMentors() {

    const grid =
        document.getElementById(
            "mentorGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    current.forEach(
        mentor => {

            const index =
                mentorsData.findIndex(
                    item =>
                        item.id ===
                        mentor.id
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

                            <h3>
                                ${mentor.name}
                            </h3>

                            <p>
                                ${mentor.role}
                            </p>

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

                        ${mentor.skills
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

        }
    );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    if (resultCount) {

        resultCount.textContent =
            `${current.length} pemateri ditemukan`;

    }

}


// ======================================================
// PROFIL PEMATERI
// ======================================================

function showProfile(index) {

    if (!isAuthenticated()) {

        showNotification(
            "Silakan login terlebih dahulu.",
            "warning"
        );

        return;
    }


    const user =
        getCurrentUser();


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


    const mentor =
        mentorsData[index];


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

                <h2>
                    ${mentor.name}
                </h2>

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

            ${mentor.skills
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

            <h4>
                Portofolio
            </h4>

            <p>
                ${mentor.portfolio}
            </p>

        </div>

    `;


    openModal(
        "profileModal"
    );

}


// ======================================================
// MODAL
// ======================================================

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


function switchModal(
    closeId,
    openId
) {

    closeModal(
        closeId
    );


    openModal(
        openId
    );

}


// ======================================================
// MOBILE MENU
// ======================================================

function toggleMenu() {

    const nav =
        document.querySelector(
            ".navbar nav"
        );


    const actions =
        document.querySelector(
            ".nav-actions"
        );


    if (nav) {

        nav.classList.toggle(
            "open"
        );

    }


    if (actions) {

        actions.classList.toggle(
            "open"
        );

    }

}

function toggleMenu() {
  // Mencari elemen menu navigasi (bisa berupa .nav-links atau nav)
  const navLinks = document.querySelector(".nav-links") || document.querySelector("nav");
  if (navLinks) {
    navLinks.classList.toggle("mobile-open");
  }
}


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

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


// ======================================================
// KLIK DI LUAR MODAL
// ======================================================

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

// --- MANAJEMEN APLIKASI MENTORFIND --- //

// 1. Fungsi Registrasi
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const role = document.getElementById("regRole")?.value;
  const password = document.getElementById("regPassword")?.value;
  const alertBox = document.getElementById("registerAlert");

  if (!name || !email || !password) {
    if (alertBox) alertBox.innerHTML = `<p style="color:red; font-size:12px; margin-top:8px;">Harap isi semua kolom.</p>`;
    return;
  }

  // Simpan data akun pengguna
  const newUser = { name, email, role, password };
  localStorage.setItem("mentorfind_registered_user", JSON.stringify(newUser));

  alert("Akun berhasil dibuat! Silakan login.");
  window.location.href = "login.html";
}

// 2. Fungsi Login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;
  const alertBox = document.getElementById("loginAlert");

  const storedUser = JSON.parse(localStorage.getItem("mentorfind_registered_user"));

  if (!storedUser || storedUser.email !== email) {
    if (alertBox) alertBox.innerHTML = `<p style="color:red; font-size:12px; margin-top:8px;">Akun tidak ditemukan.</p>`;
    return;
  }

  if (storedUser.password !== password) {
    if (alertBox) alertBox.innerHTML = `<p style="color:red; font-size:12px; margin-top:8px;">Password salah.</p>`;
    return;
  }

  // Simpan Sesi Login
  localStorage.setItem("mentorfind_active_user", JSON.stringify(storedUser));
  window.location.href = "search.html";
}

// 3. Fungsi Logout
function handleLogout() {
  localStorage.removeItem("mentorfind_active_user");
  window.location.href = "index.html";
}

// 4. Update Navbar Secara Otomatis Berdasarkan Status Login
function updateNavbar() {
  const activeUser = JSON.parse(localStorage.getItem("mentorfind_active_user"));
  const navActions = document.querySelector(".nav-actions");

  if (!navActions) return;

  if (activeUser) {
    // KONDISI SUDAH LOGIN:
    // Menghilangkan tombol 'Cari Pemateri' & 'Menjadi Pemateri', menggantinya dengan Profil Pengguna + Logout
    const initial = activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "U";

    navActions.innerHTML = `
      <a href="mentor-dashboard.html" class="user-profile-btn" title="Lihat Profil">
        <div class="user-avatar">${initial}</div>
        <span>${activeUser.name}</span>
      </a>
      <button onclick="handleLogout()" class="btn btn-outline" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer;">Keluar</button>
    `;
  } else {
    // KONDISI BELUM LOGIN:
    navActions.innerHTML = `
      <a href="search.html" class="btn btn-primary">Cari Pemateri</a>
      <a href="become-mentor.html" class="btn btn-secondary">Menjadi Pemateri</a>
      <a href="login.html" class="btn btn-outline">Masuk</a>
    `;
  }
}

// Jalankan perbaikan navbar saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
});

// ==========================================
// LOGIKA AUTENTIKASI & NAVBAR MENTORFIND
// ==========================================

// 1. Dapatkan Pengguna Aktif saat ini
function getActiveUser() {
  return JSON.parse(localStorage.getItem("mentorfind_active_user"));
}

// 2. Fungsi Login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;
  const alertBox = document.getElementById("loginAlert");

  const storedUser = JSON.parse(localStorage.getItem("mentorfind_registered_user"));

  if (!storedUser || storedUser.email !== email) {
    if (alertBox) alertBox.innerHTML = `<p style="color:#ef4444; font-size:13px; margin-top:8px;">Akun dengan email tersebut tidak ditemukan.</p>`;
    return;
  }

  if (storedUser.password !== password) {
    if (alertBox) alertBox.innerHTML = `<p style="color:#ef4444; font-size:13px; margin-top:8px;">Password salah.</p>`;
    return;
  }

  // Simpan Sesi Login & Alihkan Halaman
  localStorage.setItem("mentorfind_active_user", JSON.stringify(storedUser));
  
  if (storedUser.role === "Pemateri") {
    window.location.href = "mentor-dashboard.html";
  } else {
    window.location.href = "search.html";
  }
}

// 3. Fungsi Registrasi
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const role = document.getElementById("regRole")?.value;
  const password = document.getElementById("regPassword")?.value;
  const alertBox = document.getElementById("registerAlert");

  if (!name || !email || !password) {
    if (alertBox) alertBox.innerHTML = `<p style="color:#ef4444; font-size:13px; margin-top:8px;">Harap isi semua kolom.</p>`;
    return;
  }

  const newUser = { name, email, role, password };
  localStorage.setItem("mentorfind_registered_user", JSON.stringify(newUser));

  alert("Akun berhasil dibuat! Silakan masuk.");
  window.location.href = "login.html";
}

// 4. Fungsi Logout
function handleLogout() {
  localStorage.removeItem("mentorfind_active_user");
  alert("Anda telah keluar.");
  window.location.href = "index.html";
}

// 5. Update Tampilan Navbar Sesuai Status Login & Role
function updateNavbar() {
  const activeUser = getActiveUser();
  const navActions = document.querySelector(".nav-actions");

  if (!navActions) return;

  if (activeUser) {
    const initial = activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "U";
    
    // Alur Link Profil yang Benar (Tidak Bikin Terpental)
    const profilePage = (activeUser.role === "Pemateri") ? "mentor-dashboard.html" : "profile.html";

    navActions.innerHTML = `
      <a href="${profilePage}" class="user-profile-btn" title="Lihat Profil Saya">
        <div class="user-avatar">${initial}</div>
        <div style="text-align: left;">
          <span style="display: block; font-weight: 600; line-height: 1.2;">${activeUser.name}</span>
          <small style="color: #64748b; font-size: 11px;">${activeUser.role}</small>
        </div>
      </a>
      <button onclick="handleLogout()" class="btn btn-outline" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; cursor: pointer;">Keluar</button>
    `;
  } else {
    navActions.innerHTML = `
      <a href="login.html" class="btn btn-primary">Masuk</a>
      <a href="register.html" class="btn btn-secondary">Daftar</a>
    `;
  }
}

// 6. Batas Hak Akses Pemateri vs Pencari Pemateri
function applyRoleRestrictions() {
  const activeUser = getActiveUser();
  const currentPath = window.location.pathname.split("/").pop();

  // Jika halaman adalah 'search.html'
  if (currentPath === "search.html") {
    // Sembunyikan atau hilangkan tombol Hubungi/Pengajuan jika role adalah Pemateri
    if (activeUser && activeUser.role === "Pemateri") {
      const contactButtons = document.querySelectorAll(".btn-contact-mentor, .btn-request");
      contactButtons.forEach(btn => {
        btn.style.display = "none"; // Pemateri hanya bisa melihat daftar tanpa tombol hubungi
      });

      const notice = document.getElementById("roleNotice");
      if (notice) {
        notice.innerHTML = `<p style="background: #f1f5f9; padding: 10px; border-radius: 8px; color: #475569; font-size: 13px;">
          Mode Pemateri: Anda hanya dapat melihat daftar pemateri lain.
        </p>`;
      }
    }
  }
}

// 7. Fungsi untuk Pencari Pemateri Mengontak Pemateri
function contactMentor(mentorName) {
  const activeUser = getActiveUser();

  if (!activeUser) {
    alert("Silakan masuk terlebih dahulu untuk menghubungi pemateri.");
    window.location.href = "login.html";
    return;
  }

  if (activeUser.role === "Pemateri") {
    alert("Akun Pemateri hanya dapat melihat daftar pemateri dan tidak dapat mengajukan permintaan.");
    return;
  }

  alert(`Permintaan terhubung dengan ${mentorName} berhasil dikirim! Silakan tunggu respon dari pemateri.`);
}

// Jalankan otomatis saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  applyRoleRestrictions();
});