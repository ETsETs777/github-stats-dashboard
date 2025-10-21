from github import Github, GithubException
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
import plotly.graph_objects as go
import plotly.express as px
from config import Config


class GitHubStats:
    """Класс для получения и анализа статистики GitHub пользователя"""
    
    def __init__(self, token=None):
        """
        Инициализация клиента GitHub API
        
        Args:
            token (str, optional): GitHub Personal Access Token для увеличения лимита запросов
        """
        self.github = Github(token) if token else Github()
        self.user = None
        self.repos = []
        
    def get_user_stats(self, username):
        """
        Получить полную статистику пользователя
        
        Args:
            username (str): GitHub username
            
        Returns:
            dict: Словарь со всей статистикой пользователя
        """
        try:
            self.user = self.github.get_user(username)
            self.repos = list(self.user.get_repos())[:Config.MAX_REPOS]
            
            stats = {
                'profile': self._get_profile_info(),
                'repositories': self._get_repositories_stats(),
                'languages': self._get_languages_stats(),
                'activity': self._get_activity_stats(),
                'charts': self._generate_charts()
            }
            
            return {'success': True, 'data': stats}
            
        except GithubException as e:
            return {'success': False, 'error': f'Ошибка GitHub API: {str(e)}'}
        except Exception as e:
            return {'success': False, 'error': f'Неожиданная ошибка: {str(e)}'}
    
    def _get_profile_info(self):
        """Получить информацию о профиле пользователя"""
        return {
            'login': self.user.login,
            'name': self.user.name or self.user.login,
            'bio': self.user.bio or 'Нет описания',
            'avatar_url': self.user.avatar_url,
            'html_url': self.user.html_url,
            'followers': self.user.followers,
            'following': self.user.following,
            'public_repos': self.user.public_repos,
            'public_gists': self.user.public_gists,
            'created_at': self.user.created_at.strftime('%d.%m.%Y'),
            'company': self.user.company or 'Не указано',
            'location': self.user.location or 'Не указано',
            'blog': self.user.blog or 'Нет',
        }
    
    def _get_repositories_stats(self):
        """Получить статистику по репозиториям"""
        total_stars = sum(repo.stargazers_count for repo in self.repos)
        total_forks = sum(repo.forks_count for repo in self.repos)
        total_watchers = sum(repo.watchers_count for repo in self.repos)
        
        # Топ репозиториев по звездам
        top_repos = sorted(
            self.repos,
            key=lambda r: r.stargazers_count,
            reverse=True
        )[:Config.TOP_REPOS_COUNT]
        
        top_repos_list = [{
            'name': repo.name,
            'description': repo.description or 'Нет описания',
            'stars': repo.stargazers_count,
            'forks': repo.forks_count,
            'language': repo.language or 'Unknown',
            'url': repo.html_url,
            'updated_at': repo.updated_at.strftime('%d.%m.%Y')
        } for repo in top_repos]
        
        return {
            'total_repos': len(self.repos),
            'total_stars': total_stars,
            'total_forks': total_forks,
            'total_watchers': total_watchers,
            'top_repos': top_repos_list,
            'avg_stars': round(total_stars / len(self.repos), 2) if self.repos else 0,
        }
    
    def _get_languages_stats(self):
        """Получить статистику по языкам программирования"""
        languages = Counter()
        
        for repo in self.repos:
            if repo.language:
                languages[repo.language] += 1
        
        total = sum(languages.values())
        
        languages_data = [{
            'language': lang,
            'count': count,
            'percentage': round((count / total) * 100, 2)
        } for lang, count in languages.most_common(10)]
        
        return {
            'total_languages': len(languages),
            'languages': languages_data
        }
    
    def _get_activity_stats(self):
        """Получить статистику активности"""
        # Анализируем последние обновления репозиториев
        recent_updates = []
        one_year_ago = datetime.now(timezone.utc) - timedelta(days=365)
        
        for repo in self.repos:
            if repo.updated_at > one_year_ago:
                recent_updates.append(repo.updated_at)
        
        # Группируем по месяцам
        monthly_activity = defaultdict(int)
        for date in recent_updates:
            month_key = date.strftime('%Y-%m')
            monthly_activity[month_key] += 1
        
        return {
            'active_repos_last_year': len(recent_updates),
            'monthly_activity': dict(sorted(monthly_activity.items()))
        }
    
    def _generate_charts(self):
        """Генерация графиков с помощью Plotly"""
        charts = {}
        
        # 1. Круговая диаграмма языков программирования
        languages = Counter()
        for repo in self.repos:
            if repo.language:
                languages[repo.language] += 1
        
        if languages:
            fig_languages = px.pie(
                values=list(languages.values()),
                names=list(languages.keys()),
                title='Распределение языков программирования',
                hole=0.4,
                color_discrete_sequence=px.colors.qualitative.Set3
            )
            fig_languages.update_layout(
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12)
            )
            charts['languages_pie'] = fig_languages.to_html(full_html=False, include_plotlyjs='cdn')
        
        # 2. Барчарт топ репозиториев по звездам
        top_repos = sorted(self.repos, key=lambda r: r.stargazers_count, reverse=True)[:10]
        if top_repos:
            repo_names = [repo.name for repo in top_repos]
            repo_stars = [repo.stargazers_count for repo in top_repos]
            
            fig_repos = go.Figure(data=[
                go.Bar(
                    x=repo_stars,
                    y=repo_names,
                    orientation='h',
                    marker=dict(
                        color=repo_stars,
                        colorscale='Viridis',
                        showscale=True
                    )
                )
            ])
            fig_repos.update_layout(
                title='Топ 10 репозиториев по звездам',
                xaxis_title='Количество звезд',
                yaxis_title='Репозиторий',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12),
                height=400
            )
            charts['top_repos_bar'] = fig_repos.to_html(full_html=False, include_plotlyjs='cdn')
        
        # 3. График активности по месяцам
        one_year_ago = datetime.now(timezone.utc) - timedelta(days=365)
        monthly_activity = defaultdict(int)
        
        for repo in self.repos:
            if repo.updated_at > one_year_ago:
                month_key = repo.updated_at.strftime('%Y-%m')
                monthly_activity[month_key] += 1
        
        if monthly_activity:
            sorted_months = sorted(monthly_activity.items())
            months = [m[0] for m in sorted_months]
            activity = [m[1] for m in sorted_months]
            
            fig_activity = go.Figure(data=[
                go.Scatter(
                    x=months,
                    y=activity,
                    mode='lines+markers',
                    line=dict(color='#00d4ff', width=3),
                    marker=dict(size=8, color='#00d4ff'),
                    fill='tozeroy',
                    fillcolor='rgba(0, 212, 255, 0.3)'
                )
            ])
            fig_activity.update_layout(
                title='Активность обновления репозиториев (последний год)',
                xaxis_title='Месяц',
                yaxis_title='Количество обновлений',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12),
                height=350
            )
            charts['activity_timeline'] = fig_activity.to_html(full_html=False, include_plotlyjs='cdn')
        
        # 4. Статистика форков vs звезд
        repos_with_stars = [r for r in self.repos if r.stargazers_count > 0]
        if repos_with_stars:
            fig_scatter = go.Figure(data=[
                go.Scatter(
                    x=[r.stargazers_count for r in repos_with_stars],
                    y=[r.forks_count for r in repos_with_stars],
                    mode='markers',
                    marker=dict(
                        size=[min(r.stargazers_count + 5, 30) for r in repos_with_stars],
                        color=[r.stargazers_count for r in repos_with_stars],
                        colorscale='Plasma',
                        showscale=True,
                        colorbar=dict(title="Звезды")
                    ),
                    text=[r.name for r in repos_with_stars],
                    hovertemplate='<b>%{text}</b><br>Звезды: %{x}<br>Форки: %{y}<extra></extra>'
                )
            ])
            fig_scatter.update_layout(
                title='Звезды vs Форки',
                xaxis_title='Звезды',
                yaxis_title='Форки',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12),
                height=400
            )
            charts['stars_vs_forks'] = fig_scatter.to_html(full_html=False, include_plotlyjs='cdn')
        
        return charts

