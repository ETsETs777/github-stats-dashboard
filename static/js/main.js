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
    const searchHistory = document.getElementById('searchHistory');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    let currentMode = 'single';
    const MAX_HISTORY = 10;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const exportBtn = document.getElementById('exportBtn');
    
    // Экспорт статистики
    exportBtn.addEventListener('click', function() {
        const exportMenu = confirm('Выберите способ экспорта:\nOK - Печать в PDF\nОтмена - Скопировать URL для скриншота');
        
        if (exportMenu) {
            window.print();
        } else {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('URL скопирован! Используйте сервис скриншотов или расширение браузера.');
            });
        }
    });
    
    // Загрузка сохраненной темы при старте
    const savedTheme = localStorage.getItem('github_dashboard_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    }
    
    // Переключение темы
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('github_dashboard_theme', 'light');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('github_dashboard_theme', 'dark');
        }
    });
    
    // Загрузка истории при старте
    loadHistory();
    
    // Очистка истории
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Очистить всю историю поиска?')) {
            localStorage.removeItem('github_search_history');
            loadHistory();
        }
    });

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
            
            // Добавляем в историю
            addToHistory(username, result.data.profile.name, result.data.profile.avatar_url);
            
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
        if (data.profile.is_organization) {
            document.getElementById('followers').textContent = formatNumber(data.profile.public_members || 0);
            document.getElementById('following').textContent = '-';
            document.getElementById('gists').textContent = '-';
            document.querySelector('[for="followers"] .stat-label').textContent = 'Участники';
        } else {
            document.getElementById('followers').textContent = formatNumber(data.profile.followers);
            document.getElementById('following').textContent = formatNumber(data.profile.following);
            document.getElementById('gists').textContent = formatNumber(data.profile.public_gists);
        }
        document.getElementById('repos').textContent = formatNumber(data.profile.public_repos);

        // Статистика репозиториев
        document.getElementById('totalStars').textContent = formatNumber(data.repositories.total_stars);
        document.getElementById('totalForks').textContent = formatNumber(data.repositories.total_forks);
        document.getElementById('totalWatchers').textContent = formatNumber(data.repositories.total_watchers);
        document.getElementById('totalLanguages').textContent = formatNumber(data.languages.total_languages);

        // Графики - показываем только если есть данные
        const chartElement1 = document.getElementById('languagesChart');
        if (data.charts.languages_pie) {
            chartElement1.innerHTML = data.charts.languages_pie;
            chartElement1.closest('.chart-card').style.display = 'block';
        } else {
            chartElement1.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement2 = document.getElementById('topReposChart');
        if (data.charts.top_repos_bar) {
            chartElement2.innerHTML = data.charts.top_repos_bar;
            chartElement2.closest('.chart-card').style.display = 'block';
        } else {
            chartElement2.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement3 = document.getElementById('activityChart');
        if (data.charts.activity_timeline) {
            chartElement3.innerHTML = data.charts.activity_timeline;
            chartElement3.closest('.chart-card').style.display = 'block';
        } else {
            chartElement3.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement4 = document.getElementById('scatterChart');
        if (data.charts.stars_vs_forks) {
            chartElement4.innerHTML = data.charts.stars_vs_forks;
            chartElement4.closest('.chart-card').style.display = 'block';
        } else {
            chartElement4.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement5 = document.getElementById('reposByYearChart');
        if (data.charts.repos_by_year) {
            chartElement5.innerHTML = data.charts.repos_by_year;
            chartElement5.closest('.chart-card').style.display = 'block';
        } else {
            chartElement5.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement6 = document.getElementById('groupedChart');
        if (data.charts.stars_forks_grouped) {
            chartElement6.innerHTML = data.charts.stars_forks_grouped;
            chartElement6.closest('.chart-card').style.display = 'block';
        } else {
            chartElement6.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement7 = document.getElementById('weeklyActivityChart');
        if (data.charts.weekly_activity) {
            chartElement7.innerHTML = data.charts.weekly_activity;
            chartElement7.closest('.chart-card').style.display = 'block';
        } else {
            chartElement7.closest('.chart-card').style.display = 'none';
        }
        
        const chartElement8 = document.getElementById('repoTypesChart');
        if (data.charts.repo_types_pie) {
            chartElement8.innerHTML = data.charts.repo_types_pie;
            chartElement8.closest('.chart-card').style.display = 'block';
        } else {
            chartElement8.closest('.chart-card').style.display = 'none';
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
        const reposCard = reposList.closest('.repos-card');
        reposList.innerHTML = '';

        if (!repos || repos.length === 0) {
            if (reposCard) reposCard.style.display = 'none';
            return;
        }
        
        if (reposCard) reposCard.style.display = 'block';

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
        const langsCard = table.closest('.langs-card');
        table.innerHTML = '';

        if (!languages || languages.length === 0) {
            if (langsCard) langsCard.style.display = 'none';
            return;
        }
        
        if (langsCard) langsCard.style.display = 'block';

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
        exportBtn.style.display = 'inline-block';
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
    
    // Функции для работы с историей поиска
    function addToHistory(username, name, avatar) {
        let history = JSON.parse(localStorage.getItem('github_search_history') || '[]');
        
        // Удаляем дубликаты
        history = history.filter(item => item.username !== username);
        
        // Добавляем в начало
        history.unshift({
            username: username,
            name: name,
            avatar: avatar,
            timestamp: new Date().toISOString()
        });
        
        // Ограничиваем размер истории
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }
        
        localStorage.setItem('github_search_history', JSON.stringify(history));
        loadHistory();
    }
    
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('github_search_history') || '[]');
        
        if (history.length === 0) {
            searchHistory.style.display = 'none';
            return;
        }
        
        searchHistory.style.display = 'block';
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.avatar}" alt="${item.name}" style="width: 24px; height: 24px; border-radius: 50%;">
                <span>${item.username}</span>
            `;
            
            historyItem.addEventListener('click', function() {
                usernameInput.value = item.username;
                searchForm.dispatchEvent(new Event('submit'));
            });
            
            historyList.appendChild(historyItem);
        });
    }
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

