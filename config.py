import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Конфигурация приложения"""
    
    # Flask настройки
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here-change-in-production')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    
    # GitHub API настройки
    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', None)  # Опционально, но увеличивает лимит запросов
    
    # Настройки кеширования
    CACHE_TIMEOUT = 3600  # 1 час
    
    # Настройки приложения
    MAX_REPOS = 100  # Максимальное количество репозиториев для анализа
    TOP_REPOS_COUNT = 10  # Количество топ репозиториев для отображения

