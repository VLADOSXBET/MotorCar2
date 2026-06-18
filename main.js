// main.js — вся логика

// Данные услуг
const servicesData = [
    { title: "Компьютерная диагностика", icon: "fa-microchip", shortDesc: "Выявление ошибок, проверка электронных систем.", price: "от 1 200 ₽", fullDesc: "Полная компьютерная диагностика всех электронных блоков автомобиля. Считывание ошибок, проверка датчиков, анализ данных в реальном времени.", details: ["Считывание ошибок ECU", "Проверка ABS, ESP, подушек безопасности", "Анализ параметров двигателя и коробки", "Подробный отчёт с рекомендациями"] },
    { title: "Техническое обслуживание", icon: "fa-oil-can", price: "от 2 500 ₽", shortDesc: "Замена масла, фильтров, свечей.", fullDesc: "Плановое ТО с использованием качественных масел и оригинальных фильтров. Контроль всех узлов.", details: ["Замена масла и масляного фильтра", "Замена воздушного и салонного фильтров", "Проверка тормозной системы", "Диагностика ходовой части"] },
    { title: "Кузовной ремонт", icon: "fa-car-side", price: "от 4 000 ₽", shortDesc: "Покраска, рихтовка, PDR.", fullDesc: "Профессиональный кузовной ремонт любой сложности. Подбор краски по VIN, гарантия на покраску до 3 лет.", details: ["Рихтовка вмятин", "PDR (беспокрасочное удаление вмятин)", "Локальная и полная покраска", "Полировка и антикоррозийная обработка"] },
    { title: "Шиномонтаж", icon: "fa-snowplow", price: "от 1 800 ₽", shortDesc: "Балансировка, хранение шин.", fullDesc: "Сезонная смена резины, высокоточная балансировка на стенде Hunter.", details: ["Шиномонтаж легковых и внедорожных шин", "Бесконтактная балансировка", "Ремонт проколов и боковых порезов", "Сезонное хранение шин"] },
    { title: "Ремонт ходовой", icon: "fa-cogs", price: "от 3 500 ₽", fullDesc: "Полная диагностика и замена элементов подвески. Развал-схождение после ремонта.", details: ["Замена амортизаторов и пружин", "Замена рычагов, сайлентблоков", "Ремонт рулевого управления", "Компьютерный развал-схождение"], shortDesc: "Амортизаторы, рычаги, развал." },
    { title: "Электрика", icon: "fa-charging-station", price: "от 1 500 ₽", fullDesc: "Поиск и устранение неисправностей в электрооборудовании автомобиля.", details: ["Ремонт генератора и стартера", "Диагностика проводки", "Замена датчиков", "Установка дополнительного оборудования"], shortDesc: "Генератор, стартер, проводка." }
];

