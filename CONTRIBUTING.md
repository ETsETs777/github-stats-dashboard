# Contributing to GitHub Stats Dashboard

First off, thank you for considering contributing to GitHub Stats Dashboard! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Python version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be a bit more involved

## 🛠️ Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-stats-dashboard.git
   cd github-stats-dashboard
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   GITHUB_TOKEN=your_token_here
   SECRET_KEY=your_secret_key
   DEBUG=True
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

## 🔄 Pull Request Process

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the style guidelines
   - Add comments where necessary
   - Update documentation if needed

3. **Test your changes**
   - Ensure the application runs without errors
   - Test all affected features
   - Check responsive design on different screen sizes

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Use a clear and descriptive title
   - Reference any related issues
   - Provide a detailed description of changes
   - Include screenshots for UI changes

## 📝 Style Guidelines

### Python Code Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use 4 spaces for indentation (no tabs)
- Maximum line length: 100 characters
- Use descriptive variable names
- Add docstrings to functions and classes

Example:
```python
def get_user_stats(username):
    """
    Fetch and process GitHub user statistics.
    
    Args:
        username (str): GitHub username
        
    Returns:
        dict: User statistics including profile, repos, and charts
    """
    pass
```

### JavaScript Code Style

- Use ES6+ features
- Use camelCase for variables and functions
- Use const/let instead of var
- Add comments for complex logic

### CSS Style

- Use meaningful class names
- Group related properties
- Use CSS variables for colors
- Comment sections clearly

### HTML Style

- Use semantic HTML5 elements
- Proper indentation (2 spaces)
- Add alt text to images
- Use ARIA labels where appropriate

## 💬 Commit Messages

Use clear and meaningful commit messages:

- **Add**: for new features
  ```
  Add: user comparison feature
  ```

- **Fix**: for bug fixes
  ```
  Fix: chart rendering on mobile devices
  ```

- **Update**: for updates to existing features
  ```
  Update: improve caching performance
  ```

- **Refactor**: for code refactoring
  ```
  Refactor: reorganize API endpoints
  ```

- **Docs**: for documentation changes
  ```
  Docs: update installation instructions
  ```

- **Style**: for formatting changes
  ```
  Style: fix indentation in main.js
  ```

## 🧪 Testing

Before submitting a PR, please test:

1. **Functionality**
   - All features work as expected
   - No console errors
   - API calls succeed

2. **Responsiveness**
   - Desktop (1920x1080, 1366x768)
   - Tablet (768x1024)
   - Mobile (375x667, 414x896)

3. **Browsers**
   - Chrome/Edge (latest)
   - Firefox (latest)
   - Safari (latest)

4. **Edge Cases**
   - Users with no repositories
   - Users with many repositories
   - Invalid usernames
   - API rate limiting

## 📦 Adding New Dependencies

If your PR adds new Python dependencies:

1. Add them to `requirements.txt`
2. Specify version numbers
3. Explain why the dependency is needed
4. Ensure it's compatible with Python 3.8+

## 🎨 Adding New Features

When adding new features:

1. Update relevant documentation
2. Add comments in code
3. Include example usage
4. Update API documentation if applicable
5. Add to changelog

## ❓ Questions?

Feel free to:
- Open an issue with the `question` label
- Contact project maintainers
- Check existing documentation

## 🙏 Thank You!

Your contributions make this project better for everyone!

---

**Happy Coding! 🚀**

