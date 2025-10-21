from flask import Flask, render_template, request, jsonify
from github_api import GitHubStats
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

github_stats = GitHubStats(token=Config.GITHUB_TOKEN)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/stats/<username>')
def get_stats(username):
    if not username:
        return jsonify({'success': False, 'error': 'Username не может быть пустым'}), 400
    
    try:
        stats = github_stats.get_user_stats(username)
        return jsonify(stats)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/compare/<username1>/<username2>')
def compare_users(username1, username2):
    if not username1 or not username2:
        return jsonify({'success': False, 'error': 'Оба username обязательны'}), 400
    
    try:
        stats1 = github_stats.get_user_stats(username1)
        stats2 = github_stats.get_user_stats(username2)
        
        if not stats1['success'] or not stats2['success']:
            return jsonify({
                'success': False, 
                'error': 'Ошибка получения данных одного из пользователей'
            }), 400
        
        comparison = github_stats.compare_users(stats1['data'], stats2['data'])
        
        return jsonify({
            'success': True,
            'user1': stats1['data'],
            'user2': stats2['data'],
            'comparison': comparison
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'GitHub Stats Dashboard',
        'version': '1.1.0'
    })


@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Внутренняя ошибка сервера'}), 500


if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=Config.DEBUG
    )
