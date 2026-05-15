// async function carregarReviews() {

//     const reviews = [
//         { name: "Carlos", rating: 5, text: "Excelente localização e hospedagem muito limpa." },
//         { name: "Marina", rating: 5, text: "Muito perto da praia e ambiente confortável." },
//         { name: "Rafael", rating: 5, text: "Ótimo custo benefício, recomendo." }
//     ];

//     const container = document.getElementById('google-reviews');

//     reviews.forEach(r => {

//         const div = document.createElement('div');
//         div.className = 'review';

//         div.innerHTML = `⭐⭐⭐⭐⭐<br><strong>${r.name}</strong><br>${r.text}`;

//         container.appendChild(div);

//     });
// }

// carregarReviews();

// REVIEWS AIRBNB
async function carregarReviewsAirbnb() {

    const response = await fetch("data/airbnb-reviews.json");
    const data = await response.json();

    const ratingDiv = document.getElementById("airbnb-rating");
    const list = document.getElementById("airbnb-reviews-list");

    ratingDiv.innerHTML = `
⭐ ${data.rating} (${data.total} avaliações)
`;

    [...data.reviews].reverse().slice(0, 6).forEach(r => {
        const card = document.createElement("div");
        card.className = "review-card";

        card.innerHTML = `
            <div class="review-author">${r.author}</div>
            <div class="review-stars">${r.stars}</div>
            <div class="review-text">${r.text}</div>
            `;

        list.appendChild(card);
    });

}

carregarReviewsAirbnb();

async function carregarKitnet() {

    // const params = new URLSearchParams(window.location.search);
    const params = new URL(window.location);
    let id = params.pathname;
    console.log(id);
    if (id === "/") {
        id = "/index.html";
    }

    const response = await fetch("./data/kitnets.json");
    const data = await response.json();
    console.log(data);
    const kitnet = data[id];

    document.getElementById("titulo").innerText = kitnet.nome;
    if (document.getElementById("descricao"))
        document.getElementById("descricao").innerText = kitnet.descricao;
    if (document.getElementById("reserva_kit"))
        document.getElementById("reserva_kit").href = kitnet.reserva;
    // if (document.getElementById("btn_hero"))
    //     document.getElementById("btn_hero").href = kitnet.reserva;
    if (document.getElementById("btn-airbnb"))
        document.getElementById("btn-airbnb").href = kitnet.reserva;
    if (document.getElementById("reviews"))
        document.getElementById("reviews").href = kitnet.reviews;
    if (document.getElementById("itens")) {
        // itens   
        const lista = document.getElementById("itens");

        kitnet.itens.forEach(item => {

            const div = document.createElement("div");
            const span = document.createElement("span");
            div.className = "feature";
            span.innerText = item;
            div.appendChild(span);
            lista.appendChild(div);

        })
    }

    const galeria = document.getElementById("gallery");

    const pasta = kitnet.diretorio;

    // galeria interna
    for (let i = 1; i <= 10; i++) {

        const img = document.createElement("img");

        img.src = `img/${pasta}/${i}.webp`;
        img.loading = "lazy";
        console.log(i%2);
        img.alt = `Aluguel de Kitnet em Caraguatatuba - ${kitnet.nome} Costa Norte`;

        img.onerror = () => {
            img.classList.add("remove");
            img.remove();
        };

        galeria.appendChild(img);
    }

    // fotos externas
    for (let i = 1; i <= 10; i++) {

        const img = document.createElement("img");

        img.src = `img/exterior/${i}.webp`;
        img.loading = "lazy";
        console.log(i%2);
        img.alt = `Aluguel de Kitnet na praia Martim de Sá - ${kitnet.nome} Costa Norte`;

        console.log(img);
        img.onerror = () => {
            img.classList.add("remove");
            img.remove();
        }

        galeria.appendChild(img);
    }

    // LIGHTBOX GALERIA COM SETAS, SWIPE E CONTADOR
    galleryImages = [...document.querySelectorAll('.gallery img')]
        .filter(img => !img.classList.contains('remove'));
    console.log(galleryImages);
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const counter = document.getElementById('lightbox-counter');

    let currentIndex = 0;
    const thumbsContainer = document.getElementById('lightbox-thumbs');

    function abrirLightbox(index) {
        currentIndex = index;
        lightbox.classList.add('active');

        const existeRemovida = [...galleryImages]
            .some(img => img.classList.contains('remove'));
        galleryImages = [...document.querySelectorAll('.gallery img')]
            .filter(img => !img.classList.contains('remove'));
        console.log(galleryImages);
        console.log(existeRemovida);
        if (existeRemovida) {
            galleryImages.forEach((img, i) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.addEventListener('click', () => {
                    currentIndex = i;
                    atualizarImagem();
                });
                thumbsContainer.appendChild(thumb);
            });
        }

        atualizarImagem();
    }

    function atualizarImagem() {
        lightboxImg.src = galleryImages[currentIndex].src;
        counter.innerText = (currentIndex + 1) + ' / ' + galleryImages.length;

        document.querySelectorAll('.lightbox-thumbs img').forEach((t, i) => {
            t.classList.toggle('active', i === currentIndex);
        });
    }

    galleryImages.forEach((img, i) => {
        img.addEventListener('click', () => {
            abrirLightbox(i);
        });
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        atualizarImagem();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        atualizarImagem();
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // SWIPE MOBILE
    let startX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        let diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                currentIndex = (currentIndex + 1) % galleryImages.length;
            } else {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            }
            atualizarImagem();
        }
    });

    // ZOOM NA IMAGEM
    lightboxImg.addEventListener('click', () => {
        lightboxImg.classList.toggle('zoomed');
    });

    // TECLADO (← → ESC)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            atualizarImagem();
        }

        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            atualizarImagem();
        }

        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        }
    });
    // }, 200);

    // // LAZY LOADING + BLUR
    // document.querySelectorAll('img').forEach(img => {
    //     img.loading = 'lazy';
    //     //     // img.classList.add('blur-load');

    //     //     img.addEventListener('load', () => {
    //     //         // img.classList.remove('blur-load');
    //     //         // img.classList.add('blur-loaded');
    //     //     });
    // });    
}

