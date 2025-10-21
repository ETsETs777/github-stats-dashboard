import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here-change-in-production')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', None)
    CACHE_TIMEOUT = 3600
    MAX_REPOS = 100
    TOP_REPOS_COUNT = 10
