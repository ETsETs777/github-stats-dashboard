// GitHub Stats Dashboard - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const compareForm = document.getElementById('compareForm');
    const usernameInput = document.getElementById('username');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const statsSection = document.getElementById('statsSection');
    const comparisonSection = document.getElementById('comparisonSection');
    const toggleModeBtn = document.getElementById('toggleMode');
    const singleMode = document.getElementById('singleMode');
    const compareMode = document.getElementById('compareMode');
    
    let currentMode = 'single';

    // Переключение режима
    toggleModeBtn.addEventListener('click', function() {
        if (currentMode === 'single') {
            currentMode = 'compare';
            singleMode.style.display = 'none';
            compareMode.style.display = 'block';
            toggleModeBtn.innerHTML = '<i class="fas fa-user"></i> Одиночный режим';
            hideStats();
            hideComparison();
        } else {
            currentMode = 'single';
            singleMode.style.display = 'block';
            compareMode.style.display = 'none';
            toggleModeBtn.innerHTML = '<i class="fas fa-exchange-alt"></i> Режим сравнения';
            hideComparison();
            hideStats();
        }
    });

    // Обработчик отправки формы поиска
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        
        if (!username) {
            showError('Пожалуйста, введите GitHub username');
            return;
        }

        await fetchUserStats(username);
    });
    
    // Обработчик отправки формы сравнения
    compareForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username1 = document.getElementById('username1').value.trim();
        const username2 = document.getElementById('username2').value.trim();
        
        if (!username1 || !username2) {
            showError('Пожалуйста, введите оба username');
            return;
        }

        await compareUsers(username1, username2);
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
        } else {
            document.getElementById('languagesChart').innerHTML = '<p class="text-center text-muted p-5">📊 Нет данных о языках программирования</p>';
        }
        
        if (data.charts.top_repos_bar) {
            document.getElementById('topReposChart').innerHTML = data.charts.top_repos_bar;
        } else {
            document.getElementById('topReposChart').innerHTML = '<p class="text-center text-muted p-5">📚 Нет репозиториев для отображения</p>';
        }
        
        if (data.charts.activity_timeline) {
            document.getElementById('activityChart').innerHTML = data.charts.activity_timeline;
        } else {
            document.getElementById('activityChart').innerHTML = '<p class="text-center text-muted p-5">📈 Нет активности за последний год</p>';
        }
        
        if (data.charts.stars_vs_forks) {
            document.getElementById('scatterChart').innerHTML = data.charts.stars_vs_forks;
        } else {
            document.getElementById('scatterChart').innerHTML = '<p class="text-center text-muted p-5">⭐ Нет данных для отображения</p>';
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

        if (!repos || repos.length === 0) {
            reposList.innerHTML = '<p class="text-center text-muted p-5">📚 Нет репозиториев для отображения</p>';
            return;
        }

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

        if (!languages || languages.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="text-center text-muted p-4">💻 Нет данных о языках программирования</td>';
            table.appendChild(row);
            return;
        }

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
    
    function showComparison() {
        comparisonSection.style.display = 'block';
        setTimeout(() => {
            comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
    
    function hideComparison() {
        comparisonSection.style.display = 'none';
    }
    
    // Функция сравнения двух пользователей
    async function compareUsers(username1, username2) {
        showLoading();
        hideError();
        hideComparison();
        
        try {
            const response = await fetch(`/api/compare/${username1}/${username2}`);
            const result = await response.json();
            
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Ошибка при сравнении');
            }
            
            displayComparison(result);
            
        } catch (err) {
            showError(err.message || 'Произошла ошибка при сравнении');
            console.error('Error:', err);
        } finally {
            hideLoading();
        }
    }
    
    // Отображение результатов сравнения
    function displayComparison(data) {
        const comp = data.comparison;
        const user1 = data.user1;
        const user2 = data.user2;
        
        // Followers
        document.getElementById('comp-followers-1').textContent = formatNumber(comp.followers.user1);
        document.getElementById('comp-followers-2').textContent = formatNumber(comp.followers.user2);
        setWinner('comp-followers-winner', comp.followers.winner);
        
        // Repos
        document.getElementById('comp-repos-1').textContent = formatNumber(comp.repos.user1);
        document.getElementById('comp-repos-2').textContent = formatNumber(comp.repos.user2);
        setWinner('comp-repos-winner', comp.repos.winner);
        
        // Stars
        document.getElementById('comp-stars-1').textContent = formatNumber(comp.stars.user1);
        document.getElementById('comp-stars-2').textContent = formatNumber(comp.stars.user2);
        setWinner('comp-stars-winner', comp.stars.winner);
        
        // Forks
        document.getElementById('comp-forks-1').textContent = formatNumber(comp.forks.user1);
        document.getElementById('comp-forks-2').textContent = formatNumber(comp.forks.user2);
        setWinner('comp-forks-winner', comp.forks.winner);
        
        // Languages
        document.getElementById('comp-langs-1').textContent = formatNumber(comp.languages.user1);
        document.getElementById('comp-langs-2').textContent = formatNumber(comp.languages.user2);
        setWinner('comp-langs-winner', comp.languages.winner);
        
        // Profiles
        document.getElementById('avatar1').src = user1.profile.avatar_url;
        document.getElementById('name1').textContent = user1.profile.name;
        document.getElementById('login1').textContent = '@' + user1.profile.login;
        
        document.getElementById('avatar2').src = user2.profile.avatar_url;
        document.getElementById('name2').textContent = user2.profile.name;
        document.getElementById('login2').textContent = '@' + user2.profile.login;
        
        showComparison();
    }
    
    // Установка значка победителя
    function setWinner(elementId, winner) {
        const badge = document.getElementById(elementId);
        badge.className = 'winner-badge';
        
        if (winner === 1) {
            badge.classList.add('user1-wins');
            badge.textContent = '👑 Побеждает';
        } else if (winner === 2) {
            badge.classList.add('user2-wins');
            badge.textContent = '👑 Побеждает';
        } else {
            badge.classList.add('tie');
            badge.textContent = '🤝 Равны';
        }
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

