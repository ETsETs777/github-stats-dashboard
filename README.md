# 📊 GitHub Stats Dashboard

A beautiful and interactive dashboard for analyzing GitHub profiles, built with Python and Flask.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Version](https://img.shields.io/badge/Version-2.0.0-orange.svg)

[🇷🇺 Русская версия](README_RU.md)

## ✨ Features

- 🎨 **Modern UI/UX Design** with dark/light theme and smooth animations
- 📈 **Interactive Charts** using Plotly (10+ visualizations!)
- 📊 **Detailed Statistics** for profiles and repositories
- 🌐 **Responsive Design** for all devices
- ⚡ **Fast Data Loading** with intelligent caching
- 🔄 **User Comparison** - compare two GitHub profiles side-by-side
- 📥 **Export to PDF** - save statistics via browser print
- 📜 **Search History** - quick access to previous searches
- 🏢 **Organization Support** - analyze GitHub organizations
- 🎯 **Data Visualization**:
  - Programming languages distribution
  - Top repositories by stars
  - Activity timeline
  - Stars vs Forks correlation
  - Weekly activity patterns
  - Repository types (source/forks)
  - Repositories by creation year
  - And much more!

## 🚀 Quick Start

### Requirements

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ETsETs777/github-stats-dashboard.git
   cd github-stats-dashboard
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file** (optional, for GitHub token)
   ```bash
   # Create .env file in project root
   GITHUB_TOKEN=your_github_personal_access_token_here
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ```

   > 💡 **Note**: GitHub token is optional but recommended to increase API rate limit (5000 instead of 60 requests per hour)

5. **Run the application**
   ```bash
   python app.py
   # or
   python run.py
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## 🔑 Getting GitHub Token (Optional)

To increase GitHub API rate limits:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Enter token name (e.g., "GitHub Stats Dashboard")
4. Select scopes: `public_repo` and `read:user`
5. Click "Generate token"
6. Copy the token and add it to `.env` file

## 📸 Screenshots

### Main Dashboard
Enter any GitHub username and get comprehensive statistics!

### Features Overview
- **User Comparison**: Compare two users side-by-side with winner badges
- **Dark/Light Theme**: Toggle between themes with instant switching
- **Search History**: Quick access to your 10 most recent searches
- **Export Options**: Print to PDF or copy URL for screenshots
- **Organization Support**: Full support for GitHub organizations

### Visualizations
- Language distribution pie chart
- Top repositories bar chart
- Activity timeline graph
- Stars vs Forks scatter plot
- Weekly activity patterns
- Repository types breakdown
- Creation year distribution
- Grouped statistics charts

## 📁 Project Structure

```
github-stats-dashboard/
├── app.py                  # Main Flask application
├── github_api.py          # GitHub API interaction module
├── config.py              # Application configuration
├── cache.py               # Caching system
├── run.py                 # Launcher script
├── requirements.txt       # Python dependencies
├── README.md             # Documentation (English)
├── README_RU.md          # Documentation (Russian)
├── .env                  # Environment variables (create manually)
├── .gitignore           # Git ignored files
├── static/              # Static files
│   ├── css/
│   │   └── style.css    # CSS styles
│   └── js/
│       └── main.js      # JavaScript code
└── templates/           # HTML templates
    └── index.html       # Main page
```

## 🛠️ Technologies Used

### Backend
- **Flask** - Python web framework
- **PyGithub** - GitHub API library
- **Plotly** - Interactive chart generation
- **python-dotenv** - Environment variables management

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with gradients and animations
- **JavaScript (Vanilla)** - Interactivity without frameworks
- **Bootstrap 5** - Responsive grid and components
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography

## 📊 API Endpoints

- `GET /` - Main page
- `GET /api/stats/<username>` - Get user statistics
- `GET /api/compare/<username1>/<username2>` - Compare two users
- `POST /api/cache/clear` - Clear cache
- `GET /api/health` - API health check

### Example API Response

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
    "activity": {
      "active_repos_last_year": 50,
      "weekly_pattern": {...},
      "repo_types": {...}
    },
    "charts": {...}
  }
}
```

## ⚙️ Configuration

Configure the application via `config.py`:

- `SECRET_KEY` - Flask secret key
- `DEBUG` - Debug mode
- `GITHUB_TOKEN` - GitHub API token
- `CACHE_TIMEOUT` - Cache TTL in seconds (default: 3600)
- `MAX_REPOS` - Maximum repositories to analyze (default: 100)
- `TOP_REPOS_COUNT` - Top repositories to display (default: 10)

## 🎨 Customization

### Change Color Scheme

Open `static/css/style.css` and modify gradient variables:

```css
background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
```

### Change Number of Displayed Repositories

In `config.py`:

```python
TOP_REPOS_COUNT = 10  # Change to desired value
```

### Modify Cache Duration

In `config.py`:

```python
CACHE_TIMEOUT = 3600  # Time in seconds (1 hour)
```

## 🐛 Troubleshooting

### "API rate limit exceeded" Error

- Add GitHub token to `.env` file
- Wait some time (limit resets every hour)
- Clear cache using `/api/cache/clear` endpoint

### "User not found" Error

- Check username spelling
- Ensure profile is public
- Verify internet connection

### Application Won't Start

- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check Python version: `python --version` (must be 3.8+)
- Verify port 5000 is not in use by another application
- Check if virtual environment is activated

### Charts Not Displaying

- Ensure JavaScript is enabled in browser
- Check browser console for errors
- Try clearing browser cache
- Verify Plotly CDN is accessible

## 📈 Implemented Features

- [x] User comparison ✅
- [x] Export to PDF/PNG ✅
- [x] Search history ✅
- [x] Enhanced visualizations ✅
- [x] Contribution activity analysis ✅
- [x] Organization support ✅
- [x] Dark/Light theme toggle ✅
- [x] Data caching ✅

## 🎯 Future Enhancements

- [ ] GitHub Actions integration
- [ ] Real-time updates via WebSocket
- [ ] Historical comparison (show growth over time)
- [ ] Export to CSV/Excel
- [ ] Integration with other platforms (GitLab, Bitbucket)
- [ ] Multi-language support
- [ ] Advanced filtering options
- [ ] Customizable dashboards
- [ ] Email reports

## 📝 License

MIT License - free to use for your projects!

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🔗 Useful Links

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Plotly Python](https://plotly.com/python/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

## 📧 Contact

Have questions or suggestions? Feel free to:
- Open an issue
- Submit a pull request
- Contact the maintainer

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

## 📊 Project Stats

- **Version**: 2.0.0
- **License**: MIT
- **Python**: 3.8+
- **Framework**: Flask 3.0.0
- **Charts**: Plotly 5.18.0

---

**Built with ❤️ using Python and Flask**

---

## 🎨 Demo

Try it with popular GitHub users:
- `torvalds` - Linus Torvalds (Linux creator)
- `gvanrossum` - Guido van Rossum (Python creator)
- `tj` - TJ Holowaychuk
- `sindresorhus` - Sindre Sorhus
- `microsoft` - Microsoft Organization
- `google` - Google Organization

Compare users:
- `torvalds` vs `gvanrossum`
- `facebook` vs `google`
- Your username vs your favorite developer!

---

⭐ **Star this repo if you found it useful!** ⭐

