#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
GitHub Stats Dashboard - Launcher Script
Скрипт для запуска приложения с проверкой зависимостей
"""

import sys
import subprocess
import os

def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3, 8):
        print("❌ Ошибка: Требуется Python 3.8 или выше")
        print(f"   Текущая версия: {sys.version}")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")

def check_dependencies():
    """Проверка установленных зависимостей"""
    try:
        import flask
        import github
        import plotly
        print("✅ Все зависимости установлены")
        return True
    except ImportError as e:
        print(f"❌ Не установлены зависимости: {e}")
        print("\n🔧 Установка зависимостей...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            print("✅ Зависимости успешно установлены")
            return True
        except subprocess.CalledProcessError:
            print("❌ Ошибка установки зависимостей")
            return False

def check_env_file():
    """Проверка файла .env"""
    if not os.path.exists('.env'):
        print("⚠️  Файл .env не найден")
        print("   Создайте .env файл на основе env_example.txt")
        print("   Приложение будет работать без токена (ограничение 60 запросов/час)")
    else:
        print("✅ Файл .env найден")

def run_app():
    """Запуск приложения"""
    print("\n" + "="*60)
    print("🚀 Запуск GitHub Stats Dashboard...")
    print("="*60 + "\n")
    
    try:
        from app import app
        from config import Config
        
        print(f"📍 Приложение будет доступно по адресу: http://localhost:5000")
        print(f"🔧 Режим отладки: {'Включен' if Config.DEBUG else 'Выключен'}")
        print(f"🔑 GitHub токен: {'Настроен' if Config.GITHUB_TOKEN else 'Не настроен'}")
        print("\n💡 Нажмите Ctrl+C для остановки\n")
        print("="*60 + "\n")
        
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=Config.DEBUG
        )
    except Exception as e:
        print(f"\n❌ Ошибка при запуске приложения: {e}")
        sys.exit(1)

def main():
    """Главная функция"""
    print("\n" + "="*60)
    print("📊 GitHub Stats Dashboard - Проверка системы")
    print("="*60 + "\n")
    
    # Проверки
    check_python_version()
    
    if not check_dependencies():
        sys.exit(1)
    
    check_env_file()
    
    # Запуск
    run_app()

if __name__ == '__main__':
    main()

