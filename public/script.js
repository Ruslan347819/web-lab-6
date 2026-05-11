document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');

    const currentHour = new Date().getHours();
    let isLight = currentHour >= 7 && currentHour < 21;

    body.className = isLight ? '' : 'dark';
    updateBtnText();

    themeBtn.addEventListener('click', () => {
        isLight = !isLight;
        body.className = isLight ? '' : 'dark';
        updateBtnText();
    });

    function updateBtnText() {
        themeBtn.textContent = isLight ? 'Увімкнути нічний режим' : 'Увімкнути денний режим';
    }

    localStorage.setItem('userPlatform', navigator.platform);
    localStorage.setItem('userAgent', navigator.userAgent);

    document.getElementById('sys-os').textContent = localStorage.getItem('userPlatform');
    document.getElementById('sys-browser').textContent = localStorage.getItem('userAgent').substring(0, 30) + '...';

    fetch('https://jsonplaceholder.typicode.com/posts/18/comments')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('reviews-container');
            container.innerHTML = ''; 
            
            data.forEach(review => {
                const card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = `
                    <h4>${review.name}</h4>
                    <p class="email">${review.email}</p>
                    <p>"${review.body}"</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Помилка завантаження відгуків:', error);
            document.getElementById('reviews-container').textContent = 'Помилка завантаження відгуків.';
        });

    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('close-modal');

    setTimeout(() => {
        modal.classList.remove('hidden');
    }, 60000);

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: this.name.value,
            email: this.email.value,
            phone: this.phone.value,
            message: this.message.value
        };

        fetch('https://82def55cc3d583.lhr.life/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert('Повідомлення успішно відправлено на пошту!');
                modal.classList.add('hidden');
                this.reset();
            } else {
                alert('Помилка відправки: ' + (data.error || 'Невідома помилка'));
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert('Помилка з\'єднання з сервером. Перевір, чи запущений тунель.');
        });
    });
});