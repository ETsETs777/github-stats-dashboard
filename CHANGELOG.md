# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-21

### 🎉 Major Release - All Features Complete!

This release marks the completion of all planned features for version 2.0!

### Added
- **User Comparison**: Compare two GitHub users side-by-side with winner badges
- **Export to PDF**: Print statistics to PDF via browser print functionality
- **Search History**: Local storage-based history of last 10 searches
- **Enhanced Visualizations**: 10+ interactive Plotly charts
  - Weekly activity pattern chart
  - Repository types pie chart
  - Stars vs Forks scatter plot
  - Repositories by year distribution
  - Grouped bar charts for top repos
- **Contribution Activity Analysis**: 
  - Weekly activity patterns
  - Repository type breakdown (source vs fork)
  - Average stars on active repositories
- **Organization Support**: Full support for GitHub organizations
  - Adapted profile information display
  - Public members count
  - Automatic account type detection
- **Dark/Light Theme Toggle**: 
  - Complete light theme with adapted styles
  - Theme preference saved in localStorage
  - Smooth transitions between themes
- **Data Caching**: 
  - In-memory cache with 1-hour TTL
  - Thread-safe implementation
  - Cache clear API endpoint
  - Significant reduction in GitHub API calls

### Changed
- Updated README with comprehensive documentation
- Improved error handling for empty data states
- Enhanced mobile responsiveness
- Optimized chart rendering performance
- Updated version to 2.0.0

### Fixed
- Fixed datetime comparison issue (timezone-aware vs naive)
- Fixed empty chart blocks with fallback messages
- Fixed organization profile display
- Fixed bar chart colors when all values are zero

### API
- Added `GET /api/compare/<username1>/<username2>` endpoint
- Added `POST /api/cache/clear` endpoint
- Updated health check to version 2.0.0

### Documentation
- Added English README.md
- Renamed Russian version to README_RU.md
- Added CONTRIBUTING.md
- Added CHANGELOG.md

---

## [1.2.0] - 2025-10-20

### Added
- Organization support with adapted profile information
- Cache clearing API endpoint

### Changed
- Updated profile information retrieval to handle organizations
- Modified frontend to display organization-specific data

---

## [1.1.0] - 2025-10-20

### Added
- Dark/Light theme toggle with localStorage persistence
- Complete light theme CSS implementation
- Theme icon changes (moon/sun)

### Changed
- Updated navbar with theme toggle button
- Enhanced CSS with light theme variables

---

## [1.0.0] - 2025-10-19

### 🎉 Initial Release

### Added
- Core Flask application setup
- GitHub API integration using PyGithub
- User profile statistics
- Repository statistics
- Language statistics
- Activity statistics
- Interactive Plotly charts:
  - Language distribution pie chart
  - Top repositories bar chart
  - Activity timeline
  - Stars vs Forks scatter plot
- Modern dark theme UI
- Responsive design with Bootstrap 5
- Loading animations
- Error handling
- GitHub token support
- Configuration management
- Environment variables support

### Features
- Beautiful gradient background
- Animated cards
- Profile information display
- Top repositories list
- Language distribution table
- Real-time data fetching
- API health check endpoint

### Documentation
- Initial README.md (Russian)
- Requirements.txt with all dependencies
- .gitignore configuration
- Example environment file

---

## Version History

- **2.0.0** - Full-featured release with all planned features ✅
- **1.2.0** - Organization support
- **1.1.0** - Theme system
- **1.0.0** - Initial release

---

## Upcoming Features

See [README.md](README.md) for planned future enhancements.

---

**[Unreleased]** - Changes in development

Nothing currently in development. All planned features for v2.0 are complete!

---

## Notes

- All dates are in YYYY-MM-DD format
- Version numbers follow Semantic Versioning (MAJOR.MINOR.PATCH)
- Breaking changes are marked with ⚠️
- New features are marked with ✨
- Bug fixes are marked with 🐛
- Performance improvements are marked with ⚡

---

**For detailed commit history, see [GitHub Commits](https://github.com/ETsETs777/github-stats-dashboard/commits/main)**

