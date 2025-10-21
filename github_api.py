from github import Github, GithubException
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
import plotly.graph_objects as go
import plotly.express as px
from config import Config
from cache import SimpleCache


class GitHubStats:
    
    def __init__(self, token=None):
        self.github = Github(token) if token else Github()
        self.user = None
        self.repos = []
        self.cache = SimpleCache(ttl_seconds=Config.CACHE_TIMEOUT)
        
    def get_user_stats(self, username):
        cache_key = f'user_stats_{username}'
        cached_data = self.cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
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
            
            result = {'success': True, 'data': stats}
            self.cache.set(cache_key, result)
            return result
            
        except GithubException as e:
            return {'success': False, 'error': f'Ошибка GitHub API: {str(e)}'}
        except Exception as e:
            return {'success': False, 'error': f'Неожиданная ошибка: {str(e)}'}
    
    def _get_profile_info(self):
        is_org = self.user.type == 'Organization'
        
        profile = {
            'login': self.user.login,
            'name': self.user.name or self.user.login,
            'bio': self.user.bio or 'Нет описания',
            'avatar_url': self.user.avatar_url,
            'html_url': self.user.html_url,
            'public_repos': self.user.public_repos,
            'created_at': self.user.created_at.strftime('%d.%m.%Y'),
            'location': self.user.location or 'Не указано',
            'blog': self.user.blog or 'Нет',
            'type': 'organization' if is_org else 'user',
            'is_organization': is_org
        }
        
        if is_org:
            profile['email'] = self.user.email or 'Не указано'
            profile['public_members'] = getattr(self.user, 'public_members_count', 0) if hasattr(self.user, 'public_members_count') else 0
        else:
            profile['followers'] = self.user.followers
            profile['following'] = self.user.following
            profile['public_gists'] = self.user.public_gists
            profile['company'] = self.user.company or 'Не указано'
        
        return profile
    
    def _get_repositories_stats(self):
        total_stars = sum(repo.stargazers_count for repo in self.repos)
        total_forks = sum(repo.forks_count for repo in self.repos)
        total_watchers = sum(repo.watchers_count for repo in self.repos)
        
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
        recent_updates = []
        one_year_ago = datetime.now(timezone.utc) - timedelta(days=365)
        
        repo_types = {'source': 0, 'fork': 0}
        recent_repos = []
        
        for repo in self.repos:
            if repo.fork:
                repo_types['fork'] += 1
            else:
                repo_types['source'] += 1
                
            if repo.updated_at > one_year_ago:
                recent_updates.append(repo.updated_at)
                recent_repos.append(repo)
        
        monthly_activity = defaultdict(int)
        for date in recent_updates:
            month_key = date.strftime('%Y-%m')
            monthly_activity[month_key] += 1
        
        weekly_pattern = defaultdict(int)
        for date in recent_updates:
            day_of_week = date.strftime('%A')
            weekly_pattern[day_of_week] += 1
        
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        sorted_weekly = {day: weekly_pattern.get(day, 0) for day in days_order}
        
        avg_stars_per_repo = sum(r.stargazers_count for r in recent_repos) / len(recent_repos) if recent_repos else 0
        
        return {
            'active_repos_last_year': len(recent_updates),
            'monthly_activity': dict(sorted(monthly_activity.items())),
            'repo_types': repo_types,
            'weekly_pattern': sorted_weekly,
            'avg_stars_active': round(avg_stars_per_repo, 2),
            'total_source_repos': repo_types['source'],
            'total_fork_repos': repo_types['fork']
        }
    
    def _generate_charts(self):
        charts = {}
        
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
        
        top_repos = sorted(self.repos, key=lambda r: r.stargazers_count, reverse=True)[:10]
        if top_repos and len(top_repos) > 0:
            repo_names = [repo.name for repo in top_repos]
            repo_stars = [repo.stargazers_count for repo in top_repos]
            
            if sum(repo_stars) == 0:
                colors = ['#5865f2'] * len(repo_stars)
            else:
                colors = repo_stars
            
            fig_repos = go.Figure(data=[
                go.Bar(
                    x=repo_stars,
                    y=repo_names,
                    orientation='h',
                    marker=dict(
                        color=colors,
                        colorscale='Viridis',
                        showscale=(sum(repo_stars) > 0)
                    ),
                    text=repo_stars,
                    textposition='auto'
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
        
        repos_with_stars = [r for r in self.repos if r.stargazers_count > 0]
        if not repos_with_stars and self.repos:
            repos_with_stars = self.repos[:10]
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
        
        repos_by_year = defaultdict(int)
        for repo in self.repos:
            year = repo.created_at.year
            repos_by_year[year] += 1
        
        if repos_by_year:
            sorted_years = sorted(repos_by_year.items())
            years = [str(y[0]) for y in sorted_years]
            counts = [y[1] for y in sorted_years]
            
            fig_yearly = go.Figure(data=[
                go.Bar(
                    x=years,
                    y=counts,
                    marker=dict(
                        color=counts,
                        colorscale='Blues',
                        showscale=False
                    ),
                    text=counts,
                    textposition='auto'
                )
            ])
            fig_yearly.update_layout(
                title='Репозитории по годам создания',
                xaxis_title='Год',
                yaxis_title='Количество репозиториев',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12),
                height=350
            )
            charts['repos_by_year'] = fig_yearly.to_html(full_html=False, include_plotlyjs='cdn')
        
        top_10_repos = sorted(self.repos, key=lambda r: r.stargazers_count, reverse=True)[:10]
        if top_10_repos and len(top_10_repos) > 0:
            repo_names_short = [r.name[:20] for r in top_10_repos]
            stars = [r.stargazers_count for r in top_10_repos]
            forks = [r.forks_count for r in top_10_repos]
            
            fig_grouped = go.Figure(data=[
                go.Bar(name='Звезды', x=repo_names_short, y=stars, marker_color='#ffd700'),
                go.Bar(name='Форки', x=repo_names_short, y=forks, marker_color='#5865f2')
            ])
            fig_grouped.update_layout(
                title='Топ 10: Звезды и Форки',
                xaxis_title='Репозиторий',
                yaxis_title='Количество',
                barmode='group',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12),
                height=400
            )
            charts['stars_forks_grouped'] = fig_grouped.to_html(full_html=False, include_plotlyjs='cdn')
        
        activity_stats = self._get_activity_stats()
        if activity_stats.get('weekly_pattern') and sum(activity_stats['weekly_pattern'].values()) > 0:
            days = list(activity_stats['weekly_pattern'].keys())
            days_ru = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
            counts = list(activity_stats['weekly_pattern'].values())
            
            fig_weekly = go.Figure(data=[
                go.Bar(
                    x=days_ru,
                    y=counts,
                    marker=dict(
                        color=['#5865f2' if i < 5 else '#43b581' for i in range(7)],
                    ),
                    text=counts,
                    textposition='auto'
                )
            ])
            fig_weekly.update_layout(
                title='Активность по дням недели',
                xaxis_title='День недели',
                yaxis_title='Обновлений репозиториев',
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12),
                height=350
            )
            charts['weekly_activity'] = fig_weekly.to_html(full_html=False, include_plotlyjs='cdn')
        
        if activity_stats.get('repo_types') and sum(activity_stats['repo_types'].values()) > 0:
            fig_types = px.pie(
                values=list(activity_stats['repo_types'].values()),
                names=['Собственные', 'Форки'],
                title='Типы репозиториев',
                color_discrete_sequence=['#5865f2', '#43b581']
            )
            fig_types.update_layout(
                template='plotly_dark',
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white', size=12)
            )
            charts['repo_types_pie'] = fig_types.to_html(full_html=False, include_plotlyjs='cdn')
        
        return charts
    
    @staticmethod
    def compare_users(user1_data, user2_data):
        profile1 = user1_data['profile']
        profile2 = user2_data['profile']
        repos1 = user1_data['repositories']
        repos2 = user2_data['repositories']
        langs1 = user1_data['languages']
        langs2 = user2_data['languages']
        
        comparison = {
            'followers': {
                'user1': profile1['followers'],
                'user2': profile2['followers'],
                'diff': profile1['followers'] - profile2['followers'],
                'winner': 1 if profile1['followers'] > profile2['followers'] else (2 if profile2['followers'] > profile1['followers'] else 0)
            },
            'repos': {
                'user1': repos1['total_repos'],
                'user2': repos2['total_repos'],
                'diff': repos1['total_repos'] - repos2['total_repos'],
                'winner': 1 if repos1['total_repos'] > repos2['total_repos'] else (2 if repos2['total_repos'] > repos1['total_repos'] else 0)
            },
            'stars': {
                'user1': repos1['total_stars'],
                'user2': repos2['total_stars'],
                'diff': repos1['total_stars'] - repos2['total_stars'],
                'winner': 1 if repos1['total_stars'] > repos2['total_stars'] else (2 if repos2['total_stars'] > repos1['total_stars'] else 0)
            },
            'forks': {
                'user1': repos1['total_forks'],
                'user2': repos2['total_forks'],
                'diff': repos1['total_forks'] - repos2['total_forks'],
                'winner': 1 if repos1['total_forks'] > repos2['total_forks'] else (2 if repos2['total_forks'] > repos1['total_forks'] else 0)
            },
            'languages': {
                'user1': langs1['total_languages'],
                'user2': langs2['total_languages'],
                'diff': langs1['total_languages'] - langs2['total_languages'],
                'winner': 1 if langs1['total_languages'] > langs2['total_languages'] else (2 if langs2['total_languages'] > langs1['total_languages'] else 0)
            }
        }
        
        return comparison
