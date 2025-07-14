# 🔍 LinkedIn Finder

Find public LinkedIn profiles by entering a professional email address.  
This tool helps recruiters, researchers, and developers discover professional profiles associated with verified business emails.

---
Live link :- https://linked-in-finder-psi.vercel.app/
---

## 🚀 Features

- Search LinkedIn profiles using professional emails
- Displays profile title, image, and short description
- Smart caching using MongoDB to reduce duplicate lookups
- Supports API key rotation for higher reliability
- Clean and responsive UI for desktop and mobile

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muzammil6786/LinkedIn-Finder.git
cd LinkedIn-Finder

```

### 2. Install backend dependencies
  ```bash
  npm install
```
### 3. Configure Environment Variables
Create a .env file in the root with the following:
``` bash
CX_ID=your_search_engine_id
API_KEYS=key1,key2,key3
MONGO_URI=your_mongodb_uri
```
### 4. Run the development server
``` bash
node server.js 
```
## 🌐 API Endpoint
### GET /search?q=email@example.com

Returns:
``` bash
{
  "query": "email@example.com",
  "message": "Success",
  "linkedin": [
    {
      "url": "https://linkedin.com/in/example",
      "title": "Jane Doe - Product Manager",
      "profileImage": "https://media.licdn.com/...",
      "description": "Driven product leader focused on B2B SaaS solutions."
    }
  ]
}

```
### ⚙️ How It Works
- You enter a business email on the UI
- The backend checks if the result is already cached
- If not, it performs a smart web search for publicly available profiles
- Filters out the most relevant LinkedIn results
- Extracts title, description, and image
- Sends structured data to the frontend and stores it for future use

### 🔐 Notes
- Only works effectively for work/professional emails
- Results are based on publicly available web data
- Personal email addresses (e.g. Gmail, Yahoo) may return no result


### ✨ Credits
<div style="text-align: right;">Built with ❤️ by Muzammil</div>

