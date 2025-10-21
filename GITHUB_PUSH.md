# 🚀 Инструкция по загрузке на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Откройте: https://github.com/new
2. Заполните:
   - **Repository name**: `github-stats-dashboard`
   - **Description**: `Beautiful GitHub stats dashboard built with Python, Flask and Plotly 📊`
   - **Public** или **Private** - на ваш выбор
   - ❌ **НЕ** добавляйте README, .gitignore (уже есть!)
3. Нажмите **"Create repository"**

## Шаг 2: Скопируйте URL репозитория

После создания GitHub покажет URL типа:
```
https://github.com/YOUR-USERNAME/github-stats-dashboard.git
```

## Шаг 3: Выполните команды

Замените `YOUR-USERNAME` на ваш GitHub username:

```bash
# Добавьте remote
git remote add origin https://github.com/YOUR-USERNAME/github-stats-dashboard.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Запушьте код
git push -u origin main
```

## Готово! 🎉

Ваш проект будет доступен по адресу:
```
https://github.com/YOUR-USERNAME/github-stats-dashboard
```

---

## 📝 Альтернативный метод (с SSH):

Если у вас настроен SSH:

```bash
git remote add origin git@github.com:YOUR-USERNAME/github-stats-dashboard.git
git branch -M main
git push -u origin main
```

---

## 🔧 Если remote уже существует:

```bash
# Проверить remote
git remote -v

# Изменить remote
git remote set-url origin https://github.com/YOUR-USERNAME/github-stats-dashboard.git

# Запушить
git push -u origin main
```

