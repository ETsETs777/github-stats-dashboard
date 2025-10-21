// GitHub Stats Dashboard - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const usernameInput = document.getElementById('username');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const statsSection = document.getElementById('statsSection');

    // Обработчик отправки формы
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        
        if (!username) {
            showError('Пожалуйста, введите GitHub username');
            return;
        }

        await fetchUserStats(username);
    });

    // Функция для получения статистики пользователя
    async function fetchUserStats(username) {
        // Показываем загрузку
        showLoading();
        hideError();
        hideStats();

        try {
            const response = await fetch(`/api/stats/${username}`);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Ошибка при получении данных');
            }

            // Отображаем статистику
            displayStats(result.data);
            
        } catch (err) {
            showError(err.message || 'Произошла ошибка при загрузке данных');
            console.error('Error:', err);
        } finally {
            hideLoading();
        }
    }

    // Отображение статистики
    function displayStats(data) {
        // Профиль
        document.getElementById('avatar').src = data.profile.avatar_url;
        document.getElementById('profileName').textContent = data.profile.name;
        document.getElementById('profileLogin').textContent = '@' + data.profile.login;
        document.getElementById('profileBio').textContent = data.profile.bio;
        document.getElementById('profileLocation').textContent = data.profile.location;
        document.getElementById('profileCompany').textContent = data.profile.company;
        document.getElementById('profileCreated').textContent = 'С ' + data.profile.created_at;
        
        const blogLink = document.getElementById('profileBlog');
        if (data.profile.blog && data.profile.blog !== 'Нет') {
            blogLink.href = data.profile.blog.startsWith('http') ? data.profile.blog : 'https://' + data.profile.blog;
            blogLink.textContent = data.profile.blog;
            blogLink.style.display = 'inline';
        } else {
            blogLink.parentElement.style.display = 'none';
        }

        // Статистика профиля
        document.getElementById('followers').textContent = formatNumber(data.profile.followers);
        document.getElementById('following').textContent = formatNumber(data.profile.following);
        document.getElementById('repos').textContent = formatNumber(data.profile.public_repos);
        document.getElementById('gists').textContent = formatNumber(data.profile.public_gists);

        // Статистика репозиториев
        document.getElementById('totalStars').textContent = formatNumber(data.repositories.total_stars);
        document.getElementById('totalForks').textContent = formatNumber(data.repositories.total_forks);
        document.getElementById('totalWatchers').textContent = formatNumber(data.repositories.total_watchers);
        document.getElementById('totalLanguages').textContent = formatNumber(data.languages.total_languages);

        // Графики
        if (data.charts.languages_pie) {
            document.getElementById('languagesChart').innerHTML = data.charts.languages_pie;
        }
        if (data.charts.top_repos_bar) {
            document.getElementById('topReposChart').innerHTML = data.charts.top_repos_bar;
        }
        if (data.charts.activity_timeline) {
            document.getElementById('activityChart').innerHTML = data.charts.activity_timeline;
        }
        if (data.charts.stars_vs_forks) {
            document.getElementById('scatterChart').innerHTML = data.charts.stars_vs_forks;
        }

        // Топ репозитории
        displayTopRepos(data.repositories.top_repos);

        // Таблица языков
        displayLanguagesTable(data.languages.languages);

        // Показываем секцию со статистикой
        showStats();
    }

    // Отображение топ репозиториев
    function displayTopRepos(repos) {
        const reposList = document.getElementById('topReposList');
        reposList.innerHTML = '';

        repos.forEach((repo, index) => {
            const repoItem = document.createElement('div');
            repoItem.className = 'repo-item';
            repoItem.innerHTML = `
                <h4>
                    <i class="fas fa-book"></i>
                    <a href="${repo.url}" target="_blank">${repo.name}</a>
                </h4>
                <p>${repo.description}</p>
                <div class="repo-stats">
                    <span class="repo-stat">
                        <i class="fas fa-star"></i>
                        ${formatNumber(repo.stars)} звезд
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-code-branch"></i>
                        ${formatNumber(repo.forks)} форков
                    </span>
                    <span class="repo-stat language">
                        <i class="fas fa-code"></i>
                        ${repo.language}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-calendar"></i>
                        ${repo.updated_at}
                    </span>
                </div>
            `;
            reposList.appendChild(repoItem);
        });
    }

    // Отображение таблицы языков
    function displayLanguagesTable(languages) {
        const table = document.getElementById('languagesTable');
        table.innerHTML = '';

        languages.forEach((lang, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <i class="fas fa-code"></i>
                    <strong>${lang.language}</strong>
                </td>
                <td>${lang.count}</td>
                <td>${lang.percentage}%</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${lang.percentage}%" 
                             aria-valuenow="${lang.percentage}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                        </div>
                    </div>
                </td>
            `;
            table.appendChild(row);
        });
    }

    // Утилиты для отображения/скрытия элементов
    function showLoading() {
        loading.style.display = 'block';
    }

    function hideLoading() {
        loading.style.display = 'none';
    }

    function showError(message) {
        errorMessage.textContent = message;
        error.style.display = 'block';
        setTimeout(() => {
            hideError();
        }, 5000);
    }

    function hideError() {
        error.style.display = 'none';
    }

    function showStats() {
        statsSection.style.display = 'block';
        // Плавный скролл к статистике
        setTimeout(() => {
            statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function hideStats() {
        statsSection.style.display = 'none';
    }

    // Форматирование чисел
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Анимация при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми анимируемыми элементами
    document.querySelectorAll('.stats-card, .chart-card, .repos-card, .langs-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Пример пользователей для быстрого доступа
    const exampleUsers = ['octocat', 'torvalds', 'gaearon'];
    let currentExample = 0;

    // Можно добавить подсказки с примерами
    usernameInput.addEventListener('focus', function() {
        if (!this.value) {
            this.placeholder = `Попробуйте: ${exampleUsers[currentExample]}`;
            currentExample = (currentExample + 1) % exampleUsers.length;
        }
    });

    usernameInput.addEventListener('blur', function() {
        if (!this.value) {
            this.placeholder = 'Введите GitHub username...';
        }
    });

    // Обработка Enter в поле ввода
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Добавляем звездный эффект на фон (опционально)
function createStars() {
    const starsContainer = document.querySelector('.animated-background');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
        `;
        starsContainer.appendChild(star);
    }
}

// CSS для мерцания звезд
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Создаем звезды при загрузке
createStars();