carregarKitnet();

const toggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('menu-overlay');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const nav = document.getElementById('nav');
const header = document.getElementById('site-header');

// abrir e fechar menu
toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
});

// fechar ao clicar em link
document.querySelectorAll('#nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
    });
});

// fechar clicando fora
document.addEventListener('click', (e) => {
    const isClickInsideNav = nav.contains(e.target);
    const isClickToggle = toggle.contains(e.target);

    if (!isClickInsideNav && !isClickToggle) {
        nav.classList.remove('active');
        overlay.classList.remove('active');
    }
});

// fechar com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        nav.classList.remove('active');
        overlay.classList.remove('active');
    }
});

// header muda no scroll
let ticking = false;

window.addEventListener('scroll', () => {

    if (!ticking) {

        window.requestAnimationFrame(() => {

            if (window.scrollY > 80) {
                header.style.background = 'white';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255,255,255,0.85)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }

            ticking = false;

        });

        ticking = true;

    }

});
// fechar clicando no overlay

overlay.addEventListener('click', () => {
    nav.classList.remove('active');
    overlay.classList.remove('active');
});

let galleryImages;

const backToTop = document.getElementById('backToTop');
const progressCircle = document.getElementById('progressCircle');

const circumference = 2 * Math.PI * 45;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;

let flag = false;

window.addEventListener('scroll', () => {

    if (!flag) {

        requestAnimationFrame(() => {

            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;

            const progress = scrollTop / docHeight;

            const offset = circumference - (progress * circumference);
            progressCircle.style.strokeDashoffset = offset;

            // mostrar botão
            if (scrollTop > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }

            flag = false;

        });

        flag = true;
    }
});

// clique suave
backToTop.addEventListener('click', () => {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

});

// esconder quando menu abrir (opcional)

const navTop = document.getElementById('nav');

const observer = new MutationObserver(() => {

    if (navTop.classList.contains('active')) {
        backToTop.style.opacity = '0';
    } else {
        backToTop.style.opacity = '';
    }

});

observer.observe(navTop, { attributes: true });

async function carregarInstagram() {

    const response = await fetch("/data/instagram.json");
    const posts = await response.json();

    const container = document.getElementById("instagram-feed");

    posts.slice(0, 8).forEach(post => {

        const div = document.createElement("div");
        div.className = "instagram-item";

        div.innerHTML = `
        <img src="${post.img}" loading="lazy" alt="Post '${post.caption}' no instagram da Costa Norte Hospedagens de Caraguatatuba">
        <div class="instagram-overlay">${post.caption}</div>
    `;

        div.addEventListener("click", () => {
            window.open(post.link, "_blank");
        });

        container.appendChild(div);

    });

}

carregarInstagram();

const btnReserva = document.getElementById("reserva");
const modal = document.getElementById("modal-reservas");
const fechar = document.querySelector(".modal-close");

// abrir modal
btnReserva.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
});

// fechar no X
fechar.addEventListener("click", () => {
    modal.classList.remove("active");
});

// fechar clicando fora
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

let scrollListenerActive = false;

function scrollMobile() {
    const screenCenter = window.innerHeight / 2;

    const elements = document.querySelectorAll('.feature, .card, .btn, .gallery img, .instagram-item');
    console.log(elements);
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        let distance_max = 120;
        const distance = Math.abs(screenCenter - elCenter);

        if (el.className == 'feature') {
            distance_max = 60;
        }

        if (distance < distance_max) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

function handleMobileEffects() {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile && !scrollListenerActive) {
        window.addEventListener('scroll', scrollMobile);
        scrollListenerActive = true;

        // 🔥 roda uma vez ao carregar
        scrollMobile();

    } else if (!isMobile && scrollListenerActive) {
        window.removeEventListener('scroll', scrollMobile);
        scrollListenerActive = false;

        document.querySelectorAll('.feature, .card, .btn')
            .forEach(el => el.classList.remove('active'));
    }
}

// INIT
handleMobileEffects();
window.addEventListener('resize', handleMobileEffects);
