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


@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'GitHub Stats Dashboard',
        'version': '1.0.0'
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
