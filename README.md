# 📊 GitHub Stats Dashboard

Красивый и интерактивный дашборд для анализа статистики GitHub профилей, созданный на Python с использованием Flask.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Особенности

- 🎨 **Современный UI/UX дизайн** с темной темой и анимациями
- 📈 **Интерактивные графики** с использованием Plotly
- 📊 **Подробная статистика** профиля и репозиториев
- 🌐 **Адаптивный дизайн** для всех устройств
- ⚡ **Быстрая загрузка** данных через GitHub API
- 🎯 **Визуализация данных**:
  - Распределение языков программирования
  - Топ репозитории по звездам
  - График активности
  - Соотношение звезд и форков

## 📸 Скриншоты

### Главная страница
Введите любой GitHub username и получите полную статистику!

### Профиль пользователя
- Аватар и основная информация
- Подписчики, подписки, репозитории
- Местоположение, компания, дата регистрации

### Статистика
- Общее количество звезд, форков, watchers
- Топ репозитории с подробной информацией
- Статистика по языкам программирования

### Графики
- Круговая диаграмма языков
- Барчарт топ репозиториев
- График активности обновлений
- Scatter plot звезд vs форков

## 🚀 Быстрый старт

### Требования

- Python 3.8 или выше
- pip (менеджер пакетов Python)

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/yourusername/github-stats-dashboard.git
   cd github-stats-dashboard
   ```

2. **Создайте виртуальное окружение** (рекомендуется)
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Установите зависимости**
   ```bash
   pip install -r requirements.txt
   ```

4. **Создайте файл .env** (опционально, для GitHub токена)
   ```bash
   # Создайте файл .env в корне проекта
   GITHUB_TOKEN=your_github_personal_access_token_here
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ```

   > 💡 **Примечание**: GitHub токен не обязателен, но рекомендуется для увеличения лимита запросов API (5000 вместо 60 в час)

5. **Запустите приложение**
   ```bash
   python app.py
   ```

6. **Откройте в браузере**
   ```
   http://localhost:5000
   ```

## 🔑 Получение GitHub Token (опционально)

Для увеличения лимита запросов к GitHub API:

1. Перейдите на https://github.com/settings/tokens
2. Нажмите "Generate new token (classic)"
3. Укажите название токена (например, "GitHub Stats Dashboard")
4. Выберите область видимости: `public_repo` и `read:user`
5. Нажмите "Generate token"
6. Скопируйте токен и добавьте в файл `.env`

## 📁 Структура проекта

```
github-stats-dashboard/
├── app.py                  # Основное Flask приложение
├── github_api.py          # Модуль для работы с GitHub API
├── config.py              # Конфигурация приложения
├── requirements.txt       # Зависимости Python
├── README.md             # Документация
├── .env                  # Переменные окружения (создается вручную)
├── .gitignore           # Игнорируемые файлы Git
├── static/              # Статические файлы
│   ├── css/
│   │   └── style.css    # Стили CSS
│   └── js/
│       └── main.js      # JavaScript код
└── templates/           # HTML шаблоны
    └── index.html       # Главная страница
```

## 🛠️ Используемые технологии

### Backend
- **Flask** - веб-фреймворк Python
- **PyGithub** - библиотека для работы с GitHub API
- **Plotly** - создание интерактивных графиков
- **python-dotenv** - управление переменными окружения

### Frontend
- **HTML5** - разметка
- **CSS3** - стилизация с градиентами и анимациями
- **JavaScript (Vanilla)** - интерактивность
- **Bootstrap 5** - адаптивная сетка и компоненты
- **Font Awesome** - иконки
- **Google Fonts (Inter)** - шрифты

## 📊 API Endpoints

- `GET /` - Главная страница
- `GET /api/stats/<username>` - Получить статистику пользователя
- `GET /api/health` - Проверка работоспособности API

### Пример ответа API

```json
{
  "success": true,
  "data": {
    "profile": {
      "login": "octocat",
      "name": "The Octocat",
      "bio": "GitHub's mascot",
      "followers": 1000,
      "following": 100,
      ...
    },
    "repositories": {
      "total_stars": 5000,
      "total_forks": 1000,
      "top_repos": [...]
    },
    "languages": {
      "total_languages": 10,
      "languages": [...]
    },
    "charts": {...}
  }
}
```

## ⚙️ Конфигурация

Вы можете настроить приложение через файл `config.py`:

- `SECRET_KEY` - секретный ключ Flask
- `DEBUG` - режим отладки
- `GITHUB_TOKEN` - токен GitHub API
- `MAX_REPOS` - максимальное количество репозиториев для анализа (по умолчанию 100)
- `TOP_REPOS_COUNT` - количество топ репозиториев для отображения (по умолчанию 10)

## 🎨 Кастомизация

### Изменение цветовой схемы

Откройте `static/css/style.css` и измените переменные градиентов:

```css
background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
```

### Изменение количества отображаемых репозиториев

В файле `config.py`:

```python
TOP_REPOS_COUNT = 10  # Измените на нужное значение
```

## 🐛 Решение проблем

### Ошибка "API rate limit exceeded"

- Добавьте GitHub токен в файл `.env`
- Подождите некоторое время (лимит сбрасывается каждый час)

### Ошибка "User not found"

- Проверьте правильность написания username
- Убедитесь, что профиль публичный

### Приложение не запускается

- Убедитесь, что установлены все зависимости: `pip install -r requirements.txt`
- Проверьте версию Python: `python --version` (должна быть 3.8+)
- Проверьте, что порт 5000 не занят другим приложением

## 📝 Лицензия

MIT License - свободно используйте для своих проектов!

## 🤝 Вклад в проект

Вклад приветствуется! Пожалуйста:

1. Сделайте Fork репозитория
2. Создайте ветку для новой функции (`git checkout -b feature/AmazingFeature`)
3. Сделайте commit изменений (`git commit -m 'Add some AmazingFeature'`)
4. Отправьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 🔗 Полезные ссылки

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Plotly Python](https://plotly.com/python/)
- [Bootstrap 5](https://getbootstrap.com/)

## 📈 Планы развития

- [ ] Добавить сравнение двух пользователей
- [ ] Экспорт статистики в PDF/PNG
- [ ] История поиска
- [ ] Больше графиков и визуализаций
- [ ] Анализ contribution activity
- [ ] Поддержка организаций
- [ ] Темная/светлая тема (переключатель)
- [ ] Кеширование данных

---

⭐ Поставьте звезду, если проект был полезен!