// Построение карточек услуг
const servicesGrid = document.getElementById('servicesGrid');
function buildServices() {
    servicesGrid.innerHTML = '';
    servicesData.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-icon"><i class="fas ${service.icon}"></i></div>
            <h3>${service.title}</h3>
            <p>${service.shortDesc}</p>
            <span class="price-badge">${service.price}</span>
        `;
        card.addEventListener('click', () => openServiceModal(service.title));
        card.querySelector('.price-badge').addEventListener('click', (e) => {
            e.stopPropagation();
            openServiceModal(service.title);
        });
        servicesGrid.appendChild(card);
    });
}

// Открытие модалки услуги
function openServiceModal(title) {
    const service = servicesData.find(s => s.title === title);
    if (!service) return;
    document.getElementById('modalServiceTitle').innerText = service.title;
    document.getElementById('modalServiceDescription').innerHTML = service.fullDesc || service.shortDesc;
    document.getElementById('modalServicePrice').innerHTML = service.price;
    document.getElementById('modalServiceDetailsList').innerHTML = '<strong>Что входит:</strong><ul style="margin-top:8px;">' + service.details.map(d => `<li style="margin-bottom:6px;">✓ ${d}</li>`).join('') + '</ul>';
    document.getElementById('serviceDetailModal').style.display = 'flex';
}

document.getElementById('closeServiceModalBtn').addEventListener('click', () => {
    document.getElementById('serviceDetailModal').style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('serviceDetailModal')) {
        document.getElementById('serviceDetailModal').style.display = 'none';
    }
});

// ===== ОТЗЫВЫ =====
const STORAGE_KEY = 'motorcar_reviews';
let reviews = [];

function loadReviews() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            reviews = JSON.parse(stored);
        } else {
            reviews = [
                { name: "Дмитрий", car: "Hyundai Santa Fe", rating: 5, text: "Отличный сервис! Сделали сложную диагностику двигателя, нашли неисправность.", date: "2025-01-15" },
                { name: "Анна", car: "Kia Rio", rating: 5, text: "Удобно онлайн записаться. ТО быстро, цены адекватные.", date: "2025-01-20" },
                { name: "Игорь", car: "Volkswagen Passat", rating: 4.5, text: "Попал в яму — помял диск. Заменили за час. Спасибо!", date: "2025-02-01" }
            ];
            saveReviews();
        }
    } catch (e) { reviews = []; }
    renderReviews();
}

function saveReviews() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function renderReviews() {
    const slider = document.getElementById('reviewsSlider');
    if (!slider) return;
    slider.innerHTML = '';
    reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        const stars = getStarsHTML(r.rating);
        card.innerHTML = `
            <div class="review-stars">${stars}</div>
            <p class="review-text">"${r.text}"</p>
            <div class="review-author">— ${r.name}, ${r.car}</div>
            <div class="review-date">${r.date || 'недавно'}</div>
        `;
        slider.appendChild(card);
    });
}

function getStarsHTML(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - full - half; i++) html += '<i class="far fa-star"></i>';
    return html;
}

let selectedRating = 0;
const stars = document.querySelectorAll('#starRating i');
stars.forEach(star => {
    star.addEventListener('click', function () {
        selectedRating = parseInt(this.dataset.star);
        stars.forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.star) <= selectedRating);
        });
    });
    star.addEventListener('mouseenter', function () {
        const val = parseInt(this.dataset.star);
        stars.forEach(s => {
            s.style.color = parseInt(s.dataset.star) <= val ? '#fbbf24' : '#d1d5db';
        });
    });
    star.addEventListener('mouseleave', function () {
        stars.forEach(s => {
            s.style.color = parseInt(s.dataset.star) <= selectedRating ? '#fbbf24' : '#d1d5db';
        });
    });
});

const reviewMsg = document.getElementById('reviewMessage');

function showReviewMessage(text, type) {
    reviewMsg.textContent = text;
    reviewMsg.className = 'show ' + type;
    setTimeout(() => {
        reviewMsg.className = '';
    }, 5000);
}

// Счётчик символов
const reviewText = document.getElementById('reviewText');
const charCount = document.querySelector('.char-count');
reviewText.addEventListener('input', function () {
    const len = this.value.length;
    charCount.textContent = len + ' символов';
    if (len > 500) {
        charCount.style.color = '#dc2626';
        charCount.style.opacity = '1';
    } else {
        charCount.style.color = 'var(--text-soft)';
        charCount.style.opacity = '.5';
    }
});

document.getElementById('submitReviewBtn').addEventListener('click', function () {
    const name = document.getElementById('reviewName').value.trim();
    const car = document.getElementById('reviewCar').value.trim() || 'автомобиль';
    const text = reviewText.value.trim();

    if (!name) { showReviewMessage('❌ Пожалуйста, введите ваше имя', 'error'); return; }
    if (selectedRating === 0) { showReviewMessage('❌ Поставьте оценку сервису', 'error'); return; }
    if (!text || text.length < 10) { showReviewMessage('❌ Напишите развёрнутый отзыв (минимум 10 символов)', 'error'); return; }

    reviews.unshift({ name, car, rating: selectedRating, text, date: new Date().toLocaleDateString('ru-RU') });
    if (reviews.length > 20) reviews.pop();
    saveReviews();
    renderReviews();

    document.getElementById('reviewName').value = '';
    document.getElementById('reviewCar').value = '';
    reviewText.value = '';
    charCount.textContent = '0 символов';
    selectedRating = 0;
    stars.forEach(s => { s.classList.remove('active');
        s.style.color = '#d1d5db'; });
    showReviewMessage('✅ Спасибо за ваш отзыв! Он поможет другим водителям.', 'success');
});

document.getElementById('clearReviewBtn').addEventListener('click', function () {
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewCar').value = '';
    reviewText.value = '';
    charCount.textContent = '0 символов';
    selectedRating = 0;
    stars.forEach(s => { s.classList.remove('active');
        s.style.color = '#d1d5db'; });
    reviewMsg.className = '';
});

// ===== МОДАЛКА КОНТАКТОВ =====
const contactModal = document.getElementById('contactModal');
const openContactBtn = document.getElementById('openContactBtn');
const closeContactModal = document.getElementById('closeContactModal');

if (openContactBtn) {
    openContactBtn.addEventListener('click', () => { contactModal.style.display = 'flex'; });
}
if (closeContactModal) {
    closeContactModal.addEventListener('click', () => { contactModal.style.display = 'none'; });
}
window.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.style.display = 'none';
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
const menuBtn = document.getElementById('mobileMenuBtn');
const navLinksDiv = document.getElementById('navLinks');
if (menuBtn) {
    menuBtn.addEventListener('click', () => navLinksDiv.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinksDiv.classList.remove('active')));
}

buildServices();
loadReviews();

// ===== КАРТА =====
function initMap() {
    const location = [43.132025, 131.895222];
    const map = new DG.Map('dgisMap', { center: location, zoom: 17, zoomControl: true });
    const marker = new DG.Marker(location).addTo(map);
    marker.bindPopup('<b>MotorCar</b><br/>Автосервис<br/>ул. Карбышева, 9а, Владивосток<br/>☎ +7 950 290-75-47');
    setTimeout(() => marker.openPopup(), 400);
    DG.control.zoom().addTo(map);
}

if (typeof DG !== 'undefined') {
    DG.then(() => initMap());
} else {
    window.addEventListener('load', () => {
        if (typeof DG !== 'undefined') DG.then(() => initMap());
        else document.getElementById('dgisMap').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#e2e8f0;">📍 г. Владивосток, ул. Карбышева, 9а</div>';
    });
}